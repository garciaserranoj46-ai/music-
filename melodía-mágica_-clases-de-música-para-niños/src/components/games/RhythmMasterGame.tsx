import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../services/soundEngine';
import { Play, Pause, RotateCcw, Flame, Trophy, Volume2 } from 'lucide-react';

interface RhythmMasterGameProps {
  onEarnReward: (stars: number, coins: number, xp: number) => void;
}

interface RhythmTarget {
  id: number;
  beatIndex: number; // in quarter beats
  type: 'negra' | 'blanca' | 'corchea';
  hit: boolean;
  missed: boolean;
  label: string;
}

export const RhythmMasterGame: React.FC<RhythmMasterGameProps> = ({ onEarnReward }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(75);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [hitFeedback, setHitFeedback] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<'marcha' | 'baile' | 'reloj'>('marcha');

  // Animation track
  const [targets, setTargets] = useState<RhythmTarget[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const nextTargetIdRef = useRef<number>(0);

  // Patterns for songs
  const patternMarcha = [
    { type: 'negra', label: 'Ta' },
    { type: 'negra', label: 'Ta' },
    { type: 'negra', label: 'Ta' },
    { type: 'negra', label: 'Ta' },
    { type: 'blanca', label: 'Taa-aa' },
    { type: 'negra', label: 'Ta' },
    { type: 'negra', label: 'Ta' },
  ];

  const patternBaile = [
    { type: 'negra', label: 'Ta' },
    { type: 'corchea', label: 'Ti-Ti' },
    { type: 'negra', label: 'Ta' },
    { type: 'corchea', label: 'Ti-Ti' },
    { type: 'negra', label: 'Ta' },
    { type: 'negra', label: 'Ta' },
    { type: 'blanca', label: 'Taa-aa' },
  ];

  // Metronome interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      const beatDurationMs = (60 / bpm) * 1000;
      interval = setInterval(() => {
        setCurrentBeat(prev => {
          const next = (prev % 4) + 1;
          if (next === 1) {
            soundEngine.playDrum('kick');
          } else {
            soundEngine.playDrum('woodblock');
          }
          return next;
        });
      }, beatDurationMs);
    } else {
      setCurrentBeat(1);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, bpm]);

  // Rhythm track target spawner loop
  useEffect(() => {
    let spawnerInterval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      const beatMs = (60 / bpm) * 1000;
      const currentPattern = selectedTrack === 'baile' ? patternBaile : patternMarcha;
      let patternIdx = 0;

      spawnerInterval = setInterval(() => {
        const item = currentPattern[patternIdx % currentPattern.length];
        patternIdx++;

        setTargets(prev => [
          ...prev.slice(-12),
          {
            id: nextTargetIdRef.current++,
            beatIndex: Date.now(),
            type: item.type as 'negra' | 'blanca' | 'corchea',
            hit: false,
            missed: false,
            label: item.label
          }
        ]);
      }, beatMs);
    }

    return () => {
      if (spawnerInterval) clearInterval(spawnerInterval);
    };
  }, [isPlaying, bpm, selectedTrack]);

  // Handle Drum Tap
  const handleDrumTap = () => {
    soundEngine.playDrum('snare');

    if (!isPlaying) {
      setIsPlaying(true);
      return;
    }

    // Check hit window with active targets
    const now = Date.now();
    const hitDistanceMs = (60 / bpm) * 1000;

    // Find closest target that hasn't been hit yet
    let matched = false;
    setTargets(prev =>
      prev.map(tgt => {
        if (!tgt.hit && !tgt.missed && !matched) {
          matched = true;
          setCombo(c => {
            const nextC = c + 1;
            if (nextC > maxCombo) setMaxCombo(nextC);
            return nextC;
          });
          const points = 100 + combo * 10;
          setScore(s => s + points);
          setHitFeedback('¡A TIEMPO! ⭐');
          soundEngine.playCoin();
          setTimeout(() => setHitFeedback(null), 500);
          return { ...tgt, hit: true };
        }
        return tgt;
      })
    );

    if (!matched) {
      // Tapped outside window
      setHitFeedback('¡Sigue el pulso!');
      setTimeout(() => setHitFeedback(null), 400);
    }
  };

  const toggleGame = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (score > 300) {
        onEarnReward(score > 800 ? 3 : 2, Math.floor(score / 30), 75);
      }
    } else {
      setIsPlaying(true);
      setScore(0);
      setCombo(0);
      setTargets([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Game Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">
            🥁
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">El Maestro del Ritmo</h3>
            <p className="text-xs text-slate-500">
              Siente el pulso del corazón y toca el tambor a tiempo
            </p>
          </div>
        </div>

        {/* Track selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => { setSelectedTrack('marcha'); setIsPlaying(false); }}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedTrack === 'marcha' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Marcha de Negras
          </button>
          <button
            onClick={() => { setSelectedTrack('baile'); setIsPlaying(false); }}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedTrack === 'baile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Baile de Corcheas
          </button>
        </div>

        {/* Score & Combo */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <Trophy className="w-4 h-4" />
            <span className="font-mono text-sm">{score} pts</span>
          </div>
          <div className="flex items-center gap-1 text-orange-500">
            <Flame className="w-4 h-4" />
            <span>Combo: x{combo}</span>
          </div>
        </div>
      </div>

      {/* Metronome Beat Stage */}
      <div className="p-6 bg-gradient-to-b from-emerald-50 to-teal-50/40 rounded-3xl border border-emerald-200/80 shadow-md text-center space-y-6">
        {/* Metronome Pulse Indicator */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          {[1, 2, 3, 4].map(b => (
            <div key={b} className="flex flex-col items-center gap-1">
              <div
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-lg sm:text-xl font-extrabold transition-all duration-75 shadow-sm ${
                  isPlaying && currentBeat === b
                    ? b === 1
                      ? 'bg-emerald-600 text-white scale-110 shadow-lg ring-4 ring-emerald-300'
                      : 'bg-teal-500 text-white scale-105 shadow-md ring-2 ring-teal-200'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                {b}
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                {b === 1 ? '¡FUERTE!' : 'pulso'}
              </span>
            </div>
          ))}
        </div>

        {/* Speed Controls (BPM) */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-xs font-bold text-slate-600">Velocidad (Tempo):</span>
          <div className="flex gap-2">
            {[
              { label: 'Tortuga (65)', bpm: 65 },
              { label: 'Perrito (85)', bpm: 85 },
              { label: 'Guepardo (110)', bpm: 110 }
            ].map(item => (
              <button
                key={item.bpm}
                onClick={() => setBpm(item.bpm)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  bpm === item.bpm
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-emerald-100/50 border border-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Target Hit Line */}
        <div className="relative py-4 px-2 bg-slate-900 rounded-2xl border border-slate-800 text-white overflow-hidden shadow-inner">
          <div className="text-xs text-slate-400 mb-2 font-medium flex items-center justify-between px-3">
            <span>Pista de Ritmo Musical</span>
            <span>¡Toca cuando la figura llegue a la zona dorada!</span>
          </div>

          {/* Scrolling Note Conveyor */}
          <div className="relative h-20 bg-slate-950/80 rounded-xl flex items-center justify-end px-6 overflow-hidden">
            {/* Hit Target Line */}
            <div className="absolute left-16 top-0 bottom-0 w-12 border-2 border-dashed border-amber-400 bg-amber-400/20 rounded-lg flex items-center justify-center z-10 pointer-events-none">
              <span className="text-[10px] font-black text-amber-300 uppercase">Toca</span>
            </div>

            {/* Note critters moving */}
            <div className="flex gap-8 items-center pr-6 animate-pulse">
              {targets.map(tgt => (
                <div
                  key={tgt.id}
                  className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-sm shadow-md transition-transform ${
                    tgt.hit
                      ? 'bg-emerald-500 text-white scale-75 opacity-40'
                      : tgt.type === 'blanca'
                      ? 'bg-amber-400 text-slate-900 ring-2 ring-white'
                      : tgt.type === 'corchea'
                      ? 'bg-cyan-400 text-slate-900'
                      : 'bg-emerald-400 text-slate-900'
                  }`}
                >
                  <span className="text-lg">
                    {tgt.type === 'blanca' ? '𝅗𝅥' : tgt.type === 'corchea' ? '♫' : '♩'}
                  </span>
                  <span className="text-[9px] font-extrabold">{tgt.label}</span>
                </div>
              ))}
              {targets.length === 0 && (
                <span className="text-xs text-slate-500 italic">
                  Presiona &quot;Iniciar Juego&quot; para que comiencen a desfilar las notas
                </span>
              )}
            </div>
          </div>

          {/* Hit text feedback */}
          {hitFeedback && (
            <div className="absolute top-2 right-4 text-xs font-black text-amber-300 animate-bounce">
              {hitFeedback}
            </div>
          )}
        </div>

        {/* Big Kid-Friendly Drum Pad Button */}
        <div className="pt-2 flex flex-col items-center">
          <button
            onClick={handleDrumTap}
            className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 border-8 border-amber-100 shadow-2xl active:scale-95 flex flex-col items-center justify-center text-white cursor-pointer group transition-transform"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-dashed border-white/50 flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-4xl sm:text-5xl">🥁</span>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider mt-1">
                ¡TOCA EL TAMBOR!
              </span>
            </div>
          </button>
          <span className="text-xs text-slate-500 font-medium mt-3">
            Tip: También puedes hacer clic sobre el tambor al compás
          </span>
        </div>

        {/* Control Button */}
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={toggleGame}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-md transition-all cursor-pointer ${
              isPlaying ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pausar Ritmo</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Iniciar Juego</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
