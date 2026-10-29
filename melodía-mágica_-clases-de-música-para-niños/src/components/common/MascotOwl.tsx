import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface MascotOwlProps {
  message: string;
  submessage?: string;
  mood?: 'happy' | 'celebrating' | 'thinking' | 'teaching';
  onSpeak?: () => void;
  className?: string;
}

export const MascotOwl: React.FC<MascotOwlProps> = ({
  message,
  submessage,
  mood = 'happy',
  onSpeak,
  className = ''
}) => {
  const handlePlayVoice = () => {
    soundEngine.playCoin();
    if (onSpeak) onSpeak();
  };

  return (
    <div className={`flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50/60 rounded-3xl border border-amber-200/90 shadow-sm ${className}`}>
      {/* Mascot Avatar with Frame */}
      <div className="relative shrink-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md border-2 border-white bg-amber-100 ring-2 ring-amber-300">
          <img
            src="/src/assets/images/mascot_melody_owl_1793315906628.jpg"
            alt="Maestro Búho Profesor de Música"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shadow-md">
          {mood === 'celebrating' ? '🎉' : mood === 'thinking' ? '💡' : '🪄'}
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-amber-900 tracking-wide">
            Maestro Búho
          </span>
          <span className="text-[11px] text-amber-700/70 font-medium">
            Tutor Musical
          </span>
          <button
            onClick={handlePlayVoice}
            title="Escuchar sonido mágico"
            className="ml-auto text-amber-600 hover:text-amber-800 p-1 rounded-full hover:bg-amber-100/70 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm font-semibold text-slate-800 leading-snug">
          {message}
        </p>

        {submessage && (
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{submessage}</span>
          </p>
        )}
      </div>
    </div>
  );
};
