import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { normalizeTopicToSlug, checkRateLimits } from '@/lib/rate-limit';
import { generateWordPairsWithLLM } from '@/lib/llm';
import { Pack } from '@/types/game';
import { trackGameEvent } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic } = body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return NextResponse.json(
        { error: 'Please provide a valid topic name.' },
        { status: 400 }
      );
    }

    const trimmedTopic = topic.trim();
    const slug = normalizeTopicToSlug(trimmedTopic);

    if (!slug) {
      return NextResponse.json(
        { error: 'Invalid topic characters. Try another category name.' },
        { status: 400 }
      );
    }

    const redisKey = `pack:${slug}`;

    // 1. Check Redis for existing pack (Persistent, NO TTL per design-decisions.md)
    const cachedPack = await redis.get<Pack>(redisKey);
    if (cachedPack && cachedPack.pairs && cachedPack.pairs.length > 0) {
      await trackGameEvent('pack_cache_hit', { slug });
      return NextResponse.json({ pack: cachedPack, cached: true });
    }

    // 2. Check Rate Limits before invoking LLM
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const rateLimitResult = await checkRateLimits(clientIp);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message || 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      );
    }

    // 3. Generate word pairs via OpenAI-compatible endpoint
    let result;
    try {
      result = await generateWordPairsWithLLM(trimmedTopic);
    } catch (llmError: any) {
      console.error('LLM generation error:', llmError);
      return NextResponse.json(
        {
          error:
            'AI service is currently busy or experiencing high traffic. Please try again later or choose one of our built-in packs.',
        },
        { status: 503 }
      );
    }

    const { title, pairs } = result;

    if (!pairs || pairs.length === 0) {
      return NextResponse.json(
        { error: 'Could not generate words for this topic. Please try another.' },
        { status: 500 }
      );
    }

    // Determine clean punchy display name (1-2 words max, uppercase)
    const displayName =
      title && title.length <= 15
        ? title.toUpperCase()
        : trimmedTopic.split(/\s+/).slice(0, 2).join(' ').toUpperCase();

    const newPack: Pack = {
      id: `ai-${slug}`,
      name: displayName,
      description: `AI-generated custom pack for "${trimmedTopic}"`,
      category: 'Custom AI Pack',
      isBuiltIn: false,
      pairs,
    };

    // 4. Store in Redis indefinitely (NO TTL as per design-decisions.md)
    await redis.set(redisKey, newPack);

    // 5. Index in recent community packs list (keep last 30 unique packs)
    try {
      const packMeta = JSON.stringify({
        id: newPack.id,
        name: newPack.name,
        slug,
      });
      // Remove duplicate if already present in list, then lpush to top
      await redis.lrem('recent_packs', 0, packMeta);
      await redis.lpush('recent_packs', packMeta);
    } catch (indexErr) {
      console.error('Failed to index recent pack:', indexErr);
    }

    await trackGameEvent('pack_generated', { slug });

    return NextResponse.json({ pack: newPack, cached: false });
  } catch (error: any) {
    console.error('Pack generation API route error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
