import React from 'react';
import { LESSON_WORLDS } from '../../data/musicData';
import { LessonLevel, UserStats } from '../../types';
import { Lock, Star, ChevronRight, CheckCircle2, Play } from 'lucide-react';

interface AdventureMapProps {
  userStats: UserStats;
  onSelectLevel: (level: LessonLevel) => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  userStats,
  onSelectLevel
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Welcome Box */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-amber-200">
        <div className="h-44 sm:h-52 w-full relative">
          <img
            src="/src/assets/images/hero_kids_music_class_1793315905893.jpg"
            alt="Clase de música para niños"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              Tu Aventura de Aprendizaje
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Camino Musical de los 6 Reinos
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
              Aprende teoría básica jugando: notas, pentagrama, pulso y canciones paso a paso con el Maestro Búho.
            </p>
          </div>
        </div>
      </div>

      {/* World Journey Cards */}
      <div className="space-y-6">
        {LESSON_WORLDS.map((world, worldIdx) => {
          return (
            <div
              key={world.id}
              className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4"
            >
              {/* World Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${world.themeColor} text-white flex items-center justify-center text-2xl shadow-sm`}>
                    {world.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Mundo {world.number}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {world.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {world.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-400 hidden sm:inline-block">
                  {world.levels.length} Lecciones
                </span>
              </div>

              {/* Levels Grid in this world */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {world.levels.map((level) => {
                  const isCompleted = !!userStats.completedLevels[level.id];
                  const completedData = userStats.completedLevels[level.id];
                  const isLocked = userStats.stars < level.starsRequired && !isCompleted;

                  return (
                    <div
                      key={level.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isLocked
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : isCompleted
                          ? 'bg-amber-50/40 border-amber-200 shadow-xs hover:border-amber-300'
                          : 'bg-white border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{level.icon}</span>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 leading-snug">
                              {level.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {level.concept}
                            </p>
                          </div>
                        </div>

                        {/* Lock / Completed Badge */}
                        {isLocked ? (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold shrink-0">
                            <Lock className="w-3.5 h-3.5" />
                            <span>{level.starsRequired} ⭐</span>
                          </div>
                        ) : isCompleted ? (
                          <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                            {[...Array(completedData?.stars || 3)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                        ) : null}
                      </div>

                      {/* Action Bottom Row */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                          <span>+{level.coinsReward} 🎵</span>
                          <span>·</span>
                          <span>+{level.xpReward} XP</span>
                        </div>

                        <button
                          onClick={() => !isLocked && onSelectLevel(level)}
                          disabled={isLocked}
                          className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isLocked
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : isCompleted
                              ? 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
                              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-95'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <span>Repasar</span>
                              <ChevronRight className="w-3 h-3" />
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" />
                              <span>Comenzar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
