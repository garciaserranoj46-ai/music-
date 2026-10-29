import React, { useState } from 'react';
import { Award, Printer, X, Sparkles, CheckCircle } from 'lucide-react';
import { UserStats } from '../../types';

interface DiplomaModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onUpdateName: (newName: string) => void;
}

export const DiplomaModal: React.FC<DiplomaModalProps> = ({
  isOpen,
  onClose,
  userStats,
  onUpdateName
}) => {
  const [editingName, setEditingName] = useState(userStats.playerName);
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handleSaveName = () => {
    onUpdateName(editingName.trim() || 'Pequeño Músico');
    setIsEditing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Controls (Not printed) */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold text-slate-800">
              Certificado Oficial de Logro Musical
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Diploma Certificate Canvas */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/30 text-center relative border-8 border-double border-amber-300 m-4 rounded-2xl shadow-inner">
          {/* Corner flourish ornaments */}
          <div className="absolute top-3 left-3 text-2xl text-amber-500 select-none">𝄞</div>
          <div className="absolute top-3 right-3 text-2xl text-amber-500 select-none">𝄢</div>
          <div className="absolute bottom-3 left-3 text-2xl text-amber-500 select-none">𝅗𝅥</div>
          <div className="absolute bottom-3 right-3 text-2xl text-amber-500 select-none">♫</div>

          {/* Badge Trophy */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-2 border-amber-400 bg-amber-100 ring-4 ring-amber-200">
            <img
              src="/src/assets/images/badge_master_musician_1793315906021.jpg"
              alt="Insignia de Excelencia Musical"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <span className="text-xs font-black tracking-widest uppercase text-amber-700">
            Academia de Música Infantil · Melodía Mágica
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-display">
            DIPLOMA DE MAESTRO MUSICAL
          </h2>

          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
            Este certificado de honor se otorga con orgullo a:
          </p>

          {/* Name Display & Edit */}
          <div className="my-4">
            {!isEditing ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-amber-950 underline decoration-amber-400 decoration-2 underline-offset-8">
                  {userStats.playerName}
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[11px] text-amber-700 hover:underline font-semibold print:hidden cursor-pointer"
                >
                  (Cambiar nombre)
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 max-w-xs mx-auto print:hidden">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="px-3 py-1.5 text-sm font-bold border border-amber-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Tu Nombre"
                />
                <button
                  onClick={handleSaveName}
                  className="px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mt-4">
            Por su dedicación, alegría y asombroso talento aprendiendo las notas del pentagrama,
            el pulso del ritmo y la magia de las canciones infantiles.
          </p>

          {/* Achievement stats row */}
          <div className="flex justify-center gap-6 mt-6 py-3 border-y border-amber-200/60 max-w-md mx-auto text-xs font-bold text-slate-700">
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Estrellas</p>
              <p className="text-amber-600 font-mono text-sm">{userStats.stars} ⭐</p>
            </div>
            <div className="w-px bg-amber-200" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Notas Doradas</p>
              <p className="text-emerald-600 font-mono text-sm">{userStats.coins} 🎵</p>
            </div>
            <div className="w-px bg-amber-200" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Pegatinas</p>
              <p className="text-indigo-600 font-mono text-sm">{userStats.unlockedStickers.length} 🏆</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="flex justify-around items-end mt-8 pt-4">
            <div className="flex flex-col items-center">
              <div className="w-28 border-b border-slate-400 pb-1 font-serif text-sm italic text-slate-600">
                Maestro Búho
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                Director Pedagógico
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-100 flex items-center justify-center text-amber-800 font-black text-xs shadow-sm">
                SELLO
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                Aprobado con Honor
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
