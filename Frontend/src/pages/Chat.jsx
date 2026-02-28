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
    Paperclip,
    Trash2,
    Volume2,
    Menu,
    Sun,
    Moon,
    Mic,
    LogOut,
    Code,
    PenTool
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
    const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);
    const headerMenuRef = useRef(null);
    const headerMenuButtonRef = useRef(null);
    const navigate = useNavigate();
    const [user] = useState(JSON.parse(localStorage.getItem('user')) || { fullName: 'User', email: 'user@example.com' });

    const filteredConversations = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        } // redirect to login page

        if (!socketRef.current) {
            const socketUrl = import.meta.env.PROD ? '/' : 'http://localhost:3000';
            socketRef.current = io(socketUrl, {
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
            setTimeout(() => setIsConnected(true), 0);
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
            setTimeout(() => setRecognition(recognitionInstance), 0);
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
            setTimeout(() => {
                setConversations(prev => prev.map(conv =>
                    conv.id === currentConversationId
                        ? { ...conv, messages: messages }
                        : conv
                ));
            }, 0);
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

    // Close header menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                headerMenuRef.current &&
                !headerMenuRef.current.contains(event.target) &&
                headerMenuButtonRef.current &&
                !headerMenuButtonRef.current.contains(event.target)
            ) {
                setIsHeaderMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close header menu on Escape
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setIsHeaderMenuOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 1400);
        return () => clearTimeout(t);
    }, [toast]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
        <div className="flex h-[100dvh] bg-zd-canvas overflow-hidden font-sans text-zd-ink">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-zd-ink/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed lg:relative z-50 w-[85vw] sm:w-80 h-full bg-zd-surface border-r border-zd-border transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-zd-border bg-zd-surface/60 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zd-brand to-zd-brand2 flex items-center justify-center text-white shadow-lg shadow-[rgba(125,89,255,0.25)]">
                            <span className="font-extrabold text-xs">K</span>
                        </div>
                        <div className="pr-2">
                            <h1 className="font-bold text-lg tracking-tight text-zd-ink pr-1">KyroBot</h1>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-zd-border'}`}></span>
                                <span className="text-xs font-medium text-zd-muted">{isConnected ? 'Online' : 'Offline'}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        className="lg:hidden p-2 text-zd-muted/70 hover:text-zd-ink rounded-lg hover:bg-zd-surface2 transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="p-4">
                    <button
                        onClick={handleNewChat}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-zd-brand to-zd-brand2 hover:from-zd-brand2 hover:to-zd-brand2 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[rgba(125,89,255,0.20)] transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={20} />
                        <span>New Conversation</span>
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 mb-2">
                    <div className="relative group">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zd-muted/70 group-focus-within:text-zd-brand transition-colors" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-2.5 pl-10 pr-8 bg-zd-surface2 border border-zd-border rounded-lg text-sm text-zd-ink focus:outline-none focus:ring-2 focus:ring-zd-brand/20 focus:border-zd-brand transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zd-muted/70 hover:text-zd-ink"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1 custom-scrollbar">
                    <h3 className="px-3 text-xs font-bold text-zd-muted/70 uppercase tracking-wider mb-3 mt-4">History</h3>
                    {filteredConversations.length > 0 ? (
                        filteredConversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => handleConversationClick(conv.id)}
                                className={`group relative p-3 rounded-xl cursor-pointer transition-all ${currentConversationId === conv.id
                                    ? 'bg-zd-brandSoft text-zd-ink border border-zd-border shadow-sm'
                                    : 'hover:bg-zd-surface2 text-zd-muted hover:text-zd-ink border border-transparent'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <MessageCircle size={18} className={`mt-1 shrink-0 ${currentConversationId === conv.id ? 'text-zd-brand' : 'text-zd-muted/70'}`} />
                                    <div className="flex-1 min-w-0 pr-6">
                                        <h4 className="font-medium truncate text-sm">{conv.title}</h4>
                                        <p className={`text-xs truncate mt-0.5 ${currentConversationId === conv.id ? 'text-zd-muted' : 'text-zd-muted/70'}`}>
                                            {conv.lastMessage}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                                    className="absolute right-2 top-3 p-1.5 text-zd-muted/70 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-zd-muted/70 text-sm">
                            <MessageCircle size={32} className="mb-2 opacity-20" />
                            <p>{searchQuery ? 'No chats found' : 'No history yet'}</p>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-zd-border bg-zd-surface2/60">
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-zd-surface transition-colors border border-transparent hover:border-zd-border hover:shadow-sm group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zd-brand to-zd-brand2 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {user?.fullName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-zd-ink truncate">{user?.fullName || 'User'}</div>
                            <div className="text-xs text-zd-muted truncate">{user?.email || 'user@example.com'}</div>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-zd-muted/70 hover:text-red-600 transition-colors" title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 min-w-0 flex flex-col h-full bg-gradient-to-br from-zd-canvas to-zd-surface2">
                {/* Chat Header */}
                <div className="h-16 bg-zd-surface/70 backdrop-blur-xl border-b border-zd-border/70 flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-20">
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden p-2 -ml-2 text-zd-muted hover:bg-zd-surface2 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <div className="w-9 h-9 rounded-full bg-zd-brandSoft text-zd-brand flex items-center justify-center border border-zd-surface shadow-sm">
                            <span className="font-extrabold text-xs">K</span>
                        </div>
                        <div className="pr-2">
                            <h2 className="font-bold text-zd-ink text-sm pr-1">KyroBot</h2>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-zd-border'}`}></span>
                                <span className="text-xs text-zd-muted font-medium">{isConnected ? 'Active' : 'Connecting...'}</span>
                            </div>
                        </div>
                    </div>
                    {/* Header Actions */}
                    <div className="relative flex items-center gap-2 z-[2001]">
                        <span className="hidden sm:inline text-xs font-bold text-zd-muted uppercase tracking-wider">
                            Quick actions
                        </span>
                        <button
                            ref={headerMenuButtonRef}
                            onClick={() => setIsHeaderMenuOpen((prev) => !prev)}
                            className={`p-2 text-zd-muted/70 hover:text-zd-ink hover:bg-zd-surface2 rounded-lg transition-colors ${isHeaderMenuOpen ? 'bg-zd-surface2 text-zd-ink' : ''}`}
                            aria-haspopup="menu"
                            aria-expanded={isHeaderMenuOpen}
                            title="More"
                        >
                            <div className="w-5 h-5 flex items-center justify-center">
                                <span className="text-xl leading-none pb-2">...</span>
                            </div>
                        </button>

                        {isHeaderMenuOpen && (
                            <div
                                ref={headerMenuRef}
                                className="absolute right-0 top-full mt-2 w-56 bg-zd-surface/95 backdrop-blur-xl border border-zd-border/80 rounded-2xl shadow-xl shadow-[rgba(125,89,255,0.1)] z-[100] overflow-hidden animate-fade-in origin-top-right transform transition-all"
                                role="menu"
                            >
                                <div className="p-1.5 flex flex-col gap-0.5">
                                    <button
                                        onClick={() => {
                                            handleNewChat();
                                            setIsHeaderMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zd-ink hover:bg-zd-surface2 rounded-xl transition-all duration-200 group"
                                        role="menuitem"
                                    >
                                        <div className="p-1.5 bg-zd-brandSoft rounded-lg text-zd-brand group-hover:bg-zd-brand group-hover:text-white transition-colors">
                                            <Plus size={14} />
                                        </div>
                                        New conversation
                                    </button>

                                    <button
                                        onClick={() => {
                                            switchTheme(theme === 'dark' ? 'light' : 'dark');
                                            setIsHeaderMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zd-ink hover:bg-zd-surface2 rounded-xl transition-all duration-200 group"
                                        role="menuitem"
                                    >
                                        <div className="p-1.5 bg-zd-surface2 rounded-lg text-zd-muted group-hover:bg-zd-ink group-hover:text-white transition-colors">
                                            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                                        </div>
                                        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                                    </button>

                                    <div className="h-px bg-zd-border/50 my-1 mx-2"></div>

                                    <button
                                        onClick={() => {
                                            setMessages([]);
                                            if (currentConversationId) {
                                                setConversations(prev => prev.map(conv =>
                                                    conv.id === currentConversationId
                                                        ? { ...conv, messages: [], lastMessage: '', timestamp: 'Just now' }
                                                        : conv
                                                ));
                                            }
                                            setIsHeaderMenuOpen(false);
                                            setToast('Cleared chat');
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                                        role="menuitem"
                                    >
                                        <div className="p-1.5 bg-red-50 rounded-lg text-red-500 group-hover:bg-red-200/50 transition-colors">
                                            <Trash2 size={14} />
                                        </div>
                                        Clear chat
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {toast && (
                    <div className="fixed top-20 right-4 z-[80]">
                        <div className="px-3 py-2 rounded-xl bg-zd-ink text-zd-canvas text-sm font-semibold shadow-xl">
                            {toast}
                        </div>
                    </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 min-h-0 overflow-y-auto px-4 lg:px-8 py-5 custom-scrollbar scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="min-h-full flex flex-col items-center justify-start sm:justify-center text-center max-w-3xl mx-auto py-6 sm:py-0 animate-fade-in-up">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zd-ink mb-3 sm:mb-4 tracking-tight px-2">
                                How can I help you today?
                            </h2>
                            <p className="text-zd-muted mb-8 sm:mb-12 text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed px-4">
                                I'm your advanced AI assistant. Ask me to write code, analyze data, or generate creative content.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full px-2 sm:px-4">
                                {[
                                    { icon: Search, label: "Brainstorm ideas", sub: "for a marketing campaign", color: "text-zd-brand", bg: "bg-zd-brandSoft group-hover:bg-zd-brandSoft/70" },
                                    { icon: Code, label: "Write code", sub: "for a react component", color: "text-zd-brand2", bg: "bg-zd-brandSoft group-hover:bg-zd-brandSoft/70" },
                                    { icon: PenTool, label: "Draft an email", sub: "to a client", color: "text-zd-brand", bg: "bg-zd-brandSoft group-hover:bg-zd-brandSoft/70" },
                                    { icon: ImageIcon, label: "Explain concepts", sub: "in simple terms", color: "text-zd-brand2", bg: "bg-zd-brandSoft group-hover:bg-zd-brandSoft/70" }
                                ].map((action, i) => (
                                    <button key={i} className="p-4 sm:p-5 bg-zd-surface hover:bg-zd-surface border border-zd-border/80 hover:border-zd-brand/35 rounded-2xl text-left transition-all duration-300 hover:shadow-lg hover:shadow-[rgba(125,89,255,0.06)] hover:-translate-y-1 group">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className={`p-2.5 ${action.bg} ${action.color} rounded-xl transition-colors`}>
                                                <action.icon size={20} />
                                            </div>
                                            <span className="font-bold text-zd-ink">{action.label}</span>
                                        </div>
                                        <div className="text-sm text-zd-muted/80 pl-[3.25rem]">{action.sub}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm text-sm font-bold ${msg.sender === 'user'
                                        ? 'bg-gradient-to-tr from-zd-brand to-zd-brand2 text-white'
                                        : 'bg-zd-surface border border-zd-border text-zd-brand'
                                        }`}>
                                        {msg.sender === 'user' ? 'I' : <Brain size={16} />}
                                    </div>

                                    <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[90%] sm:max-w-[85%] lg:max-w-[75%]`}>
                                        <div className={`py-2.5 px-4 sm:py-3 sm:px-5 rounded-2xl shadow-sm text-sm sm:text-[15px] leading-relaxed break-words whitespace-pre-wrap ${msg.sender === 'user'
                                            ? 'bg-zd-brand text-white rounded-tr-none'
                                            : 'bg-zd-surface border border-zd-border text-zd-ink rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1.5 px-1">
                                            <span className="text-[10px] uppercase font-bold text-zd-muted/70 tracking-wider">
                                                {msg.timestamp}
                                            </span>
                                            {msg.sender === 'ai' && (
                                                <button onClick={() => handlePlayMessage(msg.text)} className="text-zd-muted/70 hover:text-zd-brand transition-colors" title="Read aloud">
                                                    <Volume2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-4 animate-fade-in">
                                    <div className="w-8 h-8 rounded-full bg-zd-surface border border-zd-border text-zd-brand flex items-center justify-center shadow-sm">
                                        <Brain size={16} />
                                    </div>
                                    <div className="bg-zd-surface border border-zd-border py-3 px-5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-zd-brand rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-zd-brand rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-zd-brand rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:p-6 border-t border-zd-border/60 bg-zd-surface/70 backdrop-blur-xl shrink-0">
                    <div className="max-w-4xl mx-auto">
                        <div className={`relative flex items-center gap-2 bg-zd-surface border transition-all duration-300 rounded-[2rem] p-2 shadow-2xl shadow-[rgba(31,27,26,0.06)] ${inputMessage ? 'border-zd-brand ring-4 ring-zd-brand/10' : 'border-zd-border'}`}>
                            <button className="p-3 text-zd-muted/70 hover:text-zd-brand hover:bg-zd-brandSoft rounded-full transition-colors shrink-0" title="Attach files">
                                <Paperclip size={22} />
                            </button>

                            <form onSubmit={handleSendMessage} className="flex-1 flex items-center">
                                <textarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                    placeholder="Message KyroBot..."
                                    className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none text-zd-ink placeholder-zd-muted/70 resize-none py-2 sm:py-3 px-1 sm:px-2 text-sm sm:text-base md:text-lg leading-relaxed max-h-32 custom-scrollbar"
                                    rows={1}
                                    style={{ minHeight: '24px', boxShadow: 'none' }}
                                />
                            </form>

                            <div className="flex items-center gap-1 pr-1 shrink-0">
                                {inputMessage.trim() ? (
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!isConnected}
                                        className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${isConnected
                                            ? 'bg-zd-brand text-white shadow-lg shadow-[rgba(125,89,255,0.30)] hover:bg-zd-brand2 hover:scale-105 active:scale-95'
                                            : 'bg-zd-surface2 text-zd-muted/50 cursor-not-allowed'
                                            }`}
                                        title="Send message"
                                    >
                                        <Send size={20} className="ml-0.5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={toggleVoiceInput}
                                        className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${isListening
                                            ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                                            : 'text-zd-muted/70 hover:text-zd-brand hover:bg-zd-brandSoft'}`}
                                        title={isListening ? "Stop listening" : "Voice input"}
                                    >
                                        <Mic size={22} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="text-center mt-3 text-xs font-medium text-zd-muted/70 flex items-center justify-center gap-2">
                            <span>Powered by KyroBot</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;