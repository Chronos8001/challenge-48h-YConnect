import React, { useState } from 'react';
import './SignupPage.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const SignupPage = ({ onSwitch, endpoint }) => {
  const [form, setForm] = useState({
    email: '',
    mdp: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const inferIdentityFromEmail = (email) => {
    const local = (email.split('@')[0] || '').trim();
    const cleaned = local.replace(/[._-]+/g, ' ').trim();
    const parts = cleaned.length > 0 ? cleaned.split(/\s+/) : ['Utilisateur'];
    const prenom = parts[0] || 'Utilisateur';
    const nom = parts.slice(1).join(' ') || prenom;
    return { nom, prenom };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (form.mdp.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (form.mdp !== form.confirm) {
      setError('La confirmation du mot de passe ne correspond pas.');
      return;
    }

    const identity = inferIdentityFromEmail(form.email);

    setLoading(true);
    try {
      const response = await fetch(endpoint.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nom: identity.nom,
          prenom: identity.prenom,
          email: form.email,
          mdp: form.mdp,
          filiere: null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.message || (data.errors ? data.errors.join(' ') : 'Inscription refusée.'));
        return;
      }

      setSuccess('Inscription réussie. Vous pouvez maintenant vous connecter.');
      setForm({ email: '', mdp: '', confirm: '' });
    } catch {
      setError('Impossible de joindre le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
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
        <div className="signup-card">
          <div className="logo-placeholder">
             <img src="/logo-ynov.png" alt="Logo Ynov" className="logo-img" />
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
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

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="confirm"
                placeholder="Confirmer le mot de passe"
                value={form.confirm}
                onChange={handleChange}
                required
              />
            </div>

            {error ? <div className="auth-feedback auth-error">{error}</div> : null}
            {success ? <div className="auth-feedback auth-success">{success}</div> : null}

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