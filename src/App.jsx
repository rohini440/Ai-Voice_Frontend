import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am Rohini, your AI voice assistant. How can I help you today?' }
  ]);
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    // Check backend health
    fetch('http://localhost:8000/')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'healthy') {
          setBackendStatus('Connected');
        } else {
          setBackendStatus('Error');
        }
      })
      .catch(() => {
        setBackendStatus('Disconnected');
      });
  }, []);

  const toggleListening = () => {
    setIsListening(prev => !prev);
    if (!isListening) {
      // Add user speech mock-up
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { role: 'user', text: 'Can you summarize my schedule for today?' },
          { role: 'assistant', text: 'Sure! You have a sync with the product team at 10 AM, followed by lunch with Sarah at 12:30 PM. Would you like me to read the details?' }
        ]);
        setIsListening(false);
      }, 3000);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <h1>Rohini AI</h1>
        </div>
        <div className="status-container">
          <span className={`status-dot ${backendStatus.toLowerCase()}`}></span>
          <span className="status-text">Backend: {backendStatus}</span>
        </div>
      </header>

      <main className="app-main">
        <div className="chat-window">
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.role}`}>
                <div className="message-sender">{msg.role === 'assistant' ? 'Rohini' : 'You'}</div>
                <div className="message-text">{msg.text}</div>
              </div>
            ))}
            {isListening && (
              <div className="message-bubble assistant typing">
                <div className="message-sender">Rohini</div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <div className="controls-section">
            <button 
              className={`mic-button ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              <div className="mic-icon">
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path fill="currentColor" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                </svg>
              </div>
              <div className="pulse-ring"></div>
            </button>
            <p className="status-instruction">
              {isListening ? "Listening... Speak now" : "Click the microphone to speak"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
