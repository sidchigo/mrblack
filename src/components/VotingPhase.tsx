'use client';

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Player } from '@/types/game';

interface VotingPhaseProps {
  players: Player[];
  onPlayerVotedOut: (votedPlayer: Player) => void;
  onSkipVote: () => void;
}

export function VotingPhase({
  players,
  onPlayerVotedOut,
  onSkipVote,
}: VotingPhaseProps) {
  const alivePlayers = players.filter((p) => !p.isEliminated);
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);

  // Peek word modal state for any player who missed/forgot their word!
  const [peekingPlayer, setPeekingPlayer] = React.useState<Player | null>(null);
  const [isHoldingPeek, setIsHoldingPeek] = React.useState(false);

  const handleSelect = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleConfirmElimination = () => {
    if (selectedPlayer) {
      onPlayerVotedOut(selectedPlayer);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-4 space-y-4 select-none">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-widest text-discord-red bg-discord-red/20 border border-discord-red/40 px-3 py-0.5 rounded-full font-sans">
          Discussion &amp; Vote
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-discord-headline text-white uppercase tracking-tight pt-0.5">
          Who Is Out?
        </h1>
        <p className="text-xs text-discord-muted font-normal font-sans">
          Debate clues, then tap a player to eliminate
        </p>
      </div>

      {/* Alive Player List */}
      <div className="space-y-1.5 font-sans">
        {alivePlayers.map((player) => {
          const isSelected = selectedPlayer?.id === player.id;
          return (
            <div
              key={player.id}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-discord-red/20 border-discord-red shadow-glow'
                  : 'bg-discord-surface-indigo/90 border-white/10'
              }`}
            >
              {/* Select player for vote */}
              <button
                onClick={() => handleSelect(player)}
                className="flex items-center gap-2.5 flex-1 text-left font-bold"
              >
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-discord-red text-white' : 'bg-discord-surface-onyx text-discord-muted'
                  }`}
                >
                  {player.name[0].toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-white">
                  {player.name}
                </span>
                {isSelected && (
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-discord-red text-white px-2 py-0.5 rounded-md ml-auto mr-2">
                    VOTED
                  </span>
                )}
              </button>

              {/* Peek Word action for this player */}
              <button
                onClick={() => setPeekingPlayer(player)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-discord-muted hover:text-white transition-colors"
                title={`Peek secret word for ${player.name}`}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleConfirmElimination}
          disabled={!selectedPlayer}
          className="w-full bg-discord-red hover:bg-discord-red-hover disabled:opacity-30 text-white font-black font-discord-headline text-base py-3.5 rounded-2xl shadow-float flex items-center justify-center uppercase tracking-wider transition-all transform active:scale-98"
        >
          Eliminate {selectedPlayer ? selectedPlayer.name : ''}
        </button>

        <button
          onClick={onSkipVote}
          className="w-full py-2 text-xs text-discord-muted hover:text-white font-bold transition-colors text-center"
        >
          No Consensus? Skip Round
        </button>
      </div>

      {/* Peek Word Modal */}
      {peekingPlayer && (
        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-full h-full min-h-dvh !m-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-discord-surface-indigo border border-white/15 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-card my-auto">
            <span className="text-[11px] font-black uppercase tracking-widest text-discord-primary">
              Peek Word • {peekingPlayer.name}
            </span>

            <div
              onMouseDown={() => setIsHoldingPeek(true)}
              onMouseUp={() => setIsHoldingPeek(false)}
              onTouchStart={() => setIsHoldingPeek(true)}
              onTouchEnd={() => setIsHoldingPeek(false)}
              className="w-full aspect-video rounded-2xl bg-discord-surface-onyx border border-white/10 flex flex-col items-center justify-center p-4 cursor-pointer select-none"
            >
              {isHoldingPeek ? (
                peekingPlayer.role === 'mrblack' ? (
                  <span className="text-base font-black font-discord-headline text-discord-yellow uppercase">
                    You Are Mr. Black
                  </span>
                ) : (
                  <span className="text-2xl font-black font-discord-headline text-white uppercase">
                    {peekingPlayer.word}
                  </span>
                )
              ) : (
                <div className="flex flex-col items-center gap-1 text-discord-muted">
                  <EyeOff className="w-6 h-6" />
                  <span className="text-xs font-bold text-white">Hold to View</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setPeekingPlayer(null);
                setIsHoldingPeek(false);
              }}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-black font-discord-headline text-xs py-3 rounded-xl uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
