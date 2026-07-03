import React from 'react';
import styles from './Badge.module.css';

export function Badge({
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  const badgeClass = `
    ${styles.badge}
    ${styles[`variant-${variant}`]}
    ${className}
  `.trim();

  return (
    <span className={badgeClass} {...props}>
      {children}
    </span>
  );
}
