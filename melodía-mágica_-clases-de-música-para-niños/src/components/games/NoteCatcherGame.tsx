import React, { useState, useEffect, useCallback } from 'react';
import { MUSIC_NOTES } from '../../data/musicData';
import { soundEngine } from '../../services/soundEngine';
import { RainbowXylophone } from '../instruments/RainbowXylophone';
import { InteractiveStave } from '../stave/InteractiveStave';
import { NoteDefinition, InstrumentType } from '../../types';
import { Volume2, Award, RefreshCw, Trophy, Zap } from 'lucide-react';

interface NoteCatcherGameProps {
  onEarnReward: (stars: number, coins: number, xp: number) => void;
  notationStyle?: 'solfege' | 'letters';
  instrument?: InstrumentType;
}

export const NoteCatcherGame: React.FC<NoteCatcherGameProps> = ({
  onEarnReward,
  notationStyle = 'solfege'
}) => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [round, setRound] = useState(1);
  const maxRounds = 10;
  const [targetNote, setTargetNote] = useState<NoteDefinition>(MUSIC_NOTES[0]);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<'facil' | 'normal' | 'pro'>('normal');

  // Pick next random note
  const pickNewNote = useCallback(() => {
    // For facil: C4 to G4 (5 notes)
    // For normal: C4 to C5 (8 notes)
    // For pro: all notes
    const pool = difficulty === 'facil'
      ? MUSIC_NOTES.slice(0, 5)
      : MUSIC_NOTES.slice(0, 8);
    const randomIndex = Math.floor(Math.random() * pool.length);
    const next = pool[randomIndex];
    setTargetNote(next);
    // Play the note so kids can hear it
    setTimeout(() => {
      soundEngine.playNote(next.frequency, 0.7, 'xylophone');
    }, 150);
  }, [difficulty]);

  useEffect(() => {
    pickNewNote();
  }, [pickNewNote]);

  const handlePlayTargetSound = () => {
    soundEngine.playNote(targetNote.frequency, 0.8, 'xylophone');
  };

  const handleAnswer = (selectedNoteId: string) => {
    if (isGameOver) return;

    if (selectedNoteId === targetNote.id) {
      // Correct!
      const newStreak = streak + 1;
      const points = 100 + newStreak * 20;
      setScore(prev => prev + points);
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      soundEngine.playSuccess();
      setFeedback({
        text: `¡Fantástico! Era ${notationStyle === 'solfege' ? targetNote.solfege : targetNote.pitch}`,
        type: 'success'
      });

      if (round >= maxRounds) {
        // Game complete
        setTimeout(() => {
          setIsGameOver(true);
          const earnedStars = score > 1000 ? 3 : score > 600 ? 2 : 1;
          const earnedCoins = Math.floor(score / 35);
          soundEngine.playFanfare();
          onEarnReward(earnedStars, earnedCoins, 80);
        }, 800);
      } else {
        setTimeout(() => {
          setRound(r => r + 1);
          setFeedback({ text: '', type: null });
          pickNewNote();
        }, 700);
      }
    } else {
      // Wrong
      soundEngine.playWrong();
      setStreak(0);
      setFeedback({
        text: `¡Casi! Escucha bien y busca en el pentagrama`,
        type: 'error'
      });
      setTimeout(() => {
        setFeedback({ text: '', type: null });
      }, 1200);
    }
  };

  const restartGame = () => {
    setScore(0);
    setStreak(0);
    setRound(1);
    setIsGameOver(false);
    setFeedback({ text: '', type: null });
    pickNewNote();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Game Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
            🎯
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Caza-Notas en el Pentagrama</h3>
            <p className="text-xs text-slate-500">
              Ronda {round} de {maxRounds} · Dificultad: {difficulty.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setDifficulty('facil')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              difficulty === 'facil' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fácil (5 Notas)
          </button>
          <button
            onClick={() => setDifficulty('normal')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              difficulty === 'normal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Escala Completa
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-amber-600">
            <Trophy className="w-4 h-4" />
            <span className="font-mono text-sm">{score} pts</span>
          </div>
          <div className="flex items-center gap-1 text-orange-500">
            <Zap className="w-4 h-4" />
            <span>Racha: x{streak}</span>
          </div>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Target Note Display on Pentagram */}
          <div className="p-5 bg-gradient-to-b from-sky-50 to-blue-50/40 rounded-3xl border border-sky-100 shadow-sm">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-sky-950">
                  ¿Dónde vive esta nota en el pentagrama?
                </span>
              </div>
              <button
                onClick={handlePlayTargetSound}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition-colors cursor-pointer shadow-sm active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>Escuchar Nota</span>
              </button>
            </div>

            {/* Visual Stave highlighting only the target note position */}
            <InteractiveStave
              activeNoteId={targetNote.id}
              interactive={false}
              showLabels={false}
              size="lg"
            />

            {/* Clue Prompt */}
            <div className="text-center mt-3">
              <span className="text-xs font-medium text-slate-600 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
                Pista: Observa si la nota está sobre una línea o en un espacio
              </span>
            </div>
          </div>

          {/* Feedback Banner */}
          {feedback.text && (
            <div
              className={`p-3 rounded-2xl text-center text-sm font-bold animate-bounce ${
                feedback.type === 'success'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* Interactive Instrument to Answer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Toca la nota correcta en el xilófono:
              </span>
            </div>
            <RainbowXylophone
              onPlayNote={handleAnswer}
              notationStyle={notationStyle}
            />
          </div>
        </div>
      ) : (
        /* Game Over Celebration Screen */
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-md text-center space-y-5">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner">
            🏆
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              ¡Misión Cumplida, Pequeño Músico!
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Has demostrado un oído y vista musical asombrosos en el pentagrama.
            </p>
          </div>

          {/* Stars tally */}
          <div className="flex justify-center gap-2 text-3xl">
            <span className={score >= 400 ? 'text-amber-400' : 'text-slate-300'}>⭐</span>
            <span className={score >= 800 ? 'text-amber-400' : 'text-slate-300'}>⭐</span>
            <span className={score >= 1100 ? 'text-amber-400' : 'text-slate-300'}>⭐</span>
          </div>

          <div className="flex justify-center gap-6 text-sm font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl max-w-sm mx-auto">
            <div>
              <p className="text-xs text-slate-400 font-normal">Puntuación</p>
              <p className="text-lg font-mono text-amber-600">{score}</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div>
              <p className="text-xs text-slate-400 font-normal">Mejor Racha</p>
              <p className="text-lg font-mono text-orange-600">x{bestStreak}</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div>
              <p className="text-xs text-slate-400 font-normal">Monedas Ganadas</p>
              <p className="text-lg font-mono text-emerald-600">+{Math.floor(score / 35)} 🎵</p>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={restartGame}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Jugar Otra Vez</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
