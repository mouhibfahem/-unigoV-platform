import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Send, Search, Paperclip, MoreHorizontal, Smile, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EmojiPicker from 'emoji-picker-react';
import api from '../services/api';

const MessagingPage = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isStartingNew, setIsStartingNew] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const onEmojiClick = (emojiObject) => {
        setMessage((prevMsg) => prevMsg + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const fetchConversations = async () => {
        try {
            const res = await api.getConversations();
            setConversations(res.data);
            if (!activeContact && res.data.length > 0) {
                // Automatic selection of first conversation if no contact active
                fetchHistory(res.data[0].otherUserId);
                setActiveContact({ id: res.data[0].otherUserId, name: res.data[0].otherUserName });
            }
        } catch (err) {
            console.error('Failed to fetch conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async (userId) => {
        try {
            const res = await api.getConversationHistory(userId);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to fetch history:', err);
        }
    };

    const fetchPossibleContacts = async () => {
        try {
            const res = await api.getContacts();
            setContacts(res.data);
        } catch (err) {
            console.error('Failed to fetch contacts:', err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        fetchConversations();
        fetchPossibleContacts();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !activeContact || sending) return;

        setSending(true);
        try {
            const userId = activeContact.otherUserId || activeContact.id;
            await api.sendMessage({
                content: message,
                recipientId: userId
            });
            setMessage('');
            await fetchHistory(userId);
            fetchConversations();
        } catch (err) {
            console.error('Failed to send message:', err);
            alert("Erreur lors de l'envoi. Vérifiez les droits.");
        } finally {
            setSending(false);
        }
    };

    const handleSelectContact = (c) => {
        setActiveContact(c);
        fetchHistory(c.otherUserId || c.id);
    };

    return (
        <DashboardLayout title="Messagerie Interne">
            <div className="h-[calc(100vh-160px)] flex gap-6 overflow-hidden">
                {/* Contact List */}
                <div className="w-80 card p-0 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Messages</h3>
                        <button
                            onClick={() => setIsStartingNew(!isStartingNew)}
                            className={`p-2 rounded-xl transition-all ${isStartingNew ? 'bg-primary-600 text-white' : 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}
                            title="Nouveau message"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 text-xs py-2.5 pl-9 pr-4 rounded-xl border-none focus:ring-1 focus:ring-primary-500 outline-none dark:text-slate-200"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400 text-sm">Chargement...</div>
                        ) : isStartingNew ? (
                            <div className="p-2 space-y-1">
                                <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nouvelle Discussion</p>
                                {contacts
                                    .filter(c => {
                                        const query = searchQuery.toLowerCase();
                                        return (c.fullName?.toLowerCase().includes(query) ||
                                            c.username?.toLowerCase().includes(query));
                                    })
                                    .map((c) => (
                                        <div
                                            key={c.id}
                                            onClick={() => {
                                                handleSelectContact(c);
                                                setIsStartingNew(false);
                                                setSearchQuery('');
                                            }}
                                            className="p-3 mx-2 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all"
                                        >
                                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold uppercase text-xs">
                                                {c.fullName?.charAt(0) || c.username?.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{c.fullName || c.username || 'Utilisateur'}</p>
                                                <p className="text-[10px] text-primary-600 font-medium">{(c.role || "").replace('ROLE_', '')}</p>
                                            </div>
                                        </div>
                                    ))}
                                {contacts.filter(c => {
                                    const query = searchQuery.toLowerCase();
                                    return (c.fullName?.toLowerCase().includes(query) ||
                                        c.username?.toLowerCase().includes(query));
                                }).length === 0 && (
                                        <div className="p-8 text-center space-y-4">
                                            <p className="text-slate-400 text-xs italic">Aucun contact trouvé.</p>
                                            <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                                                <p className="text-[10px] text-slate-500 uppercase font-bold">Diagnostic</p>
                                                <p className="text-[10px] text-slate-400">Contacts reçus: {contacts.length}</p>
                                                <p className="text-[10px] text-slate-400">Votre rôle: {user?.role}</p>
                                                <p className="text-[10px] text-slate-400">Utilisateur: {user?.username}</p>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ) : conversations.length > 0 ? (
                            conversations
                                .filter(c => (c.otherUserName || "").toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((c) => (
                                    <div
                                        key={c.otherUserId}
                                        onClick={() => handleSelectContact(c)}
                                        className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-l-4 ${activeContact?.id === c.otherUserId || activeContact?.otherUserId === c.otherUserId ? 'bg-primary-50/30 dark:bg-primary-900/10 border-primary-600' : 'border-transparent'}`}
                                    >
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold uppercase">
                                                {(c.otherUserName || "?").charAt(0)}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{c.otherUserName}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {c.lastTimestamp ? new Date(c.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate pr-2">{c.lastMessage}</p>
                                                {c.unreadCount > 0 && <span className="w-4 h-4 bg-primary-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{c.unreadCount}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="p-8 text-center">
                                <div className="mb-6">
                                    <p className="text-slate-400 text-sm mb-2">Aucune conversation.</p>
                                    <button
                                        onClick={() => setIsStartingNew(true)}
                                        className="text-xs text-primary-600 font-bold hover:underline"
                                    >
                                        Démarrer une discussion
                                    </button>
                                </div>

                                {contacts.length > 0 && (
                                    <div className="text-left">
                                        <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-t border-slate-50 dark:border-slate-800 pt-6">Suggestions</p>
                                        <div className="space-y-1">
                                            {contacts.slice(0, 3).map((c) => (
                                                <div
                                                    key={c.id}
                                                    onClick={() => handleSelectContact(c)}
                                                    className="p-3 mx-2 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all border border-transparent hover:border-primary-100 dark:hover:border-primary-900/30"
                                                >
                                                    <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold uppercase text-xs">
                                                        {c.fullName?.charAt(0) || c.username?.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">{c.fullName || c.username || 'Utilisateur'}</p>
                                                        <p className="text-[9px] text-slate-500 font-medium">{(c.role || "").replace('ROLE_', '')}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 card p-0 flex flex-col overflow-hidden">
                    {!activeContact ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <Send size={48} className="mb-4 opacity-20" />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Vos Messages</h3>
                            <p className="max-w-xs text-sm">Sélectionnez une conversation pour commencer à discuter en toute confidentialité.</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="h-20 px-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold uppercase">
                                        {(activeContact.otherUserName || activeContact.name || activeContact.fullName)?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">
                                            {activeContact.otherUserName || activeContact.name || activeContact.fullName || activeContact.username}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Privé</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/30 dark:bg-slate-950/20">
                                {messages.map((m) => (
                                    <div key={m.id} className={`flex ${m.senderUsername === user?.username ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm relative group ${m.senderUsername === user?.username
                                            ? 'bg-primary-600 text-white rounded-tr-none shadow-primary-200 dark:shadow-none'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-tl-none border border-slate-100 dark:border-slate-700'
                                            }`}>
                                            <p className="text-sm leading-relaxed">{m.content}</p>
                                            <div className={`flex items-center justify-end gap-1 mt-2 ${m.senderUsername === user.username ? 'text-primary-200' : 'text-slate-400'}`}>
                                                <span className="text-[9px] font-bold uppercase tracking-tighter">
                                                    {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                                {m.senderUsername === user?.username && (
                                                    m.isRead ? <CheckCheck size={12} /> : <Check size={12} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat Input */}
                            <form
                                onSubmit={handleSendMessage}
                                className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 relative"
                            >
                                {showEmojiPicker && (
                                    <div className="absolute bottom-24 right-6 z-50">
                                        <EmojiPicker
                                            onEmojiClick={onEmojiClick}
                                            theme="auto"
                                            searchDisabled
                                            skinTonesDisabled
                                            width={300}
                                            height={400}
                                        />
                                    </div>
                                )}
                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-transparent focus-within:border-primary-100 dark:focus-within:border-primary-900 transition-all">
                                    <button type="button" className="p-2.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all">
                                        <Paperclip size={20} />
                                    </button>
                                    <input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Écrivez votre message..."
                                        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 h-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className={`p-2.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all ${showEmojiPicker ? 'text-primary-600 bg-white dark:bg-slate-700' : 'text-slate-400 hover:text-primary-600 dark:hover:text-primary-400'}`}
                                    >
                                        <Smile size={20} />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={sending || !message.trim()}
                                        className={`p-2.5 rounded-xl transition-all shadow-lg scale-100 active:scale-95 ${sending || !message.trim() ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200 dark:shadow-none'}`}
                                    >
                                        <Send size={20} className={sending ? 'animate-pulse' : ''} />
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MessagingPage;
