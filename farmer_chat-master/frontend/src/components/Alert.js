import React from 'react';
import styles from './Alert.module.css';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export function Alert({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  icon: IconComponent,
  actions 
}) {
  const iconMap = {
    error: AlertCircle,
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = IconComponent || iconMap[type] || Info;

  return (
    <div className={`${styles.alert} ${styles[`alert-${type}`]}`}>
      <div className={styles.content}>
        <Icon className={styles.icon} />
        <div className={styles.textContent}>
          {title && <h4 className={styles.title}>{title}</h4>}
          {message && <p className={styles.message}>{message}</p>}
        </div>
      </div>
      
      {(actions || onClose) && (
        <div className={styles.actions}>
          {actions}
          {onClose && (
            <button 
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close alert"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
