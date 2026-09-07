# Context
This is MrBlack a fun twist to Mr White game with India specific twist. It is a party game but you can play it in your office as well. :) 
Keeping it open-source so that community can contribute to the word list as well.

# Core Principles
- Pass-and-play is the default; multi-device is future, not now
- Keep it simple, reject complexity that isn't justified by real usage
- Open source with real community contribution

# Tech Stack
Layer	Choice
Framework	Next.js 14 on Vercel
Styling	[Discord Design MD](https://getdesign.md/discord/design-md)
LLM	Gemini free, fallback Groq (no paid service — runtime fallback ends with graceful error / "try again")
Cache/DB	Upstash Redis

# Rejected: Real-time Multi-device (for now)
- What was considered: PartyKit, Ably, Supabase Realtime, Upstash Realtime
- Why rejected: PartyKit is overkill for V1, just keeping things simple for now. Later WS connection logic can be checked for creating rooms
- When to revisit: what would trigger re-evaluating this? post V1 and good website traffic

# Dedup Algorithm (minimal, locked)
- Flow: normalize → slug → Redis lookup → miss → generate once → store
- Why no LLM-canonicalization / embeddings / edit-distance: completely over-engineered approach. Very expensive with simaltaneous users having race condition to generate category, multiple wasted LLM calls would be present. To avoid this again over-engineering would be required to avoid race conditions which will not happen that frequently
- Accepted tradeoffs: typos (bolywood vs bollywood) & concurrent same-category race → rare, low-cost; revisit only if analytics show duplicates forming

# Pack Contract
- Unified shape: { a: civilian, b: undercover }
- No need to categorize anything with difficult as this is not a difficult game
- Why shared contract: built-in (code) + LLM (Redis) + premium (Redis) all plug into one draw engine — seamless M1→M2→premium

# Storage Strategy
- Built-in curated → code bundle (static, offline, updated via repo/PR)
- LLM-generated → Redis pack:{slug} — **persistent (no TTL)**
- Premium (future) → Redis JSON + server-enforced entitlement flag. No special persistence rule — premium packs persist like all generated packs (no TTL). Premiumness = entitlement check + a premium flag, not durability.
- DAU/analytics → Redis counters — **short TTL (e.g., 90 days, transient)**

### Persistence note (why packs have no TTL)
Generated packs must persist indefinitely. Expiring them (e.g., after 3-6 months) means the next request for the same category regenerates the identical pack and pays the LLM again — defeating caching and raising cost. Redis free tier (256MB) holds far more packs than realistically generated, so storage volume is not a v1 concern. If memory pressure ever becomes real, migrate packs to a durable store (Postgres) then — not before.
- Analytics/DAU expire (short TTL, transient); packs do not expire.

# Analytics (for future monetization)
- DAU counters (anonymous, no PII), game events
- Why: decide monetization on real data, not guesses
- Findings also feed back into dedup decisions

# India Differentiators
- Built-in desi packs, Hinglish, regional languages, community submissions

# Monetization (Future, Open)
- Not decided — data-driven
- Options weighed: premium packs (server-enforced) & donations

# LLM Error Fallback (UX)
- When Gemini + Groq are both down/rate-limited: show a plain "try again later" message.
- Do NOT auto-suggest a closest built-in pack — that requires a Redis lookup anyway, so it's unnecessary work for little value.

# Rate Limiting (Pack Generation)
Single shared Gemini pool across all users → cap aggregate to protect it, plus a per-IP cap to stop one user hogging it. Two dimensions, both in the API route via Upstash Redis:
- **Per-IP RPM**: 2 (prevents one user spamming generations)
- **Global RPM**: 5 (stays under Gemini's ~10 RPM with headroom; avoids 429s cascading to fallback)
- **Global RPD**: ~900 (the binding constraint — protects Groq fallback's 1,000 RPD budget; also under Gemini's 1,500 RPD)

Rationale: per-minute caps smooth bursty behavior; the daily cap is what actually protects the free tier since the binding limit on both providers is per-day (Gemini ~1,500 RPD, Groq ~1,000 RPD). Make these config values (env vars) so they can be tuned live without redeploy.

# Roadmap
- M1 static shell + built-in packs (client-side)
- M2 LLM generation + Redis dedup + rate limit
- M3 analytics
- M4 polish + OSS packaging