import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (title: string, message?: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((title: string, message?: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = (title: string, message?: string) => addToast(title, message, 'success');
  const error = (title: string, message?: string) => addToast(title, message, 'error');
  const info = (title: string, message?: string) => addToast(title, message, 'info');
  const warning = (title: string, message?: string) => addToast(title, message, 'warning');

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info, warning }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-fade-in ${
              t.type === 'success'
                ? 'bg-amber-950/90 border-amber-500/40 text-amber-50 shadow-amber-950/40'
                : t.type === 'error'
                ? 'bg-red-950/90 border-red-500/40 text-red-50 shadow-red-950/40'
                : t.type === 'warning'
                ? 'bg-orange-950/90 border-orange-500/40 text-orange-50 shadow-orange-950/40'
                : 'bg-stone-900/90 border-stone-700/50 text-stone-100 shadow-black/40'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
              {t.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-400" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-400" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-coffee-300" />}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm leading-tight">{t.title}</p>
              {t.message && <p className="text-xs opacity-90 mt-1">{t.message}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-md hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
