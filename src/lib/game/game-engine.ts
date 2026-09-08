import { GameSettings, GameState, Player, Pack, WordPair } from '@/types/game';
import { getRandomPairFromPacks, BUILT_IN_PACKS } from './packs';

export function initializeGame(
  settings: GameSettings,
  customPacks?: Pack | Pack[],
  previousGameState?: GameState | null
): GameState {
  const extraPacks: Pack[] = Array.isArray(customPacks)
    ? customPacks
    : customPacks
    ? [customPacks]
    : [];

  const allAvailablePacks = [...BUILT_IN_PACKS, ...extraPacks];

  let chosenPacks: Pack[] = allAvailablePacks.filter((p) =>
    settings.selectedPackIds.includes(p.id)
  );

  if (chosenPacks.length === 0 && extraPacks.length > 0) {
    chosenPacks = extraPacks;
  }

  if (chosenPacks.length === 0) {
    chosenPacks = [BUILT_IN_PACKS[0]];
  }

  // Prevent immediate repetition of previous word pair
  const excludeWord = previousGameState?.activePair?.a;
  const { pair, pack } = getRandomPairFromPacks(chosenPacks, excludeWord);

  const totalPlayers = settings.players.length;
  const undercoverCount = settings.undercoverCount;
  const mrblackCount = settings.mrblackCount;
  const civilianCount = totalPlayers - undercoverCount - mrblackCount;

  // Build role array
  const roles: ('civilian' | 'undercover' | 'mrblack')[] = [
    ...Array(civilianCount).fill('civilian'),
    ...Array(undercoverCount).fill('undercover'),
    ...Array(mrblackCount).fill('mrblack'),
  ];

  // Helper to shuffle array with Fisher-Yates
  const shuffle = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  let shuffledRoles = shuffle(roles);

  // If there was a previous game and enough civilian slots exist,
  // try up to 30 shuffles to avoid assigning special roles (undercover / mrblack)
  // to the EXACT same player who had a special role in the immediately preceding game.
  if (previousGameState && civilianCount >= undercoverCount + mrblackCount) {
    const previousImpostorNames = new Set(
      previousGameState.players
        .filter((p) => p.role === 'undercover' || p.role === 'mrblack')
        .map((p) => p.name.trim().toLowerCase())
    );

    if (previousImpostorNames.size > 0) {
      for (let attempt = 0; attempt < 30; attempt++) {
        const candidate = shuffle(roles);
        // Check if any previous impostor gets an impostor role again
        const hasImmediateRepeat = candidate.some((role, idx) => {
          const playerName = (settings.players[idx] || '').trim().toLowerCase();
          return (role === 'undercover' || role === 'mrblack') && previousImpostorNames.has(playerName);
        });

        if (!hasImmediateRepeat) {
          shuffledRoles = candidate;
          break;
        }
      }
    }
  }

  // Create Player entities
  const players: Player[] = settings.players.map((name, index) => {
    const role = shuffledRoles[index];
    let word: string | null = null;
    if (role === 'civilian') {
      word = pair.a;
    } else if (role === 'undercover') {
      word = pair.b;
    } else {
      word = null; // Mr. Black knows nothing
    }

    return {
      id: `player-${index + 1}`,
      name: name.trim() || `Player ${index + 1}`,
      role,
      word,
      isEliminated: false,
      revealedCard: false,
    };
  });

  const startingPlayerIndex = Math.floor(Math.random() * players.length);

  return {
    phase: 'reveal',
    settings,
    activePacks: chosenPacks,
    activePair: pair,
    players,
    currentRevealIndex: 0,
    currentRound: 1,
    startingPlayerIndex,
    currentSpeakerIndex: startingPlayerIndex,
    votedOutPlayer: null,
    winner: null,
  };
}

export function checkGameEndCondition(players: Player[]): {
  isOver: boolean;
  winner: 'civilians' | 'undercovers' | 'mrblack' | null;
  reason?: string;
} {
  const alivePlayers = players.filter((p) => !p.isEliminated);
  const aliveCivilians = alivePlayers.filter((p) => p.role === 'civilian').length;
  const aliveUndercovers = alivePlayers.filter((p) => p.role === 'undercover').length;
  const aliveMrBlacks = alivePlayers.filter((p) => p.role === 'mrblack').length;

  const totalImpostors = aliveUndercovers + aliveMrBlacks;

  // Condition 1: All Impostors (Undercovers + Mr. Blacks) are eliminated -> Civilians Win
  if (totalImpostors === 0) {
    return {
      isOver: true,
      winner: 'civilians',
      reason: 'All Undercovers and Mr. Blacks have been eliminated! Civilians win!',
    };
  }

  // Condition 2: Impostors count >= Civilians count -> Impostors Win (Undercovers or Mr. Black)
  if (totalImpostors >= aliveCivilians) {
    if (aliveUndercovers > 0 && aliveMrBlacks === 0) {
      return {
        isOver: true,
        winner: 'undercovers',
        reason: 'Undercovers have outnumbered the Civilians!',
      };
    } else if (aliveMrBlacks > 0 && aliveUndercovers === 0) {
      return {
        isOver: true,
        winner: 'mrblack',
        reason: 'Mr. Black survived and outsmarted the Civilians!',
      };
    } else {
      return {
        isOver: true,
        winner: 'undercovers',
        reason: 'Impostors successfully infiltrated and outnumbered the Civilians!',
      };
    }
  }

  return { isOver: false, winner: null };
}
