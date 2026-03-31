import React, { useState } from 'react';
import './LoginPage.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const LoginPage = ({ onSwitch, onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onLogin({ email: email.trim(), mdp: password });
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
                placeholder="votreadressemail@ynov.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {error ? <p className="form-error">{error}</p> : null}

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