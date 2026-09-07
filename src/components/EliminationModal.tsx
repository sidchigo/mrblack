'use client';

import React from 'react';
import { Player } from '@/types/game';

interface EliminationModalProps {
  player: Player;
  onContinue: () => void;
}

export function EliminationModal({ player, onContinue }: EliminationModalProps) {
  const isCiv = player.role === 'civilian';
  const isUc = player.role === 'undercover';
  const isMb = player.role === 'mrblack';

  const getRoleLabel = () => {
    if (isCiv) return 'Civilian';
    if (isUc) return 'Undercover';
    return 'Mr. Black';
  };

  const getRoleColor = () => {
    if (isCiv) return 'text-discord-green bg-discord-green/20 border-discord-green/40';
    if (isUc) return 'text-discord-magenta bg-discord-magenta/20 border-discord-magenta/40';
    return 'text-discord-yellow bg-discord-yellow/20 border-discord-yellow/40';
  };

  return (
    <div className="fixed inset-0 w-screen h-screen z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-discord-surface-indigo border border-white/15 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-card my-auto">
        <span className="text-[11px] font-black uppercase tracking-widest text-discord-muted">
          Elimination Result
        </span>

        <div>
          <h2 className="text-3xl font-black font-discord-headline text-white uppercase tracking-tight">
            {player.name}
          </h2>
          <p className="text-xs text-discord-muted font-medium pt-1">
            has been voted out!
          </p>
        </div>

        <div className={`p-4 rounded-2xl border text-center space-y-1 ${getRoleColor()}`}>
          <span className="text-[10px] uppercase font-black tracking-widest text-white/70 block">
            Their Secret Role Was
          </span>
          <span className="text-2xl font-black font-discord-headline uppercase block">
            {getRoleLabel()}
          </span>
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-discord-primary hover:bg-discord-primary-hover text-white font-black font-discord-headline text-sm py-3.5 rounded-xl uppercase tracking-wider transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}
