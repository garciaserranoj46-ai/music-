import React, { useState } from 'react';
import { MUSIC_NOTES } from '../../data/musicData';
import { soundEngine } from '../../services/soundEngine';
import { InstrumentType } from '../../types';

interface VirtualPianoProps {
  onPlayNote?: (noteId: string) => void;
  activeNoteId?: string | null;
  instrument?: InstrumentType;
  notationStyle?: 'solfege' | 'letters';
  className?: string;
}

export const VirtualPiano: React.FC<VirtualPianoProps> = ({
  onPlayNote,
  activeNoteId,
  instrument = 'piano',
  notationStyle = 'solfege',
  className = ''
}) => {
  const [pressedNote, setPressedNote] = useState<string | null>(null);

  const handleKeyPress = (noteId: string, freq: number) => {
    soundEngine.playNote(freq, 0.9, instrument);
    setPressedNote(noteId);
    if (onPlayNote) {
      onPlayNote(noteId);
    }
    setTimeout(() => {
      setPressedNote(null);
    }, 200);
  };

  // Black keys between white keys
  // C#4 between C4 & D4 (freq ~ 277.18)
  // D#4 between D4 & E4 (freq ~ 311.13)
  // F#4 between F4 & G4 (freq ~ 369.99)
  // G#4 between G4 & A4 (freq ~ 415.30)
  // A#4 between A4 & B4 (freq ~ 466.16)
  const blackKeys = [
    { id: 'Cs4', label: 'Do#', freq: 277.18, leftIndex: 0 },
    { id: 'Ds4', label: 'Re#', freq: 311.13, leftIndex: 1 },
    { id: 'Fs4', label: 'Fa#', freq: 369.99, leftIndex: 3 },
    { id: 'Gs4', label: 'Sol#', freq: 415.30, leftIndex: 4 },
    { id: 'As4', label: 'La#', freq: 466.16, leftIndex: 5 },
  ];

  return (
    <div className={`relative p-4 sm:p-5 bg-slate-900 rounded-3xl shadow-xl border border-slate-800 ${className}`}>
      {/* Piano fallboard brass strip */}
      <div className="w-full h-3 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-md mb-3 flex items-center justify-center">
        <span className="text-[10px] font-bold text-amber-950 tracking-widest uppercase">
          {instrument.toUpperCase()} MÁGICO
        </span>
      </div>

      {/* Piano Keys Frame */}
      <div className="relative flex justify-center bg-slate-950 p-2 rounded-2xl shadow-inner select-none overflow-x-auto">
        {/* White Keys */}
        <div className="flex gap-1.5 sm:gap-2">
          {MUSIC_NOTES.slice(0, 8).map((note) => {
            const isPlaying = pressedNote === note.id || activeNoteId === note.id;

            return (
              <button
                key={note.id}
                onClick={() => handleKeyPress(note.id, note.frequency)}
                className={`relative w-11 sm:w-14 h-48 sm:h-56 rounded-b-xl flex flex-col justify-end items-center pb-3 text-slate-800 transition-all duration-75 cursor-pointer border-x border-b border-slate-300 ${
                  isPlaying
                    ? 'bg-amber-100 shadow-inner scale-[0.98] translate-y-1'
                    : 'bg-white hover:bg-slate-50 shadow-md'
                }`}
              >
                {/* Visual Note Color Pill indicator */}
                <div
                  className="w-4 h-4 rounded-full mb-2 shadow-sm flex items-center justify-center"
                  style={{ backgroundColor: note.color }}
                />

                <span className="text-sm font-bold text-slate-900">
                  {notationStyle === 'solfege' ? note.solfege : note.pitch}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {note.keyLetter}
                </span>
              </button>
            );
          })}
        </div>

        {/* Black Keys overlaid accurately */}
        <div className="absolute top-2 left-2 right-2 flex pointer-events-none">
          <div className="flex gap-1.5 sm:gap-2 mx-auto">
            {MUSIC_NOTES.slice(0, 7).map((_, idx) => {
              const bKey = blackKeys.find(k => k.leftIndex === idx);
              return (
                <div key={idx} className="relative w-11 sm:w-14 pointer-events-none">
                  {bKey && (
                    <button
                      onClick={() => handleKeyPress(bKey.id, bKey.freq)}
                      className={`pointer-events-auto absolute -right-3.5 sm:-right-4.5 z-20 w-7 sm:w-9 h-28 sm:h-32 bg-slate-950 rounded-b-md shadow-lg border border-slate-800 flex flex-col justify-end items-center pb-2 text-white transition-all cursor-pointer ${
                        pressedNote === bKey.id
                          ? 'bg-slate-800 translate-y-1'
                          : 'hover:bg-slate-900'
                      }`}
                    >
                      <span className="text-[9px] font-bold text-slate-400">
                        #
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
            <div className="w-11 sm:w-14 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
