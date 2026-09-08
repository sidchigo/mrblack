import { GameSettings, GameState, Player, Pack, WordPair } from '@/types/game';
import { getRandomPairFromPacks, BUILT_IN_PACKS } from './packs';

export function initializeGame(
  settings: GameSettings,
  customPacks?: Pack | Pack[]
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

  const { pair, pack } = getRandomPairFromPacks(chosenPacks);

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

  // Fisher-Yates Shuffle roles
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  // Create Player entities
  const players: Player[] = settings.players.map((name, index) => {
    const role = roles[index];
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
