import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Send, Search, Paperclip, MoreHorizontal, Smile, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EmojiPicker from 'emoji-picker-react';

const MessagingPage = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const onEmojiClick = (emojiObject) => {
        setMessage((prevMsg) => prevMsg + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const contacts = [
        { id: 1, name: 'Admin Étudiant', role: 'Support', status: 'en ligne', lastMsg: 'J\'ai mis à jour le statut...', time: '2m', unread: 2 },
        { id: 2, name: 'Déléguée Wiem', role: 'Délégué', status: 'hors ligne', lastMsg: 'La réunion est prévue à 14h.', time: '1h', unread: 0 },
        { id: 3, name: 'Amri Mahmoud', role: 'Étudiant', status: 'en ligne', lastMsg: 'Merci pour l\'annonce.', time: '3h', unread: 0 }
    ];

    const [activeContact, setActiveContact] = useState(contacts[0]);

    return (
        <DashboardLayout title="Messagerie Interne">
            <div className="h-[calc(100vh-160px)] flex gap-6 overflow-hidden">
                {/* Contact List */}
                <div className="w-80 card p-0 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-800">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">Messages</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-full bg-slate-50 dark:bg-slate-800 text-xs py-2.5 pl-9 pr-4 rounded-xl border-none focus:ring-1 focus:ring-primary-500 outline-none dark:text-slate-200"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {contacts.map((c) => (
                            <div
                                key={c.id}
                                onClick={() => setActiveContact(c)}
                                className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-l-4 ${activeContact.id === c.id ? 'bg-primary-50/30 dark:bg-primary-900/10 border-primary-600' : 'border-transparent'}`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                                        {c.name.charAt(0)}
                                    </div>
                                    {c.status === 'en ligne' && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{c.name}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">{c.time}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate pr-2">{c.lastMsg}</p>
                                        {c.unread > 0 && <span className="w-4 h-4 bg-primary-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{c.unread}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 card p-0 flex flex-col overflow-hidden">
                    {/* Chat Header */}
                    <div className="h-20 px-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
                                {activeContact.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">{activeContact.name}</h4>
                                <div className="flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${activeContact.status === 'en ligne' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{activeContact.status}</span>
                                </div>
                            </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/30 dark:bg-slate-950/20">
                        <div className="flex justify-center mb-4">
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800 uppercase tracking-widest shadow-sm">Aujourd'hui</span>
                        </div>

                        <div className="flex justify-start">
                            <div className="max-w-[70%] bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm relative group">
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Bonjour ! J'ai examiné votre demande concernant les horaires d'examen. Nous allons faire une annonce officielle demain.</p>
                                <div className="flex items-center justify-end gap-1 mt-2">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">10:45</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <div className="max-w-[70%] bg-primary-600 text-white p-4 rounded-2xl rounded-tr-none shadow-lg shadow-primary-200 dark:shadow-none">
                                <p className="text-sm leading-relaxed font-medium">C'est parfait, merci beaucoup pour votre réactivité ! Les étudiants attendent cette information avec impatience.</p>
                                <div className="flex items-center justify-end gap-1 mt-2 text-primary-200">
                                    <span className="text-[9px] font-bold uppercase tracking-tighter">10:48</span>
                                    <CheckCheck size={12} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 relative">
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
                            <button className="p-2.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all">
                                <Paperclip size={20} />
                            </button>
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Écrivez votre message..."
                                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 h-10"
                            />
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-2.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all ${showEmojiPicker ? 'text-primary-600 bg-white dark:bg-slate-700' : 'text-slate-400 hover:text-primary-600 dark:hover:text-primary-400'}`}
                            >
                                <Smile size={20} />
                            </button>
                            <button className="bg-primary-600 text-white p-2.5 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none scale-100 active:scale-95">
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MessagingPage;
