import React from 'react';
import { Volume2, VolumeX, Star, Trophy, Sparkles } from 'lucide-react';
import { UserStats } from '../../types';
import { soundEngine } from '../../services/soundEngine';

interface HeaderProps {
  currentTab: 'aventura' | 'juegos' | 'taller' | 'recompensas';
  onSelectTab: (tab: 'aventura' | 'juegos' | 'taller' | 'recompensas') => void;
  userStats: UserStats;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenDiploma: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  userStats,
  isMuted,
  onToggleMute,
  onOpenDiploma
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
        <span className="text-xl">𝄞</span>
        <button
          onClick={() => onSelectTab('aventura')}
          className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 hover:text-amber-600 transition-colors cursor-pointer"
        >
          Melodía Mágica
        </button>
      </div>

      {/* Zone 2: 4 single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
        <button
          onClick={() => onSelectTab('aventura')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentTab === 'aventura' ? 'text-amber-600 border-b-2 border-amber-500 pb-0.5' : ''
          }`}
        >
          Aventura Musical
        </button>
        <button
          onClick={() => onSelectTab('juegos')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentTab === 'juegos' ? 'text-amber-600 border-b-2 border-amber-500 pb-0.5' : ''
          }`}
        >
          Juegos
        </button>
        <button
          onClick={() => onSelectTab('taller')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentTab === 'taller' ? 'text-amber-600 border-b-2 border-amber-500 pb-0.5' : ''
          }`}
        >
          Taller Libre
        </button>
        <button
          onClick={() => onSelectTab('recompensas')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentTab === 'recompensas' ? 'text-amber-600 border-b-2 border-amber-500 pb-0.5' : ''
          }`}
        >
          Recompensas
        </button>
      </nav>

      {/* Zone 3: 1 primary action cluster (Stats + Sound toggle) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* User stats summary */}
        <div className="flex items-center gap-2.5 bg-amber-50/80 border border-amber-200/70 px-3 py-1 rounded-xl text-xs font-bold text-amber-950">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span className="font-mono">{userStats.stars}</span>
          </div>
          <span className="text-amber-300">·</span>
          <div className="flex items-center gap-1 text-emerald-700">
            <span>🎵</span>
            <span className="font-mono">{userStats.coins}</span>
          </div>
        </div>

        {/* Mute button */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Certificate button */}
        <button
          onClick={onOpenDiploma}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 whitespace-nowrap"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Mi Diploma</span>
        </button>
      </div>
    </header>
  );
};
