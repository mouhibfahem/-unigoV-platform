import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FileText, GraduationCap, CreditCard, Calendar, MousePointer2 } from 'lucide-react';

const ProceduresPage = () => {
    const procedures = [
        {
            icon: GraduationCap,
            title: "Réinscription Universitaire",
            description: "Guide étape par étape pour effectuer votre réinscription annuelle.",
            steps: [
                "Payer les frais d'inscription (se munir de la Carte Technologique).",
                "Remplir le formulaire en ligne sur le site inscription.tn.",
                "Imprimer le reçu de paiement.",
                "Déposer le dossier (Reçu + Photos + Copie CIN) au service scolarité avant le 15 Septembre."
            ],
            color: "bg-blue-50 text-blue-600"
        },
        {
            icon: Calendar,
            title: "Permutation de Groupe",
            description: "Changement de groupe uniquement par échange mutuel (Permutation).",
            steps: [
                "Trouver un binôme souhaitant faire l'échange inverse (Groupe A vers B et B vers A).",
                "Remplir le formulaire de 'Demande de Permutation' en double exemplaire.",
                "Signature légalisée des deux étudiants.",
                "Déposer la demande au service scolarité avant le 30 Septembre."
            ],
            color: "bg-orange-50 text-orange-600"
        }
    ];

    return (
        <DashboardLayout title="Procédures Administratives">
            <div className="max-w-5xl mx-auto">
                <p className="text-slate-500 mb-8">
                    Retrouvez ici toutes les démarches administratives essentielles pour votre parcours étudiant.
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                    {procedures.map((proc, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 rounded-lg ${proc.color} flex items-center justify-center mb-4`}>
                                <proc.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">{proc.title}</h3>
                            <p className="text-slate-500 text-sm mb-4">{proc.description}</p>

                            <div className="space-y-3">
                                {proc.steps.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-slate-50 text-slate-400 text-xs flex items-center justify-center flex-shrink-0 font-medium border border-slate-200">
                                            {idx + 1}
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-6 w-full py-2 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                                <MousePointer2 size={16} />
                                Plus de détails
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProceduresPage;
