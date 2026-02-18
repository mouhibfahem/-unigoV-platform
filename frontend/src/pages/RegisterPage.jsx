import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Shield, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        role: 'STUDENT'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Échec de l\'inscription. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full mx-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Inscription réussie !</h2>
                    <p className="text-slate-500">Redirection vers la page de connexion...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
            <div className="max-w-md w-full card !p-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <Logo className="scale-125" textColor="text-slate-800 dark:text-slate-100" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Créer un compte</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Rejoignez la plateforme EniGov</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 flex items-start gap-3 border border-red-100 dark:border-red-900/30">
                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Nom complet</label>
                            <div className="relative group">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="input !pl-10 !py-2.5"
                                    placeholder="Votre nom"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Identifiant</label>
                            <div className="relative group">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="input !pl-10 !py-2.5"
                                    placeholder="Pseudo"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input !pl-10 !py-2.5"
                                placeholder="votre.email@university.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Rôle</label>
                        <div className="relative group">
                            <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="input !pl-10 !py-2.5 appearance-none cursor-pointer"
                            >
                                <option value="STUDENT">Étudiant</option>
                                <option value="DELEGUE">Délégué</option>
                                <option value="ADMIN">Administrateur</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
                        <div className="relative group">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input !pl-10 !py-2.5"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full !py-3.5 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-primary-200 dark:shadow-none"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span>S'inscrire</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline underline-offset-4">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
