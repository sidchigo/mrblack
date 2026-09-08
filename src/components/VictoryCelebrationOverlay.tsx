'use client';

import React from 'react';
import { Player } from '@/types/game';

interface VictoryCelebrationOverlayProps {
  winner: 'civilians' | 'undercovers' | 'mrblack';
  players: Player[];
  onFinish?: () => void;
}

export function VictoryCelebrationOverlay({
  winner,
  players,
  onFinish,
}: VictoryCelebrationOverlayProps) {
  const [visible, setVisible] = React.useState(true);
  const [fadingOut, setFadingOut] = React.useState(false);

  // Group winning players by role
  const winningUndercovers = players.filter((p) => p.role === 'undercover');
  const winningMrBlacks = players.filter((p) => p.role === 'mrblack');
  const winningCivilians = players.filter((p) => p.role === 'civilian');

  const hasUndercovers = winningUndercovers.length > 0;
  const hasMrBlack = winningMrBlacks.length > 0;

  // Joint Impostor win when both Undercovers and Mr. Black were in game and victory went to impostors
  const isJointImpostorWin =
    winner !== 'civilians' &&
    hasUndercovers &&
    hasMrBlack &&
    (winner === 'undercovers' || winner === 'mrblack');

  // Determine Title, Subtitle, Theme Colors and Character Images
  const getThemeConfig = () => {
    if (winner === 'civilians') {
      return {
        isDual: false,
        title: 'CIVILIANS',
        subtitle: winningCivilians.length > 1 ? 'CIVILIANS VICTORIOUS' : 'CIVILIAN VICTORIOUS',
        images: ['/civilian.png'],
        titleColor: 'text-[#35ed7e]',
        textShadow:
          '0 0 25px rgba(53, 237, 126, 0.95), 0 0 50px rgba(16, 185, 129, 0.8), 4px 4px 0px #000',
        bgGlow:
          'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-600/35 via-teal-950/50 to-transparent',
        slitGlow: 'bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent',
      };
    }

    if (isJointImpostorWin) {
      return {
        isDual: true,
        title: 'IMPOSTORS',
        subtitle: 'INFILTRATION COMPLETE',
        titleColor: 'bg-gradient-to-r from-[#ff2a5f] via-[#d946ef] to-[#a855f7] bg-clip-text text-transparent',
        textShadow:
          '0 0 30px rgba(217, 70, 239, 0.8), 0 0 60px rgba(168, 85, 247, 0.7)',
        bgGlow:
          'bg-[radial-gradient(ellipse_at_top,_rgba(239,68,68,0.35)_0%,_rgba(147,51,234,0.4)_45%,_rgba(15,7,30,0.9)_80%)]',
        slitGlow:
          'bg-gradient-to-r from-red-600/25 via-purple-600/35 to-violet-600/25',
      };
    }

    if (winner === 'undercovers') {
      return {
        isDual: false,
        title: 'UNDERCOVER',
        subtitle: winningUndercovers.length > 1 ? 'INFILTRATORS VICTORIOUS' : 'INFILTRATOR VICTORIOUS',
        images: ['/undercover.png'],
        titleColor: 'text-[#ff2a3b]',
        textShadow:
          '0 0 25px rgba(255, 42, 59, 0.9), 0 0 50px rgba(185, 28, 28, 0.8), 4px 4px 0px #000',
        bgGlow:
          'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600/40 via-rose-950/50 to-transparent',
        slitGlow: 'bg-gradient-to-r from-transparent via-red-600/20 to-transparent',
      };
    }

    // Single Mr. Black Win
    return {
      isDual: false,
      title: 'MR. BLACK',
      subtitle: 'VICTORY HIJACKED',
      images: ['/logo.png'],
      titleColor: 'text-[#b57bee]',
      textShadow:
        '0 0 25px rgba(181, 123, 238, 0.95), 0 0 50px rgba(126, 34, 206, 0.8), 4px 4px 0px #000',
      bgGlow:
        'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-700/40 via-indigo-950/60 to-transparent',
      slitGlow: 'bg-gradient-to-r from-transparent via-purple-600/25 to-transparent',
    };
  };

  const theme = getThemeConfig();

  React.useEffect(() => {
    // Start fadeout after 4.4 seconds so it smoothly vanishes at 5 seconds
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 4400);

    const closeTimer = setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 top-0 left-0 right-0 bottom-0 w-full h-full min-h-dvh !m-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden transition-opacity duration-700 pointer-events-auto ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        backgroundColor: '#030307',
      }}
    >
      {/* Background colored ambient glow gradient */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${theme.bgGlow}`}
      />

      {/* Subtle cinematic horizontal slit glow */}
      <div
        className={`absolute top-1/2 left-0 right-0 h-44 -translate-y-1/2 blur-3xl pointer-events-none ${theme.slitGlow}`}
      />

      {/* Vertical structured layout */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-md w-full animate-in zoom-in-95 duration-500 space-y-6">
        {/* 1. Header: Among Us style pixel/stencil headline */}
        <div className="space-y-1.5">
          <h1
            className={`text-5xl sm:text-6xl font-extrabold uppercase tracking-[0.18em] font-discord-headline ${theme.titleColor}`}
            style={{
              textShadow: theme.textShadow,
            }}
          >
            {theme.title}
          </h1>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-white/75 font-sans">
            {theme.subtitle}
          </p>
        </div>

        {/* 2. Character Images with Player Names Below */}
        {theme.isDual ? (
          <div className="flex items-start justify-center gap-6 sm:gap-10 my-2">
            {/* Undercover Column */}
            <div className="flex flex-col items-center space-y-2.5">
              <img
                src="/undercover.png"
                alt="Undercover"
                className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)]"
              />
              <div className="space-y-0.5">
                {winningUndercovers.map((player, idx) => (
                  <div
                    key={player.id || idx}
                    className="text-white text-base sm:text-lg font-bold tracking-wider uppercase font-sans"
                  >
                    {player.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Mr. Black Column */}
            <div className="flex flex-col items-center space-y-2.5">
              <img
                src="/logo.png"
                alt="Mr. Black"
                className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)]"
              />
              <div className="space-y-0.5">
                {winningMrBlacks.map((player, idx) => (
                  <div
                    key={player.id || idx}
                    className="text-white text-base sm:text-lg font-bold tracking-wider uppercase font-sans"
                  >
                    {player.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 my-2">
            <img
              src={theme.images![0]}
              alt={theme.title}
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
            />
            {/* Single Faction Player Names */}
            <div className="space-y-1">
              {(winner === 'civilians'
                ? winningCivilians
                : winner === 'undercovers'
                ? winningUndercovers
                : winningMrBlacks
              ).map((player, idx) => (
                <div
                  key={player.id || idx}
                  className="text-white text-lg sm:text-xl font-bold tracking-wider uppercase font-sans"
                >
                  {player.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
