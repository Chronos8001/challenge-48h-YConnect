import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ text = 'Salut !', isMine = false }) => {
  return <div className={`message-bubble ${isMine ? 'mine' : ''}`}>{text}</div>;
};

export default MessageBubble;
