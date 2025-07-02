// src/components/AuthGate.jsx
import React, { useState, useEffect } from 'react';
import styles from '../styles/AuthGate.module.css';

const PASSWORD_KEY = 'price-list-auth';

export default function AuthGate({ children }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(PASSWORD_KEY));
    if (saved && saved.expires > Date.now()) {
      setAuthed(true);
    }
  }, []);

  const handleLogin = () => {
    if (password === '1234') {
      const expires = Date.now() + 1000 * 60 * 60 * 12; // 12 hours
      localStorage.setItem(PASSWORD_KEY, JSON.stringify({ expires }));
      setAuthed(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (authed) return children;

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2 style={{ color: '#0846c4' }}>
          Enter Password
        </h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleLogin}>Continue</button>
      </div>
    </div>
  );
}
