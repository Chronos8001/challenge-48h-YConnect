import React from 'react';
import './Header.css';
import { FaPlus, FaRegCommentDots, FaUserFriends, FaSearch } from 'react-icons/fa';
import logoYnovImage from '../assets/images/logo-ynov.png';
import avatarImage from '../assets/images/avatar.png';

const Header = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-placeholder" onClick={() => setActiveTab('feed')}>
          <img src={logoYnovImage} alt="Logo Ynov" className="logo-img" />
        </div>
      </div>

      <div className="header-center">
        <div className="search-group">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Rechercher un utilisateur" />
        </div>

        <nav className="header-tabs">
          <button className="tab-btn"><FaPlus /></button>
          
          <button 
            className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <FaRegCommentDots />
          </button>
          
          <button className="tab-btn"><FaUserFriends /></button>
        </nav>
      </div>

      <div className="header-right">
        <div className="profile-btn" onClick={() => setActiveTab('profile')}>
          <img src={avatarImage} alt="Mon profil" className="avatar-img-small" />
        </div>
      </div>
    </header>
  );
};

export default Header;