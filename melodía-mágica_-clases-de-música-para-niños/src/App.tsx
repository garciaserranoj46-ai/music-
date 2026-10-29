/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { MascotOwl } from './components/common/MascotOwl';
import { AdventureMap } from './components/lessons/AdventureMap';
import { LessonViewer } from './components/lessons/LessonViewer';
import { GamesHub } from './components/games/GamesHub';
import { FreePlayStudio } from './components/studio/FreePlayStudio';
import { StickerAlbum } from './components/rewards/StickerAlbum';
import { DiplomaModal } from './components/rewards/DiplomaModal';
import { soundEngine } from './services/soundEngine';
import { LessonLevel, UserStats } from './types';
import { BookOpen, Gamepad2, Music, Sparkles, Award } from 'lucide-react';

const STORAGE_KEY = 'melodia_magica_user_data_v1';

const defaultStats: UserStats = {
  playerName: 'Pequeño Músico',
  stars: 0,
  coins: 20,
  xp: 0,
  completedLevels: {},
  unlockedStickers: ['stk-do-rojo'],
  activeInstrument: 'xylophone',
  unlockedInstruments: ['xylophone', 'piano', 'flute', 'synth'],
  notationStyle: 'solfege'
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'aventura' | 'juegos' | 'taller' | 'recompensas'>('aventura');
  const [activeLevel, setActiveLevel] = useState<LessonLevel | null>(null);
  const [isDiplomaOpen, setIsDiplomaOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Load user data from localStorage
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return defaultStats;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userStats));
    } catch {
      // ignore
    }
  }, [userStats]);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  const handleEarnReward = (newStars: number, newCoins: number, newXp: number, stickerId?: string) => {
    setUserStats(prev => {
      const updatedStickers = stickerId && !prev.unlockedStickers.includes(stickerId)
        ? [...prev.unlockedStickers, stickerId]
        : prev.unlockedStickers;

      return {
        ...prev,
        stars: prev.stars + newStars,
        coins: prev.coins + newCoins,
        xp: prev.xp + newXp,
        unlockedStickers: updatedStickers
      };
    });
  };

  const handleCompleteLevel = (levelId: string, starsEarned: number, coinsEarned: number, xpEarned: number, stickerId?: string) => {
    setUserStats(prev => {
      const alreadyCompleted = prev.completedLevels[levelId];
      const previousStars = alreadyCompleted ? alreadyCompleted.stars : 0;
      const additionalStars = Math.max(0, starsEarned - previousStars);

      const updatedStickers = stickerId && !prev.unlockedStickers.includes(stickerId)
        ? [...prev.unlockedStickers, stickerId]
        : prev.unlockedStickers;

      return {
        ...prev,
        stars: prev.stars + additionalStars,
        coins: prev.coins + coinsEarned,
        xp: prev.xp + xpEarned,
        completedLevels: {
          ...prev.completedLevels,
          [levelId]: {
            stars: Math.max(previousStars, starsEarned),
            completedAt: new Date().toISOString()
          }
        },
        unlockedStickers: updatedStickers
      };
    });
  };

  const handleUpdatePlayerName = (name: string) => {
    setUserStats(prev => ({ ...prev, playerName: name }));
  };

  // Mascot dynamic messages
  const getMascotMessage = () => {
    if (activeLevel) {
      return {
        text: `¡Estamos en la clase "${activeLevel.title}"!`,
        sub: 'Lee con atención el secreto de las notas y pulsa en los botones para escuchar cómo suenan.'
      };
    }
    switch (currentTab) {
      case 'aventura':
        return {
          text: `¡Hola ${userStats.playerName}! ¿Listo para una nueva aventura musical?`,
          sub: 'Explora los 6 mundos progresivos. Cada nivel te enseña un concepto y te premia con estrellas doradas.'
        };
      case 'juegos':
        return {
          text: '¡Hora de jugar y afinar los reflejos!',
          sub: 'Entrena tu vista con el Caza-Notas o tu sentido del ritmo con el tambor mágico.'
        };
      case 'taller':
        return {
          text: '¡Bienvenido a tu taller libre de música!',
          sub: 'Aquí puedes tocar cualquier instrumento, componer canciones y ver las notas en el pentagrama.'
        };
      case 'recompensas':
        return {
          text: '¡Mira cuántas pegatinas y diplomas has acumulado!',
          sub: 'Sigue practicando para completar la colección y ser coronado Gran Maestro.'
        };
      default:
        return {
          text: '¡La música nos alegra el corazón!',
          sub: 'Toca las notas para llenar de color el día.'
        };
    }
  };

  const mascotInfo = getMascotMessage();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveLevel(null);
          setCurrentTab(tab);
          soundEngine.playClick();
        }}
        userStats={userStats}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenDiploma={() => setIsDiplomaOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Tutor Mascot Banner */}
        <MascotOwl
          message={mascotInfo.text}
          submessage={mascotInfo.sub}
          mood={userStats.stars > 5 ? 'celebrating' : 'teaching'}
        />

        {/* Dynamic Tab Views */}
        {currentTab === 'aventura' && (
          activeLevel ? (
            <LessonViewer
              level={activeLevel}
              userStats={userStats}
              onBack={() => setActiveLevel(null)}
              onComplete={handleCompleteLevel}
            />
          ) : (
            <AdventureMap
              userStats={userStats}
              onSelectLevel={(lvl) => {
                setActiveLevel(lvl);
                soundEngine.playClick();
              }}
            />
          )
        )}

        {currentTab === 'juegos' && (
          <GamesHub
            onEarnReward={handleEarnReward}
            notationStyle={userStats.notationStyle}
            instrument={userStats.activeInstrument}
          />
        )}

        {currentTab === 'taller' && (
          <FreePlayStudio notationStyle={userStats.notationStyle} />
        )}

        {currentTab === 'recompensas' && (
          <StickerAlbum
            unlockedStickerIds={userStats.unlockedStickers}
            onOpenDiploma={() => setIsDiplomaOpen(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 flex items-center justify-around z-30 shadow-lg">
        {[
          { id: 'aventura', label: 'Clases', icon: BookOpen },
          { id: 'juegos', label: 'Juegos', icon: Gamepad2 },
          { id: 'taller', label: 'Taller', icon: Music },
          { id: 'recompensas', label: 'Premios', icon: Sparkles }
        ].map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveLevel(null);
                setCurrentTab(item.id as any);
                soundEngine.playClick();
              }}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold rounded-xl transition-colors cursor-pointer ${
                isActive ? 'text-amber-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Official Diploma Certificate Modal */}
      <DiplomaModal
        isOpen={isDiplomaOpen}
        onClose={() => setIsDiplomaOpen(false)}
        userStats={userStats}
        onUpdateName={handleUpdatePlayerName}
      />

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 text-center text-xs text-slate-400 pb-16 md:pb-6">
        <p>Melodía Mágica · Clases de Música para Niños · Sonido en Vivo con Web Audio API</p>
      </footer>
    </div>
  );
}
