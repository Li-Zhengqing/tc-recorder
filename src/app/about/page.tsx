import React from 'react';
import styles from '../page.module.css'

export default function AboutPage() {
  return (
    <div className={styles.main}>
      <h1>About TC Recorder</h1>
      <p>TC Recorder is a data recorder for TwinCAT hosts.</p>
    </div>
  );
}