import React from 'react';
import { MUSIC_NOTES } from '../../data/musicData';
import { soundEngine } from '../../services/soundEngine';

interface InteractiveStaveProps {
  activeNoteId?: string | null;
  highlightedNoteIds?: string[];
  interactive?: boolean;
  onNoteClick?: (noteId: string) => void;
  showLabels?: boolean;
  notationStyle?: 'solfege' | 'letters';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const InteractiveStave: React.FC<InteractiveStaveProps> = ({
  activeNoteId,
  highlightedNoteIds = [],
  interactive = true,
  onNoteClick,
  showLabels = true,
  notationStyle = 'solfege',
  className = '',
  size = 'md'
}) => {
  // Staff geometry
  // 5 lines spaced by lineSpacing.
  // Line 5 (top, F5): y = 40
  // Line 4 (D5): y = 60
  // Line 3 (B4): y = 80
  // Line 2 (G4): y = 100
  // Line 1 (bottom, E4): y = 120
  // Line spacing = 20px, so each half-step/position on staff is 10px vertically!
  // E4 is line 1 -> y = 120
  // D4 is space below -> y = 130
  // C4 is ledger line -> y = 140

  const getNoteY = (staffOffset: number) => {
    // E4 has staffOffset = 0 -> y = 120
    // Each offset unit goes up 10px (so y decreases by 10)
    return 120 - (staffOffset * 10);
  };

  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.15 : 1;

  const handleNoteSelect = (noteId: string, freq: number) => {
    soundEngine.playNote(freq, 0.6, 'piano');
    if (onNoteClick) {
      onNoteClick(noteId);
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      <div className="w-full flex items-center justify-between mb-2 px-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Pentagrama en Clave de Sol
        </span>
        <span className="text-xs text-slate-400">
          5 Líneas · 4 Espacios
        </span>
      </div>

      <div className="w-full overflow-x-auto flex justify-center py-2">
        <svg
          viewBox="0 0 520 180"
          className="w-full max-w-[540px] select-none"
          style={{ height: `${180 * scale}px` }}
        >
          {/* Subtle background staff guide */}
          <rect x="10" y="20" width="500" height="145" rx="8" fill="#F8FAFC" />

          {/* 5 Staff Lines */}
          {[120, 100, 80, 60, 40].map((y, idx) => (
            <g key={y}>
              <line
                x1="30"
                y1={y}
                x2="490"
                y2={y}
                stroke="#334155"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <text
                x="498"
                y={y + 3.5}
                fontSize="9"
                fontWeight="600"
                fill="#94A3B8"
                textAnchor="start"
              >
                L{idx + 1}
              </text>
            </g>
          ))}

          {/* Bar lines on ends */}
          <line x1="30" y1="40" x2="30" y2="120" stroke="#334155" strokeWidth="2.5" />
          <line x1="490" y1="40" x2="490" y2="120" stroke="#334155" strokeWidth="2.5" />

          {/* Treble Clef Graphic (Accurate stylized Clave de Sol) */}
          <g transform="translate(42, 28) scale(0.68)">
            <path
              d="M 28 85 C 28 85 24 100 24 112 C 24 125 33 133 42 133 C 51 133 58 126 58 116 C 58 103 48 94 36 94 C 20 94 8 107 8 123 C 8 141 24 154 44 154 C 64 154 78 138 78 116 C 78 88 56 62 48 35 C 44 20 45 4 41 0 C 37 20 37 38 41 58 C 45 78 48 97 48 115 C 48 130 40 142 32 142 C 25 142 20 135 20 126 C 20 120 23 113 28 107 Z"
              fill="#1E293B"
            />
            {/* Clef circle accent on line 2 (Sol line) */}
            <circle cx="43" cy="106" r="3" fill="#0EA5E9" />
          </g>

          {/* Render notes across the stave horizontally */}
          {MUSIC_NOTES.slice(0, 8).map((note, index) => {
            const x = 115 + index * 46;
            const y = getNoteY(note.staffOffset);
            const isActive = activeNoteId === note.id;
            const isHighlighted = highlightedNoteIds.includes(note.id);
            const hasLedger = note.staffOffset === -2; // C4 needs ledger line

            return (
              <g
                key={note.id}
                className={interactive ? 'cursor-pointer group' : ''}
                onClick={() => interactive && handleNoteSelect(note.id, note.frequency)}
              >
                {/* Ledger line for Do (C4) */}
                {hasLedger && (
                  <line
                    x1={x - 14}
                    y1={y}
                    x2={x + 14}
                    y2={y}
                    stroke={isActive ? note.color : '#64748B'}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                )}

                {/* Hit area for kids clicks */}
                <circle cx={x} cy={y} r="18" fill="transparent" />

                {/* Outer halo when active or highlighted */}
                {(isActive || isHighlighted) && (
                  <circle
                    cx={x}
                    cy={y}
                    r="16"
                    fill={note.color}
                    opacity={isActive ? 0.35 : 0.2}
                    className="animate-pulse"
                  />
                )}

                {/* Note head (rotated ellipse like standard notation) */}
                <ellipse
                  cx={x}
                  cy={y}
                  rx="7.5"
                  ry="5.5"
                  transform={`rotate(-25 ${x} ${y})`}
                  fill={isActive ? note.color : isHighlighted ? note.color : '#0F172A'}
                  stroke={note.color}
                  strokeWidth={isActive ? '2' : '1'}
                  className="transition-transform duration-150 group-hover:scale-110"
                />

                {/* Note stem (pointing up or down depending on position) */}
                {note.staffOffset < 4 ? (
                  // Stem up on the right
                  <line
                    x1={x + 6}
                    y1={y}
                    x2={x + 6}
                    y2={y - 28}
                    stroke={isActive ? note.color : '#0F172A'}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  // Stem down on the left for high notes
                  <line
                    x1={x - 6}
                    y1={y}
                    x2={x - 6}
                    y2={y + 28}
                    stroke={isActive ? note.color : '#0F172A'}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}

                {/* Solfege name badge / text label */}
                {showLabels && (
                  <g>
                    <rect
                      x={x - 16}
                      y="152"
                      width="32"
                      height="20"
                      rx="6"
                      fill={isActive ? note.color : '#F1F5F9'}
                      className="transition-colors"
                    />
                    <text
                      x={x}
                      y="166"
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                      fill={isActive ? '#FFFFFF' : '#334155'}
                    >
                      {notationStyle === 'solfege' ? note.solfege : note.pitch}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
          <span>Do</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span>
          <span>Sol (Línea 2)</span>
        </span>
        <span className="text-slate-400">·</span>
        <span>Haz clic en cualquier nota para escucharla</span>
      </div>
    </div>
  );
};
