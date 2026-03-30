import React from 'react';
import './AddFriendButton.css';

const AddFriendButton = ({ onClick }) => {
  return (
    <button type="button" className="add-friend-button" onClick={onClick}>
      Ajouter
    </button>
  );
};

export default AddFriendButton;
