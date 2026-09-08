# Mr. Black 🎭🕵️

A sleek, fast, and fun **Desi Party Game** inspired by "Undercover" and "Mr. White", designed for friends, families, and teams. Built with **Next.js 14**, styled with modern sleek gaming aesthetics, with OpenAI-compatible AI category pack generation and Upstash Redis rate limiting and deduplication.

---

## 🌟 Game Highlights
- **Pass-and-Play Friendly**: Play seamlessly on a single mobile or desktop device.
- **Rich Desi Curated Packs**: Includes Bollywood, Chai & Street Food, Cricket Mania, Shaadi & Festivals, Tech & Office Life, and Indian Travel.
- **AI Custom Packs**: Generate custom Indian word pairs on the fly with any OpenAI-compatible endpoint (OpenAI, Groq, OpenRouter).
- **Sleek Aesthetics**: Dark theme, Blurple (#5865F2) & Magenta highlights, animated mesh gradients, and smooth cards.
- **Cinematic Victory Celebrations**: Dynamic, Among Us–inspired victory celebration screens with custom art and thematic atmospheric glows for Civilians, Undercovers, Mr. Black, and joint Impostor wins.
- **Smart Redis Dedup & Rate Limiting**: Zero-TTL cached packs to save AI tokens, plus per-IP and global rate limiting.
- **Mr. Black Guess Climax**: If Mr. Black gets voted out, they get one final chance to guess the secret word and hijack the victory!

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the optional keys:
- `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`: (Optional, has an automatic in-memory fallback for local dev).
- `OPENAI_API_KEY` or `GROQ_API_KEY`: (Optional for AI custom category generation).

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to start playing!

---

## 📜 How to Play
1. **Roles**:
   - **Civilians (majority)**: Know the true secret word (e.g. *Samosa*).
   - **Undercover**: Knows a closely related word (e.g. *Kachori*).
   - **Mr. Black**: Knows nothing! Must bluff and figure out the word.
2. **Reveal**: Pass the phone. Tap or hold to reveal your role.
3. **Clues**: Give one subtle clue per turn.
4. **Voting**: Discuss and eliminate the impostor.
5. **Mr. Black Twist**: If Mr. Black is eliminated, they can guess the civilian word to win immediately!

---

## 🤝 Community & Contributions
Word pairs and packs are open for community additions! We welcome PRs for new Desi packs, pop-culture themes, and word pairs.
See [**`CONTRIBUTING.md`**](./CONTRIBUTING.md) for a step-by-step guide on adding packs and submitting PRs.

---

## 📄 License
This project is licensed under the [PolyForm Noncommercial License 1.0.0](./LICENSE). Free for personal, party, community, and non-commercial gameplay. Commercial monetization and paywalled pack features are reserved by the project maintainers.
