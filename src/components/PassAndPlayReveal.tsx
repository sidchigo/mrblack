'use client';

import React from 'react';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import { Player } from '@/types/game';

interface PassAndPlayRevealProps {
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  onNextPlayer: () => void;
  onPrevPlayer: () => void;
}

export function PassAndPlayReveal({
  player,
  playerIndex,
  totalPlayers,
  onNextPlayer,
  onPrevPlayer,
}: PassAndPlayRevealProps) {
  const [isHolding, setIsHolding] = React.useState(false);

  const startHold = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsHolding(true);
  };

  const endHold = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (isHolding) {
      setIsHolding(false);
      // Advance to next person upon release
      setTimeout(() => {
        onNextPlayer();
      }, 150);
    }
  };

  const isMrBlack = player.role === 'mrblack';

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-4 flex flex-col items-center justify-between min-h-[75vh] select-none">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-widest text-discord-primary bg-discord-primary/20 border border-discord-primary/40 px-3 py-0.5 rounded-full">
          Player {playerIndex + 1} of {totalPlayers}
        </span>

        {playerIndex > 0 && (
          <button
            onClick={onPrevPlayer}
            className="flex items-center gap-1 text-[11px] font-bold text-discord-muted hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Missed? Peek Previous</span>
          </button>
        )}
      </div>

      {/* Center Pass Target & Word Surface */}
      <div className="w-full text-center space-y-4 my-auto">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-widest text-discord-muted font-semibold block font-sans">
            Pass Phone To
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-discord-headline text-white uppercase tracking-tight">
            {player.name}
          </h1>
        </div>

        {/* Holdable Card */}
        <div
          onMouseDown={startHold}
          onMouseUp={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          onMouseLeave={endHold}
          className={`w-full aspect-[4/3] rounded-3xl cursor-pointer border shadow-card flex flex-col items-center justify-center p-6 text-center transition-all duration-150 transform active:scale-95 select-none ${
            isHolding
              ? 'bg-discord-primary border-discord-primary shadow-glow text-white'
              : 'bg-discord-surface-indigo/90 hover:bg-discord-surface-indigo border-white/10 text-discord-muted'
          }`}
        >
          {isHolding ? (
            <div className="animate-in fade-in zoom-in duration-100 flex flex-col items-center justify-center space-y-2">
              {isMrBlack ? (
                <div className="space-y-1">
                  <span className="text-2xl sm:text-3xl font-bold font-discord-headline uppercase tracking-tight text-discord-yellow block">
                    YOU ARE MR. BLACK
                  </span>
                  <span className="text-xs text-white/90 font-medium block font-sans">
                    You have NO word. Bluff your way through!
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-4xl sm:text-5xl font-bold font-discord-headline text-white drop-shadow-md block uppercase">
                    {player.word}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="text-4xl">👆</span>
              <span className="text-base font-bold font-discord-headline text-white uppercase tracking-wide">
                Hold Card To Reveal
              </span>
              <span className="text-xs text-discord-muted font-medium font-sans">
                Release to hide and pass to next
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="text-center text-[11px] text-discord-muted font-medium">
        Ensure other players cannot see your screen
      </div>
    </div>
  );
}
