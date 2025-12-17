import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

type ToastSeverity = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  severity?: ToastSeverity;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    ({ message, severity = 'info', duration = 3000 }: Omit<Toast, 'id'>) => {
      const id = uuidv4();
      setToasts((prev) => [...prev, { id, message, severity, duration }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toasts.map((toast) => {
        const isSuccess = toast.severity === 'success';
        return (
          <Snackbar
            key={toast.id}
            open
            autoHideDuration={toast.duration}
            onClose={() => removeToast(toast.id)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={() => removeToast(toast.id)}
              severity={toast.severity as AlertColor}
              variant="outlined"
              sx={{
                backgroundColor: '#fdfcf3',
                borderColor: isSuccess ? 'green' : undefined,
                color: 'inherit',
                '& .MuiAlert-icon': {
                  color: isSuccess ? 'green' : undefined,
                },
              }}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        );
      })}
    </ToastContext.Provider>
  );
};
