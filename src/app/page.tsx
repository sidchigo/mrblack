'use client';

import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { GameState, GameSettings, Pack, Player } from '@/types/game';
import { initializeGame, checkGameEndCondition } from '@/lib/game/game-engine';
import { Lobby } from '@/components/Lobby';
import { PassAndPlayReveal } from '@/components/PassAndPlayReveal';
import { VotingPhase } from '@/components/VotingPhase';
import { EliminationModal } from '@/components/EliminationModal';
import { MrBlackGuessModal } from '@/components/MrBlackGuessModal';
import { VictoryScreen } from '@/components/VictoryScreen';
import { HowToPlayModal } from '@/components/HowToPlayModal';

export default function Home() {
  const [gameState, setGameState] = React.useState<GameState | null>(null);
  const [customGeneratedPacks, setCustomGeneratedPacks] = React.useState<Pack[]>([]);
  const [showHowToPlay, setShowHowToPlay] = React.useState(false);
  const [eliminatedAnnouncement, setEliminatedAnnouncement] = React.useState<Player | null>(null);

  // Track initial anonymous DAU on client
  React.useEffect(() => {
    let clientId = localStorage.getItem('mrblack_client_id');
    if (!clientId) {
      clientId = 'client_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('mrblack_client_id', clientId);
    }
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, event: 'app_opened' }),
    }).catch(() => {});
  }, []);

  // 1. Start Game from Lobby
  const handleStartGame = (settings: GameSettings, customPacks?: Pack | Pack[]) => {
    const extraPacks = Array.isArray(customPacks)
      ? customPacks
      : customPacks
      ? [customPacks]
      : [];

    if (extraPacks.length > 0) {
      setCustomGeneratedPacks(extraPacks);
    }
    const newGame = initializeGame(settings, extraPacks);
    setGameState(newGame);

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'game_started',
        meta: {
          players: settings.players.length,
          packIds: settings.selectedPackIds,
        },
      }),
    }).catch(() => {});
  };

  // 2. Next player in Pass & Play reveal
  const handleNextReveal = () => {
    if (!gameState) return;

    if (gameState.currentRevealIndex + 1 < gameState.players.length) {
      setGameState({
        ...gameState,
        currentRevealIndex: gameState.currentRevealIndex + 1,
      });
    } else {
      // All cards revealed -> proceed directly to Voting / Discussion round!
      setGameState({
        ...gameState,
        phase: 'voting',
      });
    }
  };

  const handlePrevReveal = () => {
    if (!gameState || gameState.currentRevealIndex <= 0) return;
    setGameState({
      ...gameState,
      currentRevealIndex: gameState.currentRevealIndex - 1,
    });
  };

  // 3. Handle Player Eliminated via Vote
  const handlePlayerVotedOut = (votedPlayer: Player) => {
    if (!gameState) return;

    const updatedPlayers = gameState.players.map((p) =>
      p.id === votedPlayer.id
        ? { ...p, isEliminated: true, eliminatedRound: gameState.currentRound }
        : p
    );

    // If eliminated player is Mr. Black -> Trigger Mr. Black last guess phase
    if (votedPlayer.role === 'mrblack') {
      setGameState({
        ...gameState,
        players: updatedPlayers,
        votedOutPlayer: votedPlayer,
        phase: 'mrblack_guess',
      });
      return;
    }

    // Show elimination announcement modal with revealed role
    setEliminatedAnnouncement(votedPlayer);

    // Check win conditions
    const result = checkGameEndCondition(updatedPlayers);
    if (result.isOver) {
      setGameState({
        ...gameState,
        players: updatedPlayers,
        votedOutPlayer: votedPlayer,
        phase: 'game_over',
        winner: result.winner,
        winReason: result.reason,
      });
    } else {
      // Continue next round
      setGameState({
        ...gameState,
        players: updatedPlayers,
        votedOutPlayer: votedPlayer,
        phase: 'voting',
        currentRound: gameState.currentRound + 1,
      });
    }
  };

  // 4. Skip vote when tie or no consensus
  const handleSkipVote = () => {
    if (!gameState) return;
    setGameState({
      ...gameState,
      phase: 'voting',
      currentRound: gameState.currentRound + 1,
    });
  };

  // 5. Mr. Black Guess submission
  const handleMrBlackGuessSubmitted = (guessedWord: string, isCorrect: boolean) => {
    if (!gameState) return;

    if (isCorrect) {
      // Mr. Black wins!
      setGameState({
        ...gameState,
        mrblackGuessedWord: guessedWord,
        mrblackGuessSuccess: true,
        phase: 'game_over',
        winner: 'mrblack',
        winReason: `Mr. Black correctly guessed "${gameState.activePair.a}" and hijacked the victory!`,
      });
    } else {
      // Mr. Black failed guess, check if game is over or continues
      const result = checkGameEndCondition(gameState.players);
      if (result.isOver) {
        setGameState({
          ...gameState,
          mrblackGuessedWord: guessedWord,
          mrblackGuessSuccess: false,
          phase: 'game_over',
          winner: result.winner,
          winReason: result.reason,
        });
      } else {
        setGameState({
          ...gameState,
          mrblackGuessedWord: guessedWord,
          mrblackGuessSuccess: false,
          phase: 'voting',
          currentRound: gameState.currentRound + 1,
        });
      }
    }
  };

  // 6. Replay Handlers
  const handlePlayAgainSame = () => {
    if (!gameState) return;
    const newGame = initializeGame(gameState.settings, customGeneratedPacks);
    setGameState(newGame);
  };

  const handleBackToLobby = () => {
    setGameState(null);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-discord-surface-indigo/60 backdrop-blur-md px-4 py-3 sticky top-0 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={handleBackToLobby}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/10 shadow-float group-hover:scale-105 transition-transform bg-discord-surface-indigo/90 shrink-0">
              <img
                src="/logo.png"
                alt="Mr. Black Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-extrabold font-discord-headline tracking-tight text-sm text-white uppercase">
                MR. <span className="text-discord-primary">BLACK</span>
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHowToPlay(true)}
              className="flex items-center gap-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-1.5 rounded-xl transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-discord-magenta" />
              <span>Rules</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Screen Router */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {!gameState && <Lobby onStartGame={handleStartGame} />}

        {gameState && gameState.phase === 'reveal' && (
          <PassAndPlayReveal
            player={gameState.players[gameState.currentRevealIndex]}
            playerIndex={gameState.currentRevealIndex}
            totalPlayers={gameState.players.length}
            onNextPlayer={handleNextReveal}
            onPrevPlayer={handlePrevReveal}
          />
        )}

        {gameState && gameState.phase === 'voting' && (
          <VotingPhase
            players={gameState.players}
            onPlayerVotedOut={handlePlayerVotedOut}
            onSkipVote={handleSkipVote}
          />
        )}

        {gameState && gameState.phase === 'mrblack_guess' && gameState.votedOutPlayer && (
          <MrBlackGuessModal
            player={gameState.votedOutPlayer}
            civilianWord={gameState.activePair.a}
            onGuessSubmitted={handleMrBlackGuessSubmitted}
          />
        )}

        {gameState && gameState.phase === 'game_over' && (
          <VictoryScreen
            gameState={gameState}
            onPlayAgainSame={handlePlayAgainSame}
            onBackToLobby={handleBackToLobby}
          />
        )}
      </div>

      {/* Elimination Role Reveal Modal */}
      {eliminatedAnnouncement && (
        <EliminationModal
          player={eliminatedAnnouncement}
          onContinue={() => setEliminatedAnnouncement(null)}
        />
      )}

      {/* How To Play Modal */}
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </main>
  );
}
