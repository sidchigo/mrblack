export interface WordPair {
  a: string; // Civilian word
  b: string; // Undercover word
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  category: string;
  isBuiltIn: boolean;
  pairs: WordPair[];
}

export type GameRole = 'civilian' | 'undercover' | 'mrblack';

export interface Player {
  id: string;
  name: string;
  role: GameRole;
  word: string | null;
  isEliminated: boolean;
  eliminatedRound?: number;
  revealedCard?: boolean;
}

export type GamePhase =
  | 'lobby'
  | 'reveal'
  | 'clues'
  | 'voting'
  | 'mrblack_guess'
  | 'game_over';

export interface GameSettings {
  players: string[];
  undercoverCount: number;
  mrblackCount: number;
  selectedPackIds: string[];
  customTopic?: string;
  timerSeconds?: number;
}

export interface GameState {
  phase: GamePhase;
  settings: GameSettings;
  activePacks: Pack[];
  activePair: WordPair;
  players: Player[];
  currentRevealIndex: number;
  currentRound: number;
  startingPlayerIndex: number;
  currentSpeakerIndex: number;
  votedOutPlayer: Player | null;
  mrblackGuessedWord?: string;
  mrblackGuessSuccess?: boolean;
  winner: 'civilians' | 'undercovers' | 'mrblack' | null;
  winReason?: string;
}
