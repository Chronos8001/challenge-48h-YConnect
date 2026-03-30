import React, { useEffect, useMemo, useState } from 'react';
import './HomePage.css';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import AddFriendButton from '../components/AddFriendButton';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';
import UserCardShort from '../components/UserCardShort';

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

const HomePage = ({ user, onLogout }) => {
  const [rightPanel, setRightPanel] = useState('contacts');
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [postError, setPostError] = useState('');
  const [postActionError, setPostActionError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(0);

  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [removedContactIds, setRemovedContactIds] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(0);
  const [messages, setMessages] = useState([]);
  const [chatDraft, setChatDraft] = useState('');
  const [chatError, setChatError] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const [news, setNews] = useState([]);
  const [profileDescription, setProfileDescription] = useState('');
  const [profileFiliere, setProfileFiliere] = useState('');
  const [profileSkillsText, setProfileSkillsText] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const userName = useMemo(() => {
    if (!user) {
      return 'Utilisateur';
    }
    return `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Utilisateur';
  }, [user]);

  const visibleContacts = useMemo(() => {
    const filtered = contacts.filter((contact) => !removedContactIds.includes(contact.id_user));
    if (!searchTerm.trim()) {
      return filtered;
    }
    return filtered.filter((contact) => {
      const fullName = `${contact.prenom || ''} ${contact.nom || ''}`.trim().toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
  }, [contacts, removedContactIds, searchTerm]);

  const removedContacts = useMemo(() => {
    const list = contacts.filter((contact) => removedContactIds.includes(contact.id_user));
    if (!searchTerm.trim()) {
      return list;
    }
    return list.filter((contact) => {
      const fullName = `${contact.prenom || ''} ${contact.nom || ''}`.trim().toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
  }, [contacts, removedContactIds, searchTerm]);

  const selectedContact = useMemo(
    () => visibleContacts.find((contact) => contact.id_user === selectedContactId) || null,
    [visibleContacts, selectedContactId],
  );

  const loadPosts = async () => {
    setIsLoadingPosts(true);
    const { response, data } = await requestJson('/posts/list.php', {
      method: 'GET',
      headers: {},
    });

    if (response.ok && data.ok && Array.isArray(data.posts)) {
      setPosts(data.posts);
    }

    setIsLoadingPosts(false);
  };

  const loadNews = async () => {
    const { response, data } = await requestJson('/news/list.php', {
      method: 'GET',
      headers: {},
    });

    if (response.ok && data.ok && Array.isArray(data.news)) {
      setNews(data.news);
    }
  };

  const loadContacts = async () => {
    const { response, data } = await requestJson('/messages/users.php', {
      method: 'GET',
      headers: {},
    });

    if (response.ok && data.ok && Array.isArray(data.users)) {
      setContacts(data.users);
    }
  };

  const loadProfile = async () => {
    const { response, data } = await requestJson('/profile/me.php', {
      method: 'GET',
      headers: {},
    });

    if (response.ok && data.ok && data.profile) {
      setProfileDescription(data.profile.description || '');
      setProfileFiliere(data.profile.filiere || user?.filiere || '');
      setProfileSkillsText(Array.isArray(data.profile.competences) ? data.profile.competences.join(', ') : '');
    }
  };

  const loadUserSearch = async (query) => {
    if (!query.trim()) {
      setSearchedUsers([]);
      setIsSearchingUsers(false);
      return;
    }

    setIsSearchingUsers(true);
    const { response, data } = await requestJson(`/users/search.php?q=${encodeURIComponent(query.trim())}`, {
      method: 'GET',
      headers: {},
    });

    if (response.ok && data.ok && Array.isArray(data.users)) {
      setSearchedUsers(data.users);
    } else {
      setSearchedUsers([]);
    }

    setIsSearchingUsers(false);
  };

  const loadThread = async (otherUserId) => {
    if (!otherUserId) {
      setMessages([]);
      return;
    }

    const { response, data } = await requestJson(`/messages/thread.php?user_id=${otherUserId}`, {
      method: 'GET',
      headers: {},
    });

    if (response.ok && data.ok && Array.isArray(data.messages)) {
      setMessages(data.messages);
    } else {
      setMessages([]);
    }
  };

  useEffect(() => {
    loadPosts();
    loadNews();
    loadContacts();
    loadProfile();
  }, []);

  useEffect(() => {
    if (!selectedContactId && visibleContacts.length > 0) {
      setSelectedContactId(visibleContacts[0].id_user);
    }
  }, [visibleContacts, selectedContactId]);

  useEffect(() => {
    if (!selectedContactId) {
      return;
    }
    loadThread(selectedContactId);
  }, [selectedContactId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadUserSearch(searchTerm);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePublishPost = async (event) => {
    event.preventDefault();
    if (!postContent.trim()) {
      setPostError('Le contenu du post est obligatoire.');
      return;
    }

    setIsPublishing(true);
    setPostError('');

    const { response, data } = await requestJson('/posts/create.php', {
      method: 'POST',
      body: JSON.stringify({
        contenu: postContent.trim(),
        image_url: '',
      }),
    });

    if (!response.ok || !data.ok) {
      setPostError(data.message || 'Impossible de publier ce post.');
      setIsPublishing(false);
      return;
    }

    setPostContent('');
    setIsPublishing(false);
    loadPosts();
  };

  const handleOpenConversation = (contact) => {
    setRemovedContactIds((previous) => previous.filter((id) => id !== contact.id_user));
    setSelectedContactId(contact.id_user);
    setRightPanel('chat');
  };

  const handleDeletePost = async (postId) => {
    setPostActionError('');
    setDeletingPostId(postId);

    const { response, data } = await requestJson('/posts/delete.php', {
      method: 'POST',
      body: JSON.stringify({ id_post: postId }),
    });

    if (!response.ok || !data.ok) {
      setPostActionError(data.message || 'Impossible de supprimer ce post.');
      setDeletingPostId(0);
      return;
    }

    setDeletingPostId(0);
    loadPosts();
  };

  const handleRemoveFriend = (contact) => {
    setRemovedContactIds((previous) => {
      if (previous.includes(contact.id_user)) {
        return previous;
      }
      return [...previous, contact.id_user];
    });

    if (selectedContactId === contact.id_user) {
      const next = visibleContacts.find((item) => item.id_user !== contact.id_user);
      setSelectedContactId(next?.id_user || 0);
      setMessages([]);
      setChatDraft('');
    }
  };

  const handleAddFriend = (contact) => {
    setRemovedContactIds((previous) => previous.filter((id) => id !== contact.id_user));
    if (!selectedContactId) {
      setSelectedContactId(contact.id_user);
    }
  };

  const handleSendMessage = async (rawText) => {
    const text = rawText.trim();
    if (!selectedContactId || !text) {
      return;
    }

    setIsSendingMessage(true);
    setChatError('');

    const { response, data } = await requestJson('/messages/send.php', {
      method: 'POST',
      body: JSON.stringify({
        destinataire_id: selectedContactId,
        message_text: text,
      }),
    });

    if (!response.ok || !data.ok) {
      setChatError(data.message || 'Impossible d\'envoyer le message.');
      setIsSendingMessage(false);
      return;
    }

    setChatDraft('');
    setIsSendingMessage(false);
    await loadThread(selectedContactId);
    loadContacts();
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage('');

    const competences = profileSkillsText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const { response, data } = await requestJson('/profile/update.php', {
      method: 'POST',
      body: JSON.stringify({
        description: profileDescription,
        filiere: profileFiliere,
        competences,
      }),
    });

    if (!response.ok || !data.ok) {
      setProfileMessage(data.message || 'Erreur de sauvegarde du profil.');
      setIsSavingProfile(false);
      return;
    }

    setProfileMessage('Profil mis a jour avec succes.');
    setIsSavingProfile(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'A l\'instant';
    }
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return 'A l\'instant';
    }
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="home-container">
      <header className="app-header">
        <div className="header-left">
          <div className="logo-box" onClick={() => setRightPanel('contacts')}>
            <img src="/logo-ynov.png" alt="Ynov" className="logo-img" />
          </div>
        </div>

        <div className="header-center">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        <div className="header-right">
          <div className="nav-container">
            <nav className="menu-icons">
              <button className={`nav-btn ${rightPanel === 'add' ? 'active' : ''}`} onClick={() => setRightPanel('add')}>
                <img src="/icon-post.svg" alt="Ajouts" />
              </button>
              <button className={`nav-btn ${rightPanel === 'chat' ? 'active' : ''}`} onClick={() => setRightPanel('chat')}>
                <img src="/icon-message.svg" alt="Chat" />
              </button>
              <button className={`nav-btn ${rightPanel === 'contacts' ? 'active' : ''}`} onClick={() => setRightPanel('contacts')}>
                <img src="/icon-friends.svg" alt="Contacts" />
              </button>
            </nav>
            <button type="button" className="ymatch-nav-btn" onClick={() => setRightPanel('ymatch')}>
              Ymatch
            </button>
            <div className="user-profile" onClick={() => setRightPanel('profile')}>
              <img src="/avatar.png" alt="Me" className="header-avatar" />
            </div>
            <button type="button" className="logout-btn" onClick={onLogout}>
              Deconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="main-layout">
        <aside className="left-column">
          <form className="composer-card" onSubmit={handlePublishPost}>
            <textarea
              value={postContent}
              onChange={(event) => setPostContent(event.target.value)}
              placeholder="Quoi de neuf aujourd'hui ?"
              rows={3}
            />
            {postError ? <p className="form-error">{postError}</p> : null}
            <div className="composer-actions">
              <button type="submit" className="publish-btn" disabled={isPublishing}>
                {isPublishing ? 'Publication...' : 'Publier'}
              </button>
            </div>
          </form>

          {isLoadingPosts ? <p className="status-text">Chargement du fil...</p> : null}
          {!isLoadingPosts && posts.length === 0 ? <p className="status-text">Aucun post pour le moment.</p> : null}
          {postActionError ? <p className="form-error">{postActionError}</p> : null}

          {posts.map((post) => (
            <div className="post-card" key={post.id_post}>
              <div className="post-top">
                <div className="user-info">
                  <img src={post.image_profile || '/avatar.png'} alt="Auteur" className="mini-avatar" />
                  <div className="user-text">
                    <h3>{`${post.prenom || ''} ${post.nom || ''}`.trim() || userName}</h3>
                    <p>Poste le {formatDate(post.date_publi)}.</p>
                  </div>
                </div>
                <div className="post-actions">
                  {Number(post.id_auteur) === Number(user?.id_user) ? (
                    <button
                      type="button"
                      className="panel-action-btn danger"
                      disabled={deletingPostId === post.id_post}
                      onClick={() => handleDeletePost(post.id_post)}
                    >
                      {deletingPostId === post.id_post ? 'Suppression...' : 'Supprimer'}
                    </button>
                  ) : null}
                  <FaChevronDown className="icon-grey" />
                </div>
              </div>
              <div className="post-content">{post.contenu}</div>
            </div>
          ))}
        </aside>

        <section className="right-column">
          <div className="dynamic-panel">
            {rightPanel === 'contacts' && (
              <div className="panel-inner">
                <div className="panel-title-row">
                  <h3>Mes amis</h3>
                  <span>{visibleContacts.length}</span>
                </div>

                {searchTerm.trim() ? (
                  <div className="search-results-box">
                    <h4>Resultats de recherche</h4>
                    {isSearchingUsers ? <p className="status-text">Recherche en cours...</p> : null}
                    {!isSearchingUsers && searchedUsers.length === 0 ? (
                      <p className="status-text">Aucun utilisateur trouve.</p>
                    ) : null}
                    {!isSearchingUsers && searchedUsers.map((result) => (
                      <div className="contact-row compact" key={`search-${result.id_user}`}>
                        <UserCardShort
                          name={`${result.prenom || ''} ${result.nom || ''}`.trim() || 'Etudiant'}
                          role={result.filiere || result.email || 'Etudiant Ynov'}
                        />
                        <button type="button" className="panel-action-btn" onClick={() => handleOpenConversation(result)}>
                          Ecrire
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                {visibleContacts.length === 0 ? <p className="status-text">Aucun ami actif.</p> : null}

                {visibleContacts.map((contact) => (
                  <div className="contact-row" key={contact.id_user}>
                    <UserCardShort
                      name={`${contact.prenom || ''} ${contact.nom || ''}`.trim() || 'Etudiant'}
                      role={contact.filiere || 'Etudiant Ynov'}
                    />
                    <button type="button" className="panel-action-btn" onClick={() => handleOpenConversation(contact)}>
                      Ecrire
                    </button>
                    <button type="button" className="panel-action-btn danger" onClick={() => handleRemoveFriend(contact)}>
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}

            {rightPanel === 'chat' && (
              <div className="panel-inner">
                <div className="panel-title-row">
                  <h3>Messagerie</h3>
                  <span>
                    {selectedContact
                      ? `${selectedContact.prenom || ''} ${selectedContact.nom || ''}`.trim()
                      : 'Aucun contact'}
                  </span>
                </div>

                <div className="chat-users">
                  {visibleContacts.map((contact) => (
                    <button
                      key={contact.id_user}
                      type="button"
                      className={`chat-user-chip ${selectedContactId === contact.id_user ? 'active' : ''}`}
                      onClick={() => setSelectedContactId(contact.id_user)}
                    >
                      {`${contact.prenom || ''} ${contact.nom || ''}`.trim()}
                    </button>
                  ))}
                </div>

                <div className="chat-thread">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id_message}
                      text={message.message_text}
                      isMine={Number(message.id_expediteur) === Number(user?.id_user)}
                    />
                  ))}
                  {messages.length === 0 ? <p className="status-text">Aucun message pour le moment.</p> : null}
                </div>

                {chatError ? <p className="form-error padded">{chatError}</p> : null}
                <ChatInput
                  placeholder="Ecris un message..."
                  value={chatDraft}
                  onChange={setChatDraft}
                  onSubmit={handleSendMessage}
                  disabled={!selectedContactId || isSendingMessage}
                />
              </div>
            )}

            {rightPanel === 'add' && (
              <div className="panel-inner">
                <div className="panel-title-row">
                  <h3>Ajouter des amis</h3>
                  <span>{removedContacts.length}</span>
                </div>

                {removedContacts.length === 0 ? (
                  <p className="status-text">Aucun profil a re-ajouter actuellement.</p>
                ) : null}

                {removedContacts.map((contact) => (
                  <div className="contact-row" key={contact.id_user}>
                    <UserCardShort
                      name={`${contact.prenom || ''} ${contact.nom || ''}`.trim() || 'Etudiant'}
                      role={contact.filiere || 'Etudiant Ynov'}
                    />
                    <AddFriendButton onClick={() => handleAddFriend(contact)} />
                  </div>
                ))}
              </div>
            )}

            {rightPanel === 'profile' && (
              <div className="panel-inner">
                <div className="panel-title-row">
                  <h3>Mon profil</h3>
                </div>

                <div className="profile-summary">
                  <img src="/avatar.png" alt="Mon profil" className="mini-avatar" />
                  <div className="contact-info">
                    <h4>{userName}</h4>
                    <p>{user?.email || ''}</p>
                  </div>
                </div>

                <form className="profile-form" onSubmit={handleSaveProfile}>
                  <label htmlFor="filiere">Filiere</label>
                  <input
                    id="filiere"
                    type="text"
                    value={profileFiliere}
                    onChange={(event) => setProfileFiliere(event.target.value)}
                    placeholder="Ex: Informatique"
                  />

                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    rows={3}
                    value={profileDescription}
                    onChange={(event) => setProfileDescription(event.target.value)}
                    placeholder="Parle de ton parcours, tes projets, tes objectifs."
                  />

                  <label htmlFor="skills">Competences (separees par des virgules)</label>
                  <input
                    id="skills"
                    type="text"
                    value={profileSkillsText}
                    onChange={(event) => setProfileSkillsText(event.target.value)}
                    placeholder="React, PHP, UI Design, SQL"
                  />

                  <button type="submit" className="publish-btn" disabled={isSavingProfile}>
                    {isSavingProfile ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </form>
                {profileMessage ? <p className="status-text">{profileMessage}</p> : null}
              </div>
            )}

            {rightPanel === 'ymatch' && (
              <div className="panel-inner">
                <div className="panel-title-row">
                  <h3>Job Board Ymatch</h3>
                </div>

                <div className="ymatch-panel">
                  <p>Consulte les offres de stage et alternance adaptees a ton profil et ta filiere.</p>
                  <a className="ymatch-link" href="https://www.ymatch.fr" target="_blank" rel="noreferrer">
                    Ouvrir Ymatch
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="news-panel">
            <div className="panel-title-row">
              <h3>News d'Ynov</h3>
              <span>{news.length}</span>
            </div>

            {news.length === 0 ? <p className="status-text">Aucune news disponible.</p> : null}

            {news.map((item) => (
              <article key={item.id_news} className="news-item">
                <div className="news-item-head">
                  <strong>{item.titre}</strong>
                  <span className="news-badge">{item.type_event}</span>
                </div>
                <p>{item.description}</p>
                <small>{item.date_event ? formatDate(item.date_event) : 'Date a confirmer'}</small>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;