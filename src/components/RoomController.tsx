'use client';

import React from 'react';
import {
  Users,
  Copy,
  Check,
  Share2,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Crown,
  LogOut,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { RoomState, RoomPlayer, Pack, Player, GameSettings } from '@/types/game';
import { BUILT_IN_PACKS } from '@/lib/game/packs';
import { RoomReveal } from '@/components/RoomReveal';
import { VotingPhase } from '@/components/VotingPhase';
import { EliminationModal } from '@/components/EliminationModal';
import { MrBlackGuessModal } from '@/components/MrBlackGuessModal';
import { VictoryScreen } from '@/components/VictoryScreen';

interface RoomControllerProps {
  roomCode: string;
  initialPlayerId: string;
  onExitRoom: () => void;
}

export function RoomController({
  roomCode,
  initialPlayerId,
  onExitRoom,
}: RoomControllerProps) {
  const [room, setRoom] = React.useState<RoomState | null>(null);
  const [myPlayer, setMyPlayer] = React.useState<RoomPlayer | null>(null);
  const [playerId] = React.useState<string>(initialPlayerId);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);

  // Elimination modal state tracking
  const [lastAnnouncedRound, setLastAnnouncedRound] = React.useState<number>(0);
  const [eliminatedPlayer, setEliminatedPlayer] = React.useState<Player | null>(null);

  // Community / AI packs
  const [communityPacks, setCommunityPacks] = React.useState<Pack[]>([]);
  const [customTopic, setCustomTopic] = React.useState('');
  const [isAiPackActive, setIsAiPackActive] = React.useState(false);
  const [aiGenerating, setAiGenerating] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);

  // Fetch community packs
  React.useEffect(() => {
    fetch('/api/packs/recent')
      .then((res) => res.json())
      .then((data) => {
        if (data.packs && Array.isArray(data.packs)) {
          setCommunityPacks(data.packs);
        }
      })
      .catch(() => {});
  }, []);

  // Poll room state every 1.2 seconds
  const fetchRoomState = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/room/${roomCode}?playerId=${playerId}`);
      if (!res.ok) {
        if (res.status === 404) {
          sessionStorage.removeItem('mrblack_active_room_code');
          sessionStorage.removeItem('mrblack_active_player_id');
          setError('Host left the room. Room has been closed.');
        }
        return;
      }
      const data = await res.json();
      if (data.roomClosed || !data.room) {
        sessionStorage.removeItem('mrblack_active_room_code');
        sessionStorage.removeItem('mrblack_active_player_id');
        setError('Host left the room. Room has been closed.');
        return;
      }

      if (data.room) {
        setRoom(data.room);
        setMyPlayer(data.myPlayer);
        setError(null);

        // Check if a new player was voted out for elimination modal
        if (
          data.room.gameState?.votedOutPlayer &&
          data.room.gameState?.phase === 'voting' &&
          data.room.gameState.currentRound > lastAnnouncedRound
        ) {
          setEliminatedPlayer(data.room.gameState.votedOutPlayer);
          setLastAnnouncedRound(data.room.gameState.currentRound);
        }
      }
    } catch (err) {
      // Ignore transient network errors during background polling
    } finally {
      setIsLoading(false);
    }
  }, [roomCode, playerId, lastAnnouncedRound]);

  React.useEffect(() => {
    fetchRoomState();

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return; // Pause polling when tab is hidden or device screen is off
      }
      fetchRoomState();
    }, 1500);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchRoomState();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchRoomState]);

  // Execute Room Actions
  const executeAction = async (action: string, payload?: any) => {
    try {
      const res = await fetch('/api/room/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: roomCode, playerId, action, payload }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error('Non-JSON response from /api/room/action:', jsonErr);
        throw new Error('Connection issue. Please try again.');
      }

      if (data.roomClosed) {
        sessionStorage.removeItem('mrblack_active_room_code');
        sessionStorage.removeItem('mrblack_active_player_id');
        setError('Host left the room. Room has been closed.');
        return;
      }
      if (!res.ok) {
        throw new Error(data.error || 'Action failed');
      }
      if (data.room) {
        setRoom(data.room);
        setMyPlayer(data.myPlayer);
      }
    } catch (err: any) {
      console.warn('Room action error:', err.message);
      // Only show error if significant
      if (action !== 'player_ready') {
        alert(err.message || 'Something went wrong');
      }
    }
  };

  const isHost = myPlayer?.isHost ?? false;

  const handleCastVote = (targetPlayerId: string) => {
    executeAction('cast_vote', { targetPlayerId });
  };

  // Host: Update Settings
  const handleTogglePack = (packId: string) => {
    if (!room || !isHost) return;
    const current = room.settings.selectedPackIds || [];
    let updated: string[];
    if (current.includes(packId)) {
      if (current.length > 1) {
        updated = current.filter((id) => id !== packId);
      } else {
        updated = current;
      }
    } else {
      updated = [...current, packId];
    }
    executeAction('update_settings', { selectedPackIds: updated });
  };

  const handleUpdateRoles = (undercover: number, mrblack: number) => {
    if (!room || !isHost) return;
    executeAction('update_settings', {
      undercoverCount: undercover,
      mrblackCount: mrblack,
    });
  };

  // Host: Start Game
  const handleStartGame = async () => {
    if (!room || !isHost) return;

    if (isAiPackActive && customTopic.trim()) {
      setAiGenerating(true);
      setAiError(null);
      try {
        const res = await fetch('/api/packs/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: customTopic.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'AI generation failed');
        const generatedPack: Pack = data.pack;

        await executeAction('start_game', {
          customPacks: [...communityPacks, generatedPack],
        });
      } catch (err: any) {
        setAiError(err.message || 'AI generation busy. Please try again.');
      } finally {
        setAiGenerating(false);
      }
    } else {
      await executeAction('start_game', {
        customPacks: communityPacks,
      });
    }
  };

  // Player Actions
  const handlePlayerReady = () => {
    executeAction('player_ready');
  };

  const handleStartVoting = () => {
    executeAction('start_voting');
  };

  const handlePlayerVotedOut = (votedPlayer: Player) => {
    executeAction('eliminate_player', { targetPlayerId: votedPlayer.id });
  };

  const handleSkipVote = () => {
    executeAction('skip_vote');
  };

  const handleMrBlackGuessSubmitted = (guessedWord: string) => {
    executeAction('mrblack_guess', { guess: guessedWord });
  };

  const handlePlayAgainSame = () => {
    executeAction('play_again', { customPacks: communityPacks });
  };

  const handleBackToLobby = () => {
    executeAction('back_to_lobby');
  };

  const handleLeaveRoom = () => {
    executeAction('leave_room');
    onExitRoom();
  };

  const handleKickPlayer = (targetId: string) => {
    if (confirm('Remove this player from the room?')) {
      executeAction('kick_player', { targetPlayerId: targetId });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/play?room=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const sortedBuiltInPacks = React.useMemo(() => {
    const selected = room?.settings?.selectedPackIds || [];
    return [...BUILT_IN_PACKS].sort((a, b) => {
      const aSelected = selected.includes(a.id);
      const bSelected = selected.includes(b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [room?.settings?.selectedPackIds]);

  const sortedTrendingPacks = React.useMemo(() => {
    const selected = room?.settings?.selectedPackIds || [];
    return [...communityPacks].sort((a, b) => {
      const aSelected = selected.includes(a.id);
      const bSelected = selected.includes(b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [communityPacks, room?.settings?.selectedPackIds]);

  if (isLoading && !room) {
    return (
      <div className="w-full max-w-sm mx-auto text-center py-16 space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-discord-primary mx-auto" />
        <p className="text-xs text-discord-muted font-semibold">Connecting to Room {roomCode}...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="w-full max-w-sm mx-auto text-center py-12 space-y-4 font-sans">
        <div className="w-12 h-12 rounded-full bg-discord-red/20 text-discord-red flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-discord-headline text-white uppercase">Room Error</h2>
          <p className="text-xs text-discord-muted">{error || 'Room not found.'}</p>
        </div>
        <button
          onClick={onExitRoom}
          className="bg-discord-primary hover:bg-discord-primary-hover text-white font-bold text-xs py-3 px-6 rounded-xl uppercase tracking-wider transition-all"
        >
          Back to Lobby
        </button>
      </div>
    );
  }

  const totalPlayers = room.players.length;
  const undercoverCount = room.settings.undercoverCount;
  const mrblackCount = room.settings.mrblackCount;
  const civilianCount = totalPlayers - undercoverCount - mrblackCount;
  const hasValidImpostor = undercoverCount > 0 || mrblackCount > 0;
  const hasSelectedPacks =
    (room.settings.selectedPackIds && room.settings.selectedPackIds.length > 0) ||
    (isAiPackActive && customTopic.trim().length > 0);
  const isValidConfig = totalPlayers >= 3 && civilianCount >= 1 && hasValidImpostor && hasSelectedPacks;

  const allAvailablePacks = [...BUILT_IN_PACKS, ...communityPacks];

  // 1. LOBBY PHASE
  if (room.status === 'lobby' || !room.gameState) {
    return (
      <div className="w-full max-w-sm mx-auto space-y-4 select-none pb-6 pt-1 font-sans">
        {/* Top Room Banner with 4-Letter Code */}
        <div className="bg-discord-surface-indigo/90 border border-white/10 rounded-2xl p-4 text-center space-y-2 shadow-card">
          <span className="text-[10px] font-black uppercase tracking-widest text-discord-primary">
            Room Code
          </span>
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl font-black font-discord-headline tracking-widest text-white uppercase drop-shadow">
              {room.code}
            </h1>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyCode}
                title="Copy Room Code"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-discord-muted hover:text-white transition-colors"
              >
                {copiedCode ? <Check className="w-4 h-4 text-discord-green" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCopyLink}
                title="Copy Invite Link"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-discord-muted hover:text-white transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-discord-green" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <p className="text-[11px] text-discord-muted font-medium">
            Share this 4-letter code or invite link with friends to join
          </p>
        </div>

        {/* Connected Players List */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium tracking-wider uppercase text-white/70 px-1">
            <span>Players in Room ({totalPlayers})</span>
            {totalPlayers < 3 && (
              <span className="text-[10px] text-discord-yellow font-normal normal-case">
                Need at least 3 players
              </span>
            )}
          </div>

          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {room.players.map((p, idx) => {
              const isMe = p.id === playerId;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all ${
                    isMe
                      ? 'bg-discord-primary/15 border-discord-primary/40 text-white font-semibold'
                      : 'bg-discord-surface-indigo/90 border-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-discord-surface-onyx text-discord-muted font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-white">
                      {p.name} {isMe && '(You)'}
                    </span>
                    {p.isHost && (
                      <span className="inline-flex items-center gap-1 bg-discord-yellow/20 text-discord-yellow text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase">
                        <Crown className="w-2.5 h-2.5" /> Host
                      </span>
                    )}
                  </div>

                  {isHost && !p.isHost && (
                    <button
                      onClick={() => handleKickPlayer(p.id)}
                      className="text-discord-muted hover:text-discord-red p-1 transition-colors"
                      title="Remove player"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* If Host: Configure Packs and Roles */}
        {isHost ? (
          <>
            {/* Word Packs Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium tracking-wider uppercase text-white/70 px-1">
                <span>
                  1. Word Packs ({room.settings.selectedPackIds?.length || 0})
                </span>
                <button
                  onClick={() => {
                    const current = room.settings.selectedPackIds || [];
                    if (current.length === allAvailablePacks.length) {
                      executeAction('update_settings', { selectedPackIds: [BUILT_IN_PACKS[0].id] });
                    } else {
                      executeAction('update_settings', { selectedPackIds: allAvailablePacks.map((p) => p.id) });
                    }
                  }}
                  className="text-[11px] text-discord-primary hover:underline font-normal normal-case"
                >
                  {room.settings.selectedPackIds?.length === allAvailablePacks.length ? 'Reset' : 'Select All'}
                </button>
              </div>

              {/* Custom AI Pack */}
              <div className="space-y-1.5">
                <button
                  onClick={() => setIsAiPackActive(!isAiPackActive)}
                  className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between border ${
                    isAiPackActive
                      ? 'bg-discord-magenta text-white border-discord-magenta shadow-float'
                      : 'bg-discord-surface-indigo/90 hover:bg-discord-surface-indigo text-discord-muted hover:text-white border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate pr-1">
                    <Sparkles className="w-3.5 h-3.5 text-discord-yellow shrink-0" />
                    <span className="uppercase text-xs font-semibold tracking-wider">Custom AI Pack</span>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-md shrink-0 flex items-center justify-center text-[9px] ${
                      isAiPackActive
                        ? 'bg-white text-discord-magenta font-bold'
                        : 'border border-white/20'
                    }`}
                  >
                    {isAiPackActive && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                </button>

                {isAiPackActive && (
                  <div className="py-0.5">
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="Enter custom topic (e.g. Shark Tank, Gully Cricket...)"
                      className="w-full bg-discord-surface-darker border border-discord-magenta/50 rounded-xl px-3 py-2 text-xs text-white placeholder:text-discord-muted outline-none font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Scrollable Pack list with Trending and Built-in packs */}
              <div className="max-h-52 overflow-y-auto pr-1 space-y-2">
                {/* Trending Community Packs */}
                {sortedTrendingPacks.length > 0 && (
                  <div className="space-y-1.5 pb-2 border-b border-white/10">
                    <div className="flex items-center justify-between text-xs font-medium tracking-wider uppercase text-white/70 px-1">
                      <span className="flex items-center gap-1.5 text-discord-green">
                        <span>🔥 Trending</span>
                        <span className="text-[10px] text-discord-muted font-normal normal-case">
                          ({sortedTrendingPacks.length})
                        </span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {sortedTrendingPacks.map((pack) => {
                        const isSelected = room.settings.selectedPackIds?.includes(pack.id);
                        return (
                          <button
                            key={pack.id}
                            onClick={() => handleTogglePack(pack.id)}
                            title={pack.name}
                            className={`px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between border ${
                              isSelected
                                ? 'bg-discord-green text-black border-discord-green shadow-float'
                                : 'bg-discord-surface-indigo/90 hover:bg-discord-surface-indigo text-discord-muted hover:text-white border-white/10'
                            }`}
                          >
                            <span className="truncate pr-1 uppercase text-xs tracking-wider">
                              {pack.name}
                            </span>
                            <span
                              className={`w-4 h-4 rounded-md shrink-0 flex items-center justify-center text-[9px] ${
                                isSelected
                                  ? 'bg-black text-discord-green font-bold'
                                  : 'border border-white/20'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Built-in Curated Packs */}
                <div className="grid grid-cols-2 gap-1.5">
                  {sortedBuiltInPacks.map((pack) => {
                    const isSelected = room.settings.selectedPackIds?.includes(pack.id);
                    return (
                      <button
                        key={pack.id}
                        onClick={() => handleTogglePack(pack.id)}
                        className={`px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-discord-primary text-white border-discord-primary shadow-float'
                            : 'bg-discord-surface-indigo/90 hover:bg-discord-surface-indigo text-discord-muted hover:text-white border-white/10'
                        }`}
                      >
                        <span className="truncate pr-1 uppercase text-xs tracking-wider">{pack.name}</span>
                        <span
                          className={`w-4 h-4 rounded-md shrink-0 flex items-center justify-center text-[9px] ${
                            isSelected ? 'bg-white text-discord-primary font-bold' : 'border border-white/20'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {aiError && (
                <div className="text-[11px] text-discord-red flex items-center gap-1 px-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}
            </div>

            {/* Roles Selection */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium tracking-wider uppercase text-white/70 px-1">
                <span>2. Roles Distribution</span>
              </div>

              <div className="space-y-1.5">
                {/* Civilians */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-discord-surface-indigo/90 border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-discord-green/20 text-discord-green font-bold flex items-center justify-center text-xs">
                      C
                    </span>
                    <span className="font-medium text-white">Civilians</span>
                  </div>
                  <span className="font-bold text-discord-green text-sm px-2">
                    {Math.max(0, civilianCount)}
                  </span>
                </div>

                {/* Undercover */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-discord-surface-indigo/90 border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-discord-magenta/20 text-discord-magenta font-bold flex items-center justify-center text-xs">
                      U
                    </span>
                    <span className="font-medium text-white">Undercover</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateRoles(Math.max(0, undercoverCount - 1), mrblackCount)}
                      disabled={undercoverCount <= 0}
                      className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-semibold flex items-center justify-center text-sm transition-colors"
                    >
                      -
                    </button>
                    <span className="font-semibold text-white text-xs w-4 text-center">
                      {undercoverCount}
                    </span>
                    <button
                      onClick={() => handleUpdateRoles(undercoverCount + 1, mrblackCount)}
                      disabled={civilianCount <= 1}
                      className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-semibold flex items-center justify-center text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Mr. Black */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-discord-surface-indigo/90 border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-discord-yellow/20 text-discord-yellow font-bold flex items-center justify-center text-xs">
                      MB
                    </span>
                    <span className="font-medium text-white">Mr. Black</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateRoles(undercoverCount, Math.max(0, mrblackCount - 1))}
                      disabled={mrblackCount <= 0}
                      className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-semibold flex items-center justify-center text-sm transition-colors"
                    >
                      -
                    </button>
                    <span className="font-semibold text-white text-xs w-4 text-center">
                      {mrblackCount}
                    </span>
                    <button
                      onClick={() => handleUpdateRoles(undercoverCount, mrblackCount + 1)}
                      disabled={civilianCount <= 1}
                      className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-semibold flex items-center justify-center text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Game Button for Host */}
            <button
              onClick={handleStartGame}
              disabled={!isValidConfig || aiGenerating}
              className="w-full bg-discord-green hover:bg-discord-green-hover disabled:opacity-30 text-black font-bold text-sm py-3.5 px-6 rounded-xl shadow-float flex items-center justify-center gap-2 transition-all transform active:scale-98 tracking-wider uppercase mt-2 font-sans"
            >
              {aiGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Creating AI Pack...</span>
                </>
              ) : (
                <>
                  <span>START GAME ({totalPlayers} Players)</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </>
        ) : (
          /* Waiting Screen for Joined Non-Host Players */
          <div className="bg-discord-surface-indigo/90 border border-white/10 rounded-2xl p-5 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-discord-primary/20 text-discord-primary flex items-center justify-center mx-auto animate-pulse">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold font-discord-headline text-white uppercase">
                Waiting for Host to Start
              </h3>
              <p className="text-xs text-discord-muted">
                The host is configuring word packs and players. Game will start automatically!
              </p>
            </div>
          </div>
        )}

        {/* Leave Room Action */}
        <button
          onClick={handleLeaveRoom}
          className="w-full py-2.5 text-xs text-discord-muted hover:text-discord-red font-medium transition-colors text-center flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Leave Room</span>
        </button>
      </div>
    );
  }

  // 2. ACTIVE GAMEPLAY PHASES (Identical Visual Experience to Pass & Play)
  const gameState = room.gameState;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* 2.1 Reveal Phase */}
      {gameState.phase === 'reveal' && (
        <RoomReveal
          room={room}
          myPlayer={myPlayer}
          onReady={handlePlayerReady}
          onStartVoting={isHost ? handleStartVoting : undefined}
          isHost={isHost}
        />
      )}

      {/* 2.2 Voting & Discussion Phase */}
      {gameState.phase === 'voting' && (
        <VotingPhase
          players={gameState.players}
          onPlayerVotedOut={handlePlayerVotedOut}
          onSkipVote={handleSkipVote}
          isRoomMode={true}
          isHost={isHost}
          myPlayerId={playerId}
          votes={gameState.votes || {}}
          onCastVote={handleCastVote}
        />
      )}

      {/* 2.3 Mr. Black Guess Phase */}
      {gameState.phase === 'mrblack_guess' && gameState.votedOutPlayer && (
        <MrBlackGuessModal
          player={gameState.votedOutPlayer}
          civilianWord={gameState.activePair.a}
          isGuesser={myPlayer?.id === gameState.votedOutPlayer.id}
          onGuessSubmitted={handleMrBlackGuessSubmitted}
        />
      )}

      {/* 2.4 Victory / Game Over Phase */}
      {gameState.phase === 'game_over' && (
        <VictoryScreen
          gameState={gameState}
          onPlayAgainSame={handlePlayAgainSame}
          onBackToLobby={handleBackToLobby}
        />
      )}

      {/* Elimination Announcement Modal */}
      {eliminatedPlayer && (
        <EliminationModal
          player={eliminatedPlayer}
          onContinue={() => setEliminatedPlayer(null)}
        />
      )}
    </div>
  );
}
