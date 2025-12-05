"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX, FiAlertTriangle } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface EnhancedToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const toastIcons = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
  warning: FiAlertTriangle,
};

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
};

export default function EnhancedToast({ toasts, onRemove }: EnhancedToastProps) {
  console.log("EnhancedToast: Rendering with", toasts.length, "toasts");

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const Icon = toastIcons[toast.type];

  useEffect(() => {
    console.log("ToastItem: Setting up auto-dismiss for", toast.id);
    
    const timer = setTimeout(() => {
      if (!isRemoving) {
        handleRemove();
      }
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, isRemoving]);

  const handleRemove = () => {
    console.log("ToastItem: Removing toast", toast.id);
    setIsRemoving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ 
        opacity: isRemoving ? 0 : 1, 
        x: isRemoving ? 300 : 0,
        scale: isRemoving ? 0.8 : 1
      }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative overflow-hidden rounded-lg border shadow-lg backdrop-blur-sm
        ${toastStyles[toast.type]}
      `}
    >
      {/* Progress bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: toast.duration ? toast.duration / 1000 : 5, ease: "linear" }}
        className="absolute top-0 left-0 h-1 bg-current opacity-30"
      />

      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${iconStyles[toast.type]}`} />
          </div>
          
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-semibold">
              {toast.title}
            </h3>
            {toast.message && (
              <p className="text-sm opacity-90 mt-1">
                {toast.message}
              </p>
            )}
            
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    toast.action!.onClick();
                    handleRemove();
                  }}
                  className="text-sm font-medium underline hover:no-underline transition-all"
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleRemove}
            className="ml-4 flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Toast context and hook
import { createContext, useContext, ReactNode } from 'react';

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    console.log("ToastProvider: Adding toast", id);
    
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    console.log("ToastProvider: Removing toast", id);
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <EnhancedToast toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}