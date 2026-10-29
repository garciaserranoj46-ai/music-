import React, { useState } from 'react';
import { InstrumentType, SongSheet } from '../../types';
import { MUSIC_NOTES, POPULAR_SONGS } from '../../data/musicData';
import { soundEngine } from '../../services/soundEngine';
import { VirtualPiano } from '../instruments/VirtualPiano';
import { RainbowXylophone } from '../instruments/RainbowXylophone';
import { InteractiveStave } from '../stave/InteractiveStave';
import { Play, Square, RotateCcw, Music, Sparkles, BookOpen } from 'lucide-react';

interface FreePlayStudioProps {
  notationStyle?: 'solfege' | 'letters';
}

export const FreePlayStudio: React.FC<FreePlayStudioProps> = ({ notationStyle = 'solfege' }) => {
  const [instrument, setInstrument] = useState<InstrumentType>('xylophone');
  const [recordedNotes, setRecordedNotes] = useState<{ noteId: string; timestamp: number }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [activePlaybackNote, setActivePlaybackNote] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<SongSheet | null>(null);
  const [songGuideIndex, setSongGuideIndex] = useState<number>(0);

  const handleNotePlayed = (noteId: string) => {
    if (isRecording) {
      setRecordedNotes(prev => [...prev, { noteId, timestamp: Date.now() }]);
    }

    // Check guided song
    if (selectedSong) {
      const currentTarget = selectedSong.notes[songGuideIndex];
      if (currentTarget && currentTarget.note === noteId) {
        if (songGuideIndex < selectedSong.notes.length - 1) {
          setSongGuideIndex(i => i + 1);
        } else {
          // Finished song!
          soundEngine.playSuccess();
          setTimeout(() => {
            soundEngine.playFanfare();
          }, 400);
        }
      }
    }
  };

  const handleStartRecording = () => {
    setRecordedNotes([]);
    setIsRecording(true);
    soundEngine.playClick();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    soundEngine.playClick();
  };

  const handlePlayback = () => {
    if (recordedNotes.length === 0 || isPlayingBack) return;
    setIsPlayingBack(true);
    const firstTime = recordedNotes[0].timestamp;

    recordedNotes.forEach((item, idx) => {
      const delay = item.timestamp - firstTime;
      setTimeout(() => {
        const noteDef = MUSIC_NOTES.find(n => n.id === item.noteId);
        if (noteDef) {
          soundEngine.playNote(noteDef.frequency, 0.7, instrument);
          setActivePlaybackNote(noteDef.id);
        }
        if (idx === recordedNotes.length - 1) {
          setTimeout(() => {
            setIsPlayingBack(false);
            setActivePlaybackNote(null);
          }, 600);
        }
      }, delay);
    });
  };

  const handleSelectSong = (song: SongSheet) => {
    setSelectedSong(song);
    setSongGuideIndex(0);
    soundEngine.playClick();
  };

  const currentGuidedTarget = selectedSong ? selectedSong.notes[songGuideIndex]?.note : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Studio Header & Instrument Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
            🎨
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Taller Libre & Compositor Mágico</h3>
            <p className="text-xs text-slate-500">
              Toca libremente, graba tus canciones o aprende melodías guiadas
            </p>
          </div>
        </div>

        {/* Instrument tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'xylophone', label: 'Xilófono', icon: '✨' },
            { id: 'piano', label: 'Piano', icon: '🎹' },
            { id: 'flute', label: 'Flauta', icon: '🪈' },
            { id: 'synth', label: 'Sinte', icon: '🚀' }
          ].map(inst => (
            <button
              key={inst.id}
              onClick={() => {
                setInstrument(inst.id as InstrumentType);
                soundEngine.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                instrument === inst.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{inst.icon}</span>
              <span>{inst.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Song Book (Cancionero Guiado) */}
      <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
              Cancionero Infantil Guiado:
            </span>
          </div>
          {selectedSong && (
            <button
              onClick={() => setSelectedSong(null)}
              className="text-xs text-amber-800 hover:underline font-semibold cursor-pointer"
            >
              Salir de la canción guiada
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {POPULAR_SONGS.map(song => (
            <button
              key={song.id}
              onClick={() => handleSelectSong(song)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedSong?.id === song.id
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-amber-100/60 border border-amber-200'
              }`}
            >
              <span>🎵</span>
              <span>{song.title}</span>
              <span className="text-[10px] opacity-75 font-normal">({song.difficulty})</span>
            </button>
          ))}
        </div>

        {selectedSong && (
          <div className="mt-3 p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-amber-900">Siguiente nota a tocar:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-sm animate-pulse">
                {currentGuidedTarget ? MUSIC_NOTES.find(n => n.id === currentGuidedTarget)?.solfege : '¡Fin! 🎉'}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Nota {songGuideIndex + 1} de {selectedSong.notes.length}
            </span>
          </div>
        )}
      </div>

      {/* Recording & Stave Display */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-bold text-slate-700">
              Tus Notas Registradas ({recordedNotes.length})
            </span>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center gap-2">
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Grabar Melodía</span>
              </button>
            ) : (
              <button
                onClick={handleStopRecording}
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                <Square className="w-3 h-3 fill-white" />
                <span>Detener Grabación</span>
              </button>
            )}

            <button
              onClick={handlePlayback}
              disabled={recordedNotes.length === 0 || isPlayingBack}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                recordedNotes.length > 0 && !isPlayingBack
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isPlayingBack ? 'Reproduciendo...' : 'Escuchar'}</span>
            </button>

            {recordedNotes.length > 0 && (
              <button
                onClick={() => setRecordedNotes([])}
                title="Borrar notas"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Pentagram view */}
        <InteractiveStave
          activeNoteId={activePlaybackNote || currentGuidedTarget}
          interactive={true}
          notationStyle={notationStyle}
          onNoteClick={handleNotePlayed}
        />
      </div>

      {/* Main Playable Instrument */}
      <div className="space-y-4">
        {instrument === 'xylophone' ? (
          <RainbowXylophone
            activeNoteId={currentGuidedTarget || activePlaybackNote}
            onPlayNote={handleNotePlayed}
            notationStyle={notationStyle}
          />
        ) : (
          <VirtualPiano
            activeNoteId={currentGuidedTarget || activePlaybackNote}
            instrument={instrument}
            onPlayNote={handleNotePlayed}
            notationStyle={notationStyle}
          />
        )}
      </div>

      {/* Drum Pad Mini Bar for Accompaniment */}
      <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-400">
          Acompañamiento Rítmico:
        </span>
        <div className="flex gap-2">
          {[
            { id: 'kick', label: 'Bombo', icon: '🥁' },
            { id: 'snare', label: 'Caja', icon: '💥' },
            { id: 'hihat', label: 'Platillo', icon: '✨' },
            { id: 'woodblock', label: 'Clave', icon: '🪵' },
            { id: 'bell', label: 'Campanita', icon: '🔔' }
          ].map(drum => (
            <button
              key={drum.id}
              onClick={() => soundEngine.playDrum(drum.id as any)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-600 text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <span>{drum.icon}</span>
              <span>{drum.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
