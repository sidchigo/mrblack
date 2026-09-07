'use client';

import React from 'react';
import { ShieldAlert, HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import { Player } from '@/types/game';

interface MrBlackGuessModalProps {
  player: Player;
  civilianWord: string;
  onGuessSubmitted: (guessedWord: string, isCorrect: boolean) => void;
}

export function MrBlackGuessModal({
  player,
  civilianWord,
  onGuessSubmitted,
}: MrBlackGuessModalProps) {
  const [guess, setGuess] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;

    // Fuzzy normalize match
    const cleanGuess = guess.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanTarget = civilianWord.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    const isCorrect = cleanGuess === cleanTarget;
    onGuessSubmitted(guess.trim(), isCorrect);
  };

  return (
    <div className="w-full max-w-md mx-auto px-3.5 py-4 flex flex-col items-center justify-center min-h-[75vh]">
      <div className="discord-card bg-discord-surface-indigo/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-discord-yellow/40 shadow-glow text-center w-full">
        <div className="w-14 h-14 rounded-full bg-discord-yellow/20 border border-discord-yellow/50 flex items-center justify-center text-discord-yellow mx-auto mb-3 animate-bounce">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 bg-discord-yellow/20 text-discord-yellow font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          Mr. Black Voted Out!
        </div>

        <h3 className="text-2xl sm:text-3xl font-black font-discord-headline text-white mb-1.5 uppercase">
          {player.name}, Last Chance!
        </h3>
        <p className="text-xs text-discord-muted mb-4 leading-tight">
          Guess the <span className="text-white font-bold">Civilian secret word</span> to steal victory!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Type civilian word guess..."
            autoFocus
            className="w-full bg-discord-surface-onyx border border-white/10 rounded-2xl px-4 py-3.5 text-base text-white placeholder:text-discord-muted focus:outline-none focus:border-discord-yellow transition-all text-center font-bold"
          />

          <button
            type="submit"
            disabled={!guess.trim()}
            className="w-full bg-discord-yellow hover:bg-yellow-400 disabled:opacity-40 text-discord-ink-dark font-extrabold text-base py-3.5 px-6 rounded-2xl shadow-float transition-all"
          >
            Submit Final Guess
          </button>
        </form>
      </div>
    </div>
  );
}
