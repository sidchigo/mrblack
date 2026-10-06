'use client';

import React from 'react';
import { Eye, EyeOff, Check, Users, Sparkles } from 'lucide-react';
import { RoomPlayer, RoomState } from '@/types/game';

interface RoomRevealProps {
  room: RoomState;
  myPlayer: RoomPlayer | null;
  onReady: () => void;
  onStartVoting?: () => void;
  isHost: boolean;
}

export function RoomReveal({
  room,
  myPlayer,
  onReady,
  onStartVoting,
  isHost,
}: RoomRevealProps) {
  const [isHolding, setIsHolding] = React.useState(false);
  const [hasRevealedOnce, setHasRevealedOnce] = React.useState(myPlayer?.revealedCard ?? false);

  const startHold = () => {
    setIsHolding(true);
  };

  const endHold = () => {
    if (isHolding) {
      setIsHolding(false);
      setHasRevealedOnce(true);
      if (!myPlayer?.isReady) {
        onReady();
      }
    }
  };

  const isMrBlack = myPlayer?.role === 'mrblack';
  const readyCount = room.gameState?.readyPlayers?.length ?? 0;
  const totalPlayers = room.players.length;

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-4 flex flex-col items-center justify-between min-h-[75vh] select-none">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-widest text-discord-primary bg-discord-primary/20 border border-discord-primary/40 px-3 py-0.5 rounded-full">
          Room {room.code}
        </span>

        <span className="flex items-center gap-1.5 text-[11px] font-bold text-discord-green bg-discord-green/15 border border-discord-green/30 px-2.5 py-0.5 rounded-full">
          <Users className="w-3 h-3" />
          <span>{readyCount} of {totalPlayers} Ready</span>
        </span>
      </div>

      {/* Center Word Surface */}
      <div className="w-full text-center space-y-4 my-auto">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-widest text-discord-muted font-semibold block font-sans">
            Your Secret Identity
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-discord-headline text-white uppercase tracking-tight">
            {myPlayer?.name || 'Player'}
          </h1>
        </div>

        {/* Holdable Card (Identical to Pass & Play) */}
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
                    {myPlayer?.word || '???'}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="text-4xl">{hasRevealedOnce ? '👀' : '👆'}</span>
              <span className="text-base font-bold font-discord-headline text-white uppercase tracking-wide">
                {hasRevealedOnce ? 'Hold to Peek Again' : 'Hold Card To Reveal'}
              </span>
              <span className="text-xs text-discord-muted font-medium font-sans">
                Release to hide from others around you
              </span>
            </div>
          )}
        </div>

        {/* Readiness Status indicator */}
        <div className="space-y-2 pt-2">
          {hasRevealedOnce ? (
            <div className="flex items-center justify-center gap-1.5 text-xs text-discord-green font-semibold">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>You are marked ready. Waiting for friends...</span>
            </div>
          ) : (
            <div className="text-xs text-discord-muted font-medium">
              Hold the card above to see your secret word
            </div>
          )}

          {isHost && onStartVoting && (
            <button
              onClick={onStartVoting}
              className="mt-3 w-full bg-discord-surface-onyx hover:bg-white/10 text-white font-bold text-xs py-2.5 rounded-xl border border-white/10 transition-colors uppercase tracking-wider"
            >
              Skip Wait &amp; Start Discussion Now
            </button>
          )}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="text-center text-[11px] text-discord-muted font-medium">
        Keep your screen private from other players
      </div>
    </div>
  );
}
