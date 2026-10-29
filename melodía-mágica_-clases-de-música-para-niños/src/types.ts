export type InstrumentType = 'piano' | 'xylophone' | 'flute' | 'synth';

export interface NoteDefinition {
  id: string; // e.g. 'C4'
  pitch: string; // 'C'
  octave: number; // 4
  solfege: string; // 'Do'
  fullSolfege: string; // 'Do central'
  frequency: number; // 261.63
  color: string; // Tailwind color class or hex
  bgGradient: string;
  keyLetter?: string; // Keyboard shortcut e.g. 'A'
  staffOffset: number; // Offset in staff units (C4 = -2, D4 = -1, E4 = 0 [line 1], F4 = 1 [space 1], G4 = 2 [line 2], etc.)
  isAccidental?: boolean;
}

export interface RhythmFigure {
  id: string;
  name: string;
  beats: number;
  syllable: string;
  description: string;
  symbol: string;
  iconType: 'whole' | 'half' | 'quarter' | 'eighth' | 'rest';
}

export interface LessonStep {
  id: string;
  title: string;
  explanation: string;
  hint?: string;
  audioDemoNote?: string; // note ID to play
  audioRhythmPattern?: number[]; // beat durations
  question?: {
    prompt: string;
    options: {
      id: string;
      label: string;
      isCorrect: boolean;
      feedback: string;
      playNote?: string;
    }[];
  };
  interactiveTask?: {
    type: 'play_note' | 'identify_staff' | 'tap_rhythm' | 'pitch_compare';
    targetNote?: string;
    targetPattern?: number[];
    instruction: string;
  };
}

export interface LessonLevel {
  id: string;
  worldId: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  concept: string;
  icon: string;
  starsRequired: number;
  xpReward: number;
  coinsReward: number;
  unlockedStickerId?: string;
  steps: LessonStep[];
}

export interface LessonWorld {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  themeColor: string;
  icon: string;
  description: string;
  levels: LessonLevel[];
}

export interface VirtualSticker {
  id: string;
  title: string;
  category: 'notas' | 'ritmo' | 'instrumentos' | 'maestria';
  description: string;
  icon: string;
  rarity: 'común' | 'especial' | 'dorada' | 'legendaria';
  unlockedAt?: string;
}

export interface UserStats {
  playerName: string;
  stars: number;
  coins: number;
  xp: number;
  completedLevels: Record<string, { stars: number; completedAt: string }>;
  unlockedStickers: string[];
  activeInstrument: InstrumentType;
  unlockedInstruments: InstrumentType[];
  notationStyle: 'solfege' | 'letters'; // 'Do Re Mi' vs 'C D E'
}

export interface SongSheet {
  id: string;
  title: string;
  difficulty: 'Fácil' | 'Medio' | 'Avanzado';
  bpm: number;
  notes: { note: string; duration: number }[]; // duration in beats (1 = quarter note)
}
