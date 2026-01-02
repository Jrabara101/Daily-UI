
import React, { useEffect, useRef } from 'react';
import { ConfirmationDialogProps } from '../types';
import { Portal } from './Portal';
import { AlertTriangle, Info, CheckCircle, AlertCircle, X } from 'lucide-react';

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  variant = 'default',
  size = 'md',
  isLoading = false,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus management: Focus the first button (usually Cancel/Confirm)
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onCancel();
        // Simple focus trap: lock tab within the dialog
        if (e.key === 'Tab') {
          const focusableElements = dialogRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements && focusableElements.length > 0) {
            const first = focusableElements[0] as HTMLElement;
            const last = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey && document.activeElement === first) {
              last.focus();
              e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  const variantIcons = {
    danger: <AlertTriangle className="w-6 h-6 text-red-600" />,
    success: <CheckCircle className="w-6 h-6 text-emerald-600" />,
    warning: <AlertCircle className="w-6 h-6 text-amber-600" />,
    info: <Info className="w-6 h-6 text-blue-600" />,
    default: <Info className="w-6 h-6 text-slate-600" />,
  };

  const confirmBtnClasses = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    success: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
    warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    default: 'bg-slate-900 hover:bg-slate-800 focus:ring-slate-500',
  };

  return (
    <Portal>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
        aria-hidden="true"
      >
        <div
          ref={dialogRef}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          className={`w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden animate-in zoom-in-95 duration-200 scale-100 transform transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-0">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${
                variant === 'danger' ? 'bg-red-50' : 
                variant === 'success' ? 'bg-emerald-50' :
                variant === 'warning' ? 'bg-amber-50' :
                variant === 'info' ? 'bg-blue-50' : 'bg-slate-50'
              }`}>
                {variantIcons[variant]}
              </div>
              <h2 id="dialog-title" className="text-xl font-bold text-slate-900 leading-tight">
                {title}
              </h2>
            </div>
            <button 
              onClick={onCancel}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 pt-4">
            <p id="dialog-description" className="text-slate-600 leading-relaxed text-base">
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="p-6 pt-2 flex flex-col sm:flex-row-reverse gap-3">
            <button
              ref={firstFocusableRef}
              disabled={isLoading}
              onClick={onConfirm}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-white font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${confirmBtnClasses[variant]}`}
            >
              {isLoading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {confirmButtonText}
            </button>
            <button
              disabled={isLoading}
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-slate-600 font-semibold bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              {cancelButtonText}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default ConfirmationDialog;
