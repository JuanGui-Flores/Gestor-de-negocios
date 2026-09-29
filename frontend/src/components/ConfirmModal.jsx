import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
        <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title || '¿Estás seguro?'}</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          {message || 'Esta acción eliminará el elemento de forma permanente y no se podrá deshacer.'}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 rounded-xl text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-medium py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-rose-600/20"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}