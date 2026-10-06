'use client';

import React from 'react';
import { Eye, EyeOff, Check, Users, Crown, ShieldAlert } from 'lucide-react';
import { Player } from '@/types/game';

interface VotingPhaseProps {
  players: Player[];
  onPlayerVotedOut: (votedPlayer: Player) => void;
  onSkipVote: () => void;
  // Room Mode Props
  isRoomMode?: boolean;
  isHost?: boolean;
  myPlayerId?: string;
  votes?: Record<string, string>;
  onCastVote?: (targetPlayerId: string) => void;
}

export function VotingPhase({
  players,
  onPlayerVotedOut,
  onSkipVote,
  isRoomMode = false,
  isHost = false,
  myPlayerId,
  votes = {},
  onCastVote,
}: VotingPhaseProps) {
  const alivePlayers = players.filter((p) => !p.isEliminated);
  
  // My voted target in room mode
  const myCurrentVotedTargetId = myPlayerId ? votes[myPlayerId] : null;

  // Selected player for host action or local vote
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(() => {
    if (isRoomMode && myCurrentVotedTargetId) {
      return alivePlayers.find((p) => p.id === myCurrentVotedTargetId) || null;
    }
    return null;
  });

  // Keep selected player synced if votes change
  React.useEffect(() => {
    if (isRoomMode && myCurrentVotedTargetId && !selectedPlayer) {
      const target = alivePlayers.find((p) => p.id === myCurrentVotedTargetId);
      if (target) setSelectedPlayer(target);
    }
  }, [isRoomMode, myCurrentVotedTargetId, alivePlayers, selectedPlayer]);

  // Peek word modal state for any player who missed/forgot their word!
  const [peekingPlayer, setPeekingPlayer] = React.useState<Player | null>(null);
  const [isHoldingPeek, setIsHoldingPeek] = React.useState(false);

  // Compute vote tallies
  const voteTallies = React.useMemo(() => {
    const tallies: Record<string, { count: number; voterNames: string[] }> = {};
    alivePlayers.forEach((p) => {
      tallies[p.id] = { count: 0, voterNames: [] };
    });

    if (isRoomMode && votes) {
      Object.entries(votes).forEach(([voterId, targetId]) => {
        const voter = players.find((p) => p.id === voterId);
        if (tallies[targetId] && voter) {
          tallies[targetId].count += 1;
          tallies[targetId].voterNames.push(voter.name);
        }
      });
    }
    return tallies;
  }, [alivePlayers, players, isRoomMode, votes]);

  const totalVotesCast = Object.keys(votes || {}).length;
  const totalVotersNeeded = alivePlayers.length;

  const handleSelect = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleCastMyVote = () => {
    if (selectedPlayer && onCastVote) {
      onCastVote(selectedPlayer.id);
    }
  };

  const handleConfirmElimination = () => {
    if (selectedPlayer) {
      onPlayerVotedOut(selectedPlayer);
    }
  };

  // Find candidate with most votes if host hasn't selected someone
  const topVotedCandidate = React.useMemo(() => {
    let topId: string | null = null;
    let maxVotes = 0;
    Object.entries(voteTallies).forEach(([id, { count }]) => {
      if (count > maxVotes) {
        maxVotes = count;
        topId = id;
      }
    });
    return topId ? alivePlayers.find((p) => p.id === topId) : null;
  }, [voteTallies, alivePlayers]);

  const candidateToEliminate = selectedPlayer || topVotedCandidate;

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-4 space-y-4 select-none">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-discord-red bg-discord-red/20 border border-discord-red/40 px-3 py-0.5 rounded-full font-sans">
            Discussion &amp; Vote
          </span>
          {isRoomMode && (
            <span className="text-[11px] font-bold text-discord-green bg-discord-green/15 border border-discord-green/30 px-2.5 py-0.5 rounded-full font-sans flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{totalVotesCast}/{totalVotersNeeded} Voted</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-discord-headline text-white uppercase tracking-tight pt-0.5">
          Who Is Out?
        </h1>
        <p className="text-xs text-discord-muted font-normal font-sans">
          {isRoomMode
            ? isHost
              ? 'Tally votes with group, then confirm elimination'
              : 'Debate clues and cast your vote below'
            : 'Debate clues, then tap a player to eliminate'}
        </p>
      </div>

      {/* Alive Player List */}
      <div className="space-y-1.5 font-sans">
        {alivePlayers.map((player) => {
          const isSelected = selectedPlayer?.id === player.id;
          const isMyVotedTarget = isRoomMode && myCurrentVotedTargetId === player.id;
          const tally = voteTallies[player.id]?.count || 0;

          return (
            <div
              key={player.id}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-discord-red/20 border-discord-red shadow-glow'
                  : isMyVotedTarget
                  ? 'bg-discord-primary/20 border-discord-primary'
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
                    isSelected
                      ? 'bg-discord-red text-white'
                      : isMyVotedTarget
                      ? 'bg-discord-primary text-white'
                      : 'bg-discord-surface-onyx text-discord-muted'
                  }`}
                >
                  {player.name[0].toUpperCase()}
                </span>
                
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">
                    {player.name} {isRoomMode && player.id === myPlayerId && '(You)'}
                  </span>
                  {isRoomMode && tally > 0 && (
                    <span className="text-[10px] text-discord-muted font-normal">
                      {voteTallies[player.id].voterNames.join(', ')}
                    </span>
                  )}
                </div>

                <div className="ml-auto flex items-center gap-1.5 mr-2">
                  {isRoomMode && tally > 0 && (
                    <span className="text-[11px] font-black uppercase tracking-wider bg-discord-surface-onyx border border-white/15 text-discord-yellow px-2 py-0.5 rounded-lg">
                      {tally} {tally === 1 ? 'Vote' : 'Votes'}
                    </span>
                  )}

                  {isMyVotedTarget && (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-discord-primary text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 stroke-[3]" /> You
                    </span>
                  )}

                  {!isRoomMode && isSelected && (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-discord-red text-white px-2 py-0.5 rounded-md">
                      SELECTED
                    </span>
                  )}
                </div>
              </button>

              {/* Peek Word action */}
              {(!isRoomMode || player.id === myPlayerId) && (
                <button
                  onClick={() => setPeekingPlayer(player)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-discord-muted hover:text-white transition-colors"
                  title={`Peek secret word for ${player.name}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Area */}
      <div className="space-y-2 pt-1 font-sans">
        {isRoomMode ? (
          <>
            {/* 1. Player Vote Casting Button */}
            {(() => {
              const myTargetPlayer = myCurrentVotedTargetId
                ? alivePlayers.find((p) => p.id === myCurrentVotedTargetId)
                : null;
              const hasVotedForSelected = Boolean(
                selectedPlayer && myCurrentVotedTargetId && myCurrentVotedTargetId === selectedPlayer.id
              );

              return (
                <button
                  onClick={handleCastMyVote}
                  disabled={!selectedPlayer || hasVotedForSelected}
                  className={`w-full font-black font-discord-headline text-sm py-3 rounded-2xl shadow-float flex items-center justify-center uppercase tracking-wider transition-all transform active:scale-98 ${
                    hasVotedForSelected
                      ? 'bg-discord-surface-onyx border border-discord-green/40 text-discord-green'
                      : 'bg-discord-primary hover:bg-discord-primary-hover disabled:opacity-30 text-white'
                  }`}
                >
                  {hasVotedForSelected && selectedPlayer ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Vote Cast for {selectedPlayer.name}</span>
                    </span>
                  ) : selectedPlayer ? (
                    myCurrentVotedTargetId ? (
                      `Change Vote to ${selectedPlayer.name}`
                    ) : (
                      `Vote for ${selectedPlayer.name}`
                    )
                  ) : myTargetPlayer ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Voted for {myTargetPlayer.name}</span>
                    </span>
                  ) : (
                    'Select Player to Vote'
                  )}
                </button>
              );
            })()}

            {/* 2. Host Elimination Action Bar (HOST ONLY) */}
            {isHost ? (
              <div className="space-y-2 pt-1 border-t border-white/10 mt-2">
                <div className="flex items-center justify-between text-[11px] text-discord-yellow font-bold uppercase tracking-wider px-1">
                  <span className="flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" /> Host Decision
                  </span>
                  <span>{totalVotesCast}/{totalVotersNeeded} Players Voted</span>
                </div>

                <button
                  onClick={handleConfirmElimination}
                  disabled={!candidateToEliminate}
                  className="w-full bg-discord-red hover:bg-discord-red-hover disabled:opacity-30 text-white font-black font-discord-headline text-base py-3.5 rounded-2xl shadow-float flex items-center justify-center uppercase tracking-wider transition-all transform active:scale-98"
                >
                  Eliminate {candidateToEliminate ? candidateToEliminate.name : 'Selected Player'}
                </button>

                <button
                  onClick={onSkipVote}
                  className="w-full py-2 text-xs text-discord-muted hover:text-white font-bold transition-colors text-center"
                >
                  No Consensus? Skip Round
                </button>
              </div>
            ) : (
              /* Non-Host Waiting Note */
              <div className="text-center py-1">
                <p className="text-[11px] text-discord-muted font-medium">
                  {myCurrentVotedTargetId
                    ? 'Vote cast! Waiting for host to review votes and proceed...'
                    : 'Select a candidate and cast your vote above'}
                </p>
              </div>
            )}
          </>
        ) : (
          /* Pass and Play Mode Buttons */
          <>
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
          </>
        )}
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
                    {peekingPlayer.word || 'Hidden'}
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

