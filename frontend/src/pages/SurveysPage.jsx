import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
    ClipboardList,
    ArrowRight,
    Clock,
    CheckCircle2,
    Users,
    Star
} from 'lucide-react';

const SurveysPage = () => {
    const surveys = [
        {
            id: 1,
            title: "Évaluation de la Qualité de l'Enseignement - S1",
            description: "Votre avis est essentiel pour améliorer la pédagogie au sein de l'ENICarthage. Ce sondage est totalement anonyme.",
            status: "ACTIVE",
            deadline: "25 Février 2026",
            participants: 124,
            category: "Pédagogie",
            timeToComplete: "5-10 min",
            color: "from-blue-500 to-indigo-600"
        },
        {
            id: 2,
            title: "Enquête de Satisfaction - Buvette & Restauration",
            description: "Aidez-nous à évaluer les services de restauration de l'annexe et à proposer des améliorations.",
            status: "ACTIVE",
            deadline: "20 Février 2026",
            participants: 89,
            category: "Vie Étudiante",
            timeToComplete: "3 min",
            color: "from-amber-500 to-orange-600"
        },
        {
            id: 3,
            title: "Feedback - Nouvelle Plateforme EniGov",
            description: "Que pensez-vous du nouvel outil numérique ? Vos suggestions pour les futures mises à jour.",
            status: "COMPLETED",
            deadline: "10 Février 2026",
            participants: 210,
            category: "Digital",
            timeToComplete: "2 min",
            color: "from-emerald-500 to-teal-600"
        }
    ];

    return (
        <DashboardLayout title="Enquêtes & Feedback">
            <div className="flex flex-col gap-8 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Participez aux enquêtes en cours pour influencer les décisions de votre établissement.
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="px-4 py-2 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl text-sm font-black uppercase tracking-widest border border-primary-100 dark:border-primary-500/20">
                            2 Enquêtes actives
                        </span>
                    </div>
                </div>

                <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                    {surveys.map((survey) => (
                        <div key={survey.id} className="group relative bg-white dark:bg-[#1a1c2e] rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500">
                            {/* Accent Header */}
                            <div className={`h-2 w-full bg-gradient-to-r ${survey.color}`} />

                            <div className="p-8 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                                        <ClipboardList size={28} />
                                    </div>
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${survey.status === 'ACTIVE'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                        : 'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700'
                                        }`}>
                                        {survey.status === 'ACTIVE' ? 'En cours' : 'Terminé'}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight line-clamp-2 min-h-[4rem]">
                                        {survey.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3 text-sm">
                                        {survey.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                        <Users size={16} className="text-primary-500" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Participants</span>
                                            <span className="text-sm font-black text-slate-800 dark:text-white">{survey.participants}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                        <Clock size={16} className="text-primary-500" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Durée estimée</span>
                                            <span className="text-sm font-black text-slate-800 dark:text-white">{survey.timeToComplete}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800/50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date limite</span>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{survey.deadline}</span>
                                    </div>

                                    {survey.status === 'ACTIVE' ? (
                                        <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40">
                                            Répondre
                                            <ArrowRight size={16} />
                                        </button>
                                    ) : (
                                        <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                                            Clôturé
                                            <CheckCircle2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Proposal Card */}
                    <div className="relative group p-8 rounded-[2.5rem] bg-slate-50 dark:bg-[#1a1c2e]/50 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-4 hover:bg-white dark:hover:bg-[#1a1c2e] hover:border-primary-500/30 transition-all">
                        <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center text-primary-600">
                            <Star size={32} />
                        </div>
                        <h4 className="text-xl font-black text-slate-800 dark:text-white">Suggérer une enquête</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-[250px]">
                            Vous avez un sujet qui mérite l'attention de tous ? Proposez une nouvelle enquête.
                        </p>
                        <button className="mt-4 px-8 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-primary-500 transition-all">
                            Proposer
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SurveysPage;
