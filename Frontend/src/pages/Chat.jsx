import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { io } from 'socket.io-client';
import {
    MessageCircle,
    Send,
    Plus,
    X,
    Search,
    Brain,
    Image as ImageIcon,
    BarChart3,
    Paperclip,
    Trash2,
    Volume2,
    Menu,
    Sun,
    Moon,
    Mic
} from 'lucide-react';

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
    const socketRef = useRef(null);
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { fullName: 'User', email: 'user@example.com' });

    const filteredConversations = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (!socketRef.current) {
            socketRef.current = io('http://localhost:3000', {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 2000
            });
        }

        const onConnect = () => {
            console.log('✅ Connected to server');
            setIsConnected(true);
        };

        const onDisconnect = () => {
            console.log('❌ Disconnected from server');
            setIsConnected(false);
        };

        const onResponse = (response) => {
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
        };

        socketRef.current.on('connect', onConnect);
        socketRef.current.on('disconnect', onDisconnect);
        socketRef.current.on('ai-message-response', onResponse);

        // Sync initial connection state
        if (socketRef.current.connected) {
            setIsConnected(true);
        }

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

            recognitionInstance.onend = () => setIsListening(false);
            recognitionInstance.onerror = () => setIsListening(false);
            setRecognition(recognitionInstance);
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off('connect', onConnect);
                socketRef.current.off('disconnect', onDisconnect);
                socketRef.current.off('ai-message-response', onResponse);
            }
        };
    }, [navigate]);

    useEffect(() => {
        if (currentConversationId && messages.length > 0) {
            setConversations(prev => prev.map(conv =>
                conv.id === currentConversationId
                    ? { ...conv, messages: messages }
                    : conv
            ));
        }
    }, [messages, currentConversationId]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !socketRef.current) return;

        if (!isConnected) {
            alert('Wait, the AI is still connecting... Please check if your backend server is running.');
            return;
        }

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

        socketRef.current.emit('ai-message', {
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className={`chat-app-layout theme-${theme}`}>
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
                    <button className="sidebar-btn" onClick={handleLogout}>
                        <X size={20} />
                        Logout
                    </button>
                    <div className="user-info">
                        <div className="user-avatar">{user?.fullName?.[0]?.toUpperCase() || 'U'}</div>
                        <div className="user-details">
                            <div className="user-name">{user?.fullName || 'User'}</div>
                            <div className="user-email">{user?.email || 'user@example.com'}</div>
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