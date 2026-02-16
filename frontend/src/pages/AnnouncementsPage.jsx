import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Megaphone, Calendar, User, Plus, Search, Trash2 } from 'lucide-react';

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await api.get('/announcements');
            setAnnouncements(response.data);
        } catch (err) {
            console.error('Failed to fetch', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('content', formData.content);
            if (formData.file) {
                data.append('file', formData.file);
            }

            await api.post('/announcements', data);
            setShowForm(false);
            setFormData({ title: '', content: '' });
            fetchAnnouncements();
        } catch (err) {
            console.error('Failed to post announcement:', err.response || err);
            const status = err.response?.status;
            const message = err.response?.data?.message || err.response?.data?.error || err.message;
            alert(`Échec de publication: ${status ? 'Erreur ' + status : ''} ${message}`);
        }
    };

    return (
        <DashboardLayout title="Annonces Officielles">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Rechercher des annonces..." className="input pl-10 bg-white" />
                    </div>
                    {user.role !== 'ROLE_STUDENT' && (
                        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                            <Plus size={18} />
                            <span>Publier</span>
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200 mx-auto">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800">Nouvelle Annonce</h3>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input
                                className="input"
                                placeholder="Titre de l'annonce"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <textarea
                                className="input min-h-[150px]"
                                placeholder="Que voulez-vous annoncer ?..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            ></textarea>
                            <input
                                type="file"
                                className="input p-2"
                                onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                                accept="image/*,.pdf"
                            />
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Annuler</button>
                                <button type="submit" className="btn-primary px-8">Publier</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {loading ? (
                        <div className="col-span-full py-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>
                    ) : announcements.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-slate-400">Aucune annonce pour le moment.</div>
                    ) : (
                        announcements.map((announcement) => (
                            <div key={announcement.id} className="card flex flex-col group hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                        Officiel
                                    </span>
                                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase">
                                        <Calendar size={12} />
                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 leading-tight group-hover:text-primary-600 transition-colors">{announcement.title}</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm flex-1 leading-relaxed whitespace-pre-wrap mb-6">{announcement.content}</p>

                                {announcement.attachmentUrl && (
                                    <div className="mb-6">
                                        {announcement.attachmentUrl.toLowerCase().endsWith('.pdf') ? (
                                            <a
                                                href={`http://localhost:8081/uploads/${announcement.attachmentUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm border border-red-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M10 13l-2-2m0 0l2-2m-2 2h8m-2 4l2 2m0 0l2-2m-2 2v-8" /></svg>
                                                Voir le document PDF
                                            </a>
                                        ) : (
                                            <img
                                                src={`http://localhost:8081/uploads/${announcement.attachmentUrl}`}
                                                alt="Attachment"
                                                className="w-full h-48 object-cover rounded-lg border border-slate-100"
                                            />
                                        )}
                                    </div>
                                )}

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                                            {announcement.delegateName?.charAt(0) || 'A'}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Publié par {announcement.delegateName || 'Admin'}</span>
                                    </div>
                                    {user?.role !== 'ROLE_STUDENT' && (
                                        <button className="text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AnnouncementsPage;
