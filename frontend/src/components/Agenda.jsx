import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import api from '../services/api';

const Agenda = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.getUpcomingEvents();
                setEvents(res.data);
            } catch (err) {
                console.error('Failed to fetch events:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const daysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const getEventTypeColor = (type) => {
        switch (type) {
            case 'ACADEMIC': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'MEETING': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'EXAM': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'SOCIAL': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const renderCalendar = () => {
        const days = [];
        const startDay = firstDayOfMonth(currentDate);
        const totalDays = daysInMonth(currentDate);

        // Padding for empty days
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
        }

        for (let d = 1; d <= totalDays; d++) {
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toDateString();
            days.push(
                <div
                    key={d}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all
                        ${isToday ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-110' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    {d}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mini Calendar Card */}
            <div className="card !p-8 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-8">
                    <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-3">
                        <CalendarIcon size={20} className="text-primary-600" />
                        Calendrier
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2 w-full">
                    {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
                        <div key={d} className="h-8 w-8 flex items-center justify-center text-[10px] font-black text-slate-300 dark:text-slate-600">
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1 w-full relative">
                    {renderCalendar()}
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 w-full">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-4">
                        <span>Statistiques</span>
                        <span className="text-primary-600">{events.length} Événements</span>
                    </div>
                    <div className="space-y-3">
                        {['Academic', 'Meeting', 'Exam'].map(type => (
                            <div key={type} className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${type === 'Academic' ? 'bg-blue-500' : type === 'Meeting' ? 'bg-purple-500' : 'bg-red-500'}`} />
                                <span className="text-xs text-slate-600 dark:text-slate-400">{type}</span>
                                <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${type === 'Academic' ? 'bg-blue-500' : type === 'Meeting' ? 'bg-purple-500' : 'bg-red-500'}`} style={{ width: '40%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Event List Card */}
            <div className="lg:col-span-2 card !p-0 overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#1a1c2e]">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">Prochains Évènements</h3>
                    <button className="text-xs font-bold text-primary-600 hover:underline">Voir tout</button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-slate-400 italic">Chargement de l'agenda...</div>
                    ) : events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
                            <CalendarIcon size={48} className="mb-4 opacity-10" />
                            <p className="font-bold">Aucun événement à venir</p>
                        </div>
                    ) : (
                        events.map((event) => {
                            const date = new Date(event.startTime);
                            return (
                                <div key={event.id} className="group flex gap-6 items-start hover:translate-x-1 transition-transform cursor-pointer">
                                    <div className="shrink-0 w-16 text-center">
                                        <div className="text-[10px] font-black uppercase text-slate-400 mb-1">{monthNames[date.getMonth()].slice(0, 3)}</div>
                                        <div className="text-2xl font-black text-slate-800 dark:text-white leading-none">{date.getDate()}</div>
                                    </div>

                                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-6 border border-transparent group-hover:border-primary-500/20 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all shadow-sm group-hover:shadow-xl">
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getEventTypeColor(event.type)}`}>
                                                {event.type}
                                            </span>
                                            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 tracking-tight">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} className="text-primary-500" />
                                                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                {event.location && (
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={14} className="text-primary-500" />
                                                        {event.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-800 dark:text-white mb-2 leading-tight group-hover:text-primary-600 transition-colors">
                                            {event.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-2">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Agenda;
