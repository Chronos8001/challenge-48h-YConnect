import React, { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';

const API_BASE = '/api';

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  return { response, data };
}

function App() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { response, data } = await requestJson('/auth/me.php', {
        method: 'GET',
        headers: {},
      });

      if (response.ok && data.user) {
        setIsLoggedIn(true);
        setUser(data.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }

      setIsBootstrapping(false);
    };

    checkSession();
  }, []);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');

    const { response, data } = await requestJson('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!response.ok || !data.ok) {
      setError(data.message || 'Connexion impossible.');
      setLoading(false);
      return false;
    }

    setIsLoggedIn(true);
    setUser(data.user || null);
    setLoading(false);
    return true;
  };

  const handleSignup = async (payload) => {
    setLoading(true);
    setError('');

    const { response, data } = await requestJson('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok || !data.ok) {
      const message = data.message || (Array.isArray(data.errors) ? data.errors.join(' ') : 'Inscription impossible.');
      setError(message);
      setLoading(false);
      return false;
    }

    const loggedIn = await handleLogin({ email: payload.email, mdp: payload.mdp });
    setLoading(false);
    return loggedIn;
  };

  const handleLogout = async () => {
    await requestJson('/auth/logout.php', { method: 'POST' });
    setIsLoggedIn(false);
    setUser(null);
    setPage('login');
  };

  if (isBootstrapping) {
    return null;
  }

  if (!isLoggedIn) {
    return page === 'login' ? (
      <LoginPage
        onSwitch={() => {
          setError('');
          setPage('signup');
        }}
        onLogin={handleLogin}
        loading={loading}
        error={error}
      />
    ) : (
      <SignupPage
        onSwitch={() => {
          setError('');
          setPage('login');
        }}
        onSignup={handleSignup}
        loading={loading}
        error={error}
      />
    );
  }

  return <HomePage user={user} onLogout={handleLogout} />;
}

export default App;