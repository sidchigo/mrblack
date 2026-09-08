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
} from 'lucide-react';
import { BUILT_IN_PACKS } from '@/lib/game/packs';
import { GameSettings, Pack } from '@/types/game';

interface LobbyProps {
  onStartGame: (settings: GameSettings, customPack?: Pack | Pack[]) => void;
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

export function Lobby({ onStartGame }: LobbyProps) {
  const [players, setPlayers] = React.useState<string[]>([
    'Rahul',
    'Pooja',
    'Bunty',
    'Simran',
  ]);
  const [newPlayerName, setNewPlayerName] = React.useState('');

  const [undercoverCount, setUndercoverCount] = React.useState(1);
  const [mrblackCount, setMrblackCount] = React.useState(1);

  // Selected packs list (multi-select)
  const [selectedPackIds, setSelectedPackIds] = React.useState<string[]>([
    BUILT_IN_PACKS[0].id,
    BUILT_IN_PACKS[1].id,
  ]);

  // Community / AI Generated Packs from Redis
  const [communityPacks, setCommunityPacks] = React.useState<Pack[]>([]);

  // Fetch recent community packs on mount
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

  // AI custom pack
  const [customTopic, setCustomTopic] = React.useState('');
  const [isAiPackActive, setIsAiPackActive] = React.useState(false);
  const [aiGenerating, setAiGenerating] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);

  const totalPlayers = players.length;
  const civilianCount = totalPlayers - undercoverCount - mrblackCount;
  const hasValidImpostor = undercoverCount > 0 || mrblackCount > 0;
  const hasSelectedPacks = selectedPackIds.length > 0 || (isAiPackActive && customTopic.trim().length > 0);
  const isValidConfig = totalPlayers >= 3 && civilianCount >= 1 && hasValidImpostor && hasSelectedPacks;

  const handleTogglePack = (packId: string) => {
    if (selectedPackIds.includes(packId)) {
      if (selectedPackIds.length > 1 || isAiPackActive) {
        setSelectedPackIds(selectedPackIds.filter((id) => id !== packId));
      }
    } else {
      setSelectedPackIds([...selectedPackIds, packId]);
    }
  };

  const handlePlayerNameChange = (index: number, val: string) => {
    const updated = [...players];
    updated[index] = val;
    setPlayers(updated);
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    setPlayers([...players, newPlayerName.trim()]);
    setNewPlayerName('');
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length <= 3) return;
    const updated = players.filter((_, i) => i !== index);
    setPlayers(updated);

    if (updated.length - undercoverCount - mrblackCount < 1) {
      if (mrblackCount > 1) setMrblackCount(mrblackCount - 1);
      else if (undercoverCount > 1) setUndercoverCount(undercoverCount - 1);
    }
  };

  const handleRandomizeNames = () => {
    const shuffled = [...DEFAULT_NAMES].sort(() => 0.5 - Math.random());
    setPlayers(shuffled.slice(0, players.length));
  };

  const handleStart = async () => {
    if (!isValidConfig) return;

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
        communityPacks
      );
    }
  };

  const allBuiltInAndCommunityPacks = [...BUILT_IN_PACKS, ...communityPacks];

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 select-none pb-6">
      {/* 1. Seamless Hero Section (Transparent Image directly above text) */}
      <div className="text-center space-y-3 pt-2">
        {/* Transparent 3D Character Artwork */}
        <div className="w-full max-w-[290px] mx-auto flex items-center justify-center">
          <img
            src="/hero-banner-mobile.png"
            alt="Mr. Black Desi Characters"
            className="w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="space-y-1.5 px-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-discord-headline text-white uppercase leading-[1.15] tracking-tight">
            IDENTIFY THE IMPOSTER, <span className="text-discord-primary">DESI-STYLE!</span>
          </h1>

          <p className="text-xs text-discord-muted font-medium leading-relaxed max-w-xs mx-auto">
            A fun desi twist on Mr. White, packed with Bollywood, Chai &amp; Indian pop-culture word packs.
          </p>
        </div>
      </div>

      {/* 2. Main Game Setup Surface (Single Unified Flow) */}
      <div className="space-y-4 font-sans">
        {/* Section: Word Categories */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium tracking-wider uppercase text-white/70 px-1">
            <span>1. Word Packs ({selectedPackIds.length + (isAiPackActive && customTopic.trim() ? 1 : 0)})</span>
            <button
              onClick={() => {
                if (selectedPackIds.length === allBuiltInAndCommunityPacks.length) {
                  setSelectedPackIds([BUILT_IN_PACKS[0].id]);
                } else {
                  setSelectedPackIds(allBuiltInAndCommunityPacks.map((p) => p.id));
                }
              }}
              className="text-[11px] text-discord-primary hover:underline font-normal normal-case"
            >
              {selectedPackIds.length === allBuiltInAndCommunityPacks.length ? 'Reset' : 'Select All'}
            </button>
          </div>

          {/* Custom AI Pack Card (Always prominent at top) */}
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

            {/* AI Input appears cleanly below when Custom is active */}
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

          {/* Clean Scrollable Grid for Trending & Built-in packs to scale smoothly to 20+ packs */}
          <div className="max-h-60 overflow-y-auto pr-1 space-y-2.5">
            {/* Trending Community Packs (when available) */}
            {communityPacks.length > 0 && (
              <div className="space-y-1.5 pt-1 pb-2.5 border-b border-white/10">
                <div className="flex items-center justify-between text-xs font-medium tracking-wider uppercase text-white/70 px-1">
                  <span className="flex items-center gap-1.5 text-discord-green">
                    <span>🔥 Trending</span>
                    <span className="text-[10px] text-discord-muted font-normal normal-case">({communityPacks.length})</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {communityPacks.map((pack) => {
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
              {BUILT_IN_PACKS.map((pack) => {
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

          {/* Simple Direct-Editable Inputs List */}
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

          {/* Add Player bar */}
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
      </div>

      {/* Start Game Action */}
      <button
        onClick={handleStart}
        disabled={!isValidConfig || aiGenerating}
        className="w-full bg-discord-green hover:bg-discord-green-hover disabled:opacity-30 text-black font-bold text-sm py-3.5 px-6 rounded-2xl shadow-float flex items-center justify-center gap-2 transition-all transform active:scale-98 tracking-wider uppercase mt-2 font-sans"
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
  );
}
