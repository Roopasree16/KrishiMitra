import React from 'react';
import styles from './Button.module.css';

export function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  const buttonClass = `
    ${styles.button}
    ${styles[`variant-${variant}`]}
    ${styles[`size-${size}`]}
    ${disabled ? styles.disabled : ''}
    ${className}
  `.trim();

  return (
    <button className={buttonClass} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
