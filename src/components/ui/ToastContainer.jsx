import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[#69745B]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#C4A16A]" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-[#C9704C]" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-[#75677D]" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success': return 'border-[#69745B]/40';
      case 'warning': return 'border-[#C4A16A]/40';
      case 'error': return 'border-[#C9704C]/40';
      default: return 'border-[#2D2F2A]';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-[#20221D] border ${getBorderColor(
              t.type
            )} shadow-xl shadow-black/40 text-[#F1E8D7] backdrop-blur-md`}
          >
            <div className="mt-0.5 shrink-0">{getIcon(t.type)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-wide text-[#F1E8D7]">{t.title}</h4>
              {t.message && <p className="text-xs text-[#F1E8D7]/75 mt-0.5 leading-relaxed">{t.message}</p>}
              {t.action && (
                <button
                  type="button"
                  onClick={() => {
                    t.action.onClick();
                    removeToast(t.id);
                  }}
                  className="mt-2 text-xs font-medium text-[#C4A16A] hover:underline cursor-pointer"
                >
                  {t.action.label}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-[#F1E8D7]/40 hover:text-[#F1E8D7] transition-colors p-1 -mr-1 -mt-1 cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
