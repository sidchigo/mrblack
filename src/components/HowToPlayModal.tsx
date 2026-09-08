'use client';

import React from 'react';
import { HelpCircle, X, Sparkles, Flame } from 'lucide-react';

export function HowToPlayModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-full h-full min-h-dvh !m-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-discord-surface-indigo border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-discord-muted hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-discord-primary font-bold text-sm mb-1 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          Game Rules
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mb-4">
          How to Play Mr. Black
        </h2>

        <div className="space-y-4 text-sm text-discord-muted leading-relaxed max-h-[65vh] overflow-y-auto pr-1">
          {/* Section 1 */}
          <div className="bg-discord-surface-onyx p-4 rounded-2xl border border-white/5">
            <h3 className="text-white font-bold mb-1 flex items-center gap-1.5">
              🎭 1. Roles & Pass-and-Play
            </h3>
            <p>
              Pass the single phone to each player to reveal their secret identity:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
              <li><strong className="text-discord-green">Civilians:</strong> Know the true secret word (e.g. <em>&quot;Samosa&quot;</em>).</li>
              <li><strong className="text-discord-magenta">Undercover:</strong> Receives a slightly different word (e.g. <em>&quot;Kachori&quot;</em>).</li>
              <li><strong className="text-discord-yellow">Mr. Black:</strong> Gets NO word! Must bluff and figure out the word.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-discord-surface-onyx p-4 rounded-2xl border border-white/5">
            <h3 className="text-white font-bold mb-1 flex items-center gap-1.5">
              🗣️ 2. Discussion & Clue Round
            </h3>
            <p>
              Taking turns, each player describes their word with <strong>one clue</strong>. Be subtle! If your clue is too obvious, Mr. Black will figure it out. If it is too vague, people will think you are an impostor!
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-discord-surface-onyx p-4 rounded-2xl border border-white/5">
            <h3 className="text-white font-bold mb-1 flex items-center gap-1.5">
              🗳️ 3. Voting & Elimination
            </h3>
            <p>
              After clues, discuss and vote out the most suspicious player.
            </p>
            <p className="mt-1 text-xs">
              ⚡ <strong>Mr. Black Twist:</strong> If Mr. Black gets voted out, they get ONE final chance to guess the Civilian word. If correct, Mr. Black steals the victory instantly!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-discord-primary hover:bg-discord-primary-hover text-white font-bold py-3.5 rounded-2xl transition-all"
        >
          Got It! Let&apos;s Play
        </button>
      </div>
    </div>
  );
}
