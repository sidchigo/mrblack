'use client';

import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';
import { GameState } from '@/types/game';
import { VictoryCelebrationOverlay } from './VictoryCelebrationOverlay';

interface VictoryScreenProps {
  gameState: GameState;
  onPlayAgainSame: () => void;
  onBackToLobby: () => void;
}

export function VictoryScreen({
  gameState,
  onPlayAgainSame,
  onBackToLobby,
}: VictoryScreenProps) {
  const { winner, winReason, players, activePair, mrblackGuessedWord, mrblackGuessSuccess } = gameState;

  const [showCelebrationIntro, setShowCelebrationIntro] = React.useState(
    winner === 'civilians' || winner === 'undercovers' || winner === 'mrblack'
  );

  const getWinnerTitle = () => {
    if (winner === 'civilians') return 'CIVILIANS WIN!';
    if (winner === 'undercovers') return 'UNDERCOVERS WIN!';
    if (winner === 'mrblack') return 'MR. BLACK WINS!';
    return 'GAME OVER';
  };

  const getWinnerColor = () => {
    if (winner === 'civilians') return 'text-discord-green bg-discord-green/20 border-discord-green/40';
    if (winner === 'undercovers') return 'text-discord-magenta bg-discord-magenta/20 border-discord-magenta/40';
    if (winner === 'mrblack') return 'text-discord-yellow bg-discord-yellow/20 border-discord-yellow/40';
    return 'text-discord-primary bg-discord-primary/20 border-discord-primary/40';
  };

  return (
    <>
      {showCelebrationIntro && winner && (
        <VictoryCelebrationOverlay
          winner={winner}
          players={players}
          onFinish={() => setShowCelebrationIntro(false)}
        />
      )}

      <div className="w-full max-w-sm mx-auto space-y-4 select-none pb-4">
      {/* 1. Header Banner */}
      <div className="text-center space-y-1.5 pt-1">
        <div className={`inline-flex items-center gap-1.5 border px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest font-sans ${getWinnerColor()}`}>
          <Trophy className="w-3.5 h-3.5" />
          Game Complete
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-discord-headline text-white uppercase tracking-tight">
          {getWinnerTitle()}
        </h1>

        {winReason && (
          <p className="text-discord-muted text-xs font-normal leading-tight font-sans">
            {winReason}
          </p>
        )}

        {mrblackGuessedWord && (
          <div className="text-xs bg-discord-surface-onyx border border-white/10 px-3 py-1 rounded-xl inline-block text-discord-muted font-sans">
            Mr. Black guess: <strong className="text-white">&quot;{mrblackGuessedWord}&quot;</strong> {mrblackGuessSuccess ? '🎯 (Correct)' : '❌ (Wrong)'}
          </div>
        )}
      </div>

      {/* 2. Secret Words Reveal (Clean 2-column or stacked pill) */}
      <div className="space-y-2 font-sans">
        <span className="text-xs font-medium tracking-wider uppercase text-white/70 px-1 block">
          Secret Words
        </span>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-discord-surface-indigo/90 border border-discord-green/40 p-3 rounded-2xl text-center">
            <span className="text-[10px] font-semibold uppercase text-discord-green block">
              Civilian
            </span>
            <span className="text-lg font-bold font-discord-headline text-white block truncate uppercase pt-0.5">
              {activePair.a}
            </span>
          </div>

          <div className="bg-discord-surface-indigo/90 border border-discord-magenta/40 p-3 rounded-2xl text-center">
            <span className="text-[10px] font-semibold uppercase text-discord-magenta block">
              Undercover
            </span>
            <span className="text-lg font-bold font-discord-headline text-white block truncate uppercase pt-0.5">
              {activePair.b}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Players & Roles List */}
      <div className="space-y-1.5 font-sans">
        <span className="text-xs font-medium tracking-wider uppercase text-white/70 px-1 block">
          Player Identities
        </span>

        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {players.map((p) => {
            const isCiv = p.role === 'civilian';
            const isUc = p.role === 'undercover';

            return (
              <div
                key={p.id}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-discord-surface-indigo/90 border border-white/10 text-xs font-sans"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isCiv
                        ? 'bg-discord-green/20 text-discord-green'
                        : isUc
                        ? 'bg-discord-magenta/20 text-discord-magenta'
                        : 'bg-discord-yellow/20 text-discord-yellow'
                    }`}
                  >
                    {isCiv ? 'C' : isUc ? 'U' : 'MB'}
                  </span>
                  <span className="font-medium text-white">{p.name}</span>
                </div>

                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                    isCiv
                      ? 'bg-discord-green/10 text-discord-green'
                      : isUc
                      ? 'bg-discord-magenta/10 text-discord-magenta'
                      : 'bg-discord-yellow/10 text-discord-yellow'
                  }`}
                >
                  {isCiv ? 'Civilian' : isUc ? 'Undercover' : 'Mr. Black'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="space-y-2 pt-2 font-sans">
        <button
          onClick={onPlayAgainSame}
          className="w-full bg-discord-primary hover:bg-discord-primary-hover text-white font-bold text-sm py-3.5 rounded-2xl shadow-float flex items-center justify-center gap-2 uppercase tracking-wide transition-all font-sans"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again</span>
        </button>

        <button
          onClick={onBackToLobby}
          className="w-full py-2.5 text-xs text-discord-muted hover:text-white font-medium transition-colors text-center font-sans"
        >
          Back to Lobby
        </button>
      </div>
    </div>
    </>
  );
}
