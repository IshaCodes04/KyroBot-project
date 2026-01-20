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
        } // redirect to login page

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
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed lg:relative z-50 w-80 h-full bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 bg-white/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                            <MessageCircle size={18} />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight text-slate-900">AI ChatBot</h1>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                <span className="text-xs font-medium text-slate-500">{isConnected ? 'Online' : 'Offline'}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="p-4">
                    <button
                        onClick={handleNewChat}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={20} />
                        <span>New Conversation</span>
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 mb-2">
                    <div className="relative group">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-2.5 pl-10 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1 custom-scrollbar">
                    <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 mt-4">History</h3>
                    {filteredConversations.length > 0 ? (
                        filteredConversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => handleConversationClick(conv.id)}
                                className={`group relative p-3 rounded-xl cursor-pointer transition-all ${currentConversationId === conv.id
                                    ? 'bg-cyan-50 text-cyan-900 border border-cyan-100 shadow-sm'
                                    : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <MessageCircle size={18} className={`mt-1 shrink-0 ${currentConversationId === conv.id ? 'text-cyan-600' : 'text-slate-400'}`} />
                                    <div className="flex-1 min-w-0 pr-6">
                                        <h4 className="font-medium truncate text-sm">{conv.title}</h4>
                                        <p className={`text-xs truncate mt-0.5 ${currentConversationId === conv.id ? 'text-cyan-600/70' : 'text-slate-400'}`}>
                                            {conv.lastMessage}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                                    className="absolute right-2 top-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
                            <MessageCircle size={32} className="mb-2 opacity-20" />
                            <p>{searchQuery ? 'No chats found' : 'No history yet'}</p>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {user?.fullName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-slate-900 truncate">{user?.fullName || 'User'}</div>
                            <div className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</div>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative bg-gradient-to-br from-slate-50 to-blue-50/50">
                {/* Chat Header */}
                <div className="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 lg:px-8 absolute top-0 left-0 right-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-600 flex items-center justify-center border border-white shadow-sm">
                            <Brain size={18} />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 text-sm">Gemini Assistant</h2>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`}></span>
                                <span className="text-xs text-slate-500 font-medium">{isConnected ? 'Active' : 'Connecting...'}</span>
                            </div>
                        </div>
                    </div>
                    {/* Header Actions */}
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Settings">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <span className="text-xl leading-none pb-2">...</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto pt-20 pb-36 px-4 lg:px-8 custom-scrollbar scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto p-4 animate-fade-in-up">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-cyan-500/10 flex items-center justify-center mb-8 border border-white ring-4 ring-slate-50">
                                <Brain size={40} className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-blue-600" />
                            </div>
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">How can I help you today?</h2>
                            <p className="text-slate-500 mb-12 text-lg max-w-xl mx-auto leading-relaxed">I'm your advanced AI assistant. Ask me to write code, analyze data, or generate creative content.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-4">
                                {[
                                    { icon: Search, label: "Brainstorm ideas", sub: "for a marketing campaign", color: "text-purple-500", bg: "bg-purple-50 group-hover:bg-purple-100" },
                                    { icon: Code, label: "Write code", sub: "for a react component", color: "text-blue-500", bg: "bg-blue-50 group-hover:bg-blue-100" },
                                    { icon: PenTool, label: "Draft an email", sub: "to a client", color: "text-pink-500", bg: "bg-pink-50 group-hover:bg-pink-100" },
                                    { icon: ImageIcon, label: "Explain concepts", sub: "in simple terms", color: "text-amber-500", bg: "bg-amber-50 group-hover:bg-amber-100" }
                                ].map((action, i) => (
                                    <button key={i} className="p-5 bg-white hover:bg-white border border-slate-200/60 hover:border-cyan-300/50 rounded-2xl text-left transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-1 group">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className={`p-2.5 ${action.bg} ${action.color} rounded-xl transition-colors`}>
                                                <action.icon size={20} />
                                            </div>
                                            <span className="font-bold text-slate-800">{action.label}</span>
                                        </div>
                                        <div className="text-sm text-slate-400 pl-[3.25rem]">{action.sub}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm text-sm font-bold ${msg.sender === 'user'
                                        ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white'
                                        : 'bg-white border border-slate-200 text-cyan-600'
                                        }`}>
                                        {msg.sender === 'user' ? 'I' : <Brain size={16} />}
                                    </div>

                                    <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                                        <div className={`py-3 px-5 rounded-2xl shadow-sm text-[15px] leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-cyan-600 text-white rounded-tr-none'
                                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1.5 px-1">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                {msg.timestamp}
                                            </span>
                                            {msg.sender === 'ai' && (
                                                <button onClick={() => handlePlayMessage(msg.text)} className="text-slate-400 hover:text-cyan-600 transition-colors" title="Read aloud">
                                                    <Volume2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-4 animate-fade-in">
                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-cyan-600 flex items-center justify-center shadow-sm">
                                        <Brain size={16} />
                                    </div>
                                    <div className="bg-white border border-slate-200 py-3 px-5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 z-30 pointer-events-none">
                    <div className="max-w-4xl mx-auto pointer-events-auto">
                        <div className={`relative flex items-center gap-2 bg-white border transition-all duration-300 rounded-[2rem] p-2 shadow-2xl shadow-slate-200/60 ${inputMessage ? 'border-cyan-400 ring-4 ring-cyan-500/10' : 'border-slate-200'}`}>
                            <button className="p-3 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-colors shrink-0">
                                <Plus size={24} />
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
                                    placeholder="Message..."
                                    className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none text-slate-700 placeholder-slate-400 resize-none py-3 px-2 text-lg leading-relaxed max-h-32 custom-scrollbar"
                                    rows={1}
                                    style={{ minHeight: '24px', boxShadow: 'none' }}
                                />
                            </form>

                            <div className="flex items-center gap-1 pr-1 shrink-0">
                                {inputMessage && (
                                    <button
                                        className={`p-2.5 rounded-full transition-all duration-300 ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                        onClick={toggleVoiceInput}
                                        title="Voice Input"
                                    >
                                        <Mic size={22} />
                                    </button>
                                )}
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim() || !isConnected}
                                    className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${inputMessage.trim() && isConnected
                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 hover:bg-cyan-700 hover:scale-105 active:scale-95'
                                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                        }`}
                                >
                                    {inputMessage.trim() ? <Send size={20} className="ml-0.5" /> : <Mic size={22} />}
                                </button>
                            </div>
                        </div>
                        <div className="text-center mt-3 text-xs font-medium text-slate-400 flex items-center justify-center gap-2">
                            <span>Powered by Gemini AI</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;