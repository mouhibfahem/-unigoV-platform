import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';
import api from '../services/api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
            <div className="max-w-md w-full card !p-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <Logo className="scale-125" textColor="text-slate-800 dark:text-slate-100" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Bienvenue</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Connectez-vous à votre espace EniGov</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 flex items-start gap-3 border border-red-100 dark:border-red-900/30">
                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Nom d'utilisateur</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input !pl-12 !py-3.5"
                                placeholder="votre_identifiant"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input !pl-12 !py-3.5"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full !py-4 flex items-center justify-center gap-3 mt-8 shadow-lg shadow-primary-200 dark:shadow-none"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={22} />
                        ) : (
                            <>
                                <span className="text-lg">Se connecter</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 text-center space-y-4">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        Pas encore de compte ?{' '}
                        <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline underline-offset-4">
                            S'inscrire
                        </Link>
                    </p>

                    <button
                        onClick={async () => {
                            try {
                                await api.post('/auth/seed-all');
                                alert('Base de données initialisée ! Essayez de vous connecter.');
                            } catch (err) {
                                alert('Erreur lors du seeding. Vérifiez que le backend est en ligne.');
                            }
                        }}
                        className="text-[10px] text-slate-300 hover:text-slate-500 transition-colors uppercase tracking-widest font-black"
                    >
                        Réinitialiser les données de démo (Secours)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
