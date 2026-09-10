import assert from 'node:assert';
import { initializeGame, checkGameEndCondition } from '../lib/game/game-engine';
import { getRandomPairFromPacks, BUILT_IN_PACKS } from '../lib/game/packs';
import { GameSettings, Player } from '../types/game';

console.log('🧪 Running Game Logic Tests...\n');

// Test 1: Game Initialization & Role Distribution
{
  const settings: GameSettings = {
    players: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    undercoverCount: 1,
    mrblackCount: 1,
    selectedPackIds: ['desi-food'],
  };

  const game = initializeGame(settings);

  assert.strictEqual(game.players.length, 5, 'Should have 5 players');
  const civCount = game.players.filter((p) => p.role === 'civilian').length;
  const ucCount = game.players.filter((p) => p.role === 'undercover').length;
  const mbCount = game.players.filter((p) => p.role === 'mrblack').length;

  assert.strictEqual(civCount, 3, 'Should have 3 civilians');
  assert.strictEqual(ucCount, 1, 'Should have 1 undercover');
  assert.strictEqual(mbCount, 1, 'Should have 1 mr black');

  // Verify secret word distribution
  game.players.forEach((p) => {
    if (p.role === 'civilian') {
      assert.strictEqual(p.word, game.activePair.a, 'Civilian should have civilian word');
    } else if (p.role === 'undercover') {
      assert.strictEqual(p.word, game.activePair.b, 'Undercover should have undercover word');
    } else if (p.role === 'mrblack') {
      assert.strictEqual(p.word, null, 'Mr. Black should have null word');
    }
  });
  console.log('✅ Test 1 Passed: Initialization & Role Assignment logic');
}

// Test 2: Win Condition - Civilians Win when all Impostors are eliminated
{
  const players: Player[] = [
    { id: '1', name: 'A', role: 'civilian', word: 'Samosa', isEliminated: false },
    { id: '2', name: 'B', role: 'civilian', word: 'Samosa', isEliminated: false },
    { id: '3', name: 'C', role: 'undercover', word: 'Kachori', isEliminated: true },
    { id: '4', name: 'D', role: 'mrblack', word: null, isEliminated: true },
  ];

  const result = checkGameEndCondition(players);
  assert.strictEqual(result.isOver, true, 'Game should be over');
  assert.strictEqual(result.winner, 'civilians', 'Civilians should win');
  console.log('✅ Test 2 Passed: Civilians Win condition when impostors eliminated');
}

// Test 3: Win Condition - Impostors Win when Impostors outnumber/equal alive Civilians
{
  const players: Player[] = [
    { id: '1', name: 'A', role: 'civilian', word: 'Samosa', isEliminated: false },
    { id: '2', name: 'B', role: 'civilian', word: 'Samosa', isEliminated: true },
    { id: '3', name: 'C', role: 'undercover', word: 'Kachori', isEliminated: false },
    { id: '4', name: 'D', role: 'mrblack', word: null, isEliminated: false },
  ];

  const result = checkGameEndCondition(players);
  assert.strictEqual(result.isOver, true, 'Game should be over');
  assert.strictEqual(result.winner, 'undercovers', 'Impostors should win');
  console.log('✅ Test 3 Passed: Impostors Win condition when outnumbering civilians');
}

// Test 4: Role Randomization & Fair Distribution across players
{
  const settings: GameSettings = {
    players: ['P1', 'P2', 'P3', 'P4'],
    undercoverCount: 1,
    mrblackCount: 1,
    selectedPackIds: ['desi-food'],
  };

  const impostorCounts: Record<string, number> = { P1: 0, P2: 0, P3: 0, P4: 0 };
  const ROUNDS = 200;

  for (let i = 0; i < ROUNDS; i++) {
    const game = initializeGame(settings);
    game.players.forEach((p) => {
      if (p.role === 'undercover' || p.role === 'mrblack') {
        impostorCounts[p.name] = (impostorCounts[p.name] || 0) + 1;
      }
    });
  }

  // Every player should get a chance to be an impostor over 200 rounds (expected ~100 each for 2 impostors across 4 players)
  Object.values(impostorCounts).forEach((count) => {
    assert.ok(
      count > 40,
      `Each player should have a fair random chance of being impostor (got ${count})`
    );
  });
  console.log('✅ Test 4 Passed: Fair random role distribution (unbiased, unpredictable)');
}

// Test 5: Anti-Repetition - Avoid immediate repeated word pair
{
  const pack = BUILT_IN_PACKS[0]; // Food pack with 12 pairs
  const result1 = getRandomPairFromPacks([pack]);
  const result2 = getRandomPairFromPacks([pack], result1.pair.a);

  assert.notStrictEqual(
    result2.pair.a,
    result1.pair.a,
    'Subsequent pair should not immediately repeat the previous pair'
  );
  console.log('✅ Test 5 Passed: Word pair anti-repetition');
}

console.log('\n🎉 ALL GAME LOGIC TESTS PASSED SUCCESSFULLY!\n');
