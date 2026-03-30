import React, { useState } from 'react';
import './LoginPage.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const LoginPage = ({ onSwitch, endpoint, onLoginSuccess }) => {
  const [form, setForm] = useState({ email: '', mdp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(endpoint.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.message || 'Connexion refusée.');
        return;
      }

      onLoginSuccess(data.user);
    } catch {
      setError('Impossible de joindre le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="avatar-placeholder">
          <img src="/avatar.png" alt="Avatar Ynov" className="avatar-img" />
        </div>
        
        <h1 className="welcome-title">
          <span className="text-black">Bienvenue sur votre</span><br/>
          <span className="text-gradient">réseau social </span>
          <span className="text-teal">Ynov.</span>
        </h1>
      </div>

      <div className="right-side">
        <div className="login-card">
          <div className="logo-placeholder">
             <img src="/logo-ynov.png" alt="Logo Ynov" className="logo-img" />
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="votreadressemail@ynov.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="mdp"
                placeholder="Mot de passe"
                value={form.mdp}
                onChange={handleChange}
                required
              />
            </div>

            {error ? <div className="auth-feedback auth-error">{error}</div> : null}

            <div className="form-actions">
              <a 
                href="#creer" 
                className="create-account"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitch();
                }}
              >
                Créez un compte.
              </a>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;