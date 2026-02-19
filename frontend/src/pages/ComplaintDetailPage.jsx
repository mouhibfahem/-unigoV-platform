import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    Clock,
    CheckCircle2,
    AlertCircle,
    FileText,
    Share2,
    Download,
    MessageSquare,
    Paperclip,
    Send,
    User,
    ChevronRight,
    MapPin,
    Tag,
    History,
    Smile,
    Image as ImageIcon,
    MoreHorizontal
} from 'lucide-react';

const ComplaintDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const fetchComplaint = async () => {
        try {
            const response = await api.getComplaintById(id);
            setComplaint(response.data);
        } catch (err) {
            console.error('Failed to fetch complaint details', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = () => {
        if (!replyText.trim()) return;
        // Logic for sending message (we can extend this later)
        console.log('Sending message:', replyText);
        setReplyText('');
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'URGENT': return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400';
            case 'HIGH': return 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400';
            case 'MEDIUM': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400';
            default: return 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800';
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="Détails de la Réclamation">
                <div className="py-20 flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!complaint) {
        return (
            <DashboardLayout title="Réclamation non trouvée">
                <div className="card p-20 text-center">
                    <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">Cette réclamation n'existe pas ou a été supprimée.</p>
                    <button onClick={() => navigate('/complaints')} className="btn-primary mt-6">Retour à la liste</button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={`ID #${complaint.id.substring(0, 4).toUpperCase()}`}>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Top Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                            <span>Réclamations</span>
                            <ChevronRight size={14} />
                            <span className="text-primary-600 font-bold">Détails de l'incident</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                            {complaint.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(complaint.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span className="flex items-center gap-1.5 text-slate-500"><User size={14} /> {complaint.studentName}</span>
                            <span className="flex items-center gap-1.5 text-primary-600 font-bold">• {complaint.studentDepartment || 'Département Inconnu'}</span>
                            <span className="flex items-center gap-1.5"><Tag size={14} /> {complaint.category}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                            <Download size={16} />
                            Exporter PDF
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25">
                            <Share2 size={16} />
                            Partager
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Description and Attachments */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description Card */}
                        <div className="card !p-8 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-600">
                                        <AlertCircle size={20} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 dark:text-white">Description de l'incident</h3>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${getPriorityColor(complaint.priority)}`}>
                                    Priorité {complaint.priority}
                                </span>
                            </div>

                            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-medium">
                                {complaint.description}
                            </p>

                            <div className="grid grid-cols-2 gap-8 mt-10 pt-8 border-t border-slate-50 dark:border-slate-800/50">
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Catégorie</span>
                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                                        <Tag size={16} className="text-primary-500" />
                                        <span>{complaint.category}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Localisation</span>
                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                                        <MapPin size={16} className="text-primary-500" />
                                        <span>{complaint.location || 'Non spécifiée'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attachments Card */}
                        <div className="card !p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary-600">
                                    <Paperclip size={20} />
                                </div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white">Preuves & Pièces Jointes</h3>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {complaint.attachmentPath ? (
                                    <div className="relative group w-32 h-24 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8081'}/uploads/${complaint.attachmentPath}`}
                                            alt="Attachment"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button className="p-2 bg-white text-slate-800 rounded-lg hover:bg-white/90">
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 w-full bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                        < ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
                                        <p className="text-slate-400 text-sm font-medium">Aucun fichier joint</p>
                                    </div>
                                )}

                                {user?.role === 'ROLE_STUDENT' && (
                                    <button className="w-32 h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-500 hover:bg-primary-50 transition-all text-slate-400 hover:text-primary-600">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary-100">
                                            <Paperclip size={18} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Ajouter</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Status and Discussion */}
                    <div className="space-y-6">
                        {/* Status Tracker */}
                        <div className="card !p-8">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6">État du dossier</h3>

                            <div className="relative flex items-center justify-between mb-8 px-2">
                                {/* Connector Line */}
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2">
                                    <div
                                        className="h-full bg-primary-600 transition-all duration-1000"
                                        style={{ width: complaint.status === 'RESOLVED' ? '100%' : complaint.status === 'IN_PROGRESS' ? '50%' : '0%' }}
                                    />
                                </div>

                                <div className="relative flex flex-col items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${complaint.status === 'PENDING' ? 'bg-primary-600 ring-4 ring-primary-100 dark:ring-primary-500/20' : 'bg-primary-600'}`}>
                                        <CheckCircle2 size={14} className="text-white" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-white">Attente</span>
                                </div>

                                <div className="relative flex flex-col items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${complaint.status === 'IN_PROGRESS' ? 'bg-primary-600 ring-4 ring-primary-100 dark:ring-primary-500/20' : complaint.status === 'RESOLVED' ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                        <Clock size={14} className={complaint.status === 'PENDING' ? 'text-slate-400' : 'text-white'} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${complaint.status === 'PENDING' ? 'text-slate-400' : 'text-slate-800 dark:text-white'}`}>En cours</span>
                                </div>

                                <div className="relative flex flex-col items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${complaint.status === 'RESOLVED' ? 'bg-green-600 ring-4 ring-green-100 dark:ring-green-500/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                        <CheckCircle2 size={14} className={complaint.status === 'RESOLVED' ? 'text-white' : 'text-slate-400'} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${complaint.status === 'RESOLVED' ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>Résolu</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs font-bold pt-4 border-t border-slate-50 dark:border-slate-800/50">
                                <span className="text-slate-400 uppercase tracking-widest">Mis à jour</span>
                                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                    <History size={14} /> il y a 2 heures
                                </span>
                            </div>
                        </div>

                        {/* Discussion / Chat Section */}
                        <div className="card !p-0 flex flex-col h-[500px] overflow-hidden">
                            <div className="p-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                                <div className="flex items-center gap-3">
                                    <MessageSquare size={18} className="text-primary-600" />
                                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Discussion Officielle</h3>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Étudiant & Délégué</span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                                {/* Message from Student */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Étudiant</span>
                                        <span>10:15 AM</span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700/50 shadow-sm inline-block max-w-[90%]">
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                            Bonjour, j'ai remarqué que le problème s'aggrave pendant les examens. Des nouvelles de l'administration ?
                                        </p>
                                    </div>
                                </div>

                                {/* Status Update Indicator */}
                                <div className="flex items-center gap-4 py-2">
                                    <div className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800"></div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600">
                                        Statut modifié : EN COURS
                                    </span>
                                    <div className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800"></div>
                                </div>

                                {/* Message from Delegate/Admin */}
                                <div className="space-y-2 flex flex-col items-end">
                                    <div className="flex items-center justify-between w-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>11:30 AM</span>
                                        <span className="text-primary-600">
                                            {user?.role === 'ROLE_STUDENT' ? 'Administration' : 'Vous (Gestionnaire)'}
                                        </span>
                                    </div>
                                    <div className="bg-primary-600 p-4 rounded-2xl rounded-tr-none shadow-lg shadow-primary-500/20 inline-block max-w-[90%]">
                                        <p className="text-sm font-medium text-white">
                                            {complaint.response || "Nous avons contacté le responsable des services techniques. Une intervention est prévue demain matin."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-50 dark:border-slate-800/50 bg-white dark:bg-slate-900">
                                <div className="relative group">
                                    <textarea
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 pr-16 text-sm font-medium focus:ring-2 focus:ring-primary-500/20 transition-all resize-none dark:text-white"
                                        placeholder="Écrire une réponse..."
                                        rows="3"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                    />
                                    <div className="absolute right-3 bottom-3 flex items-center gap-2">
                                        <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                                            <Paperclip size={18} />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                                            <Smile size={18} />
                                        </button>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!replyText.trim()}
                                            className="p-2.5 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:shadow-none hover:bg-primary-700 transition-all"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ComplaintDetailPage;
