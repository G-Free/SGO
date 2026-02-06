
import React, { useState, useMemo, lazy, Suspense } from 'react';
import { 
    BrainCircuit, 
    ShieldCheck, 
    Target, 
    Activity, 
    FileCheck, 
    ChevronRight, 
    Search, 
    Eye, 
    CheckCircle2,
    CornerUpLeft,
    User,
    History,
    MapPin,
    Zap,
    Clock,
    Filter,
    ClipboardList,
    AlertTriangle,
    TrendingUp
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../components/Notification';

const DetalheRelatorioModal = lazy(() => import('../components/DetalheRelatorioModal'));
const DetalheAtividadeModal = lazy(() => import('../components/DetalheAtividadeModal'));

const COLORS = { blue: '#002B7F', emerald: '#10B981', amber: '#F59E0B', rose: '#F43F5E', indigo: '#6366F1' };

const CoordenacaoRegionalPage: React.FC = () => {
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const province = user?.province || 'Luanda';

    const [activeTab, setActiveTab] = useState<'supervisao' | 'validacoes' | 'arquivo'>('supervisao');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState<any | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    // Mock Provincial Data
    const provincialStats = {
        efficiency: '88%',
        activeTasks: 12,
        pendingReports: 3,
        incidents: 2
    };

    const provincialActivities = [
        { id: 'ATV-PR-01', title: 'Fiscalização Posto de Controlo', province, responsible: 'Técnico Regional', status: 'Em Andamento', priority: 'Alta', progress: 45 },
        { id: 'ATV-PR-02', title: 'Inventário de Meios Técnicos', province, responsible: 'Gestor Operação', status: 'Concluída', priority: 'Média', progress: 100 },
    ];

    const provincialValidations = [
        { id: 'VAL-PR-10', title: 'Relatório Semanal Atividade 05', origin: province, submittedBy: 'Técnico Regional', date: '2024-07-28', status: 'Submetido' },
        { id: 'VAL-PR-11', title: 'tdR Manutenção Viatura 22', origin: province, submittedBy: 'Gestor Local', date: '2024-07-29', status: 'Pendente' },
    ];

    return (
        <div className="w-full pb-10">
            {/* 1. HEADER REGIONAL */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <MapPin size={150} className="text-blue-900" />
                </div>
                
                <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-3xl bg-[#002B7F] flex items-center justify-center shadow-2xl border-4 border-blue-800/30">
                            <ShieldCheck className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Supervisão Regional: {province}</h1>
                            </div>
                            <p className="text-slate-500 mt-1 font-bold text-sm flex items-center uppercase tracking-widest">
                                <Zap size={14} className="mr-1.5 text-yellow-500" /> Nível Supervisão • Alcance Provincial
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Eficiência local', val: provincialStats.efficiency, color: 'text-emerald-600' },
                            { label: 'Atividades', val: provincialStats.activeTasks, color: 'text-blue-600' },
                            { label: 'Validações', val: provincialStats.pendingReports, color: 'text-indigo-600' },
                            { label: 'Alertas', val: provincialStats.incidents, color: 'text-rose-600' },
                        ].map((s, i) => (
                            <div key={i} className="text-center bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100 shadow-inner min-w-[120px]">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                                <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="bg-slate-200/50 p-1.5 rounded-2xl flex flex-wrap gap-1 mb-8 w-fit shadow-inner">
                {[
                    { id: 'supervisao', label: 'Monitorização Local', icon: Activity },
                    { id: 'validacoes', label: 'Validações Pendentes', icon: FileCheck },
                    { id: 'arquivo', label: 'Histórico Provincial', icon: History },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as any); setSearchTerm(''); }}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center transition-all ${activeTab === tab.id ? 'bg-white text-blue-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <tab.icon size={14} className="mr-2" />
                        {tab.label}
                        {tab.id === 'validacoes' && provincialValidations.length > 0 && (
                            <span className="ml-2 bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[9px]">{provincialValidations.length}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* CONTEÚDO DINÂMICO */}
            <div className="animate-fadeIn min-h-[400px]">
                
                {activeTab === 'supervisao' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b flex justify-between items-center bg-slate-50/30">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
                                    <ClipboardList className="mr-2 text-blue-600" size={18} /> Atividades em curso na Província
                                </h3>
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-black text-slate-400 uppercase text-[10px] tracking-widest">ID</th>
                                        <th className="px-6 py-4 text-left font-black text-slate-400 uppercase text-[10px] tracking-widest">Atividade</th>
                                        <th className="px-6 py-4 text-left font-black text-slate-400 uppercase text-[10px] tracking-widest">Responsável</th>
                                        <th className="px-6 py-4 text-center font-black text-slate-400 uppercase text-[10px] tracking-widest">Estado</th>
                                        <th className="px-6 py-4 text-center font-black text-slate-400 uppercase text-[10px] tracking-widest">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {provincialActivities.map(act => (
                                        <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-black text-blue-900 text-xs">{act.id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{act.title}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-600">{act.responsible}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${act.status === 'Concluída' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>{act.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="p-2 text-slate-400 hover:text-blue-900 transition-all"><Eye size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-[#002B7F] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                                <div className="absolute -top-4 -right-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <Target size={100} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-blue-300 mb-6">Metas de Desempenho {province}</h3>
                                <div className="space-y-6 relative z-10">
                                    {['Fiscalização', 'Controlo Migratório', 'Resposta Incidentes'].map((meta, i) => (
                                        <div key={meta}>
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter mb-2">
                                                <span>{meta}</span>
                                                <span className="text-yellow-400">{80 + i * 5}%</span>
                                            </div>
                                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${80 + i * 5}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => addNotification("Pedido de suporte técnico encaminhado para a Central.", "info", "Suporte")} className="w-full bg-white border-2 border-dashed border-slate-200 p-6 rounded-3xl text-slate-500 hover:border-blue-900 hover:text-blue-900 transition-all flex flex-col items-center">
                                <AlertTriangle className="mb-2" />
                                <span className="text-xs font-black uppercase tracking-widest">Solicitar Suporte Central</span>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'validacoes' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center mb-6">
                            <FileCheck className="mr-3 text-indigo-600" size={24} /> Validação de Procedimentos Provinciais
                        </h3>
                        {provincialValidations.map(val => (
                            <div key={val.id} className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[9px] font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full uppercase border border-blue-100 font-mono tracking-tighter">{val.id}</span>
                                        <h4 className="font-black text-slate-900 text-lg group-hover:text-blue-900 transition-colors">{val.title}</h4>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center"><User size={12} className="mr-1.5" /> Submetido por {val.submittedBy}</span>
                                        <span className="flex items-center"><Clock size={12} className="mr-1.5" /> {val.date}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => addNotification("Documento validado e enviado para a Central.", "success", "Provincial")} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all">Aprovar</button>
                                    <button onClick={() => addNotification("Documento devolvido ao técnico para ajuste.", "info", "Provincial")} className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Devolver</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'arquivo' && (
                    <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center flex flex-col items-center">
                        <History size={64} className="text-slate-200 mb-4" />
                        <p className="text-slate-400 font-black uppercase text-sm tracking-widest">Nenhum documento arquivado recentemente em {province}.</p>
                    </div>
                )}
            </div>
            
            <Suspense fallback={null}>
                <DetalheRelatorioModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} report={selectedReport} />
            </Suspense>
        </div>
    );
};

export default CoordenacaoRegionalPage;
