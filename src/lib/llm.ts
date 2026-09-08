import OpenAI from 'openai';
import { WordPair } from '@/types/game';

// Standard OpenAI client initialized with OPENAI_API_KEY and optional OPENAI_BASE_URL
// Works with OpenAI, Groq (base_url: https://api.groq.com/openai/v1), OpenRouter, or any OpenAI-compatible provider
export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || 'dummy-key';
  const baseURL = process.env.OPENAI_BASE_URL || (process.env.GROQ_API_KEY ? 'https://api.groq.com/openai/v1' : undefined);

  return new OpenAI({
    apiKey,
    baseURL,
  });
}

export async function generateWordPairsWithLLM(
  topic: string
): Promise<{ title?: string; pairs: WordPair[] }> {
  const client = getOpenAIClient();
  const model = process.env.OPENAI_MODEL || (process.env.GROQ_API_KEY ? 'llama-3.1-8b-instant' : 'gpt-4o-mini');

  const prompt = `You are a creative party game designer for "Mr. Black", a popular social deduction party game in India (similar to Undercover / Mr. White).
The user requested a category pack for: "${topic}".

Generate:
1. "title": A short, punchy 1-word (or max 2 words) uppercase pack title suitable for a button label (e.g. "MEMES", "BOLLYWOOD", "CRICKET", "ANIME", "STARTUPS", "COLLEGE").
2. "pairs": Exactly 10 to 20 pairs of related words suitable for an Indian audience (mixing Bollywood, desi pop-culture, Indian food, tech, everyday Indian life, Hindi/Hinglish slang where fitting).
For each pair:
- "a" is the Civilian secret word.
- "b" is the Undercover secret word (closely related to "a", but with a subtle fun difference so people give ambiguous clues).

Return ONLY valid JSON matching this exact structure:
{
  "title": "MEMES",
  "pairs": [
    { "a": "Samosa", "b": "Kachori" },
    { "a": "Pani Puri", "b": "Sev Puri" }
  ]
}`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are an expert game creator specialized in Indian pop culture, humor, and word deduction games. Return strictly JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from LLM');
  }

  let raw = content.trim();

  // Strip reasoning/thought tags (e.g., <thought>...</thought> emitted by models like DeepSeek-R1 / Gemma / Gemini)
  raw = raw.replace(/<thought>[\s\S]*?<\/thought>/gi, '').trim();

  // Strip markdown code blocks if wrapped (e.g. ```json ... ```)
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonMatch) {
    raw = jsonMatch[1].trim();
  } else {
    // If there's still leading non-JSON characters, slice from first '{' to last '}'
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      raw = raw.substring(firstBrace, lastBrace + 1);
    }
  }

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (err: any) {
    console.error('Failed to parse LLM JSON output. Raw content was:\n', content);
    throw new Error(`JSON parse error: ${err.message}`);
  }

  if (!parsed.pairs || !Array.isArray(parsed.pairs) || parsed.pairs.length === 0) {
    throw new Error('Invalid JSON structure returned by LLM');
  }

  const validPairs = parsed.pairs.filter(
    (p: any) => typeof p.a === 'string' && typeof p.b === 'string' && p.a.trim() && p.b.trim()
  );

  const title = typeof parsed.title === 'string' && parsed.title.trim() ? parsed.title.trim() : undefined;

  return {
    title,
    pairs: validPairs,
  };
}
