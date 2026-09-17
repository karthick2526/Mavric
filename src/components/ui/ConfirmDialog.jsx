import React from 'react';
import { Modal } from './Modal.jsx';
import { AlertCircle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full shrink-0 ${danger ? 'bg-[#C9704C]/20 text-[#C9704C]' : 'bg-[#C4A16A]/20 text-[#C4A16A]'}`}>
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-[#F1E8D7]/80 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#2D2F2A]">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-[#F1E8D7]/70 hover:text-[#F1E8D7] rounded-lg border border-[#2D2F2A] hover:bg-[#2D2F2A] transition-colors cursor-pointer"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors cursor-pointer ${
            danger
              ? 'bg-[#C9704C] hover:bg-[#b05f3d] shadow-lg shadow-[#C9704C]/20'
              : 'bg-[#69745B] hover:bg-[#57614b] shadow-lg shadow-[#69745B]/20'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
