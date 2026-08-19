import React from 'react';
import { AlertCircle, CheckCircle2, Trash2, HelpCircle } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Yes, Confirm",
  cancelText = "No, Cancel",
  type = "primary", // 'primary' | 'danger' | 'warning' | 'success'
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 className="w-10 h-10 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-10 h-10 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="w-10 h-10 text-emerald-600" />;
      default:
        return <HelpCircle className="w-10 h-10 text-navy" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white';
      default:
        return 'bg-gold hover:bg-gold-hover text-navy-dark';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans text-slate-800 border border-slate-100">
        
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-slate-100 rounded-full">
            {getIcon()}
          </div>
          <h3 className="text-xl font-bold text-navy tracking-tight">{title}</h3>
          <p className="font-serif text-slate-600 text-xs sm:text-sm leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-4 flex justify-center space-x-3 text-xs font-sans">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors uppercase tracking-wider"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className={`px-6 py-2.5 font-bold rounded-xl shadow transition-colors uppercase tracking-wider ${getConfirmButtonStyle()}`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};
