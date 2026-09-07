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
  onStartGame: (settings: GameSettings, customPack?: Pack) => void;
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
          generatedPack
        );
      } catch (err: any) {
        setAiError(err.message || 'AI busy. Try again or uncheck AI pack.');
      } finally {
        setAiGenerating(false);
      }
    } else {
      onStartGame({
        players: players.map((p, i) => p.trim() || `Player ${i + 1}`),
        undercoverCount,
        mrblackCount,
        selectedPackIds,
      });
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-4 select-none pb-4">
      {/* 1. Top Hero Title */}
      <div className="text-center pt-1">
        <h1 className="text-4xl font-black font-discord-headline tracking-tight text-white uppercase">
          MR. <span className="text-discord-primary">BLACK</span>
        </h1>
        <p className="text-[11px] text-discord-muted font-medium pt-0.5">
          Pass &amp; Play Desi Social Deduction Game
        </p>
      </div>

      {/* 2. Main Game Setup Surface (Single Unified Flow) */}
      <div className="space-y-4">
        {/* Section: Word Categories */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-black font-discord-headline uppercase text-white/90 px-1">
            <span>1. Word Packs ({selectedPackIds.length + (isAiPackActive && customTopic.trim() ? 1 : 0)})</span>
            <button
              onClick={() => {
                if (selectedPackIds.length === BUILT_IN_PACKS.length) {
                  setSelectedPackIds([BUILT_IN_PACKS[0].id]);
                } else {
                  setSelectedPackIds(BUILT_IN_PACKS.map((p) => p.id));
                }
              }}
              className="text-[10px] text-discord-primary hover:underline font-bold"
            >
              {selectedPackIds.length === BUILT_IN_PACKS.length ? 'Reset' : 'Select All'}
            </button>
          </div>

          {/* Clean Grid of Word Packs including Custom */}
          <div className="grid grid-cols-2 gap-1.5">
            {BUILT_IN_PACKS.map((pack) => {
              const isSelected = selectedPackIds.includes(pack.id);
              return (
                <button
                  key={pack.id}
                  onClick={() => handleTogglePack(pack.id)}
                  className={`px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-discord-primary text-white border-discord-primary shadow-float'
                      : 'bg-discord-surface-indigo/90 hover:bg-discord-surface-indigo text-discord-muted hover:text-white border-white/10'
                  }`}
                >
                  <span className="truncate pr-1 font-discord-headline tracking-wide uppercase text-xs">{pack.name}</span>
                  <span
                    className={`w-4 h-4 rounded-md shrink-0 flex items-center justify-center text-[9px] ${
                      isSelected
                        ? 'bg-white text-discord-primary font-black'
                        : 'border border-white/20'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                </button>
              );
            })}

            {/* Custom AI Pack Card - Sits cleanly as a pack card */}
            <button
              onClick={() => setIsAiPackActive(!isAiPackActive)}
              className={`px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between border ${
                isAiPackActive
                  ? 'bg-discord-magenta text-white border-discord-magenta shadow-float'
                  : 'bg-discord-surface-indigo/90 hover:bg-discord-surface-indigo text-discord-muted hover:text-white border-white/10'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate pr-1">
                <Sparkles className="w-3.5 h-3.5 text-discord-yellow shrink-0" />
                <span className="font-discord-headline tracking-wide uppercase text-xs">Custom</span>
              </div>
              <span
                className={`w-4 h-4 rounded-md shrink-0 flex items-center justify-center text-[9px] ${
                  isAiPackActive
                    ? 'bg-white text-discord-magenta font-black'
                    : 'border border-white/20'
                }`}
              >
                {isAiPackActive && <Check className="w-3 h-3 stroke-[3]" />}
              </span>
            </button>

            {/* AI Input appears cleanly below when Custom is active */}
            {isAiPackActive && (
              <div className="col-span-2 pt-0.5">
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

          {aiError && (
            <div className="text-[11px] text-discord-red flex items-center gap-1 px-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{aiError}</span>
            </div>
          )}
        </div>

        {/* Section: Roles */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-black font-discord-headline uppercase text-white/90 px-1">
            <span>2. Roles</span>
            <span className="text-[10px] text-discord-muted font-bold">
              {totalPlayers} Total
            </span>
          </div>

          <div className="space-y-1.5">
            {/* Civilians */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-discord-surface-indigo/90 border border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-discord-green/20 text-discord-green font-black flex items-center justify-center text-xs font-discord-headline">
                  C
                </span>
                <span className="font-bold text-white">Civilians</span>
              </div>
              <span className="font-black font-discord-headline text-discord-green text-sm px-2">
                {civilianCount}
              </span>
            </div>

            {/* Undercover */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-discord-surface-indigo/90 border border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-discord-magenta/20 text-discord-magenta font-black flex items-center justify-center text-xs font-discord-headline">
                  U
                </span>
                <span className="font-bold text-white">Undercover</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUndercoverCount(Math.max(0, undercoverCount - 1))}
                  disabled={undercoverCount <= 0}
                  className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white font-black flex items-center justify-center text-xs"
                >
                  -
                </button>
                <span className="w-3 text-center font-black font-discord-headline text-white text-sm">
                  {undercoverCount}
                </span>
                <button
                  onClick={() => setUndercoverCount(undercoverCount + 1)}
                  disabled={civilianCount <= 1}
                  className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white font-black flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Mr. Black */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-discord-surface-indigo/90 border border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-discord-yellow/20 text-discord-yellow font-black flex items-center justify-center text-xs font-discord-headline">
                  MB
                </span>
                <span className="font-bold text-white">Mr. Black</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMrblackCount(Math.max(0, mrblackCount - 1))}
                  disabled={mrblackCount <= 0}
                  className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white font-black flex items-center justify-center text-xs"
                >
                  -
                </button>
                <span className="w-3 text-center font-black font-discord-headline text-white text-sm">
                  {mrblackCount}
                </span>
                <button
                  onClick={() => setMrblackCount(mrblackCount + 1)}
                  disabled={civilianCount <= 1}
                  className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white font-black flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Players */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-black font-discord-headline uppercase text-white/90 px-1">
            <span>3. Players ({players.length})</span>
            <button
              onClick={handleRandomizeNames}
              className="flex items-center gap-1 text-[10px] text-discord-muted hover:text-white font-bold"
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
                <span className="text-[10px] font-black font-discord-headline text-discord-muted w-4 text-center">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(idx, e.target.value)}
                  placeholder={`Player ${idx + 1}`}
                  maxLength={18}
                  className="flex-1 bg-transparent text-xs font-bold text-white outline-none placeholder:text-discord-muted"
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
              className="flex-1 bg-discord-surface-onyx border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-discord-muted outline-none focus:border-discord-primary transition-all"
            />
            <button
              onClick={handleAddPlayer}
              disabled={!newPlayerName.trim()}
              className="bg-discord-primary hover:bg-discord-primary-hover disabled:opacity-30 text-white font-black px-3.5 py-2 rounded-xl text-xs transition-all flex items-center justify-center"
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
        className="w-full bg-discord-green hover:bg-discord-green-hover disabled:opacity-30 text-discord-ink-dark font-black font-discord-headline text-base py-4 px-6 rounded-2xl shadow-float flex items-center justify-center gap-2 transition-all transform active:scale-98 tracking-wide uppercase mt-2"
      >
        {aiGenerating ? (
          <>
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>Creating AI Pack...</span>
          </>
        ) : (
          <>
            <span>START GAME</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
