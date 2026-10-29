import React, { useState } from 'react';
import { MUSIC_NOTES } from '../../data/musicData';
import { soundEngine } from '../../services/soundEngine';

interface RainbowXylophoneProps {
  onPlayNote?: (noteId: string) => void;
  activeNoteId?: string | null;
  notationStyle?: 'solfege' | 'letters';
  className?: string;
}

export const RainbowXylophone: React.FC<RainbowXylophoneProps> = ({
  onPlayNote,
  activeNoteId,
  notationStyle = 'solfege',
  className = ''
}) => {
  const [lastPlayedId, setLastPlayedId] = useState<string | null>(null);

  const handleBarClick = (noteId: string, freq: number) => {
    soundEngine.playNote(freq, 0.7, 'xylophone');
    setLastPlayedId(noteId);
    if (onPlayNote) {
      onPlayNote(noteId);
    }
    setTimeout(() => {
      setLastPlayedId(null);
    }, 250);
  };

  // Length factor: Lower notes (C4) are physically longer, higher notes are shorter
  const barHeights = [240, 226, 212, 198, 184, 170, 156, 142];

  return (
    <div className={`relative p-5 bg-gradient-to-b from-amber-50 to-orange-50/40 rounded-3xl border border-amber-200/80 shadow-md ${className}`}>
      {/* Wooden frame beams */}
      <div className="absolute top-12 left-6 right-6 h-3 bg-amber-800/40 rounded-full pointer-events-none" />
      <div className="absolute bottom-12 left-6 right-6 h-3 bg-amber-800/40 rounded-full pointer-events-none" />

      {/* Xylophone Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <span className="text-sm font-bold text-amber-950">Xilófono Arcoíris</span>
        </div>
        <span className="text-xs text-amber-800/80 font-medium bg-amber-100/80 px-2.5 py-1 rounded-full">
          Teclas: A, S, D, F, G, H, J, K
        </span>
      </div>

      {/* Bars Container */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 py-2 px-1 select-none overflow-x-auto">
        {MUSIC_NOTES.slice(0, 8).map((note, index) => {
          const height = barHeights[index] || 180;
          const isPressed = lastPlayedId === note.id || activeNoteId === note.id;

          return (
            <button
              key={note.id}
              onClick={() => handleBarClick(note.id, note.frequency)}
              style={{
                height: `${height}px`,
                backgroundColor: note.color,
              }}
              className={`relative w-11 sm:w-14 rounded-2xl flex flex-col justify-between items-center py-4 text-white font-bold transition-all duration-100 shadow-lg active:scale-95 cursor-pointer group ${
                isPressed
                  ? 'brightness-125 scale-95 ring-4 ring-white shadow-2xl -translate-y-1'
                  : 'hover:brightness-110 hover:-translate-y-1'
              }`}
            >
              {/* Top bolt/screw */}
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900/30 border border-white/40 shadow-inner" />

              {/* Note Name & Key Helper */}
              <div className="flex flex-col items-center">
                <span className="text-sm sm:text-base font-extrabold tracking-tight drop-shadow-sm">
                  {notationStyle === 'solfege' ? note.solfege : note.pitch}
                </span>
                <span className="text-[10px] text-white/80 font-medium">
                  {note.keyLetter}
                </span>
              </div>

              {/* Bottom bolt/screw */}
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900/30 border border-white/40 shadow-inner" />

              {/* Highlight gloss line */}
              <div className="absolute top-3 left-1.5 bottom-3 w-1 bg-white/25 rounded-full pointer-events-none" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
