import React, { useEffect, useMemo, useState } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

function App() {
  const [bootLoading, setBootLoading] = useState(true);
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  const endpoint = useMemo(
    () => ({
      login: '/api/auth/login.php',
      register: '/api/auth/register.php',
      me: '/api/auth/me.php',
      logout: '/api/auth/logout.php',
    }),
    [],
  );

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(endpoint.me, { credentials: 'include' });
        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        if (data.ok) {
          setUser(data.user);
        }
      } catch {
        setUser(null);
      } finally {
        setBootLoading(false);
      }
    };

    fetchSession();
  }, [endpoint.me]);

  const handleLogout = async () => {
    try {
      await fetch(endpoint.logout, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null);
      setPage('login');
    }
  };

  if (bootLoading) {
    return (
      <div className="login-container">
        <div className="left-side">
          <div className="avatar-placeholder">
            <img src="/avatar.png" alt="Avatar Ynov" className="avatar-img" />
          </div>
          <h1 className="welcome-title">
            <span className="text-black">Bienvenue sur votre</span>
            <br />
            <span className="text-gradient">réseau social </span>
            <span className="text-teal">Ynov.</span>
          </h1>
        </div>
        <div className="right-side">
          <div className="login-card">
            <p>Chargement de la session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="login-container">
        <div className="left-side">
          <div className="avatar-placeholder">
            <img src="/avatar.png" alt="Avatar Ynov" className="avatar-img" />
          </div>
          <h1 className="welcome-title">
            <span className="text-black">Bienvenue </span>
            <br />
            <span className="text-gradient">{user.prenom} {user.nom}</span>
          </h1>
        </div>

        <div className="right-side">
          <div className="login-card">
            <div className="logo-placeholder">
              <img src="/logo-ynov.png" alt="Logo Ynov" className="logo-img" />
            </div>
            <div className="auth-feedback auth-success">Connecté en tant que {user.email}</div>
            <button type="button" className="login-button" onClick={handleLogout}>
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {page === 'login' ? (
        <LoginPage
          onSwitch={() => setPage('signup')}
          endpoint={endpoint}
          onLoginSuccess={(loggedUser) => setUser(loggedUser)}
        />
      ) : (
        <SignupPage onSwitch={() => setPage('login')} endpoint={endpoint} />
      )}
    </>
  );
}

export default App;