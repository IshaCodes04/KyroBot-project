import { useState, useEffect, useRef } from 'react';
import './App.css';
import { io } from 'socket.io-client';
import { 
  MessageCircle, 
  Send, 
  Plus, 
  Settings, 
  HelpCircle, 
  Sun, 
  Moon, 
  Search, 
  Brain, 
  Image as ImageIcon, 
  BarChart3,
  Paperclip,
  Trash2,
  X,
  Mic,
  Volume2,
  Menu
} from 'lucide-react';

const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInputMessage(transcript);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    socket.on('connect', () => {
      console.log('✅ Connected to server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });

    socket.on('test-connection', (msg) => {
      console.log('Test connection:', msg);
    });

    socket.on('ai-message-response', (response) => {
      console.log('📥 Received AI response:', response);
      setIsTyping(false);
      const newMessage = {
        id: Date.now(),
        text: response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
      setMessages(prev => [...prev, newMessage]);
      
      if (currentConversationId) {
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, messages: [...(conv.messages || []), newMessage] }
            : conv
        ));
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('test-connection');
      socket.off('ai-message-response');
    };
  }, [currentConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isConnected) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };

    setMessages(prev => [...prev, userMessage]);
    
    const now = new Date();
    const dateInfo = {
      day: now.toLocaleDateString('en-US', { weekday: 'long' }),
      date: now.getDate(),
      month: now.toLocaleDateString('en-US', { month: 'long' }),
      year: now.getFullYear(),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      fullDate: now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
    
    console.log('📤 Sending message to server:', inputMessage);
    
    socket.emit('ai-message', { 
      message: inputMessage,
      dateContext: dateInfo
    });
    
    setIsTyping(true);

    if (currentConversationId) {
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { 
              ...conv, 
              lastMessage: inputMessage, 
              timestamp: 'Just now',
              messages: [...(conv.messages || []), userMessage]
            }
          : conv
      ));
    } else {
      const newConv = {
        id: Date.now(),
        title: inputMessage.slice(0, 30) + (inputMessage.length > 30 ? '...' : ''),
        lastMessage: inputMessage,
        timestamp: 'Just now',
        messages: [userMessage]
      };
      setConversations(prev => [newConv, ...prev]);
      setCurrentConversationId(newConv.id);
    }
    
    setInputMessage('');
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setIsSidebarOpen(false);
  };

  const handleConversationClick = (convId) => {
    const conversation = conversations.find(c => c.id === convId);
    setCurrentConversationId(convId);
    setMessages(conversation?.messages || []);
    setIsSidebarOpen(false);
  };

  const handleDeleteConversation = (convId, e) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(conv => conv.id !== convId));
    if (currentConversationId === convId) {
      setMessages([]);
      setCurrentConversationId(null);
    }
  };

  const switchTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const handlePlayMessage = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser');
    }
  };

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`app theme-${theme}`}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="app-logo">
            <MessageCircle size={28} />
          </div>
          <div className="app-info">
            <h1 className="app-title">AI-ChatBot</h1>
            <div className="app-status">
              <span className={`status-dot ${isConnected ? 'online' : ''}`}></span>
              {isConnected ? 'Online' : 'Offline'}
            </div>
          </div>
          <button 
            className="sidebar-close-btn"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <button className="new-chat-btn" onClick={handleNewChat}>
          <Plus size={20} />
          New Chat
        </button>

        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="conversations-section">
          <h3 className="conversations-title">RECENT CONVERSATIONS</h3>
          <div className="conversations-list">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conv => (
                <div 
                  key={conv.id} 
                  className={`conversation-item ${currentConversationId === conv.id ? 'active' : ''}`}
                  onClick={() => handleConversationClick(conv.id)}
                >
                  <div className="conv-icon">
                    <MessageCircle size={20} />
                  </div>
                  <div className="conversation-content">
                    <div className="conversation-title">{conv.title}</div>
                    <div className="conversation-time">{conv.timestamp}</div>
                  </div>
                  <button 
                    className="delete-conversation-btn"
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                    title="Delete conversation"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="no-conversations">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-btn">
            <Settings size={20} />
            Settings
          </button>
          <button className="sidebar-btn">
            <HelpCircle size={20} />
            Support
          </button>
          <div className="user-info">
            <div className="user-avatar">I</div>
            <div className="user-details">
              <div className="user-name">Isha</div>
              <div className="user-email">isha.dev@gmail.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-left">
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            <div className="ai-avatar">
              <Brain size={24} />
            </div>
            <div className="ai-info">
              <div className="ai-name">AI Assistant</div>
              <div className="ai-status">
                <span className={`status-dot ${isConnected ? 'active' : ''}`}></span>
                {isConnected ? 'Active now' : 'Offline'}
              </div>
            </div>
          </div>
          <div className="header-actions">
            <div className="theme-switcher">
              <button 
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => switchTheme('light')}
                title="Light Theme"
              >
                <Sun size={18} />
              </button>
              <button 
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => switchTheme('dark')}
                title="Dark Theme"
              >
                <Moon size={18} />
              </button>
              <button 
                className={`theme-option ${theme === 'pink' ? 'active' : ''}`}
                onClick={() => switchTheme('pink')}
                title="Pink Theme"
              >
                <div className="pink-icon"></div>
              </button>
            </div>
          </div>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <h1 className="welcome-title">How can I help today?</h1>
              <p className="welcome-subtitle">
                I'm your AI assistant, ready to help with questions, creative tasks, analysis, and more.
                <br />Ask me anything!
              </p>
              <div className="quick-actions">
                <button className="quick-action-btn">
                  <Search size={18} />
                  Deep Search
                </button>
                <button className="quick-action-btn">
                  <Brain size={18} />
                  Think
                </button>
                <button className="quick-action-btn">
                  <ImageIcon size={18} />
                  Edit Image
                </button>
                <button className="quick-action-btn">
                  <BarChart3 size={18} />
                  Analyze
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  {msg.sender === 'ai' && (
                    <div className="message-avatar">
                      <Brain size={20} />
                    </div>
                  )}
                  <div className="message-wrapper">
                    <div className="message-content">
                      <div className="message-text">{msg.text}</div>
                      <button 
                        className="message-play-btn"
                        onClick={() => handlePlayMessage(msg.text)}
                        title="Play message"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                    <div className="message-meta">
                      {msg.timestamp} • {msg.date} • AI-ChatBot
                    </div>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="message-avatar user">
                      I
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="message ai">
                  <div className="message-avatar">
                    <Brain size={20} />
                  </div>
                  <div className="message-wrapper">
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="typing-text">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="input-container">
          <div className={`input-wrapper ${inputMessage ? 'has-text' : ''} ${isListening ? 'listening' : ''}`}>
            <button type="button" className="input-icon-btn">
              <Paperclip size={20} />
            </button>
            <form onSubmit={handleSendMessage} className="input-form">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="message-input"
                disabled={!isConnected}
              />
            </form>
            <button 
              type="button" 
              className={`input-icon-btn mic-btn ${isListening ? 'active' : ''}`}
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <Mic size={20} />
            </button>
            <button 
              type="submit" 
              className="send-btn" 
              disabled={!inputMessage.trim() || !isConnected}
              onClick={handleSendMessage}
            >
              <Send size={20} />
            </button>
          </div>
          <div className="input-status">
            <span className={`status-indicator ${isConnected ? 'online' : 'offline'}`}></span>
            <span className="status-text">AI {isConnected ? 'Online' : 'Offline'}</span>
            <span className="status-divider">•</span>
            <span className="encryption-text">🔒 End-to-end encrypted</span>
            <span className="status-divider">•</span>
            <span className="powered-text">🎤 Voice enabled</span>
            <span className="status-divider">•</span>
            <span className="powered-text">🔊 Text-to-speech</span>
          </div>
          <div className="powered-by">
            Powered by Gemini AI
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat; 


app.css code

/* Base Styles */

 * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.typing-text {
  font-size: 13px;
  color: #666;
  margin-left: 8px;
}

/* Input Container */
.input-container {
  padding: 20px 30px 30px;
  backdrop-filter: blur(10px);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 24px;
  padding: 14px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.input-wrapper.has-text {
  box-shadow: 0 0 0 2px #3b82f6, 0 4px 20px rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}

.input-wrapper.listening {
  box-shadow: 0 0 0 3px #4caf50, 0 4px 20px rgba(76, 175, 80, 0.4);
  animation: listeningPulse 1.5s infinite;
}

@keyframes listeningPulse {
  0%, 100% {
    box-shadow: 0 0 0 3px #4caf50, 0 4px 20px rgba(76, 175, 80, 0.4);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(76, 175, 80, 0.3), 0 4px 25px rgba(76, 175, 80, 0.6);
  }
}

.theme-dark .input-wrapper {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.theme-dark .input-wrapper.has-text {
  box-shadow: 0 0 0 2px #3b82f6, 0 4px 20px rgba(59, 130, 246, 0.4);
}

.input-icon-btn {
  background: transparent;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 8px;
  border-radius: 8px;
}

.input-icon-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: scale(1.05);
}

.mic-btn.active {
  background: #4caf50;
  color: white;
  animation: micPulse 1s infinite;
}

@keyframes micPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.input-form {
  flex: 1;
}

.message-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 15px;
  background: transparent;
}

.message-input::placeholder {
  color: #999;
}

.message-input:disabled {
  opacity: 0.5;
}

.send-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
  justify-content: center;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4caf50;
}

.status-indicator.offline {
  background: #f44336;
}

.status-text {
  font-weight: 600;
}

.status-divider {
  color: #ccc;
}

.encryption-text,
.powered-text {
  opacity: 0.8;
}

.powered-by {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Sidebar Overlay */
.sidebar-overlay {
  display: none;
}

/* Desktop View (> 768px) */
@media (min-width: 769px) {
  .mobile-menu-btn {
    display: none !important;
  }
  
  .sidebar-header {
    display: flex !important;
  }
  
  .sidebar-close-btn {
    display: none !important;
  }
  
  .chat-header-left .ai-avatar,
  .chat-header-left .ai-info {
    display: flex;
  }
}

/* Mobile & Tablet Responsive */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex !important;
  }

  .chat-header-left .ai-avatar,
  .chat-header-left .ai-info {
    display: none !important;
  }
  
  .sidebar-header {
    display: flex !important;
    padding-right: 40px;
  }
  
  .sidebar-close-btn {
    display: flex !important;
  }

  .sidebar {
    position: fixed;
    left: -100%;
    z-index: 1000;
    height: 100vh;
    width: 280px;
    transition: left 0.3s ease-in-out;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  }
  
  .sidebar.open {
    left: 0 !important;
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
    animation: fadeInOverlay 0.3s ease;
    backdrop-filter: blur(2px);
  }

  @keyframes fadeInOverlay {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .chat-container {
    width: 100%;
  }

  .chat-header {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .chat-header-left {
    display: flex;
    align-items: center;
  }

  .header-actions {
    display: flex;
    margin-left: auto;
  }

  .theme-switcher {
    flex-direction: row;
    gap: 3px;
    padding: 2px;
    background: rgba(0, 0, 0, 0.1);
  }

  .theme-option {
    width: 30px;
    height: 30px;
    padding: 0;
  }

  .theme-option svg {
    width: 14px;
    height: 14px;
  }

  .pink-icon {
    width: 11px;
    height: 11px;
  }
  
   .welcome-title {
    font-size: 18px;
    line-height: 1.3;
    margin-bottom: 12px;
  }
  
  .welcome-subtitle {
    font-size: 11px;
    padding: 0 10px;
    line-height: 1.4;
    margin-bottom: 24px;
  }

  .messages-container {
    padding: 20px 15px;
  }
  
  .quick-actions {
    flex-direction: column;
    width: 100%;
    padding: 0 10px;
  }
  
  .quick-action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .message-wrapper {
    max-width: 85%;
  }

  .message-content {
    padding: 12px 16px;
  }

  .message-text {
    font-size: 14px;
  }

  .message-avatar {
    width: 32px;
    height: 32px;
  }

  .message-play-btn {
    padding: 6px;
  }

  .message-meta {
    font-size: 10px;
  }

  .input-container {
    padding: 12px 16px 16px;
  }

  .input-wrapper {
    padding: 8px 14px;
  }

  .input-icon-btn {
    padding: 5px;
  }

  .send-btn {
    width: 34px;
    height: 34px;
  }

  .input-status {
    font-size: 9px;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
    margin-bottom: 6px;
  }

  .powered-by {
    font-size: 9px;
    margin-top: 4px;
  }

  .app-logo {
    width: 40px;
    height: 40px;
  }

  .app-title {
    font-size: 18px;
  }

  .app-status {
    font-size: 12px;
  }

  .new-chat-btn {
    padding: 12px 16px;
    font-size: 14px;
  }

  .search-input {
    padding: 10px 36px;
    font-size: 13px;
  }

  .conv-icon {
    width: 32px;
    height: 32px;
  }

  .conversation-title {
    font-size: 13px;
  }

  .conversation-time {
    font-size: 11px;
  }

  .sidebar-btn {
    padding: 10px 14px;
    font-size: 13px;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .user-name {
    font-size: 13px;
  }

  .user-email {
    font-size: 11px;
  }
}

/* Tablet (769px - 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .sidebar {
    width: 280px;
  }

  .welcome-title {
    font-size: 36px;
  }

  .welcome-subtitle {
    font-size: 16px;
  }

  .message-wrapper {
    max-width: 80%;
  }

  .chat-header {
    padding: 18px 25px;
  }

  .ai-avatar {
    width: 44px;
    height: 44px;
  }

  .messages-container {
    padding: 25px;
  }

  .input-container {
    padding: 18px 25px 25px;
  }
}

/* Large Desktop (> 1440px) */
@media (min-width: 1440px) {
  .sidebar {
    width: 360px;
    padding: 24px;
  }

  .app-logo {
    width: 52px;
    height: 52px;
  }

  .app-title {
    font-size: 22px;
  }

  .new-chat-btn {
    padding: 16px 24px;
    font-size: 17px;
  }

  .welcome-title {
    font-size: 56px;
  }

  .welcome-subtitle {
    font-size: 20px;
  }

  .message-wrapper {
    max-width: 65%;
  }

  .message-text {
    font-size: 16px;
  }

  .chat-header {
    padding: 24px 40px;
  }

  .ai-avatar {
    width: 52px;
    height: 52px;
  }

  .ai-name {
    font-size: 18px;
  }

  .messages-container {
    padding: 40px;
  }

  .input-container {
    padding: 24px 40px 40px;
  }

  .input-wrapper {
    padding: 16px 24px;
  }

  .send-btn {
    width: 44px;
    height: 44px;
  }
}

/* Landscape Mode for Mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .welcome-title {
    font-size: 24px;
  }

  .welcome-subtitle {
    font-size: 13px;
  }

  .messages-container {
    padding: 15px 12px;
  }

  .input-container {
    padding: 12px 15px 15px;
  }
}

/* Small Mobile (< 375px) */
@media (max-width: 374px) {
  .sidebar {
    width: 260px;
  }

  .welcome-title {
    font-size: 24px;
  }

  .welcome-subtitle {
    font-size: 13px;
  }

  .theme-switcher {
    gap: 2px;
    padding: 2px;
  }

  .theme-option {
    width: 28px;
    height: 28px;
  }

  .theme-option svg {
    width: 13px;
    height: 13px;
  }

  .ai-name {
    font-size: 13px;
  }

  .message-wrapper {
    max-width: 90%;
  }

  .chat-header {
    padding: 6px 10px;
  }

  .mobile-menu-btn svg {
    width: 20px;
    height: 20px;
  }
}

.app {
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  transition: all 0.3s ease;
  overflow: hidden;
}

/* Light Theme */
.theme-light {
  background: #ffffff;
}

.theme-light .sidebar {
  background: #fafafa;
  border-right: 1px solid #e5e7eb;
}

.theme-light .chat-container {
  background: #ffffff;
}

.theme-light .chat-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.theme-light .message.ai .message-content {
  background: #f5f5f5;
  color: #1f2937;
}

.theme-light .app-title,
.theme-light .sidebar-btn,
.theme-light .conversation-title,
.theme-light .ai-name,
.theme-light .user-name,
.theme-light .welcome-title {
  color: #000000;
  font-weight: 600;
}

.theme-light .welcome-subtitle {
  color: #4b5563;
}

.theme-light .search-input {
  background: #f5f5f5;
  color: #000000;
  border: 1px solid #e5e7eb;
}

.theme-light .message-input {
  color: #000000;
}

.theme-light .input-wrapper {
  background: #fafafa;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.theme-light .conversation-item {
  background: transparent;
}

.theme-light .conversation-item:hover {
  background: #f5f5f5;
}

.theme-light .conversation-time,
.theme-light .user-email {
  color: #6b7280;
}

.theme-light .app-logo,
.theme-light .ai-avatar,
.theme-light .conv-icon {
  background: linear-gradient(135deg, #000000, #374151);
}

.theme-light .new-chat-btn {
  background: linear-gradient(135deg, #1f2937, #000000);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.theme-light .message.user .message-content {
  background: linear-gradient(135deg, #1f2937, #000000);
}

.theme-light .send-btn {
  background: linear-gradient(135deg, #f97316, #ea580c);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
}

.theme-light .send-btn:hover:not(:disabled) {
  box-shadow: 0 6px 16px rgba(249, 115, 22, 0.5);
}

.theme-light .conversations-title {
  color: #374151;
}

.theme-light .sidebar-btn:hover {
  background: #f5f5f5;
  color: #000000;
}

.theme-light .user-avatar {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

/* Dark Theme */
.theme-dark {
  background: #0f172a;
}

.theme-dark .sidebar {
  background: #1e293b;
  border-right: 1px solid #334155;
}

.theme-dark .chat-container {
  background: #0f172a;
}

.theme-dark .chat-header {
  background: #1e293b;
  border-bottom: 1px solid #334155;
}

.theme-dark .message.ai .message-content {
  background: #1e293b;
  color: #f1f5f9;
}

.theme-dark .app-title,
.theme-dark .sidebar-btn,
.theme-dark .conversation-title,
.theme-dark .ai-name,
.theme-dark .user-name,
.theme-dark .welcome-title {
  color: #f1f5f9;
}

.theme-dark .conversation-time,
.theme-dark .user-email,
.theme-dark .welcome-subtitle,
.theme-dark .message-meta {
  color: #94a3b8;
}

.theme-dark .search-input {
  background: #334155;
  color: #f1f5f9;
}

.theme-dark .message-input {
  color: #f1f5f9;
}

.theme-dark .input-wrapper {
  background: #1e293b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.theme-dark .conversation-item {
  background: transparent;
}

.theme-dark .conversation-item:hover {
  background: #334155;
}

.theme-dark .sidebar-footer {
  border-top: 1px solid #334155;
}

.theme-dark .input-status {
  color: #94a3b8;
}

.theme-dark .powered-by {
  color: #94a3b8;
}

.theme-dark .app-logo,
.theme-dark .ai-avatar,
.theme-dark .conv-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.theme-dark .new-chat-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.theme-dark .message.user .message-content {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.theme-dark .conversations-title {
  color: #64748b;
}

.theme-dark .send-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.theme-dark .send-btn:hover:not(:disabled) {
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
}

/* Pink Theme - Light Pink */
.theme-pink {
  background: linear-gradient(135deg, #fdf2f8 0%, #fae8ff 50%, #f3e8ff 100%);
}

.theme-pink .sidebar {
  background: rgba(255, 255, 255, 0.95);
  border-right: 1px solid rgba(236, 72, 153, 0.2);
  backdrop-filter: blur(10px);
}

.theme-pink .chat-container {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
}

.theme-pink .chat-header {
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(236, 72, 153, 0.2);
  backdrop-filter: blur(10px);
}

.theme-pink .message.ai .message-content {
  background: rgba(255, 255, 255, 0.95);
  color: #831843;
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.1);
}

.theme-pink .app-title {
  background: linear-gradient(135deg, #ec4899, #db2777);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.theme-pink .sidebar-btn,
.theme-pink .conversation-title,
.theme-pink .ai-name,
.theme-pink .user-name {
  color: #831843;
}

.theme-pink .welcome-title {
  background: linear-gradient(135deg, #ec4899, #db2777);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.theme-pink .welcome-subtitle {
  color: #be185d;
}

.theme-pink .search-input {
  background: rgba(236, 72, 153, 0.08);
  color: #831843;
  border: 1px solid rgba(236, 72, 153, 0.15);
}

.theme-pink .search-input::placeholder {
  color: #ec4899;
}

.theme-pink .message-input {
  color: #831843;
}

.theme-pink .message-input::placeholder {
  color: #ec4899;
}

.theme-pink .input-wrapper {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 12px rgba(236, 72, 153, 0.15);
  border: 1px solid rgba(236, 72, 153, 0.2);
}

.theme-pink .conversation-item {
  background: transparent;
}

.theme-pink .conversation-item:hover {
  background: rgba(236, 72, 153, 0.08);
}

.theme-pink .conversation-item.active {
  background: rgba(236, 72, 153, 0.12) !important;
  border-left-color: #ec4899;
}

.theme-pink .conversation-time,
.theme-pink .user-email {
  color: #be185d;
}

.theme-pink .app-logo,
.theme-pink .ai-avatar,
.theme-pink .conv-icon {
  background: linear-gradient(135deg, #ec4899, #f472b6);
}

.theme-pink .new-chat-btn {
  background: linear-gradient(135deg, #ec4899, #f472b6);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.theme-pink .message.user .message-content {
  background: linear-gradient(135deg, #ec4899, #f472b6);
  color: white;
}

.theme-pink .user-avatar {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.theme-pink .conversations-title {
  color: #be185d;
}

.theme-pink .input-wrapper.has-text {
  box-shadow: 0 0 0 2px #ec4899, 0 4px 20px rgba(236, 72, 153, 0.3);
}

.theme-pink .message-play-btn {
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.theme-pink .message-play-btn:hover {
  background: rgba(236, 72, 153, 0.2);
}

.theme-pink .quick-action-btn {
  background: rgba(236, 72, 153, 0.08);
  border: 1px solid rgba(236, 72, 153, 0.2);
  color: #ec4899;
}

.theme-pink .quick-action-btn:hover {
  background: rgba(236, 72, 153, 0.15);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
}

.theme-pink .send-btn {
  background: linear-gradient(135deg, #ec4899, #f472b6);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
}

.theme-pink .send-btn:hover:not(:disabled) {
  box-shadow: 0 6px 16px rgba(236, 72, 153, 0.5);
}

.theme-pink .input-icon-btn {
  color: #ec4899;
}

.theme-pink .input-icon-btn:hover {
  background: rgba(236, 72, 153, 0.1);
}

.theme-pink .sidebar-btn:hover {
  background: rgba(236, 72, 153, 0.08);
  color: #831843;
}

.theme-pink .sidebar-footer {
  border-top: 1px solid rgba(236, 72, 153, 0.15);
}

.theme-pink .input-status,
.theme-pink .powered-by {
  color: #be185d;
}

.theme-pink .message-meta {
  color: #be185d;
}

/* Sidebar */
.sidebar {
  width: 320px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  padding: 20px;
  transition: all 0.3s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  position: relative;
}

.sidebar-close-btn {
  display: none;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: absolute;
  right: 0;
  top: 0;
}

.sidebar-close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.sidebar-close-btn:active {
  transform: scale(0.95);
}

.app-logo {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.app-info {
  flex: 1;
}

.app-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.app-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #4caf50;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #9e9e9e;
  border-radius: 50%;
}

.status-dot.online {
  background: #4caf50;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.new-chat-btn {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.new-chat-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* Search */
.search-container {
  position: relative;
  margin: 24px 0;
}

.search-input {
  width: 100%;
  padding: 12px 40px;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  border: none;
}

.search-input::placeholder {
  color: #999;
}

.search-input:focus {
  box-shadow: 0 0 0 2px #3b82f6;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #3b82f6;
  pointer-events: none;
}

.clear-search-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-search-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

/* Conversations */
.conversations-section {
  flex: 1;
  margin-top: 16px;
  overflow-y: auto;
}

.conversations-title {
  font-size: 11px;
  font-weight: 600;
  color: #666;
  margin-bottom: 16px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.conversations-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.conversation-item {
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.conversation-item:hover {
  transform: translateX(4px);
}

.conversation-item.active {
  background: rgba(59, 130, 246, 0.1) !important;
  border-left: 3px solid #3b82f6;
}

.conv-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.conversation-content {
  flex: 1;
  min-width: 0;
}

.conversation-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-time {
  font-size: 12px;
  color: #999;
}

.delete-conversation-btn {
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0;
}

.conversation-item:hover .delete-conversation-btn {
  opacity: 1;
}

.delete-conversation-btn:hover {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.no-conversations {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
  font-style: italic;
}

/* Sidebar Footer */
.sidebar-footer {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.sidebar-btn {
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.sidebar-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #3b82f6;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 10px;
  margin-top: 8px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #00bcd4, #00acc1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.user-email {
  font-size: 12px;
  color: #999;
}

/* Chat Container */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
}

.chat-header {
  padding: 20px 30px;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
  margin: 0;
}

.mobile-menu-btn svg {
  width: 22px;
  height: 22px;
}

.mobile-menu-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.mobile-menu-btn:active {
  transform: scale(0.95);
}

.theme-dark .mobile-menu-btn {
  color: #f1f5f9;
}

.theme-dark .mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.theme-pink .mobile-menu-btn {
  color: #fce7f3;
}

.theme-pink .mobile-menu-btn:hover {
  background: rgba(249, 168, 212, 0.2);
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.ai-info {
  display: flex;
  flex-direction: column;
}

.ai-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.ai-status {
  font-size: 13px;
  color: #4caf50;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.theme-switcher {
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.05);
  padding: 6px;
  border-radius: 12px;
}

.theme-dark .theme-switcher {
  background: rgba(255, 255, 255, 0.05);
}

.theme-pink .theme-switcher {
  background: rgba(219, 39, 119, 0.08);
}

.theme-option {
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #666;
}

.theme-option:hover {
  background: rgba(0, 0, 0, 0.1);
}

.theme-option.active {
  background: #3b82f6;
  color: white;
}

.pink-icon {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #ec407a, #f48fb1);
  border-radius: 50%;
}

/* Messages */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.welcome-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
}

.welcome-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
}

.welcome-subtitle {
  font-size: 18px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 600px;
}

.quick-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.quick-action-btn {
  padding: 12px 24px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 10px;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  background: rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.message {
  display: flex;
  margin-bottom: 24px;
  animation: fadeIn 0.3s ease;
  gap: 12px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  justify-content: flex-end;
}

.message-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.message-avatar.user {
  background: linear-gradient(135deg, #00bcd4, #00acc1);
  font-weight: 600;
  font-size: 14px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 70%;
}

.message.user .message-wrapper {
  align-items: flex-end;
}

.message-content {
  padding: 16px 20px;
  border-radius: 18px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.message.user .message-content {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.ai .message-content {
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-text {
  font-size: 15px;
  line-height: 1.6;
  flex: 1;
}

.message-play-btn {
  background: rgba(59, 130, 246, 0.1);
  border: none;
  color: #3b82f6;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0.8;
}

.message-play-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  opacity: 1;
  transform: scale(1.05);
}

.message.user .message-play-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.message.user .message-play-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.message-meta {
  font-size: 11px;
  color: #999;
  padding: 0 8px;
}

.message.user .message-meta {
  text-align: right;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
} 