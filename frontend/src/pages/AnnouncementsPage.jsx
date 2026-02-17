import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Skeleton } from '../components/ui/Skeleton';
import {
    Megaphone, Plus, Calendar, User, Search, Filter, MoreHorizontal,
    Bold, Italic, Underline, List, ListOrdered, Quote, Link, Image as ImageIcon,
    Paperclip, Eye, X, UploadCloud, Check
} from 'lucide-react';

const AnnouncementsPage = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [audience, setAudience] = useState('all');
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedYears, setSelectedYears] = useState(['1ère Année']); // Default Selection
    const [priority, setPriority] = useState(false);
    const [allowComments, setAllowComments] = useState(true);
    const [pushNotification, setPushNotification] = useState(true);
    const [file, setFile] = useState(null);
    const [wordCount, setWordCount] = useState(0);

    // Refs for Textarea interaction
    const textareaRef = React.useRef(null);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            // Uncomment real API call when backend is ready
            // const res = await api.getAnnouncements();
            // setAnnouncements(res.data);

            // Temporary Mock Data for display
            setTimeout(() => {
                setAnnouncements([
                    { id: 1, title: 'Résultats des examens du Semestre 1', date: '12 Fév 2024', author: 'Administration', content: 'Les résultats sont disponibles sur l\'ENT...' },
                    { id: 2, title: 'Maintenance du serveur informatique', date: '10 Fév 2024', author: 'DSI', content: 'Une coupure est prévue ce samedi...' },
                ]);
                setLoading(false);
            }, 1000);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    // --- Interactive Handlers ---

    const handleContentChange = (e) => {
        const text = e.target.value;
        setContent(text);
        setWordCount(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
    };

    const toggleDepartment = (dept) => {
        setSelectedDepartments(prev =>
            prev.includes(dept)
                ? prev.filter(d => d !== dept)
                : [...prev, dept]
        );
    };

    const toggleYear = (year) => {
        setSelectedYears(prev =>
            prev.includes(year)
                ? prev.filter(y => y !== year)
                : [...prev, year]
        );
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // Editor Toolbar Logic (Markdown Injection)
    const insertFormat = (startTag, endTag = startTag) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);

        const newText = text.substring(0, start) + startTag + selectedText + endTag + text.substring(end);

        setContent(newText);

        // Restore focus and cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + startTag.length, end + startTag.length);
        }, 0);
    };

    const handlePublish = async () => {
        if (!title.trim() || !content.trim()) {
            alert("Le titre et le contenu sont requis !");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('priority', priority ? 'URGENT' : 'NORMAL');
        formData.append('audience', audience);
        formData.append('departments', JSON.stringify(selectedDepartments)); // Stringify arrays for backend
        formData.append('years', JSON.stringify(selectedYears));
        formData.append('allowComments', allowComments);
        formData.append('pushNotification', pushNotification);

        if (file) {
            formData.append('file', file);
        }

        try {
            // await api.createAnnouncement(formData); // Real API call
            alert("Annonce publiée avec succès ! (Simulation)");
            console.log("Données envoyées:", Object.fromEntries(formData));

            // Reset Form and View
            setIsCreating(false);
            setTitle('');
            setContent('');
            setFile(null);
            fetchAnnouncements();
        } catch (error) {
            console.error("Erreur publication:", error);
            alert("Erreur lors de la publication.");
        }
    };

    // Available Departments
    const departmentsList = ['Informatique', 'Mécatronique', 'GSIL', 'Infotronique'];

    return (
        <DashboardLayout title="Annonces">
            {/* Header Switch */}
            {!isCreating && (
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Fil d'actualité</h1>
                        <p className="text-slate-500">Dernières nouvelles de l'université</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-primary-200 dark:shadow-none"
                    >
                        <Plus size={20} /> Nouvelle Annonce
                    </button>
                </div>
            )}

            {isCreating ? (
                // --- VUE CRÉATION ---
                <div className="animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Nouvelle Annonce</h2>
                            <p className="text-slate-500 font-medium mt-1">Partagez des informations importantes avec la communauté.</p>
                        </div>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors"
                        >
                            <X size={24} className="text-slate-400" />
                        </button>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-8">
                        {/* COLONNE GAUCHE - ÉDITEUR */}
                        <div className="flex-1 space-y-6">
                            {/* Carte Éditeur */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 min-h-[600px] flex flex-col shadow-sm border border-slate-200 dark:border-slate-800">
                                {/* Titre Input */}
                                <div className="mb-6">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Titre de l'annonce</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="ex: Calendrier des Examens du Semestre 1"
                                        className="w-full text-3xl font-bold placeholder:text-slate-300 border-none focus:ring-0 p-0 bg-transparent text-slate-800 dark:text-white outline-none"
                                    />
                                </div>

                                {/* Barre d'outils (Fonctionnelle) */}
                                <div className="flex items-center justify-between border-y border-slate-100 dark:border-slate-800 py-3 mb-6">
                                    <div className="flex items-center gap-1 text-slate-500">
                                        <button onClick={() => insertFormat('**')} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Gras"><Bold size={18} /></button>
                                        <button onClick={() => insertFormat('*')} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Italique"><Italic size={18} /></button>
                                        <button onClick={() => insertFormat('__')} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Souligné (Markdown)"><Underline size={18} /></button>
                                        <div className="w-[1px] h-5 bg-slate-200 mx-2"></div>
                                        <button onClick={() => insertFormat('- ')} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Liste à puces"><List size={18} /></button>
                                        <button onClick={() => insertFormat('1. ')} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Liste numérotée"><ListOrdered size={18} /></button>
                                        <button onClick={() => insertFormat('> ')} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Citation"><Quote size={18} /></button>
                                        <div className="w-[1px] h-5 bg-slate-200 mx-2"></div>
                                        <button onClick={() => insertFormat('[', '](url)')} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Lien"><Link size={18} /></button>
                                        <button onClick={() => insertFormat('![alt](', ')')} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Image"><ImageIcon size={18} /></button>
                                    </div>
                                    <button className="flex items-center gap-2 text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-primary-100 transition-colors">
                                        <Eye size={16} /> Aperçu
                                    </button>
                                </div>

                                {/* Zone de Texte */}
                                <textarea
                                    ref={textareaRef}
                                    value={content}
                                    onChange={handleContentChange}
                                    placeholder="Commencez à rédiger votre annonce ici... (Markdown supporté)"
                                    className="flex-1 w-full resize-none border-none focus:ring-0 p-0 bg-transparent text-lg text-slate-600 dark:text-slate-300 leading-relaxed outline-none"
                                ></textarea>
                            </div>

                            {/* Footer Stats */}
                            <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-2">
                                <div className="flex gap-4">
                                    <span>{wordCount} Mots</span>
                                    <span>{content.length} Caractères</span>
                                </div>
                                <div className="flex items-center gap-2 text-emerald-500">
                                    <Check size={14} /> Béni-Draft v1.0
                                </div>
                            </div>
                        </div>

                        {/* COLONNE DROITE - OPTIONS */}
                        <div className="w-full xl:w-96 space-y-6">

                            {/* Public Cible */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center gap-2 text-primary-600 mb-2">
                                    <div className="p-1.5 bg-primary-100 rounded-lg">
                                        <User size={18} />
                                    </div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">Public Cible</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 mb-1.5 block">Portée de l'audience</label>
                                        <select
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium outline-none text-slate-700 dark:text-slate-200"
                                            value={audience}
                                            onChange={(e) => setAudience(e.target.value)}
                                        >
                                            <option value="all">Tous les Étudiants</option>
                                            <option value="department">Département Spécifique</option>
                                            <option value="staff">Personnel Uniquement</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 mb-2 block">Département</label>
                                        <div className="flex flex-wrap gap-2">
                                            {departmentsList.map(dept => (
                                                <span
                                                    key={dept}
                                                    onClick={() => toggleDepartment(dept)}
                                                    className={`px-3 py-1 text-xs font-bold rounded-full cursor-pointer transition-all border
                                                        ${selectedDepartments.includes(dept)
                                                            ? 'bg-blue-100 text-blue-600 border-blue-200 ring-2 ring-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                                                            : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'}`}
                                                >
                                                    {dept}
                                                </span>
                                            ))}
                                            <button className="px-3 py-1 border-2 border-dashed border-primary-300 text-primary-500 text-xs font-bold rounded-full hover:bg-primary-50 items-center flex gap-1 transition-colors">
                                                <Plus size={12} /> Ajouter
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 mb-2 block">Niveau</label>
                                        <div className="flex gap-2">
                                            {['1ère Année', '2ème Année', '3ème Année'].map((yr) => (
                                                <label key={yr} className="flex-1 cursor-pointer select-none" onClick={() => toggleYear(yr)}>
                                                    <input type="checkbox" className="peer sr-only" checked={selectedYears.includes(yr)} readOnly />
                                                    <div className={`text-center py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1
                                                        ${selectedYears.includes(yr)
                                                            ? 'bg-primary-600 text-white border-primary-600'
                                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                                                        }`}>
                                                        {yr}
                                                        {selectedYears.includes(yr) && <span>✓</span>}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center gap-2 text-slate-800 dark:text-white mb-2">
                                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                        <Filter size={18} />
                                    </div>
                                    <h3 className="font-bold">Options</h3>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Priorité</span>
                                    <button
                                        onClick={() => setPriority(!priority)}
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-colors ${priority ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${priority ? 'bg-red-600' : 'bg-slate-400'}`}></div>
                                        {priority ? 'URGENT' : 'NORMAL'}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Commentaires</span>
                                    <div onClick={() => setAllowComments(!allowComments)} className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${allowComments ? 'bg-primary-600' : 'bg-slate-300'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${allowComments ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Notification Push</span>
                                    <div onClick={() => setPushNotification(!pushNotification)} className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${pushNotification ? 'bg-primary-600' : 'bg-slate-300'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${pushNotification ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Upload */}
                            <div
                                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group relative
                                    ${file ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 hover:bg-primary-50/50'}`}
                            >
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                />
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <UploadCloud className={`transition-colors ${file ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-500'}`} />
                                </div>
                                <h4 className="font-bold text-slate-700 dark:text-slate-200">
                                    {file ? file.name : 'Pièces Jointes'}
                                </h4>
                                <p className="text-xs text-slate-400 mt-1">
                                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Glissez & déposez PDF, JPG, ou PNG'}
                                </p>
                                {!file && <button className="text-primary-600 text-xs font-bold mt-3 hover:underline">Parcourir les fichiers</button>}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                    Brouillon
                                </button>
                                <button
                                    onClick={handlePublish}
                                    className="flex-1 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all hover:scale-[1.02]"
                                >
                                    Publier
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

            ) : (
                // --- LIST VIEW ---
                <div className="space-y-6">
                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher une annonce..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border-none bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:text-primary-600 transition-colors flex items-center gap-2">
                                <Filter size={18} /> Filtrer
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {announcements.map((ann) => (
                                <div key={ann.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl hover:border-primary-200 transition-colors group cursor-pointer border border-transparent shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                                <Megaphone size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">{ann.title}</h3>
                                                <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {ann.date}</span>
                                                    <span className="flex items-center gap-1"><User size={12} /> {ann.author}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 pl-[52px]">
                                        {ann.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
};

export default AnnouncementsPage;
