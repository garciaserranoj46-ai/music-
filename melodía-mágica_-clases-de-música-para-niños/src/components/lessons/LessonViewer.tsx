import React, { useState } from 'react';
import { LessonLevel, LessonStep, UserStats } from '../../types';
import { soundEngine } from '../../services/soundEngine';
import { MUSIC_NOTES } from '../../data/musicData';
import { RainbowXylophone } from '../instruments/RainbowXylophone';
import { InteractiveStave } from '../stave/InteractiveStave';
import { Volume2, CheckCircle2, ChevronRight, Award, Star, ArrowLeft } from 'lucide-react';

interface LessonViewerProps {
  level: LessonLevel;
  onComplete: (levelId: string, stars: number, coins: number, xp: number, stickerId?: string) => void;
  onBack: () => void;
  userStats: UserStats;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  level,
  onComplete,
  onBack,
  userStats
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [isLevelFinished, setIsLevelFinished] = useState(false);

  const step: LessonStep = level.steps[currentStepIndex];

  // Play audio demo for this step if available
  const handlePlayAudioDemo = () => {
    if (step.audioDemoNote) {
      const note = MUSIC_NOTES.find(n => n.id === step.audioDemoNote);
      if (note) {
        soundEngine.playNote(note.frequency, 1.0, 'xylophone');
      }
    } else {
      soundEngine.playCoin();
    }
  };

  const handleSelectOption = (opt: { id: string; label: string; isCorrect: boolean; feedback: string; playNote?: string }) => {
    if (isAnswered) return;
    setSelectedOptionId(opt.id);
    setIsAnswered(true);
    setIsCorrect(opt.isCorrect);
    setFeedbackText(opt.feedback);

    if (opt.playNote) {
      const n = MUSIC_NOTES.find(item => item.id === opt.playNote);
      if (n) soundEngine.playNote(n.frequency, 0.6, 'piano');
    }

    if (opt.isCorrect) {
      soundEngine.playSuccess();
    } else {
      soundEngine.playWrong();
    }
  };

  const handleInstrumentPlay = (noteId: string) => {
    if (step.interactiveTask && step.interactiveTask.targetNote === noteId) {
      setTaskCompleted(true);
      soundEngine.playSuccess();
      setFeedbackText('¡Excelente! Has encontrado la nota en el instrumento.');
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < level.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setFeedbackText('');
      setTaskCompleted(false);
    } else {
      // Level completed!
      setIsLevelFinished(true);
      soundEngine.playFanfare();
      onComplete(level.id, 3, level.coinsReward, level.xpReward, level.unlockedStickerId);
    }
  };

  const canProceed =
    (!step.question && !step.interactiveTask) ||
    (step.question && isAnswered && isCorrect) ||
    (step.interactiveTask && taskCompleted);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Mapa de Clases</span>
        </button>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Paso {currentStepIndex + 1} de {level.steps.length}
          </span>
          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / level.steps.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {!isLevelFinished ? (
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-md space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shrink-0">
              {level.icon}
            </div>
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {level.title}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {step.title}
              </h3>
            </div>
          </div>

          {/* Theory Explanation Box */}
          <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/70 text-slate-800 space-y-3">
            <p className="text-sm sm:text-base leading-relaxed">
              {step.explanation}
            </p>

            {/* Audio demonstration trigger */}
            {step.audioDemoNote && (
              <button
                onClick={handlePlayAudioDemo}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>Escuchar Ejemplo Sonoro</span>
              </button>
            )}
          </div>

          {/* Interactive Stave context if relevant to this step */}
          {step.audioDemoNote && (
            <div className="pt-2">
              <InteractiveStave
                activeNoteId={step.audioDemoNote}
                interactive={false}
                notationStyle={userStats.notationStyle}
                size="sm"
              />
            </div>
          )}

          {/* Interactive Question Section */}
          {step.question && (
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-900">
                ❓ {step.question.prompt}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {step.question.options.map(opt => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt)}
                      disabled={isAnswered}
                      className={`p-3.5 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-200'
                            : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-200'
                          : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <span>{opt.isCorrect ? '✅' : '❌'}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {isAnswered && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold ${
                    isCorrect
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-rose-100 text-rose-900'
                  }`}
                >
                  {feedbackText}
                </div>
              )}
            </div>
          )}

          {/* Interactive Instrument Task Section */}
          {step.interactiveTask && (
            <div className="space-y-4 pt-2">
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900 font-semibold">
                🎯 {step.interactiveTask.instruction}
              </div>

              <RainbowXylophone
                onPlayNote={handleInstrumentPlay}
                notationStyle={userStats.notationStyle}
              />

              {taskCompleted && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{feedbackText}</span>
                </div>
              )}
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              {canProceed ? '¡Listo para continuar!' : 'Responde o completa el paso para avanzar'}
            </span>
            <button
              onClick={handleNextStep}
              disabled={!canProceed}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                canProceed
                  ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>{currentStepIndex < level.steps.length - 1 ? 'Siguiente Paso' : 'Completar Lección'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Level Finish Celebration */
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-lg text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner">
            🌟
          </div>

          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              ¡Nivel Superado!
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {level.title}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Has aprendido un nuevo concepto musical y ganado recompensas mágicas.
            </p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-2 text-3xl">
            <Star className="w-8 h-8 fill-amber-400 text-amber-500" />
            <Star className="w-8 h-8 fill-amber-400 text-amber-500" />
            <Star className="w-8 h-8 fill-amber-400 text-amber-500" />
          </div>

          {/* Rewards pill */}
          <div className="flex justify-center gap-4 text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-2xl max-w-xs mx-auto">
            <span>+{level.coinsReward} Monedas 🎵</span>
            <span>·</span>
            <span>+{level.xpReward} XP ⭐</span>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={onBack}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              Volver al Mapa y Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
