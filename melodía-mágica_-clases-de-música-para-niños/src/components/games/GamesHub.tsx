import React, { useState } from 'react';
import { NoteCatcherGame } from './NoteCatcherGame';
import { RhythmMasterGame } from './RhythmMasterGame';
import { EarTrainingGame } from './EarTrainingGame';
import { InstrumentType } from '../../types';
import { ArrowLeft, Target, Drum, Headphones } from 'lucide-react';

interface GamesHubProps {
  onEarnReward: (stars: number, coins: number, xp: number) => void;
  notationStyle?: 'solfege' | 'letters';
  instrument?: InstrumentType;
}

export const GamesHub: React.FC<GamesHubProps> = ({
  onEarnReward,
  notationStyle = 'solfege',
  instrument = 'xylophone'
}) => {
  const [selectedGame, setSelectedGame] = useState<'catcher' | 'rhythm' | 'ear' | null>(null);

  if (selectedGame === 'catcher') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedGame(null)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Salón de Juegos</span>
        </button>
        <NoteCatcherGame
          onEarnReward={onEarnReward}
          notationStyle={notationStyle}
          instrument={instrument}
        />
      </div>
    );
  }

  if (selectedGame === 'rhythm') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedGame(null)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Salón de Juegos</span>
        </button>
        <RhythmMasterGame onEarnReward={onEarnReward} />
      </div>
    );
  }

  if (selectedGame === 'ear') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedGame(null)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Salón de Juegos</span>
        </button>
        <EarTrainingGame
          onEarnReward={onEarnReward}
          notationStyle={notationStyle}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-6 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 rounded-3xl text-white shadow-lg">
        <span className="text-xs font-black tracking-widest uppercase text-sky-200">
          Entrenamiento Lúdico
        </span>
        <h2 className="text-2xl font-bold mt-1">
          Salón de Juegos Musicales
        </h2>
        <p className="text-xs text-sky-100 mt-1 max-w-xl">
          Elige tu minijuego favorito para poner a prueba tus reflejos rítmicos, afinar tu oído y ganar estrellas doradas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Game 1: Note Catcher */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">
              🎯
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              Caza-Notas en el Pentagrama
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mira dónde aparece la nota entre las 5 líneas y espacios, escúchala y tócala en el xilófono.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit">
              <Target className="w-3.5 h-3.5" />
              <span>Lectura de partitura</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedGame('catcher')}
            className="mt-6 w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer active:scale-95"
          >
            Jugar Caza-Notas
          </button>
        </div>

        {/* Game 2: Rhythm Master */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">
              🥁
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              El Maestro del Ritmo
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sigue el metrónomo, sincroniza los tiempos con negras y corcheas, y golpea el tambor a compás.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
              <Drum className="w-3.5 h-3.5" />
              <span>Pulso y tempo</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedGame('rhythm')}
            className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer active:scale-95"
          >
            Jugar Maestro del Ritmo
          </button>
        </div>

        {/* Game 3: Ear Training */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">
              👂
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              Oído Mágico: Detective
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Distingue entre el sonido agudo del pajarito y el grave del oso, o adivina la nota misteriosa.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full w-fit">
              <Headphones className="w-3.5 h-3.5" />
              <span>Entrenamiento auditivo</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedGame('ear')}
            className="mt-6 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer active:scale-95"
          >
            Jugar Oído Mágico
          </button>
        </div>
      </div>
    </div>
  );
};
