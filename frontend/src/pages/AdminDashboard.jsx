import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Skeleton } from '../components/ui/Skeleton';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    Users, MessageSquare, AlertTriangle, CheckCircle2,
    TrendingUp, Activity, PieChart as PieIcon
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (user?.role === 'ROLE_STUDENT') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    React.useEffect(() => {
        // Simulate data fetching
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Mock data for the charts
    const participationData = [
        { name: 'Lun', votes: 45 },
        { name: 'Mar', votes: 52 },
        { name: 'Mer', votes: 38 },
        { name: 'Jeu', votes: 65 },
        { name: 'Ven', votes: 48 },
        { name: 'Sam', votes: 20 },
        { name: 'Dim', votes: 15 },
    ];

    const stats = [
        { label: 'Total Étudiants', value: '1,280', icon: Users, color: 'bg-blue-500/20 text-blue-500' },
        { label: 'Réclamations Actives', value: '24', icon: AlertTriangle, color: 'bg-orange-500/20 text-orange-500' },
        { label: 'Sondages en cours', value: '8', icon: Activity, color: 'bg-emerald-500/20 text-emerald-500' },

        { label: 'Messages du jour', value: '156', icon: MessageSquare, color: 'bg-purple-500/20 text-purple-500' },
    ];

    return (
        <DashboardLayout title="Administration & Analytics">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading
                        ? Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="card p-6 flex items-center gap-5">
                                <Skeleton className="h-16 w-16 rounded-2xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                            </div>
                        ))
                        : stats.map((stat, idx) => (
                            <div key={idx} className="card p-6 flex items-center gap-5 hover:scale-[1.02] transition-transform">
                                <div className={`p-4 rounded-2xl ${stat.color}`}>
                                    <stat.icon size={28} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{stat.value}</h3>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Votes Participation */}
                    <div className="card p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black flex items-center gap-2">
                                <TrendingUp className="text-primary-500" /> Participation aux Sondages
                            </h3>
                        </div>
                        <div className="h-80 w-full flex items-center justify-center">
                            {loading ? (
                                <Skeleton className="w-full h-full rounded-xl" />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={participationData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 600 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 600 }} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="votes" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Claims Status - Pie Chart Example */}
                    <div className="card p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black flex items-center gap-2">
                                <PieIcon className="text-orange-500" /> État des Réclamations
                            </h3>
                        </div>
                        <div className="h-80 w-full flex items-center justify-center">
                            {loading ? (
                                <Skeleton className="w-full h-full rounded-xl" />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'En attente', value: 12, color: '#f59e0b' },
                                                { name: 'En cours', value: 8, color: '#3b82f6' },
                                                { name: 'Résolu', value: 24, color: '#10b981' },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {[
                                                { name: 'En attente', value: 12, color: '#f59e0b' },
                                                { name: 'En cours', value: 8, color: '#3b82f6' },
                                                { name: 'Résolu', value: 24, color: '#10b981' },
                                            ].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Activity or detailed log could go here */}

            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
