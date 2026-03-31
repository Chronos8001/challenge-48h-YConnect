import React, { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaChevronDown, FaThumbsUp, FaThumbsDown, FaImage, FaTimes } from 'react-icons/fa';
import AddFriendButton from '../components/AddFriendButton';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';
import UserCardShort from '../components/UserCardShort';
import './HomePage.css';

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

function HomePage({ user, onLogout }) {
  const [currentUser, setCurrentUser] = useState(user || null);
  const [sessionChecked, setSessionChecked] = useState(false);

  const [rightPanel, setRightPanel] = useState('contacts');

  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [postImagePreview, setPostImagePreview] = useState(null);
  const [postImageFile, setPostImageFile] = useState(null);
  const [postLikes, setPostLikes] = useState({});

  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isPublishingPost, setIsPublishingPost] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(0);
  const [postError, setPostError] = useState('');
  const [postActionMessage, setPostActionMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(0);
  const [chatDraft, setChatDraft] = useState('');
  const [chatError, setChatError] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const [friendIds, setFriendIds] = useState([]);

  const [profileDescription, setProfileDescription] = useState('');
  const [profileFiliere, setProfileFiliere] = useState('');
  const [profileSkillsText, setProfileSkillsText] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  const [news, setNews] = useState([]);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsDescription, setNewsDescription] = useState('');
  const [newsType, setNewsType] = useState('Challenge');
  const [newsDate, setNewsDate] = useState('');
  const [isCreatingNews, setIsCreatingNews] = useState(false);
  const [newsCreateMessage, setNewsCreateMessage] = useState('');
  const [viewedProfile, setViewedProfile] = useState(null);
  const [isLoadingViewedProfile, setIsLoadingViewedProfile] = useState(false);
  const [viewedProfileError, setViewedProfileError] = useState('');

  const userName = useMemo(() => {
    const first = currentUser?.prenom || '';
    const last = currentUser?.nom || '';
    const full = `${first} ${last}`.trim();
    return full || 'Utilisateur';
  }, [currentUser]);

  const isAdmin = useMemo(() => Number(currentUser?.role) === 1, [currentUser]);

  const selectedContact = useMemo(() => {
    return contacts.find((contact) => Number(contact.id_user) === Number(selectedContactId)) || null;
  }, [contacts, selectedContactId]);

  const friendContacts = useMemo(() => {
    return contacts.filter((contact) => friendIds.includes(Number(contact.id_user)));
  }, [contacts, friendIds]);

  const suggestedContacts = useMemo(() => {
    return contacts.filter((contact) => !friendIds.includes(Number(contact.id_user)));
  }, [contacts, friendIds]);

  const filteredSearchedUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }
    return searchedUsers;
  }, [searchTerm, searchedUsers]);

  const formatDate = (value) => {
    if (!value) {
      return 'A l\'instant';
    }
    const date = new Date(value);
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

  const loadSession = async () => {
    const { response, data } = await requestJson('/auth/me.php', {
      method: 'GET',
      headers: {},
    });

    if (!response.ok || !data?.user) {
      setSessionChecked(true);
      if (typeof onLogout === 'function') {
        onLogout();
      }
      return;
    }

    setCurrentUser(data.user);
    setSessionChecked(true);
  };

  const loadPosts = async () => {
    setIsLoadingPosts(true);

    const { response, data } = await requestJson('/posts/list.php', {
      method: 'GET',
      headers: {},
    });

    if (response.ok && data.ok && Array.isArray(data.posts)) {
      setPosts(data.posts);
    } else {
      setPosts([]);
    }

    setIsLoadingPosts(false);
  };

  const loadContacts = async () => {
    const { response, data } = await requestJson('/messages/users.php', {
      method: 'GET',
      headers: {},
    });

    if (response.ok && data.ok && Array.isArray(data.users)) {
      setContacts(data.users);
      setFriendIds((previous) => {
        if (previous.length > 0) {
          return previous;
        }
        return data.users.slice(0, Math.min(5, data.users.length)).map((item) => Number(item.id_user));
      });
      return;
    }

    setContacts([]);
  };

  const loadThread = async (otherUserId) => {
    if (!otherUserId) {
      setMessages([]);
      return;
    }

    const { response, data } = await requestJson(`/messages/thread.php?user_id=${encodeURIComponent(otherUserId)}`, {
      method: 'GET',
      headers: {},
    });

    if (response.ok && data.ok && Array.isArray(data.messages)) {
      setMessages(data.messages);
      return;
    }

    setMessages([]);
  };

  const loadProfile = async () => {
    const { response, data } = await requestJson('/profile/me.php', {
      method: 'GET',
      headers: {},
    });

    if (!response.ok || !data.ok || !data.profile) {
      return;
    }

    setProfileDescription(data.profile.description || '');
    setProfileFiliere(data.profile.filiere || '');
    setProfileSkillsText(Array.isArray(data.profile.competences) ? data.profile.competences.join(', ') : '');

    if (data.profile.image_profile) {
      setProfileImagePreview(data.profile.image_profile);
    } else {
      setProfileImagePreview(null);
    }
  };

  const loadNews = async () => {
    const { response, data } = await requestJson('/news/list.php', {
      method: 'GET',
      headers: {},
    });

    if (response.ok && data.ok && Array.isArray(data.news)) {
      setNews(data.news);
    } else {
      setNews([]);
    }
  };

  const searchUsers = async (query) => {
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

  const handleCreateNews = async (event) => {
    event.preventDefault();

    if (!newsTitle.trim() || !newsDescription.trim() || !newsType.trim() || !newsDate) {
      setNewsCreateMessage('Merci de remplir tous les champs de la news.');
      return;
    }

    setIsCreatingNews(true);
    setNewsCreateMessage('');

    const { response, data } = await requestJson('/news/create.php', {
      method: 'POST',
      body: JSON.stringify({
        titre: newsTitle.trim(),
        description: newsDescription.trim(),
        type_event: newsType.trim(),
        date_event: newsDate,
      }),
    });

    setIsCreatingNews(false);

    if (!response.ok || !data.ok) {
      setNewsCreateMessage(data.message || 'Creation de la news impossible.');
      return;
    }

    setNewsCreateMessage('News publiee avec succes.');
    setNewsTitle('');
    setNewsDescription('');
    setNewsType('Challenge');
    setNewsDate('');
    await loadNews();
  };

  const loadUserProfile = async (userId) => {
    if (!userId) {
      return null;
    }

    const { response, data } = await requestJson(`/users/profile.php?user_id=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {},
    });

    if (!response.ok || !data.ok || !data.profile) {
      return null;
    }

    return data.profile;
  };

  const handleOpenUserProfile = async (rawUser) => {
    const userId = Number(rawUser?.id_user || rawUser?.id_auteur || 0);
    if (!userId) {
      return;
    }

    setRightPanel('user-profile');
    setViewedProfileError('');
    setIsLoadingViewedProfile(true);

    const fullProfile = await loadUserProfile(userId);
    if (!fullProfile) {
      setViewedProfile(rawUser || null);
      setViewedProfileError('Impossible de charger ce profil.');
      setIsLoadingViewedProfile(false);
      return;
    }

    setViewedProfile(fullProfile);
    setIsLoadingViewedProfile(false);
  };

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (!sessionChecked || !currentUser) {
      return;
    }

    loadPosts();
    loadContacts();
    loadNews();
    loadProfile();
  }, [sessionChecked, currentUser]);

  useEffect(() => {
    if (!selectedContactId && friendContacts.length > 0) {
      setSelectedContactId(Number(friendContacts[0].id_user));
      return;
    }

    if (selectedContactId && !friendContacts.some((item) => Number(item.id_user) === Number(selectedContactId))) {
      if (friendContacts.length > 0) {
        setSelectedContactId(Number(friendContacts[0].id_user));
      } else {
        setSelectedContactId(0);
        setMessages([]);
      }
    }
  }, [friendContacts, selectedContactId]);

  useEffect(() => {
    if (!selectedContactId) {
      return;
    }
    loadThread(selectedContactId);
  }, [selectedContactId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchUsers(searchTerm);
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handlePostImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setPostImageFile(file);
    setPostImagePreview(URL.createObjectURL(file));
  };

  const handleRemovePostImage = () => {
    setPostImageFile(null);
    setPostImagePreview(null);
  };

  const handlePublishPost = async (event) => {
    event.preventDefault();

    if (!postContent.trim()) {
      setPostError('Le contenu du post est obligatoire.');
      return;
    }

    setPostError('');
    setPostActionMessage('');
    setIsPublishingPost(true);

    let uploadedImageUrl = '';

    if (postImageFile) {
      const formData = new FormData();
      formData.append('image', postImageFile);

      const uploadResponse = await fetch(`${API_BASE}/uploads/create.php`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const uploadData = await uploadResponse.json().catch(() => ({}));
      if (!uploadResponse.ok || !uploadData.ok || !uploadData.image_url) {
        setIsPublishingPost(false);
        setPostError(uploadData.message || 'Upload image impossible.');
        return;
      }

      uploadedImageUrl = uploadData.image_url;
    }

    const { response, data } = await requestJson('/posts/create.php', {
      method: 'POST',
      body: JSON.stringify({
        contenu: postContent.trim(),
        image_url: uploadedImageUrl,
      }),
    });

    if (!response.ok || !data.ok) {
      setIsPublishingPost(false);
      setPostError(data.message || 'Publication impossible.');
      return;
    }

    setPostContent('');
    setPostImageFile(null);
    setPostImagePreview(null);
    setPostActionMessage('Post publie avec succes.');
    setIsPublishingPost(false);
    await loadPosts();
  };

  const handleDeletePost = async (postId) => {
    setPostActionMessage('');
    setPostError('');
    setDeletingPostId(Number(postId));

    const { response, data } = await requestJson('/posts/delete.php', {
      method: 'POST',
      body: JSON.stringify({ id_post: postId }),
    });

    setDeletingPostId(0);

    if (!response.ok || !data.ok) {
      setPostError(data.message || 'Suppression impossible.');
      return;
    }

    setPostActionMessage('Post supprime.');
    await loadPosts();
  };

  const handleToggleLike = (postId, type) => {
    setPostLikes((previous) => {
      const current = previous[postId] || null;
      if (current === type) {
        return { ...previous, [postId]: null };
      }
      return { ...previous, [postId]: type };
    });
  };

  const handleOpenConversation = (contact) => {
    const contactId = Number(contact.id_user);
    setSelectedContactId(contactId);
    setRightPanel('chat');

    setFriendIds((previous) => {
      if (previous.includes(contactId)) {
        return previous;
      }
      return [...previous, contactId];
    });
  };

  const handleSendMessage = async (rawText) => {
    const text = (rawText || '').trim();

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
      setIsSendingMessage(false);
      setChatError(data.message || 'Envoi du message impossible.');
      return;
    }

    setChatDraft('');
    setIsSendingMessage(false);
    await loadThread(selectedContactId);
    await loadContacts();
  };

  const handleRemoveFriend = (contact) => {
    const contactId = Number(contact.id_user);
    setFriendIds((previous) => previous.filter((id) => id !== contactId));

    if (Number(selectedContactId) === contactId) {
      setSelectedContactId(0);
      setMessages([]);
    }
  };

  const handleAddFriend = (contact) => {
    const contactId = Number(contact.id_user);
    setFriendIds((previous) => {
      if (previous.includes(contactId)) {
        return previous;
      }
      return [...previous, contactId];
    });
  };

  const handleProfileImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleUploadProfileImage = async () => {
    if (!profileImageFile) {
      return;
    }

    setProfileMessage('');
    setIsUploadingProfileImage(true);

    const formData = new FormData();
    formData.append('image', profileImageFile);

    const uploadResponse = await fetch(`${API_BASE}/uploads/profile.php`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const uploadData = await uploadResponse.json().catch(() => ({}));

    if (!uploadResponse.ok || !uploadData.ok || !uploadData.image_url) {
      setIsUploadingProfileImage(false);
      setProfileMessage(uploadData.message || 'Upload photo profil impossible.');
      return;
    }

    const { response, data } = await requestJson('/profile/update.php', {
      method: 'POST',
      body: JSON.stringify({
        description: profileDescription,
        filiere: profileFiliere,
        competences: profileSkillsText,
        image_url: uploadData.image_url,
      }),
    });

    setIsUploadingProfileImage(false);

    if (!response.ok || !data.ok) {
      setProfileMessage(data.message || 'Mise a jour du profil impossible.');
      return;
    }

    setCurrentUser((previous) => ({
      ...(previous || {}),
      image_profile: uploadData.image_url,
    }));
    setProfileImageFile(null);
    setProfileImagePreview(uploadData.image_url);
    setProfileMessage('Photo de profil mise a jour.');
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    setIsSavingProfile(true);
    setProfileMessage('');

    const skills = profileSkillsText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const { response, data } = await requestJson('/profile/update.php', {
      method: 'POST',
      body: JSON.stringify({
        description: profileDescription,
        filiere: profileFiliere,
        competences: skills,
      }),
    });

    setIsSavingProfile(false);

    if (!response.ok || !data.ok) {
      setProfileMessage(data.message || 'Sauvegarde profil impossible.');
      return;
    }

    setCurrentUser((previous) => ({
      ...(previous || {}),
      filiere: profileFiliere,
    }));
    setProfileMessage('Profil mis a jour avec succes.');
  };

  const profileImageSrc = profileImagePreview || currentUser?.image_profile || '/avatar.png';

  if (!sessionChecked) {
    return <div className="home-container"><p className="status-text">Verification de session...</p></div>;
  }

  return (
    <div className="home-container">
      <header className="app-header">
        <div className="header-left">
          <div className="logo-box" onClick={() => setRightPanel('contacts')} role="button" tabIndex={0}>
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
              <button type="button" className={`nav-btn ${rightPanel === 'contacts' ? 'active' : ''}`} onClick={() => setRightPanel('contacts')}>
                <img src="/icon-friends.svg" alt="Amis" />
              </button>
              <button type="button" className={`nav-btn ${rightPanel === 'chat' ? 'active' : ''}`} onClick={() => setRightPanel('chat')}>
                <img src="/icon-message.svg" alt="Chat" />
              </button>
              <button type="button" className={`nav-btn ${rightPanel === 'add' ? 'active' : ''}`} onClick={() => setRightPanel('add')}>
                <img src="/icon-post.svg" alt="Ajouter" />
              </button>
            </nav>
            <button type="button" className={`user-profile ${rightPanel === 'profile' ? 'active' : ''}`} onClick={() => setRightPanel('profile')}>
              <img src={currentUser?.image_profile || '/avatar.png'} alt="Mon profil" className="header-avatar" />
            </button>
            <button type="button" className="logout-btn" onClick={onLogout}>Deconnexion</button>
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

            {postImagePreview ? (
              <div className="image-preview">
                <img src={postImagePreview} alt="Preview" className="preview-img" />
                <button type="button" className="remove-preview-btn" onClick={handleRemovePostImage}>
                  <FaTimes />
                </button>
              </div>
            ) : null}

            {postError ? <p className="form-error">{postError}</p> : null}
            {postActionMessage ? <p className="status-text">{postActionMessage}</p> : null}

            <div className="composer-actions">
              <label className="image-upload-btn">
                <FaImage />
                <input type="file" accept="image/*" onChange={handlePostImageSelect} style={{ display: 'none' }} />
              </label>
              <button type="submit" className="publish-btn" disabled={isPublishingPost}>
                {isPublishingPost ? 'Publication...' : 'Publier'}
              </button>
            </div>
          </form>

          {isLoadingPosts ? <p className="status-text">Chargement du fil...</p> : null}
          {!isLoadingPosts && posts.length === 0 ? <p className="status-text">Aucun post pour le moment.</p> : null}

          {posts.map((post) => {
            const isMine = Number(post.id_auteur) === Number(currentUser?.id_user);
            const likeState = postLikes[post.id_post] || null;
            return (
              <article className="post-card" key={post.id_post}>
                <div className="post-top">
                  <button type="button" className="user-info user-info-btn" onClick={() => handleOpenUserProfile(post)}>
                    <img src={post.image_profile || '/avatar.png'} alt="Auteur" className="mini-avatar" />
                    <div className="user-text">
                      <h3>{`${post.prenom || ''} ${post.nom || ''}`.trim() || 'Etudiant Ynov'}</h3>
                      <p>{formatDate(post.date_publi)}</p>
                    </div>
                  </button>
                  <div className="post-actions">
                    {isMine ? (
                      <button
                        type="button"
                        className="panel-action-btn danger"
                        onClick={() => handleDeletePost(post.id_post)}
                        disabled={deletingPostId === Number(post.id_post)}
                      >
                        {deletingPostId === Number(post.id_post) ? 'Suppression...' : 'Supprimer'}
                      </button>
                    ) : null}
                    <FaChevronDown className="icon-grey" />
                  </div>
                </div>

                <div className="post-content">{post.contenu}</div>

                {post.image_url ? (
                  <div className="post-image">
                    <img src={post.image_url} alt="Post" className="post-img" />
                  </div>
                ) : null}

                <div className="post-interactions">
                  <button
                    type="button"
                    className={`interaction-btn like-btn ${likeState === 'like' ? 'active' : ''}`}
                    onClick={() => handleToggleLike(post.id_post, 'like')}
                  >
                    <FaThumbsUp /> J'aime
                  </button>
                  <button
                    type="button"
                    className={`interaction-btn dislike-btn ${likeState === 'dislike' ? 'active' : ''}`}
                    onClick={() => handleToggleLike(post.id_post, 'dislike')}
                  >
                    <FaThumbsDown /> Je n'aime pas
                  </button>
                </div>
              </article>
            );
          })}
        </aside>

        <section className="right-column">
          <div className="dynamic-panel">
            {rightPanel === 'contacts' ? (
              <div className="panel-inner">
                <div className="panel-title-row">
                  <h3>Mes amis</h3>
                  <span>{friendContacts.length}</span>
                </div>

                {isSearchingUsers ? <p className="status-text">Recherche...</p> : null}

                {filteredSearchedUsers.length > 0 ? (
                  <div className="search-results-box">
                    <h4>Resultats</h4>
                    {filteredSearchedUsers.map((result) => (
                      <div className="contact-row compact" key={`search-${result.id_user}`}>
                        <button type="button" className="user-card-link" onClick={() => handleOpenUserProfile(result)}>
                          <UserCardShort
                            name={`${result.prenom || ''} ${result.nom || ''}`.trim() || 'Etudiant'}
                            role={result.filiere || result.email || 'Etudiant Ynov'}
                          />
                        </button>
                        <button type="button" className="panel-action-btn" onClick={() => handleOpenConversation(result)}>
                          Ecrire
                        </button>
                        <button type="button" className="panel-action-btn add-btn" onClick={() => handleAddFriend(result)}>
                          Ajouter
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                {friendContacts.length === 0 ? <p className="status-text">Aucun ami pour le moment.</p> : null}

                {friendContacts.map((contact) => (
                  <div className="contact-row" key={contact.id_user}>
                    <button type="button" className="user-card-link" onClick={() => handleOpenUserProfile(contact)}>
                      <UserCardShort
                        name={`${contact.prenom || ''} ${contact.nom || ''}`.trim() || 'Etudiant'}
                        role={contact.filiere || contact.email || 'Etudiant Ynov'}
                      />
                    </button>
                    <button type="button" className="panel-action-btn" onClick={() => handleOpenConversation(contact)}>
                      Ecrire
                    </button>
                    <button type="button" className="panel-action-btn danger" onClick={() => handleRemoveFriend(contact)}>
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {rightPanel === 'chat' ? (
              <div className="panel-inner">
                <div className="panel-title-row">
                  <h3>Messagerie</h3>
                  <span>{selectedContact ? `${selectedContact.prenom || ''} ${selectedContact.nom || ''}`.trim() : 'Aucun contact'}</span>
                </div>

                <div className="chat-users">
                  {friendContacts.map((contact) => (
                    <button
                      key={contact.id_user}
                      type="button"
                      className={`chat-user-chip ${Number(selectedContactId) === Number(contact.id_user) ? 'active' : ''}`}
                      onClick={() => setSelectedContactId(Number(contact.id_user))}
                    >
                      {`${contact.prenom || ''} ${contact.nom || ''}`.trim()}
                    </button>
                  ))}
                </div>

                <div className="chat-thread">
                  {messages.map((item) => (
                    <MessageBubble
                      key={item.id_message}
                      text={item.message_text}
                      isMine={Number(item.id_expediteur) === Number(currentUser?.id_user)}
                    />
                  ))}
                  {messages.length === 0 ? <p className="status-text">Aucun message.</p> : null}
                </div>

                {chatError ? <p className="form-error padded">{chatError}</p> : null}

                <ChatInput
                  value={chatDraft}
                  onChange={setChatDraft}
                  onSubmit={handleSendMessage}
                  disabled={!selectedContactId || isSendingMessage}
                />
              </div>
            ) : null}

            {rightPanel === 'profile' ? (
              <div className="panel-inner">
                <div className="panel-title-row">
                  <h3>Mon profil</h3>
                </div>

                <div className="profile-summary">
                  <div className="profile-image-section">
                    <img src={profileImageSrc} alt="Mon profil" className="mini-avatar" />
                    <label className="upload-pp-btn">
                      <FaImage />
                      <input type="file" accept="image/*" onChange={handleProfileImageSelect} style={{ display: 'none' }} />
                    </label>
                  </div>
                  <div className="contact-info">
                    <h4>{userName}</h4>
                    <p>{currentUser?.email || ''}</p>
                  </div>
                </div>

                {profileImageFile ? (
                  <div className="profile-image-actions">
                    <button type="button" className="publish-btn" onClick={handleUploadProfileImage} disabled={isUploadingProfileImage}>
                      {isUploadingProfileImage ? 'Upload...' : 'Uploader la photo'}
                    </button>
                    <button
                      type="button"
                      className="panel-action-btn"
                      onClick={() => {
                        setProfileImageFile(null);
                        setProfileImagePreview(currentUser?.image_profile || null);
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                ) : null}

                <form className="profile-form" onSubmit={handleSaveProfile}>
                  <label htmlFor="profile-filiere">Filiere</label>
                  <input
                    id="profile-filiere"
                    type="text"
                    value={profileFiliere}
                    onChange={(event) => setProfileFiliere(event.target.value)}
                    placeholder="Ex: Informatique"
                  />

                  <label htmlFor="profile-description">Description</label>
                  <textarea
                    id="profile-description"
                    rows={3}
                    value={profileDescription}
                    onChange={(event) => setProfileDescription(event.target.value)}
                    placeholder="Parle de ton profil"
                  />

                  <label htmlFor="profile-skills">Competences (comma separated)</label>
                  <input
                    id="profile-skills"
                    type="text"
                    value={profileSkillsText}
                    onChange={(event) => setProfileSkillsText(event.target.value)}
                    placeholder="React, PHP, SQL"
                  />

                  <button type="submit" className="publish-btn" disabled={isSavingProfile}>
                    {isSavingProfile ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </form>

                {profileMessage ? <p className="status-text">{profileMessage}</p> : null}
              </div>
            ) : null}

            {rightPanel === 'user-profile' ? (
              <div className="panel-inner">
                <div className="panel-title-row">
                  <h3>Profil utilisateur</h3>
                </div>

                {isLoadingViewedProfile ? <p className="status-text">Chargement du profil...</p> : null}
                {viewedProfileError ? <p className="form-error padded">{viewedProfileError}</p> : null}

                {!isLoadingViewedProfile && viewedProfile ? (
                  <>
                    <div className="profile-summary">
                      <img src={viewedProfile.image_profile || '/avatar.png'} alt="Profil utilisateur" className="mini-avatar" />
                      <div className="contact-info">
                        <h4>{`${viewedProfile.prenom || ''} ${viewedProfile.nom || ''}`.trim() || 'Etudiant'}</h4>
                        <p>{viewedProfile.email || ''}</p>
                      </div>
                    </div>

                    <div className="viewed-profile-block">
                      <p><strong>Filiere:</strong> {viewedProfile.filiere || 'Non renseignee'}</p>
                      <p><strong>Description:</strong> {viewedProfile.description || 'Aucune description'}</p>
                      <p><strong>Competences:</strong> {Array.isArray(viewedProfile.competences) && viewedProfile.competences.length > 0 ? viewedProfile.competences.join(', ') : 'Aucune competence'}</p>
                    </div>

                    <div className="viewed-profile-actions">
                      <button type="button" className="panel-action-btn" onClick={() => handleOpenConversation(viewedProfile)}>
                        Ecrire
                      </button>
                      <button type="button" className="panel-action-btn add-btn" onClick={() => handleAddFriend(viewedProfile)}>
                        Ajouter
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}

            {rightPanel === 'add' ? (
              <div className="panel-inner">
                <div className="panel-title-row">
                  <h3>Ajouter des amis</h3>
                  <span>{suggestedContacts.length}</span>
                </div>

                {suggestedContacts.length === 0 ? <p className="status-text">Aucune suggestion.</p> : null}

                {suggestedContacts.map((contact) => (
                  <div className="contact-row" key={contact.id_user}>
                    <button type="button" className="user-card-link" onClick={() => handleOpenUserProfile(contact)}>
                      <UserCardShort
                        name={`${contact.prenom || ''} ${contact.nom || ''}`.trim() || 'Etudiant'}
                        role={contact.filiere || contact.email || 'Etudiant Ynov'}
                      />
                    </button>
                    <AddFriendButton onClick={() => handleAddFriend(contact)} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="news-panel">
            <div className="panel-title-row">
              <h3>News Ynov</h3>
              <span>{news.length}</span>
            </div>

            {isAdmin ? (
              <form className="news-create-form" onSubmit={handleCreateNews}>
                <input
                  type="text"
                  placeholder="Titre de la news"
                  value={newsTitle}
                  onChange={(event) => setNewsTitle(event.target.value)}
                />
                <textarea
                  rows={2}
                  placeholder="Description"
                  value={newsDescription}
                  onChange={(event) => setNewsDescription(event.target.value)}
                />
                <div className="news-create-row">
                  <select value={newsType} onChange={(event) => setNewsType(event.target.value)}>
                    <option value="Challenge">Challenge</option>
                    <option value="BDS">BDS</option>
                    <option value="BDE">BDE</option>
                    <option value="Campus">Campus</option>
                  </select>
                  <input
                    type="date"
                    value={newsDate}
                    onChange={(event) => setNewsDate(event.target.value)}
                  />
                </div>
                <button type="submit" className="publish-btn" disabled={isCreatingNews}>
                  {isCreatingNews ? 'Publication...' : 'Publier la news'}
                </button>
                {newsCreateMessage ? <p className="status-text news-create-message">{newsCreateMessage}</p> : null}
              </form>
            ) : null}

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
}

export default HomePage;
