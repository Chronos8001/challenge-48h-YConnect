import React from 'react';
import './PostCard.css';
import avatarImage from '../assets/images/avatar.png';

const PostCard = () => {
  return (
    <article className="post-card">
      <header className="post-card-header">
        <div className="post-card-author">
          <img src={avatarImage} alt="Avatar utilisateur" className="avatar-img-tiny" />
          <div className="author-details">
            <h3>Yoann</h3>
            <span className="post-time">Il y a 5 min</span>
          </div>
        </div>
        <button type="button" className="post-menu-btn" aria-label="Options du post">
          ...
        </button>
      </header>

      <div className="post-card-body">
        <p>Bienvenue sur le fil Ynov. Voici un premier message de demonstration.</p>
      </div>
    </article>
  );
};

export default PostCard;