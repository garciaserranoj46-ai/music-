import React, { useState, useEffect } from 'react';
import { MUSIC_NOTES } from '../../data/musicData';
import { soundEngine } from '../../services/soundEngine';
import { Volume2, Trophy, ArrowUpCircle, ArrowDownCircle, RefreshCw } from 'lucide-react';
import { NoteDefinition } from '../../types';

interface EarTrainingGameProps {
  onEarnReward: (stars: number, coins: number, xp: number) => void;
  notationStyle?: 'solfege' | 'letters';
}

export const EarTrainingGame: React.FC<EarTrainingGameProps> = ({
  onEarnReward,
  notationStyle = 'solfege'
}) => {
  const [gameMode, setGameMode] = useState<'pitch_compare' | 'note_guess'>('pitch_compare');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const totalRounds = 8;
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);

  // Pitch comparison state
  const [firstNote, setFirstNote] = useState<NoteDefinition>(MUSIC_NOTES[1]);
  const [secondNote, setSecondNote] = useState<NoteDefinition>(MUSIC_NOTES[5]);
  const [correctCompare, setCorrectCompare] = useState<'higher' | 'lower'>('higher');

  // Note guessing state
  const [secretNote, setSecretNote] = useState<NoteDefinition>(MUSIC_NOTES[0]);
  const [guessOptions, setGuessOptions] = useState<NoteDefinition[]>([]);

  // Setup round
  const setupRound = () => {
    setFeedback(null);
    if (gameMode === 'pitch_compare') {
      // Pick 2 distinct notes
      const idx1 = Math.floor(Math.random() * 6);
      let idx2 = Math.floor(Math.random() * 8);
      while (idx2 === idx1) {
        idx2 = Math.floor(Math.random() * 8);
      }
      const n1 = MUSIC_NOTES[idx1];
      const n2 = MUSIC_NOTES[idx2];
      setFirstNote(n1);
      setSecondNote(n2);
      setCorrectCompare(n2.frequency > n1.frequency ? 'higher' : 'lower');

      // Play both notes with a brief pause
      playCompareNotes(n1, n2);
    } else {
      // Pick secret note and 2 distractors
      const shuffled = [...MUSIC_NOTES.slice(0, 7)].sort(() => Math.random() - 0.5);
      const target = shuffled[0];
      const options = shuffled.slice(0, 3).sort((a, b) => a.frequency - b.frequency);
      setSecretNote(target);
      setGuessOptions(options);

      // Play secret note
      setTimeout(() => {
        soundEngine.playNote(target.frequency, 0.9, 'piano');
      }, 200);
    }
  };

  const playCompareNotes = (n1 = firstNote, n2 = secondNote) => {
    soundEngine.playNote(n1.frequency, 0.6, 'piano');
    setTimeout(() => {
      soundEngine.playNote(n2.frequency, 0.7, 'piano');
    }, 700);
  };

  useEffect(() => {
    setupRound();
  }, [gameMode, round]);

  const handleCompareAnswer = (answer: 'higher' | 'lower') => {
    if (feedback) return;
    const isCorrect = answer === correctCompare;

    if (isCorrect) {
      soundEngine.playSuccess();
      const points = 100 + streak * 15;
      setScore(s => s + points);
      setStreak(s => s + 1);
      setFeedback({
        text: `¡Correcto! El segundo sonido era más ${answer === 'higher' ? 'AGUDO (alto) 🐦' : 'GRAVE (bajo) 🐻'}`,
        isCorrect: true
      });
    } else {
      soundEngine.playWrong();
      setStreak(0);
      setFeedback({
        text: `¡Casi! Era más ${correctCompare === 'higher' ? 'agudo' : 'grave'}. ¡Escúchalo de nuevo!`,
        isCorrect: false
      });
    }

    advanceRound();
  };

  const handleGuessAnswer = (option: NoteDefinition) => {
    if (feedback) return;
    const isCorrect = option.id === secretNote.id;

    if (isCorrect) {
      soundEngine.playSuccess();
      const points = 120 + streak * 20;
      setScore(s => s + points);
      setStreak(s => s + 1);
      setFeedback({
        text: `¡Maravilloso oído! Era la nota ${notationStyle === 'solfege' ? secretNote.solfege : secretNote.pitch} ✨`,
        isCorrect: true
      });
    } else {
      soundEngine.playWrong();
      setStreak(0);
      setFeedback({
        text: `No fue ${notationStyle === 'solfege' ? option.solfege : option.pitch}. La nota mágica era ${notationStyle === 'solfege' ? secretNote.solfege : secretNote.pitch}.`,
        isCorrect: false
      });
    }

    advanceRound();
  };

  const advanceRound = () => {
    setTimeout(() => {
      if (round >= totalRounds) {
        setIsFinished(true);
        const stars = score > 700 ? 3 : score > 400 ? 2 : 1;
        soundEngine.playFanfare();
        onEarnReward(stars, Math.floor(score / 30), 80);
      } else {
        setRound(r => r + 1);
      }
    }, 1200);
  };

  const restart = () => {
    setRound(1);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    setFeedback(null);
    setupRound();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Game Mode Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
            👂
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Oído Mágico: Detective Musical</h3>
            <p className="text-xs text-slate-500">
              Ronda {round} de {totalRounds} · Entrena tu percepción auditiva
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => { setGameMode('pitch_compare'); setRound(1); }}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              gameMode === 'pitch_compare' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Agudo vs Grave (Oso / Pájaro)
          </button>
          <button
            onClick={() => { setGameMode('note_guess'); setRound(1); }}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              gameMode === 'note_guess' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Adivina la Nota
          </button>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 text-purple-600 font-bold text-xs">
          <Trophy className="w-4 h-4" />
          <span className="font-mono text-sm">{score} pts</span>
        </div>
      </div>

      {!isFinished ? (
        <div className="p-6 sm:p-8 bg-gradient-to-b from-purple-50 to-indigo-50/50 rounded-3xl border border-purple-200/80 shadow-md text-center space-y-6">
          {gameMode === 'pitch_compare' ? (
            /* Mode: Agudo vs Grave */
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Desafío de Alturas
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-1">
                  ¿El segundo sonido subió (agudo) o bajó (grave)?
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Escucha atentamente los dos sonidos que tocaremos para ti.
                </p>
              </div>

              {/* Sound replay button */}
              <div className="flex justify-center">
                <button
                  onClick={() => playCompareNotes()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Repetir los 2 Sonidos</span>
                </button>
              </div>

              {/* Feedback banner */}
              {feedback && (
                <div
                  className={`p-3 rounded-2xl text-sm font-bold max-w-md mx-auto ${
                    feedback.isCorrect
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              {/* Choice cards (Bird / Bear) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                <button
                  onClick={() => handleCompareAnswer('higher')}
                  className="p-6 bg-white hover:bg-sky-50 rounded-3xl border-2 border-sky-200 hover:border-sky-400 shadow-md transition-all cursor-pointer text-center group active:scale-95"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    🐦
                  </div>
                  <h5 className="font-extrabold text-slate-900 text-lg mt-3 flex items-center justify-center gap-1.5">
                    <span>Más AGUDO</span>
                    <ArrowUpCircle className="w-4 h-4 text-sky-500" />
                  </h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Sonido alto y brillante como un pajarito
                  </p>
                </button>

                <button
                  onClick={() => handleCompareAnswer('lower')}
                  className="p-6 bg-white hover:bg-amber-50 rounded-3xl border-2 border-amber-200 hover:border-amber-400 shadow-md transition-all cursor-pointer text-center group active:scale-95"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    🐻
                  </div>
                  <h5 className="font-extrabold text-slate-900 text-lg mt-3 flex items-center justify-center gap-1.5">
                    <span>Más GRAVE</span>
                    <ArrowDownCircle className="w-4 h-4 text-amber-600" />
                  </h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Sonido hondo y profundo como un oso
                  </p>
                </button>
              </div>
            </div>
          ) : (
            /* Mode: Note Guessing */
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Oído Absoluto
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-1">
                  ¿Cuál nota acaba de tocar el Maestro Búho?
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Pulsa en las opciones para escuchar y encontrar la pareja exacta.
                </p>
              </div>

              {/* Sound replay button */}
              <div className="flex justify-center">
                <button
                  onClick={() => soundEngine.playNote(secretNote.frequency, 0.9, 'piano')}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer active:scale-95 text-sm"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Escuchar Nota Secreta</span>
                </button>
              </div>

              {/* Feedback banner */}
              {feedback && (
                <div
                  className={`p-3 rounded-2xl text-sm font-bold max-w-md mx-auto ${
                    feedback.isCorrect
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              {/* 3 options */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
                {guessOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleGuessAnswer(opt)}
                    style={{ borderColor: opt.color }}
                    className="p-4 bg-white hover:bg-slate-50 rounded-2xl border-2 shadow-sm transition-all cursor-pointer flex flex-col items-center group active:scale-95"
                  >
                    <div
                      className="w-10 h-10 rounded-full mb-2 flex items-center justify-center text-white font-black text-sm shadow-md"
                      style={{ backgroundColor: opt.color }}
                    >
                      {notationStyle === 'solfege' ? opt.solfege : opt.pitch}
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {opt.fullSolfege}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEngine.playNote(opt.frequency, 0.6, 'piano');
                      }}
                      className="mt-2 text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Probar</span>
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Finished Celebration */
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-md text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-100 flex items-center justify-center text-4xl shadow-inner">
            🦉
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            ¡Tienes un Oído Musical Asombroso!
          </h3>
          <p className="text-sm text-slate-600">
            El Maestro Búho está muy orgulloso de tu afinación y percepción sonora.
          </p>

          <div className="p-4 bg-purple-50 rounded-2xl max-w-xs mx-auto">
            <span className="text-xs text-purple-700 font-bold uppercase">Puntuación Final</span>
            <p className="text-3xl font-extrabold text-purple-900 font-mono mt-1">{score} pts</p>
          </div>

          <div className="pt-2">
            <button
              onClick={restart}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-all mx-auto cursor-pointer"
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
