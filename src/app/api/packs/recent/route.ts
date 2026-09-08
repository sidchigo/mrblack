import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { Pack } from '@/types/game';

export interface CommunityPackMeta {
  id: string;
  name: string;
  slug: string;
}

export async function GET() {
  try {
    // Get the latest 30 community-generated pack metadata from Redis
    const rawList = await redis.lrange<string>('recent_packs', 0, 29);

    const communityPacks: Pack[] = [];
    const seenSlugs = new Set<string>();

    for (const item of rawList) {
      try {
        const meta = typeof item === 'string' ? JSON.parse(item) : item;
        if (meta && meta.slug && !seenSlugs.has(meta.slug)) {
          seenSlugs.add(meta.slug);
          const fullPack = await redis.get<Pack>(`pack:${meta.slug}`);
          if (fullPack && fullPack.pairs && fullPack.pairs.length > 0) {
            // Clean up name if it was previously saved with a long descriptive sentence
            const cleanName =
              fullPack.name && fullPack.name.length > 14
                ? fullPack.name.split(/\s+/).slice(0, 2).join(' ').toUpperCase()
                : (fullPack.name || meta.slug).toUpperCase();

            communityPacks.push({
              ...fullPack,
              name: cleanName,
            });
          }
        }
      } catch {
        // Skip malformed entries
      }
    }

    return NextResponse.json({ packs: communityPacks });
  } catch (error: any) {
    console.error('Error fetching recent packs:', error);
    return NextResponse.json({ packs: [] }, { status: 200 });
  }
}
