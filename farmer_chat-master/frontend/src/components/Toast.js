import React, { useState, useEffect } from 'react';
import styles from './Toast.module.css';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export function Toast({ type = 'info', message, duration = 3000, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = iconMap[type] || Info;

  return (
    <div className={`${styles.toast} ${styles[`toast-${type}`]} ${isClosing ? styles.closing : ''}`}>
      <Icon className={styles.icon} />
      <p className={styles.message}>{message}</p>
      <button
        className={styles.closeBtn}
        onClick={() => {
          setIsClosing(true);
          setTimeout(onClose, 300);
        }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
