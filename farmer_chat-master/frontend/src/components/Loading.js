import React from 'react';
import styles from './Loading.module.css';

export function Loading({ message = "Loading..." }) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}

export function LoadingDots() {
  return (
    <div className={styles.dots}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
