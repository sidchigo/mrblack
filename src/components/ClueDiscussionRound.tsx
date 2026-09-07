'use client';

import React from 'react';
import { Mic, Vote, Clock, CheckCircle, ChevronRight, User } from 'lucide-react';
import { Player } from '@/types/game';

interface ClueDiscussionRoundProps {
  round: number;
  players: Player[];
  startingPlayerIndex: number;
  onProceedToVote: () => void;
}

export function ClueDiscussionRound({
  round,
  players,
  startingPlayerIndex,
  onProceedToVote,
}: ClueDiscussionRoundProps) {
  const activePlayers = players.filter((p) => !p.isEliminated);
  
  // Re-order active players starting from startingPlayerIndex
  const startIndexInActive = activePlayers.findIndex(
    (p) => p.id === players[startingPlayerIndex]?.id
  );
  const reorderedPlayers = [
    ...activePlayers.slice(startIndexInActive >= 0 ? startIndexInActive : 0),
    ...activePlayers.slice(0, startIndexInActive >= 0 ? startIndexInActive : 0),
  ];

  const [currentSpeakerIdx, setCurrentSpeakerIdx] = React.useState(0);
  const [completedSpeakers, setCompletedSpeakers] = React.useState<string[]>([]);

  const handleNextSpeaker = () => {
    const current = reorderedPlayers[currentSpeakerIdx];
    if (current && !completedSpeakers.includes(current.id)) {
      setCompletedSpeakers([...completedSpeakers, current.id]);
    }

    if (currentSpeakerIdx < reorderedPlayers.length - 1) {
      setCurrentSpeakerIdx(currentSpeakerIdx + 1);
    }
  };

  const isAllCluesGiven = completedSpeakers.length >= reorderedPlayers.length;

  return (
    <div className="w-full max-w-md mx-auto px-3.5 py-4 space-y-4">
      {/* Round Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 bg-discord-primary/20 border border-discord-primary/40 px-3 py-1 rounded-full text-discord-primary text-[11px] font-extrabold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          Round {round} — Clues
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-discord-headline text-white uppercase">
          Give Your Clues!
        </h2>
        <p className="text-xs text-discord-muted leading-tight">
          Each player gives <span className="text-white font-bold">one word or phrase</span>. Don&apos;t say the word itself!
        </p>
      </div>

      {/* Current Speaker Spotlight Card */}
      <div className="discord-card bg-discord-surface-indigo/90 backdrop-blur-md p-6 mb-6 shadow-card text-center border border-white/10">
        <div className="text-xs font-bold uppercase tracking-widest text-discord-muted mb-2">
          Current Turn To Speak
        </div>
        <div className="inline-flex items-center gap-3 bg-discord-surface-onyx border border-discord-primary/50 px-6 py-3 rounded-2xl shadow-float mb-4">
          <Mic className="w-6 h-6 text-discord-primary animate-pulse" />
          <span className="text-2xl font-extrabold font-display text-white">
            {reorderedPlayers[currentSpeakerIdx]?.name || 'All Done'}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleNextSpeaker}
            disabled={isAllCluesGiven}
            className="bg-discord-primary hover:bg-discord-primary-hover disabled:opacity-40 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all flex items-center gap-2 shadow"
          >
            <span>Clue Given</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Player Speaking Order List */}
      <div className="discord-card bg-discord-surface-indigo/80 backdrop-blur-md p-5 shadow-card border border-white/10 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-discord-muted mb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          Turn Order
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {reorderedPlayers.map((player, idx) => {
            const isDone = completedSpeakers.includes(player.id);
            const isCurrent = idx === currentSpeakerIdx && !isAllCluesGiven;
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-discord-primary/20 border-discord-primary text-white font-bold shadow'
                    : isDone
                    ? 'bg-discord-surface-onyx/50 border-white/5 text-discord-muted'
                    : 'bg-discord-surface-onyx border-white/10 text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-sm">{player.name}</span>
                </div>
                {isDone && <CheckCircle className="w-4 h-4 text-discord-green" />}
                {isCurrent && (
                  <span className="text-[11px] uppercase tracking-wider text-discord-primary font-bold bg-discord-primary/20 px-2 py-0.5 rounded">
                    Speaking
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Vote Trigger Button */}
      <button
        onClick={onProceedToVote}
        className="w-full bg-discord-magenta hover:bg-discord-magenta-hover text-white font-extrabold text-base py-4 px-6 rounded-2xl shadow-float flex items-center justify-center gap-2 transition-all transform active:scale-98"
      >
        <Vote className="w-5 h-5" />
        <span>Proceed To Vote & Discussion</span>
      </button>
    </div>
  );
}
