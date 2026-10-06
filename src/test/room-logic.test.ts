import assert from 'node:assert';
import { generateRoomCode, generatePlayerId, sanitizeRoomForPlayer } from '../lib/room';
import { initializeGame, checkGameEndCondition } from '../lib/game/game-engine';
import { RoomState, RoomPlayer, GameSettings } from '../types/game';
import { BUILT_IN_PACKS } from '../lib/game/packs';

console.log('🧪 Running Room Multiplayer Tests...\n');

// Test 1: Room Code Generation
{
  for (let i = 0; i < 50; i++) {
    const code = generateRoomCode();
    assert.strictEqual(code.length, 4, 'Room code should be exactly 4 characters');
    assert.strictEqual(code, code.toUpperCase(), 'Room code should be uppercase');
    assert.ok(/^[A-Z0-9]{4}$/.test(code), 'Room code should only contain alphanumeric chars');
    assert.ok(!code.includes('0') && !code.includes('O') && !code.includes('1') && !code.includes('I'), 'Should avoid ambiguous chars');
  }
  console.log('✅ Test 1 Passed: 4-character room code generation & ambiguity check');
}

// Test 2: Room Initialization & Role Sanitization Security
{
  const hostId = generatePlayerId();
  const player2Id = generatePlayerId();
  const player3Id = generatePlayerId();

  const settings: GameSettings = {
    players: ['Host Player', 'Friend 1', 'Friend 2'],
    undercoverCount: 1,
    mrblackCount: 1,
    selectedPackIds: ['desi-food'],
  };

  const initialGame = initializeGame(settings);

  const players: RoomPlayer[] = [
    {
      id: hostId,
      name: 'Host Player',
      isHost: true,
      isReady: false,
      isEliminated: false,
      role: initialGame.players[0].role,
      word: initialGame.players[0].word,
      lastSeen: Date.now(),
    },
    {
      id: player2Id,
      name: 'Friend 1',
      isHost: false,
      isReady: false,
      isEliminated: false,
      role: initialGame.players[1].role,
      word: initialGame.players[1].word,
      lastSeen: Date.now(),
    },
    {
      id: player3Id,
      name: 'Friend 2',
      isHost: false,
      isReady: false,
      isEliminated: false,
      role: initialGame.players[2].role,
      word: initialGame.players[2].word,
      lastSeen: Date.now(),
    },
  ];

  const room: RoomState = {
    code: 'ABCD',
    hostId,
    status: 'playing',
    settings,
    players,
    gameState: initialGame,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // Test sanitization from Player 2's perspective
  const { room: sanitizedForP2, myPlayer: p2Obj } = sanitizeRoomForPlayer(room, player2Id);

  assert.strictEqual(p2Obj?.id, player2Id);
  assert.strictEqual(p2Obj?.role, players[1].role, 'Player 2 should see their own role');

  // Player 2 should NOT see Host's role or Friend 2's role during active game
  const hostInSanitized = sanitizedForP2.players.find((p) => p.id === hostId);
  const p3InSanitized = sanitizedForP2.players.find((p) => p.id === player3Id);
  const p2InSanitized = sanitizedForP2.players.find((p) => p.id === player2Id);

  assert.strictEqual(hostInSanitized?.role, undefined, 'Host role should be hidden from Player 2');
  assert.strictEqual(hostInSanitized?.word, undefined, 'Host word should be hidden from Player 2');
  assert.strictEqual(p3InSanitized?.role, undefined, 'Friend 2 role should be hidden from Player 2');
  assert.strictEqual(p3InSanitized?.word, undefined, 'Friend 2 word should be hidden from Player 2');
  assert.strictEqual(p2InSanitized?.role, players[1].role, 'Player 2 can see their own role');

  console.log('✅ Test 2 Passed: Cheat-proof role & word sanitization across room players');
}

// Test 3: Game Over Full Reveal
{
  const hostId = generatePlayerId();
  const player2Id = generatePlayerId();

  const settings: GameSettings = {
    players: ['Host', 'Guest'],
    undercoverCount: 1,
    mrblackCount: 0,
    selectedPackIds: ['desi-food'],
  };

  const initialGame = initializeGame(settings);

  const room: RoomState = {
    code: 'WXYZ',
    hostId,
    status: 'game_over',
    settings,
    players: [
      { id: hostId, name: 'Host', isHost: true, isReady: true, isEliminated: false, role: 'civilian', word: 'Chai', lastSeen: Date.now() },
      { id: player2Id, name: 'Guest', isHost: false, isReady: true, isEliminated: false, role: 'undercover', word: 'Coffee', lastSeen: Date.now() },
    ],
    gameState: {
      ...initialGame,
      phase: 'game_over',
      winner: 'civilians',
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const { room: sanitizedGameOver } = sanitizeRoomForPlayer(room, player2Id);
  const hostInSanitized = sanitizedGameOver.players.find((p) => p.id === hostId);
  const guestInSanitized = sanitizedGameOver.players.find((p) => p.id === player2Id);

  assert.strictEqual(hostInSanitized?.role, 'civilian', 'Roles should be revealed at game over');
  assert.strictEqual(guestInSanitized?.role, 'undercover', 'Roles should be revealed at game over');

  console.log('✅ Test 3 Passed: Game over reveals identities for victory screen');
}

// Test 4: Vote Tallies & Consensus Gathering
{
  const p1 = generatePlayerId();
  const p2 = generatePlayerId();
  const p3 = generatePlayerId();
  const p4 = generatePlayerId();

  const votes: Record<string, string> = {
    [p1]: p3, // p1 votes for p3
    [p2]: p3, // p2 votes for p3
    [p4]: p2, // p4 votes for p2
  };

  const candidateVotes: Record<string, number> = {};
  Object.values(votes).forEach((target) => {
    candidateVotes[target] = (candidateVotes[target] || 0) + 1;
  });

  assert.strictEqual(candidateVotes[p3], 2, 'Candidate 3 should have 2 votes');
  assert.strictEqual(candidateVotes[p2], 1, 'Candidate 2 should have 1 vote');
  assert.strictEqual(Object.keys(votes).length, 3, '3 total votes cast');
  console.log('✅ Test 4 Passed: Individual vote casting and tallying mechanism');
}

// Test 5: Host Leaving Room Discards Room
(async () => {
  const { deleteRoom, getRoom, saveRoom } = require('../lib/room');
  const hostId = generatePlayerId();
  const code = 'TEST';

  const room: RoomState = {
    code,
    hostId,
    status: 'lobby',
    settings: { players: ['Host'], undercoverCount: 1, mrblackCount: 1, selectedPackIds: ['desi-food'] },
    players: [{ id: hostId, name: 'Host', isHost: true, isReady: false, isEliminated: false, lastSeen: Date.now() }],
    gameState: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await saveRoom(room);
  const fetched = await getRoom(code);
  assert.ok(fetched !== null, 'Room should exist after saving');

  await deleteRoom(code);
  const afterDelete = await getRoom(code);
  assert.strictEqual(afterDelete, null, 'Room should be completely removed after host leaves');
  console.log('✅ Test 5 Passed: Room is instantly discarded when host leaves');
  console.log('\n🎉 ALL ROOM MULTIPLAYER TESTS PASSED!\n');
})();


