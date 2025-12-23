import React from 'react';
import { NotificationProvider } from './context/NotificationContext';
import { NotificationContainer } from './components/NotificationContainer/NotificationContainer';
import { Demo } from './components/Demo/Demo';
import styles from './App.module.css';

function App() {
  return (
    <NotificationProvider>
      <div className={styles.app}>
        <header className={styles.header}>
          <h1 className={styles.title}>Advanced Toast Notification System</h1>
          <p className={styles.subtitle}>Production-grade, stackable notifications with animations</p>
        </header>
        <main className={styles.main}>
          <Demo />
        </main>
        <NotificationContainer />
      </div>
    </NotificationProvider>
  );
}

export default App;

