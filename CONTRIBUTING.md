# Contributing to Mr. Black 🎭🕵️

Thank you for your interest in contributing to **Mr. Black**! We love community contributions, especially new **Desi-themed word packs**, spicy pop-culture references, regional word pairs, and gameplay improvements.

---

## 🎯 How Can You Contribute?

1. **Add New Word Packs**: Introduce new themes (e.g., *90s Nostalgia, Regional Cinema, Campus Life, Desi Memes*).
2. **Expand Existing Packs**: Add clever, balanced word pairs to existing packs in [`src/lib/game/packs.ts`](./src/lib/game/packs.ts).
3. **UI/UX & Feature Enhancements**: Improve sound effects, animations, timers, localized languages, or gameplay mechanics.
4. **Bug Reports & Fixes**: Found an edge case during voting or reveal? Submit a PR or open an issue!

---

## 📦 How to Add or Expand Word Packs (Step-by-Step)

Adding word pairs or a whole new pack is super easy! All built-in packs live in **[`src/lib/game/packs.ts`](./src/lib/game/packs.ts)**.

### 1. The Anatomy of a Good Word Pair
A great pair for Undercover / Mr. Black / Mr. White has two words that are:
- **Closely related**: Have similar contexts, functions, or associations.
- **Distinct enough**: Civilians and Undercovers shouldn't give the exact same clues immediately.
- **Fair to Mr. Black**: Leaves enough conversational breadcrumbs for Mr. Black to catch on and bluff.

**Example Pairs:**
```typescript
{ a: 'Samosa', b: 'Kachori' }       // Both fried Indian savory snacks with spiced filling
{ a: 'Virat Kohli', b: 'Rohit Sharma' } // Both iconic Indian cricket captains/batsmen
{ a: 'Swiggy', b: 'Zomato' }         // Both popular food delivery apps
```

---

### 2. Adding a Pair to an Existing Pack

Open [`src/lib/game/packs.ts`](./src/lib/game/packs.ts), locate the pack you want to contribute to, and add your pair to the `pairs` array:

```typescript
{
  id: 'desi-food',
  name: 'Food',
  // ...
  pairs: [
    // ... existing pairs
    { a: 'Rasmalai', b: 'Rabdi' },
  ],
}
```

---

### 3. Adding a Completely New Pack

To create a brand new pack:

1. Open [`src/lib/game/packs.ts`](./src/lib/game/packs.ts).
2. Add a new `Pack` object to the `BUILT_IN_PACKS` array:

```typescript
{
  id: 'campus-life',
  name: 'Campus Life',
  description: 'Hostel maggi, proxy attendance, last night submissions, and canteen adda',
  category: 'Everyday',
  isBuiltIn: true,
  pairs: [
    { a: 'Hostel Maggi', b: 'Canteen Chai' },
    { a: 'Proxy Attendance', b: 'Bunking Class' },
    { a: 'Assignment Copy', b: 'Viva Voce' },
    { a: 'Backlog Exam', b: 'Grace Marks' },
    { a: 'Placement Cell', b: 'Internship Offer' },
    { a: 'Library Night', b: 'Night Canteen' },
    { a: 'Dean Office', b: 'Warden Round' },
    { a: 'Semester Exam', b: 'Internal Midsem' },
    { a: 'Fresher Party', b: 'Farewell Night' },
    { a: 'Hostel Room', b: 'PG Room' },
  ],
},
```

> 💡 **Tip:** Aim for at least 10–15 pairs per new pack so games stay fresh and unpredictable across multiple rounds!

---

## 🛠️ Step-by-Step Pull Request (PR) Guide

### 1. Fork & Clone
```bash
# Fork the repository on GitHub, then clone your fork:
git clone https://github.com/<your-username>/mrblack.git
cd mrblack
```

### 2. Create a Feature Branch
```bash
git checkout -b pack/campus-life-pack
```

### 3. Install Dependencies & Test
```bash
npm install
npm test
```
Make sure all existing unit tests pass before submitting.

### 4. Commit Your Changes
Use descriptive, clear commit messages:
```bash
git commit -m "feat(packs): add Campus Life pack with 10 desi word pairs"
```

### 5. Push & Raise a Pull Request
```bash
git push origin pack/campus-life-pack
```
Head to the repository on GitHub and open a **Pull Request** targeting the `main` branch. Provide a brief description of the new pack/pairs and why they're fun to play!

---

## 📜 Code of Conduct & Fair Play
- Keep word pairs inclusive, light-hearted, and fun for all party and family settings.
- Avoid offensive slurs, hate speech, or NSFW terms in default/built-in packs.
- All contributions are subject to the project's [LICENSE](./LICENSE).
