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

export async function generateWordPairsWithLLM(topic: string): Promise<WordPair[]> {
  const client = getOpenAIClient();
  const model = process.env.OPENAI_MODEL || (process.env.GROQ_API_KEY ? 'llama-3.1-8b-instant' : 'gpt-4o-mini');

  const prompt = `You are a creative party game designer for "Mr. Black", a popular social deduction party game in India (similar to Undercover / Mr. White).
The user requested a category pack for: "${topic}".

Generate exactly 8 to 12 pairs of related words suitable for an Indian audience (mixing Bollywood, desi pop-culture, Indian food, tech, everyday Indian life, Hindi/Hinglish slang where fitting).
For each pair:
- "a" is the Civilian secret word.
- "b" is the Undercover secret word (closely related to "a", but with a subtle fun difference so people give ambiguous clues).

Return ONLY valid JSON matching this exact structure:
{
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

  const parsed = JSON.parse(content);
  if (!parsed.pairs || !Array.isArray(parsed.pairs) || parsed.pairs.length === 0) {
    throw new Error('Invalid JSON structure returned by LLM');
  }

  return parsed.pairs.filter(
    (p: any) => typeof p.a === 'string' && typeof p.b === 'string' && p.a.trim() && p.b.trim()
  );
}
