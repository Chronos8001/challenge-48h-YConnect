import React, { useState } from 'react';
import './SignupPage.css';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import avatarImage from '../assets/images/avatar.png';
import logoYnovImage from '../assets/images/logo-ynov.png';

const SignupPage = ({ onSwitch, onSignup, loading, error }) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== passwordConfirm) {
      setLocalError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLocalError('');
    await onSignup({
      nom: nom.trim(),
      prenom: prenom.trim(),
      email: email.trim(),
      mdp: password,
      filiere: '',
    });
  };

  return (
    <div className="signup-container">
      <div className="left-side">
        <div className="avatar-placeholder">
          <img src={avatarImage} alt="Avatar Ynov" className="avatar-img" />
        </div>
        
        <h1 className="welcome-title">
          <span className="text-black">Bienvenue sur votre</span><br/>
          <span className="text-gradient">réseau social </span>
          <span className="text-teal">Ynov.</span>
        </h1>
      </div>

      <div className="right-side">
        <div className="signup-card">
          <div className="logo-placeholder">
             <img src={logoYnovImage} alt="Logo Ynov" className="logo-img" />
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Nom"
                value={nom}
                onChange={(event) => setNom(event.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Prenom"
                value={prenom}
                onChange={(event) => setPrenom(event.target.value)}
                required
              />
            </div>

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

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                required
              />
            </div>

            {localError ? <p className="form-error">{localError}</p> : null}
            {!localError && error ? <p className="form-error">{error}</p> : null}

            <div className="form-actions">
              <a 
                href="#connexion" 
                className="back-to-login"
                onClick={(e) => {
                  e.preventDefault(); 
                  onSwitch();         
                }}
              >
                Se connecter.
              </a>
            </div>

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;