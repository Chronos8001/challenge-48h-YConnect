import React, { useEffect, useMemo, useState } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

function App() {
  const [bootLoading, setBootLoading] = useState(true);
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState('');
  const [postLoading, setPostLoading] = useState(false);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState('');
  const [feedSuccess, setFeedSuccess] = useState('');

  const endpoint = useMemo(
    () => ({
      login: '/api/auth/login.php',
      register: '/api/auth/register.php',
      me: '/api/auth/me.php',
      logout: '/api/auth/logout.php',
      listPosts: '/api/posts/list.php',
      createPost: '/api/posts/create.php',
    }),
    [],
  );

  const loadPosts = async () => {
    setFeedError('');
    setFeedLoading(true);
    try {
      const response = await fetch(endpoint.listPosts, { credentials: 'include' });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setFeedError(data.message || 'Impossible de charger le fil.');
        return;
      }

      setPosts(Array.isArray(data.posts) ? data.posts : []);
    } catch {
      setFeedError('Impossible de charger le fil.');
    } finally {
      setFeedLoading(false);
    }
  };

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
      setPosts([]);
      setPostText('');
      setFeedError('');
      setFeedSuccess('');
      setPage('login');
    }
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    setFeedError('');
    setFeedSuccess('');

    if (postText.trim() === '') {
      setFeedError('Ecris un contenu avant de publier.');
      return;
    }

    setPostLoading(true);
    try {
      const response = await fetch(endpoint.createPost, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ contenu: postText.trim(), image_url: null }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setFeedError(data.message || 'Publication refusee.');
        return;
      }

      setPostText('');
      setFeedSuccess('Post publie avec succes.');
      await loadPosts();
    } catch {
      setFeedError('Impossible de publier le post.');
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

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

            <div className="auth-feedback auth-success">Connecte en tant que {user.email}</div>

            <form className="feed-form" onSubmit={handleCreatePost}>
              <textarea
                className="feed-textarea"
                placeholder="Partage ton actualite, projet ou recherche..."
                value={postText}
                onChange={(event) => setPostText(event.target.value)}
                rows={4}
              />
              <button type="submit" className="login-button" disabled={postLoading}>
                {postLoading ? 'Publication...' : 'Publier un post'}
              </button>
            </form>

            {feedError ? <div className="auth-feedback auth-error">{feedError}</div> : null}
            {feedSuccess ? <div className="auth-feedback auth-success">{feedSuccess}</div> : null}

            <div className="feed-list">
              {feedLoading ? (
                <p className="feed-empty">Chargement du fil...</p>
              ) : posts.length === 0 ? (
                <p className="feed-empty">Aucun post pour le moment.</p>
              ) : (
                posts.map((post) => (
                  <article className="feed-item" key={post.id_post}>
                    <div className="feed-author">{post.prenom} {post.nom}</div>
                    <div className="feed-date">{new Date(post.date_publi).toLocaleString('fr-FR')}</div>
                    <p className="feed-content">{post.contenu}</p>
                  </article>
                ))
              )}
            </div>

            <button type="button" className="login-button" onClick={handleLogout}>
              Se deconnecter
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