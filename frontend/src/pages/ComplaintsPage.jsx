import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    Plus,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    MessageSquare,
    AlertTriangle,
    Trash2,
    Check
} from 'lucide-react';

const ComplaintsPage = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Infrastructure',
        location: '',
        description: '',
        priority: 'MEDIUM'
    });
    const [file, setFile] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const endpoint = user.role === 'ROLE_STUDENT' ? '/complaints/my' : '/complaints';
            const response = await api.get(endpoint);
            setComplaints(response.data);
        } catch (err) {
            console.error('Failed to fetch complaints', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('location', formData.location);
            data.append('priority', formData.priority);

            if (file) {
                data.append('file', file);
            }

            await api.post('/complaints', data);

            setShowForm(false);
            setFormData({ title: '', category: 'Infrastructure', location: '', description: '', priority: 'MEDIUM' });
            setFile(null);
            fetchComplaints();
        } catch (err) {
            console.error('Submission error:', err.response || err);
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message;
            alert(`Échec de la soumission: ${status ? 'Erreur ' + status : ''} ${message}`);
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'URGENT': return 'bg-red-100 text-red-600';
            case 'HIGH': return 'bg-orange-100 text-orange-600';
            case 'MEDIUM': return 'bg-blue-100 text-blue-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const getPriorityLabel = (p) => {
        switch (p) {
            case 'URGENT': return 'Urgente';
            case 'HIGH': return 'Haute';
            case 'MEDIUM': return 'Moyenne';
            case 'LOW': return 'Basse';
            default: return p;
        }
    };

    const getStatusLabel = (s) => {
        switch (s) {
            case 'RESOLVED': return 'Résolue';
            case 'IN_PROGRESS': return 'En cours';
            case 'PENDING': return 'En attente';
            default: return s;
        }
    };

    const getStatusIcon = (s) => {
        switch (s) {
            case 'RESOLVED': return <CheckCircle2 className="text-green-500" size={18} />;
            case 'IN_PROGRESS': return <Clock className="text-orange-500" size={18} />;
            default: return <AlertCircle className="text-slate-400" size={18} />;
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) return;
        try {
            await api.delete(`/complaints/${id}`);
            fetchComplaints();
        } catch (err) {
            console.error('Failed to delete complaint:', err.response || err);
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message;
            alert(`Échec de la suppression: ${status ? 'Erreur ' + status : ''} ${message}`);
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.put(`/complaints/${id}`, { status: 'RESOLVED' });
            fetchComplaints();
        } catch (err) {
            console.error('Failed to resolve complaint:', err.response || err);
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message;
            alert(`Échec de la mise à jour: ${status ? 'Erreur ' + status : ''} ${message}`);
        }
    };

    return (
        <DashboardLayout title="Gestion des Réclamations">
            <div className="flex flex-col gap-6">
                {/* Actions Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 max-w-lg">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Rechercher une réclamation..." className="input pl-10 bg-white" />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                            <Filter size={18} />
                            <span>Filtrer</span>
                        </button>
                    </div>

                    {user?.role === 'ROLE_STUDENT' && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-200 dark:shadow-none"
                        >
                            <Plus size={18} />
                            <span>Nouvelle Réclamation</span>
                        </button>
                    )}
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Soumettre une Réclamation</h3>
                                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Objet / Titre</label>
                                    <input
                                        className="input"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Décrivez brièvement le problème"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Catégorie</label>
                                        <select
                                            className="input"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="Infrastructure">Infrastructure & Locaux</option>
                                            <option value="Académique">Pédagogie & Académique</option>
                                            <option value="Examens">Examens & Notes</option>
                                            <option value="Vie Étudiante">Vie Étudiante & Clubs</option>
                                            <option value="Restauration">Restauration (Buvette)</option>
                                            <option value="Administratif">Services Administratifs</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Niveau de Priorité</label>
                                        <select
                                            className="input"
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        >
                                            <option value="LOW">Basse</option>
                                            <option value="MEDIUM">Moyenne</option>
                                            <option value="HIGH">Haute</option>
                                            <option value="URGENT">Urgente</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Localisation (ex: Bloc A, Bibliothèque...)</label>
                                        <input
                                            className="input"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="Où se situe le problème ?"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description Détaillée</label>
                                    <textarea
                                        className="input min-h-[120px]"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Fournissez autant de détails que possible..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Pièce Jointe (Optionnel - PDF, Image)</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            className="hidden"
                                            id="file-upload"
                                            accept="image/*,application/pdf"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <Plus size={20} className="text-slate-400" />
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                {file ? file.name : 'Cliquez pour sélectionner un fichier'}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Annuler</button>
                                    <button type="submit" className="btn-primary px-8">Soumettre</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="py-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>
                    ) : complaints.length === 0 ? (
                        <div className="card p-20 text-center border-dashed border-slate-200 dark:border-slate-800">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare size={32} />
                            </div>
                            <p className="text-slate-400 dark:text-slate-500 font-medium">Aucune réclamation trouvée pour le moment.</p>
                        </div>
                    ) : (
                        complaints.map((complaint) => (
                            <div
                                key={complaint.id}
                                onClick={() => navigate(`/complaints/${complaint.id}`)}
                                className="card hover:shadow-md transition-all group cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100">{complaint.title}</h4>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(complaint.priority)}`}>
                                                {getPriorityLabel(complaint.priority)}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-1">{complaint.description}</p>
                                        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                            <span className="flex items-center gap-1.5 dark:text-slate-500">
                                                {getStatusIcon(complaint.status)}
                                                {getStatusLabel(complaint.status)}
                                            </span>
                                            <span>•</span>
                                            <span className="dark:text-slate-500">{complaint.category}</span>
                                            <span>•</span>
                                            <span className="dark:text-slate-500">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                            {complaint.attachmentPath && (
                                                <>
                                                    <span>•</span>
                                                    <a
                                                        href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8081'}/uploads/${complaint.attachmentPath}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary-600 font-bold hover:underline"
                                                    >
                                                        Voir pièce jointe
                                                    </a>
                                                </>
                                            )}
                                            {user.role === 'ROLE_DELEGUE' || user.role === 'ROLE_ADMIN' ? (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider">Par {complaint.studentName}</span>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {(user.role === 'ROLE_DELEGUE' || user.role === 'ROLE_ADMIN') && complaint.status !== 'RESOLVED' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleResolve(complaint.id); }}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Marquer comme résolue"
                                            >
                                                <Check size={18} />
                                            </button>
                                        )}
                                        {(user.role === 'ROLE_DELEGUE' || user.role === 'ROLE_ADMIN') && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(complaint.id); }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div >
        </DashboardLayout >
    );
};

export default ComplaintsPage;
