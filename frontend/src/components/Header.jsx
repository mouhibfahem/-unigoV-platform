import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header = ({ title }) => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>

            <div className="flex items-center gap-6">
                <div className="relative group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="bg-slate-50 border-transparent focus:bg-white focus:border-primary-100 pl-10 pr-4 py-2 rounded-xl text-sm w-64 transition-all outline-none"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                        title={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-yellow-500" />}
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-xl transition-all relative">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </button>
                </div>
                <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>

                <Link to="/settings" className="flex items-center gap-3 pl-2 group/profile cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none group-hover/profile:text-primary-600 transition-colors">{user?.fullName}</p>
                        <p className="text-[10px] font-bold text-primary-500 uppercase tracking-wider mt-1">
                            {user?.username || (user?.role === 'ROLE_ADMIN' ? 'Administrateur' : 'Étudiant')}
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-bold relative overflow-hidden group-hover/profile:shadow-md group-hover/profile:bg-primary-600 group-hover/profile:text-white transition-all">
                        {user?.profilePhoto ? (
                            <img
                                src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:8081/uploads/${user.profilePhoto}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default Header;
