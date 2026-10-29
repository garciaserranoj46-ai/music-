import React, { useState } from 'react';
import { VIRTUAL_STICKERS } from '../../data/musicData';
import { VirtualSticker } from '../../types';
import { Sparkles, Lock, Trophy, Star } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface StickerAlbumProps {
  unlockedStickerIds: string[];
  onOpenDiploma: () => void;
}

export const StickerAlbum: React.FC<StickerAlbumProps> = ({
  unlockedStickerIds,
  onOpenDiploma
}) => {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'notas' | 'ritmo' | 'instrumentos' | 'maestria'>('todos');
  const [inspectedSticker, setInspectedSticker] = useState<VirtualSticker | null>(null);

  const filteredStickers = activeCategory === 'todos'
    ? VIRTUAL_STICKERS
    : VIRTUAL_STICKERS.filter(s => s.category === activeCategory);

  const unlockedCount = VIRTUAL_STICKERS.filter(s => unlockedStickerIds.includes(s.id)).length;

  const handleCardClick = (sticker: VirtualSticker, isUnlocked: boolean) => {
    setInspectedSticker(sticker);
    if (isUnlocked) {
      soundEngine.playCoin();
    } else {
      soundEngine.playClick();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Album Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-widest uppercase text-amber-200">
            Colección Mágica
          </span>
          <h3 className="text-2xl font-bold mt-1">
            Álbum de Pegatinas Musicales
          </h3>
          <p className="text-xs text-amber-100 mt-1 max-w-md">
            Desbloquea sellos y trofeos completando lecciones, acertando notas en los juegos y tocando al compás.
          </p>
        </div>

        {/* Action: Open Diploma */}
        <button
          onClick={onOpenDiploma}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-amber-900 font-bold rounded-2xl shadow-md hover:bg-amber-50 transition-all cursor-pointer active:scale-95 text-xs"
        >
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>Ver Mi Diploma Oficial</span>
        </button>
      </div>

      {/* Progress & Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Pegatinas conseguidas: {unlockedCount} de {VIRTUAL_STICKERS.length}</span>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'todos', label: 'Todas' },
            { id: 'notas', label: 'Notas' },
            { id: 'ritmo', label: 'Ritmo' },
            { id: 'instrumentos', label: 'Instrumentos' },
            { id: 'maestria', label: 'Maestría' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sticker Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredStickers.map(sticker => {
          const isUnlocked = unlockedStickerIds.includes(sticker.id);

          return (
            <button
              key={sticker.id}
              onClick={() => handleCardClick(sticker, isUnlocked)}
              className={`p-4 rounded-3xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center relative overflow-hidden group ${
                isUnlocked
                  ? 'bg-gradient-to-b from-white to-amber-50/50 border-amber-300 shadow-sm hover:shadow-md hover:-translate-y-1'
                  : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-75'
              }`}
            >
              {/* Rarity Ribbon */}
              {isUnlocked && (
                <div className="absolute top-2 right-2 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {sticker.rarity}
                </div>
              )}

              {/* Icon Container */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-inner ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-900 group-hover:scale-110 transition-transform'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isUnlocked ? sticker.icon : <Lock className="w-6 h-6 text-slate-400" />}
              </div>

              <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight mb-1">
                {sticker.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                {isUnlocked ? sticker.description : 'Completa más clases para desbloquear'}
              </p>
            </button>
          );
        })}
      </div>

      {/* Inspected Sticker Detail Modal */}
      {inspectedSticker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner">
              {unlockedStickerIds.includes(inspectedSticker.id) ? inspectedSticker.icon : '🔒'}
            </div>

            <div>
              <span className="text-[10px] font-black tracking-wider uppercase text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                {inspectedSticker.rarity} · {inspectedSticker.category}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                {inspectedSticker.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {inspectedSticker.description}
              </p>
            </div>

            <button
              onClick={() => setInspectedSticker(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
