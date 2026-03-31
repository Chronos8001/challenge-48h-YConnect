import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './ChatBox.css';

const API_KEY = 'AIzaSyB-10WPZEYcusNjumZ5Hp_cFxI5Vv0lpk0';
const genAI = new GoogleGenerativeAI(API_KEY);

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !chatSession) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const session = model.startChat({ history: [] });
      setChatSession(session);
    }
  }, [isOpen, chatSession]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const messageText = inputValue;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!chatSession) {
        throw new Error('Chat session not initialized');
      }

      const response = await chatSession.sendMessage(messageText);
      const responseText = response.response.text();

      const aiMessage = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Erreur: ' + error.message,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbox-container">
      <button
        className="chatbox-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with AI"
      >
        💬
      </button>

      {isOpen && (
        <div className="chatbox-window">
          <div className="chatbox-header">
            <h3>AI Assistant (Gemini)</h3>
            <button
              className="chatbox-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="chatbox-messages">
            {messages.length === 0 && (
              <div className="chatbox-welcome">
                <p>👋 Hello! How can I help you today?</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender}`}
              >
                <div className="message-content">
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message ai">
                <div className="message-content">
                  <span className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="chatbox-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="chatbox-input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="chatbox-send"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
