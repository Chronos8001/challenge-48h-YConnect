import React from 'react';
import './UserCardShort.css';
import avatarImage from '../assets/images/avatar.png';

const UserCardShort = ({ name = 'Nom Prenom', role = 'Etudiant', avatar = avatarImage }) => {
  return (
    <div className="user-card-short">
      <img src={avatar} alt={name} className="user-card-short-avatar" />
      <div>
        <p className="user-card-short-name">{name}</p>
        <p className="user-card-short-role">{role}</p>
      </div>
    </div>
  );
};

export default UserCardShort;
