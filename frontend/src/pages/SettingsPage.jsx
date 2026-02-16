import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import {
    User,
    Mail,
    Lock,
    Bell,
    Moon,
    Sun,
    Shield,
    Palette,
    Camera,
    Save,
    CheckCircle2
} from 'lucide-react';

const SettingsPage = () => {
    const { user, updateUser } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [saved, setSaved] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.updateProfile({
                fullName: formData.fullName,
                email: formData.email
            });
            updateUser({ fullName: formData.fullName, email: formData.email });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la mise à jour");
        }
    };

    const fileInputRef = React.useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append('file', file);

        try {
            const response = await api.uploadPhoto(data);
            const photoUrl = response.data.profilePhoto;

            // Update local user state immediately
            updateUser({ profilePhoto: photoUrl });
        } catch (error) {
            console.error("Error uploading photo:", error);
            const errorMessage = error.response?.data?.message || error.response?.data || error.message;
            alert(`Erreur upload: ${errorMessage}`);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'appearance', label: 'Apparence', icon: Palette },
        { id: 'security', label: 'Sécurité', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell }
    ];

    return (
        <DashboardLayout title="Paramètres">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none translate-x-1'
                                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <tab.icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="card shadow-xl border-none">
                        {activeTab === 'profile' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="relative group">
                                        <div
                                            className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-md overflow-hidden cursor-pointer"
                                            onClick={() => user?.profilePhoto && setShowLightbox(true)}
                                        >
                                            {user?.profilePhoto ? (
                                                <img
                                                    src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:8081/uploads/${user.profilePhoto}`}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover transition-transform hover:scale-110"
                                                />
                                            ) : (
                                                user?.fullName?.charAt(0) || 'U'
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRef.current.click();
                                            }}
                                            className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-slate-700 shadow-lg rounded-xl text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors border border-slate-100 dark:border-slate-600 z-10"
                                        >
                                            <Camera size={16} />
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{user?.fullName}</h3>
                                        <p className="text-slate-500 font-medium">{user?.role === 'ROLE_ADMIN' ? 'Administrateur' : user?.username || 'Étudiant'}</p>
                                    </div>
                                </div>

                                {/* Lightbox Modal */}
                                {showLightbox && user?.profilePhoto && (
                                    <div
                                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                                        onClick={() => setShowLightbox(false)}
                                    >
                                        <div className="relative max-w-4xl max-h-[90vh]">
                                            <img
                                                src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:8081/uploads/${user.profilePhoto}`}
                                                alt="Profile Full Size"
                                                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <button
                                                className="absolute -top-12 right-0 text-white hover:text-primary-400 transition-colors"
                                                onClick={() => setShowLightbox(false)}
                                            >
                                                <span className="text-sm font-bold uppercase tracking-widest">Fermer</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nom Complet</label>
                                            <div className="relative group">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    className="input !pl-10"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="input !pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-end">
                                        <button type="submit" className="btn-primary flex items-center gap-2 px-8">
                                            <Save size={18} />
                                            <span>Enregistrer les modifications</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Mode d'affichage</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => !darkMode && toggleTheme()}
                                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${!darkMode ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-orange-500">
                                                <Sun size={24} />
                                            </div>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">Mode Clair</span>
                                        </button>
                                        <button
                                            onClick={() => darkMode && toggleTheme()}
                                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${darkMode ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-slate-800 shadow-sm flex items-center justify-center text-blue-400">
                                                <Moon size={24} />
                                            </div>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">Mode Sombre</span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Couleur d'accentuation</h3>
                                    <div className="flex gap-4">
                                        {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                                            <button
                                                key={color}
                                                className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 shadow-sm transition-transform hover:scale-110"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Changer le mot de passe</h3>
                                <form onSubmit={handleSave} className="space-y-4 max-w-md">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Mot de passe actuel</label>
                                        <input type="password" className="input" placeholder="••••••••" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nouveau mot de passe</label>
                                        <input type="password" className="input" placeholder="••••••••" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirmer le nouveau mot de passe</label>
                                        <input type="password" className="input" placeholder="••••••••" />
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button type="submit" className="btn-primary px-8">Mettre à jour le mot de passe</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Préférences de notification</h3>
                                {[
                                    { id: 'announcements', label: 'Nouvelles annonces officielles', desc: 'Recevoir une alerte pour chaque nouvelle annonce de l\'administration.' },
                                    { id: 'polls', label: 'Nouveaux sondages', desc: 'Être informé dès qu\'un nouveau sondage est publié.' },
                                    { id: 'messages', label: 'Messages directs', desc: 'Notifications pour les nouveaux messages reçus.' },
                                    { id: 'complaints', label: 'Mises à jour des réclamations', desc: 'Suivre l\'évolution de vos demandes en temps réel.' }
                                ].map((item) => (
                                    <div key={item.id} className="flex items-start justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-800 dark:text-white">{item.label}</p>
                                            <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                                        </div>
                                        <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-primary-600">
                                            <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {saved && (
                            <div className="fixed bottom-8 right-8 animate-in slide-in-from-right duration-300">
                                <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                                    <CheckCircle2 size={24} />
                                    <span className="font-bold">Paramètres enregistrés avec succès !</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SettingsPage;
