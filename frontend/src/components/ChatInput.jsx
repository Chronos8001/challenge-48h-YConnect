import React from 'react';
import './ChatInput.css';

const ChatInput = ({
  placeholder = 'Ecris un message...',
  value = '',
  onChange,
  onSubmit,
  disabled = false,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange && onChange(event.target.value)}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !value.trim()}>Envoyer</button>
    </form>
  );
};

export default ChatInput;
