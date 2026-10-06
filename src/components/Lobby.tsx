'use client';

import React from 'react';
import {
  Sparkles,
  Shuffle,
  Plus,
  Trash2,
  ArrowRight,
  AlertCircle,
  Check,
  WifiOff,
  Smartphone,
  Globe,
  LogIn,
  Users,
} from 'lucide-react';
import { BUILT_IN_PACKS } from '@/lib/game/packs';
import { GameSettings, Pack } from '@/types/game';

interface LobbyProps {
  onStartGame: (settings: GameSettings, customPack?: Pack | Pack[]) => void;
  onJoinRoom?: (roomCode: string, playerId: string) => void;
  initialPackIds?: string[];
  initialRoomCode?: string;
}

const DEFAULT_NAMES = [
  'Rahul',
  'Pooja',
  'Bunty',
  'Simran',
  'Kabir',
  'Ananya',
  'Chintu',
  'Riya',
  'Karan',
  'Sneha',
];

export function Lobby({
  onStartGame,
  onJoinRoom,
  initialPackIds,
  initialRoomCode,
}: LobbyProps) {
  // Game Mode: 'pass_and_play' | 'room'
  const [gameMode, setGameMode] = React.useState<'pass_and_play' | 'room'>(() => {
    return initialRoomCode ? 'room' : 'pass_and_play';
  });

  // Room Sub-tab: 'create' | 'join'
  const [roomSubTab, setRoomSubTab] = React.useState<'create' | 'join'>(() => {
    return initialRoomCode ? 'join' : 'create';
  });

  // Room Form States with localStorage persistence
  const [hostPlayerName, setHostPlayerName] = React.useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mrblack_player_name');
      if (saved) return saved;
    }
    return 'Rahul';
  });

  const [joinPlayerName, setJoinPlayerName] = React.useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mrblack_player_name');
      if (saved) return saved;
    }
    return '';
  });

  const [joinRoomCode, setJoinRoomCode] = React.useState(initialRoomCode || '');
  const [roomActionLoading, setRoomActionLoading] = React.useState(false);
  const [roomActionError, setRoomActionError] = React.useState<string | null>(null);

  // Pass & Play Player List with localStorage persistence
  const [players, setPlayers] = React.useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mrblack_saved_players');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 3) {
            return parsed;
          }
        }
      } catch {}
    }
    return ['Rahul', 'Pooja', 'Bunty', 'Simran'];
  });

  const [newPlayerName, setNewPlayerName] = React.useState('');

  const [undercoverCount, setUndercoverCount] = React.useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mrblack_saved_undercover');
      if (saved) {
        const num = parseInt(saved, 10);
        if (!isNaN(num)) return num;
      }
    }
    return 1;
  });

  const [mrblackCount, setMrblackCount] = React.useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mrblack_saved_mrblack');
      if (saved) {
        const num = parseInt(saved, 10);
        if (!isNaN(num)) return num;
      }
    }
    return 1;
  });

  // Network online/offline status detection
  const [isOnline, setIsOnline] = React.useState<boolean>(true);

  React.useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update room code if initialRoomCode changes
  React.useEffect(() => {
    if (initialRoomCode) {
      setGameMode('room');
      setRoomSubTab('join');
      setJoinRoomCode(initialRoomCode.toUpperCase());
    }
  }, [initialRoomCode]);

  // Selected packs list (multi-select) initialized with optional preselected pack IDs or defaults
  const [selectedPackIds, setSelectedPackIds] = React.useState<string[]>(() => {
    if (initialPackIds && initialPackIds.length > 0) {
      return initialPackIds;
    }
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mrblack_saved_packs');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {}
    }
    return [BUILT_IN_PACKS[0].id, BUILT_IN_PACKS[1].id];
  });

  // Update if initialPackIds changes
  React.useEffect(() => {
    if (initialPackIds && initialPackIds.length > 0) {
      setSelectedPackIds(initialPackIds);
      try {
        localStorage.setItem('mrblack_saved_packs', JSON.stringify(initialPackIds));
      } catch {}
    }
  }, [initialPackIds]);

  // Save settings whenever they change
  React.useEffect(() => {
    try {
      localStorage.setItem('mrblack_saved_players', JSON.stringify(players));
    } catch {}
  }, [players]);

  React.useEffect(() => {
    try {
      localStorage.setItem('mrblack_saved_packs', JSON.stringify(selectedPackIds));
    } catch {}
  }, [selectedPackIds]);

  React.useEffect(() => {
    try {
      localStorage.setItem('mrblack_saved_undercover', undercoverCount.toString());
      localStorage.setItem('mrblack_saved_mrblack', mrblackCount.toString());
    } catch {}
  }, [undercoverCount, mrblackCount]);

  React.useEffect(() => {
    try {
      if (hostPlayerName) localStorage.setItem('mrblack_player_name', hostPlayerName);
    } catch {}
  }, [hostPlayerName]);

  React.useEffect(() => {
    try {
      if (joinPlayerName) localStorage.setItem('mrblack_player_name', joinPlayerName);
    } catch {}
  }, [joinPlayerName]);

  // Community / AI Generated Packs from Redis
  const [communityPacks, setCommunityPacks] = React.useState<Pack[]>([]);

  // Fetch recent community packs on mount (only when online)
  React.useEffect(() => {
    if (!isOnline) return;
    fetch('/api/packs/recent')
      .then((res) => res.json())
      .then((data) => {
        if (data.packs && Array.isArray(data.packs)) {
          setCommunityPacks(data.packs);
        }
      })
      .catch(() => {});
  }, [isOnline]);

  // AI custom pack
  const [customTopic, setCustomTopic] = React.useState('');
  const [isAiPackActive, setIsAiPackActive] = React.useState(false);
  const [aiGenerating, setAiGenerating] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);

  const totalPlayers = players.length;
  const civilianCount = totalPlayers - undercoverCount - mrblackCount;
  const hasValidImpostor = undercoverCount > 0 || mrblackCount > 0;
  const hasSelectedPacks =
    selectedPackIds.length > 0 || (isAiPackActive && isOnline && customTopic.trim().length > 0);
  const isValidConfig = totalPlayers >= 3 && civilianCount >= 1 && hasValidImpostor && hasSelectedPacks;

  const handleTogglePack = (packId: string) => {
    let updated: string[];
    if (selectedPackIds.includes(packId)) {
      if (selectedPackIds.length > 1 || (isAiPackActive && isOnline)) {
        updated = selectedPackIds.filter((id) => id !== packId);
      } else {
        updated = selectedPackIds;
      }
    } else {
      updated = [...selectedPackIds, packId];
    }
    setSelectedPackIds(updated);
    try {
      localStorage.setItem('mrblack_saved_packs', JSON.stringify(updated));
    } catch {}
  };

  const handlePlayerNameChange = (index: number, val: string) => {
    const updated = [...players];
    updated[index] = val;
    setPlayers(updated);
    try {
      localStorage.setItem('mrblack_saved_players', JSON.stringify(updated));
    } catch {}
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    const updated = [...players, newPlayerName.trim()];
    setPlayers(updated);
    setNewPlayerName('');
    try {
      localStorage.setItem('mrblack_saved_players', JSON.stringify(updated));
    } catch {}
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length <= 3) return;
    const updated = players.filter((_, i) => i !== index);
    setPlayers(updated);
    try {
      localStorage.setItem('mrblack_saved_players', JSON.stringify(updated));
    } catch {}

    if (updated.length - undercoverCount - mrblackCount < 1) {
      if (mrblackCount > 1) setMrblackCount(mrblackCount - 1);
      else if (undercoverCount > 1) setUndercoverCount(undercoverCount - 1);
    }
  };

  const handleRandomizeNames = () => {
    const shuffled = [...DEFAULT_NAMES].sort(() => 0.5 - Math.random());
    const updated = shuffled.slice(0, players.length);
    setPlayers(updated);
    try {
      localStorage.setItem('mrblack_saved_players', JSON.stringify(updated));
    } catch {}
  };

  // Pass & Play Start Game
  const handleStart = async () => {
    if (!isValidConfig) return;

    if (isOnline && isAiPackActive && customTopic.trim()) {
      setAiGenerating(true);
      setAiError(null);

      try {
        const res = await fetch('/api/packs/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: customTopic.trim() }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to generate pack.');
        }

        const generatedPack: Pack = data.pack;
        onStartGame(
          {
            players: players.map((p, i) => p.trim() || `Player ${i + 1}`),
            undercoverCount,
            mrblackCount,
            selectedPackIds: [...selectedPackIds, generatedPack.id],
            customTopic: customTopic.trim(),
          },
          [...communityPacks, generatedPack]
        );
      } catch (err: any) {
        setAiError(err.message || 'AI busy. Try again or uncheck AI pack.');
      } finally {
        setAiGenerating(false);
      }
    } else {
      onStartGame(
        {
          players: players.map((p, i) => p.trim() || `Player ${i + 1}`),
          undercoverCount,
          mrblackCount,
          selectedPackIds,
        },
        isOnline ? communityPacks : []
      );
    }
  };

  // Create Room
  const handleCreateRoom = async () => {
    if (!isOnline) {
      setRoomActionError('Internet connection required for Online Room mode.');
      return;
    }

    setRoomActionLoading(true);
    setRoomActionError(null);

    try {
      const res = await fetch('/api/room/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostName: hostPlayerName.trim() || 'Host',
          selectedPackIds,
          undercoverCount,
          mrblackCount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create room.');
      }

      onJoinRoom?.(data.code, data.playerId);
    } catch (err: any) {
      setRoomActionError(err.message || 'Could not create room. Please try again.');
    } finally {
      setRoomActionLoading(false);
    }
  };

  // Join Room
  const handleJoinRoom = async () => {
    if (!isOnline) {
      setRoomActionError('Internet connection required for Online Room mode.');
      return;
    }

    const cleanCode = joinRoomCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleanCode.length !== 4) {
      setRoomActionError('Please enter a valid 4-character room code (e.g. ABCD).');
      return;
    }

    if (!joinPlayerName.trim()) {
      setRoomActionError('Please enter your name.');
      return;
    }

    setRoomActionLoading(true);
    setRoomActionError(null);

    try {
      const res = await fetch('/api/room/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: cleanCode,
          playerName: joinPlayerName.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to join room.');
      }

      onJoinRoom?.(data.code, data.playerId);
    } catch (err: any) {
      setRoomActionError(err.message || 'Room not found or error joining.');
    } finally {
      setRoomActionLoading(false);
    }
  };

  const allAvailablePacks = isOnline ? [...BUILT_IN_PACKS, ...communityPacks] : BUILT_IN_PACKS;

  const sortedBuiltInPacks = React.useMemo(() => {
    return [...BUILT_IN_PACKS].sort((a, b) => {
      const aSelected = selectedPackIds.includes(a.id);
      const bSelected = selectedPackIds.includes(b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [selectedPackIds]);

  const sortedTrendingPacks = React.useMemo(() => {
    return [...communityPacks].sort((a, b) => {
      const aSelected = selectedPackIds.includes(a.id);
      const bSelected = selectedPackIds.includes(b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [communityPacks, selectedPackIds]);

  return (
    <div className="w-full max-w-sm mx-auto space-y-4 select-none pb-4 pt-1">
      {/* 1. Game Mode Selector Switcher */}
      <div className="flex p-1 bg-discord-surface-onyx border border-white/10 rounded-2xl">
        <button
          onClick={() => setGameMode('pass_and_play')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider ${
            gameMode === 'pass_and_play'
              ? 'bg-discord-primary text-white shadow-float'
              : 'text-discord-muted hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Pass &amp; Play</span>
        </button>

        <button
          onClick={() => setGameMode('room')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider ${
            gameMode === 'room'
              ? 'bg-discord-primary text-white shadow-float'
              : 'text-discord-muted hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Online Room</span>
        </button>
      </div>

      {/* Offline Banner Indicator if offline */}
      {!isOnline && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-discord-surface-indigo/90 border border-white/10 text-xs text-discord-yellow font-sans">
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-4 h-4" />
            <span className="font-semibold">Offline Mode Active</span>
          </div>
          <span className="text-[10px] text-discord-muted">Pass &amp; Play Ready</span>
        </div>
      )}

      {/* 2. MODE: PASS & PLAY */}
      {gameMode === 'pass_and_play' && (
        <div className="space-y-4 font-sans">
          {/* Section: Word Categories */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium tracking-wider uppercase text-white/70 px-1">
              <span>
                1. Word Packs ({selectedPackIds.length + (isOnline && isAiPackActive && customTopic.trim() ? 1 : 0)})
              </span>
              <button
                onClick={() => {
                  if (selectedPackIds.length === allAvailablePacks.length) {
                    setSelectedPackIds([BUILT_IN_PACKS[0].id]);
                  } else {
                    setSelectedPackIds(allAvailablePacks.map((p) => p.id));
                  }
                }}
                className="text-[11px] text-discord-primary hover:underline font-normal normal-case"
              >
                {selectedPackIds.length === allAvailablePacks.length ? 'Reset' : 'Select All'}
              </button>
            </div>

            {/* Custom AI Pack Card */}
            {isOnline && (
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
                      autoFocus
                      className="w-full bg-discord-surface-darker border border-discord-magenta/50 rounded-xl px-3 py-2 text-xs text-white placeholder:text-discord-muted outline-none font-medium"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Clean Scrollable Grid for Trending & Built-in packs */}
            <div className="max-h-60 overflow-y-auto pr-1 space-y-2.5">
              {/* Trending Community Packs */}
              {isOnline && sortedTrendingPacks.length > 0 && (
                <div className="space-y-1.5 pt-1 pb-2.5 border-b border-white/10">
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
                      const isSelected = selectedPackIds.includes(pack.id);
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
                  const isSelected = selectedPackIds.includes(pack.id);
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
                          isSelected
                            ? 'bg-white text-discord-primary font-bold'
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

            {aiError && (
              <div className="text-[11px] text-discord-red flex items-center gap-1 px-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}
          </div>

          {/* Section: Roles */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium tracking-wider uppercase text-white/70 px-1">
              <span>2. Roles</span>
              <span className="text-[10px] text-discord-muted font-normal normal-case">
                {totalPlayers} Total
              </span>
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
                  {civilianCount}
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
                    onClick={() => {
                      if (undercoverCount > 0 && civilianCount + 1 >= 1) {
                        setUndercoverCount(undercoverCount - 1);
                      }
                    }}
                    disabled={undercoverCount <= 0}
                    className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-semibold flex items-center justify-center text-sm transition-colors"
                  >
                    -
                  </button>
                  <span className="font-semibold text-white text-xs w-4 text-center">
                    {undercoverCount}
                  </span>
                  <button
                    onClick={() => {
                      if (civilianCount > 1) {
                        setUndercoverCount(undercoverCount + 1);
                      }
                    }}
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
                    onClick={() => {
                      if (mrblackCount > 0 && civilianCount + 1 >= 1) {
                        setMrblackCount(mrblackCount - 1);
                      }
                    }}
                    disabled={mrblackCount <= 0}
                    className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-semibold flex items-center justify-center text-sm transition-colors"
                  >
                    -
                  </button>
                  <span className="font-semibold text-white text-xs w-4 text-center">
                    {mrblackCount}
                  </span>
                  <button
                    onClick={() => {
                      if (civilianCount > 1) {
                        setMrblackCount(mrblackCount + 1);
                      }
                    }}
                    disabled={civilianCount <= 1}
                    className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-semibold flex items-center justify-center text-sm transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Players */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium tracking-wider uppercase text-white/70 px-1">
              <span>3. Players ({players.length})</span>
              <button
                onClick={handleRandomizeNames}
                className="flex items-center gap-1 text-[11px] text-discord-primary hover:underline font-normal normal-case"
              >
                <Shuffle className="w-3 h-3" />
                Desi Names
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {players.map((name, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-discord-surface-indigo/90 border border-white/10 px-2.5 py-1.5 rounded-xl"
                >
                  <span className="text-[10px] font-medium text-discord-muted w-4 text-center">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handlePlayerNameChange(idx, e.target.value)}
                    placeholder={`Player ${idx + 1}`}
                    maxLength={18}
                    className="flex-1 bg-transparent text-xs font-medium text-white outline-none placeholder:text-discord-muted"
                  />
                  {players.length > 3 && (
                    <button
                      onClick={() => handleRemovePlayer(idx)}
                      className="text-discord-muted hover:text-discord-red p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-0.5">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                placeholder="Add player..."
                maxLength={18}
                className="flex-1 bg-discord-surface-onyx border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-discord-muted outline-none focus:border-discord-primary transition-all font-medium"
              />
              <button
                onClick={handleAddPlayer}
                disabled={!newPlayerName.trim()}
                className="bg-discord-primary hover:bg-discord-primary-hover disabled:opacity-30 text-white font-medium px-3.5 py-2 rounded-xl text-xs transition-all flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Start Game Action */}
          <button
            onClick={handleStart}
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
                <span>START GAME</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      )}

      {/* 3. MODE: ONLINE ROOM */}
      {gameMode === 'room' && (
        <div className="space-y-4 font-sans">
          {/* Room Sub-Tabs */}
          <div className="flex p-0.5 bg-discord-surface-indigo/90 border border-white/10 rounded-xl">
            <button
              onClick={() => {
                setRoomSubTab('create');
                setRoomActionError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all uppercase tracking-wider ${
                roomSubTab === 'create'
                  ? 'bg-discord-surface-onyx text-white'
                  : 'text-discord-muted hover:text-white'
              }`}
            >
              Host Room
            </button>
            <button
              onClick={() => {
                setRoomSubTab('join');
                setRoomActionError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all uppercase tracking-wider ${
                roomSubTab === 'join'
                  ? 'bg-discord-surface-onyx text-white'
                  : 'text-discord-muted hover:text-white'
              }`}
            >
              Join With Code
            </button>
          </div>

          {/* Error Message if any */}
          {roomActionError && (
            <div className="text-xs text-discord-red flex items-center gap-1.5 bg-discord-red/10 border border-discord-red/30 p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{roomActionError}</span>
            </div>
          )}

          {/* SubTab A: Host / Create Room */}
          {roomSubTab === 'create' && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium tracking-wider uppercase text-white/70 px-1 block">
                  Your Host Name
                </label>
                <input
                  type="text"
                  value={hostPlayerName}
                  onChange={(e) => setHostPlayerName(e.target.value)}
                  placeholder="Enter your name (e.g. Rahul)..."
                  maxLength={18}
                  className="w-full bg-discord-surface-indigo/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-discord-muted outline-none focus:border-discord-primary font-medium"
                />
              </div>

              {/* Word Packs Selection for Room */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium tracking-wider uppercase text-white/70 px-1">
                  <span>
                    Word Packs ({selectedPackIds.length + (isOnline && isAiPackActive && customTopic.trim() ? 1 : 0)})
                  </span>
                  <button
                    onClick={() => {
                      if (selectedPackIds.length === allAvailablePacks.length) {
                        setSelectedPackIds([BUILT_IN_PACKS[0].id]);
                      } else {
                        setSelectedPackIds(allAvailablePacks.map((p) => p.id));
                      }
                    }}
                    className="text-[11px] text-discord-primary hover:underline font-normal normal-case"
                  >
                    {selectedPackIds.length === allAvailablePacks.length ? 'Reset' : 'Select All'}
                  </button>
                </div>

                {/* Custom AI Pack Card */}
                {isOnline && (
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
                          autoFocus
                          className="w-full bg-discord-surface-darker border border-discord-magenta/50 rounded-xl px-3 py-2 text-xs text-white placeholder:text-discord-muted outline-none font-medium"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Scrollable Grid for Trending & Built-in packs */}
                <div className="max-h-52 overflow-y-auto pr-1 space-y-2">
                  {/* Trending Community Packs */}
                  {isOnline && sortedTrendingPacks.length > 0 && (
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
                          const isSelected = selectedPackIds.includes(pack.id);
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
                      const isSelected = selectedPackIds.includes(pack.id);
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
                              isSelected
                                ? 'bg-white text-discord-primary font-bold'
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

                {aiError && (
                  <div className="text-[11px] text-discord-red flex items-center gap-1 px-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{aiError}</span>
                  </div>
                )}
              </div>

              {/* Create Room Button */}
              <button
                onClick={handleCreateRoom}
                disabled={roomActionLoading}
                className="w-full bg-discord-primary hover:bg-discord-primary-hover disabled:opacity-50 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-float flex items-center justify-center gap-2 transition-all transform active:scale-98 tracking-wider uppercase font-sans cursor-pointer disabled:cursor-not-allowed"
              >
                {roomActionLoading ? (
                  <span>Creating Room...</span>
                ) : (
                  <>
                    <span>CREATE 4-LETTER ROOM</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* SubTab B: Join Room */}
          {roomSubTab === 'join' && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium tracking-wider uppercase text-white/70 px-1 block">
                  4-Character Room Code
                </label>
                <input
                  type="text"
                  value={joinRoomCode}
                  onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4))}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                  placeholder="ABCD"
                  maxLength={4}
                  autoFocus
                  className="w-full bg-discord-surface-indigo/90 border border-white/10 rounded-xl px-4 py-3 text-2xl font-black font-discord-headline text-center uppercase tracking-widest text-discord-yellow placeholder:text-discord-muted outline-none focus:border-discord-yellow"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium tracking-wider uppercase text-white/70 px-1 block">
                  Your Name
                </label>
                <input
                  type="text"
                  value={joinPlayerName}
                  onChange={(e) => setJoinPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                  placeholder="Enter your name (e.g. Pooja)..."
                  maxLength={18}
                  className="w-full bg-discord-surface-indigo/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-discord-muted outline-none focus:border-discord-primary font-medium"
                />
              </div>

              {/* Join Room Button */}
              <button
                onClick={handleJoinRoom}
                disabled={roomActionLoading}
                className="w-full bg-discord-green hover:bg-discord-green-hover disabled:opacity-50 text-black font-bold text-sm py-3.5 px-6 rounded-xl shadow-float flex items-center justify-center gap-2 transition-all transform active:scale-98 tracking-wider uppercase font-sans cursor-pointer disabled:cursor-not-allowed"
              >
                {roomActionLoading ? (
                  <span>Joining Room...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 stroke-[2.5]" />
                    <span>JOIN ROOM</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
