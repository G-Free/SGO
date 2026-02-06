
import React, { useState, useMemo, lazy, Suspense, Fragment } from 'react';
import { 
    Brain, 
    ShieldCheck, 
    Target, 
    Activity, 
    FileCheck, 
    PlusCircle, 
    Briefcase, 
    List, 
    ChevronDown, 
    ChevronRight, 
    Edit, 
    Trash2, 
    Search, 
    RefreshCw, 
    File, 
    Clock, 
    AlertTriangle, 
    CheckCircle, 
    Eye, 
    PlayCircle, 
    FileText, 
    ClipboardCheck,
    Filter,
    CheckCircle2,
    CornerUpLeft,
    User,
    Archive,
    History,
    Download,
    TrendingUp,
    MapPin,
    BarChart3
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../components/Notification';

// Componentes Lazy
const NovoPlanoAcaoModal = lazy(() => import('../components/NovoPlanoAcaoModal'));
const NovaAtividadeModal = lazy(() => import('../components/NovaAtividadeModal'));
const DetalheAtividadeModal = lazy(() => import('../components/DetalheAtividadeModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));
const DetalheRelatorioModal = lazy(() => import('../components/DetalheRelatorioModal'));

// --- MOCK DATA ---
const monthlyExecutionData = [
  { name: 'Jan', planeado: 20, real: 15 },
  { name: 'Fev', planeado: 25, real: 22 },
  { name: 'Mar', planeado: 30, real: 28 },
  { name: 'Abr', planeado: 22, real: 24 },
  { name: 'Mai', planeado: 35, real: 30 },
  { name: 'Jun', planeado: 40, real: 38 },
];

const missionTypeData = [
  { name: 'Marítima', value: 40, color: '#002B7F' },
  { name: 'Terrestre', value: 35, color: '#10B981' },
  { name: 'Técnica/IT', value: 15, color: '#F59E0B' },
  { name: 'Aérea', value: 10, color: '#6366F1' },
];

const provincePerformanceData = [
  { name: 'Luanda', perc: 92 },
  { name: 'Cabinda', perc: 88 },
  { name: 'Zaire', perc: 75 },
  { name: 'Cunene', perc: 82 },
  { name: 'Namibe', perc: 70 },
  { name: 'Benguela', perc: 85 },
];

const initialNationalPlans = [
  { id: 'PA-01', title: 'Modernização Tecnológica das Fronteiras 2024', responsible: 'António Freire', startDate: '2024-01-15', endDate: '2024-12-20', status: 'Em Execução', progress: 60, objective: 'Digitalizar 100% dos processos de fiscalização aduaneira.' },
  { id: 'PA-02', title: 'Estratégia Nacional de Combate à Imigração Ilegal', responsible: 'Manuel Santos', startDate: '2024-02-01', endDate: '2024-11-30', status: 'Em Execução', progress: 45, objective: 'Reduzir em 30% a entrada ilegal por rotas não vigiadas.' },
  { id: 'PA-03', title: 'Plano de Formação Contínua GMO', responsible: 'Sofia Lima', startDate: '2024-03-01', endDate: '2024-09-15', status: 'Planeado', progress: 10, objective: 'Capacitar 500 agentes em técnicas de monitorização GIS.' },
];

const initialActivities = [
  { id: 'ATV-001', title: 'Fiscalização Costa Norte (Operação Marítima)', responsible: 'Manuel Santos', startDate: '01/07/2024', endDate: '05/07/2024', status: 'Em Andamento', priority: 'Alta', province: 'Cabinda', vessel: 'Patrulha Angola I', type: 'Marítima', planoAcaoId: 'PA-02', progress: 65 },
  { id: 'ATV-002', title: 'Auditoria de Segurança Posto Luvo', responsible: 'António Freire', startDate: '12/07/2024', endDate: '12/07/2024', status: 'Planeada', priority: 'Alta', province: 'Zaire', type: 'Técnica/IT', planoAcaoId: 'PA-01', progress: 0 },
  { id: 'ATV-005', title: 'Missão de Vigilância Fronteira Santa Clara', responsible: 'Gestor 1', startDate: '08/07/2024', endDate: '08/07/2024', status: 'Concluída', priority: 'Crítica', province: 'Cunene', type: 'Terrestre', planoAcaoId: 'PA-02', progress: 100, reportId: 'REL-2024-058' },
];

const initialReportsForApproval = [
  { id: 'REL-OP-102', title: 'Relatório Mensal Consolidado - Junho 2024', month: 'Junho/2024', createdBy: 'Coord. Operacional Central', createdAt: '2024-07-25', status: 'Submetido', province: 'Nacional', summary: 'Consolidado de todas as operações de fiscalização do mês de Junho.' },
  { id: 'REL-OP-105', title: 'Relatório Especial: Incidente Fronteira Sul', month: 'Julho/2024', createdBy: 'Coord. Operacional Central', createdAt: '2024-07-28', status: 'Submetido', province: 'Cunene', summary: 'Detalhes sobre a contenção de fluxo migratório irregular na zona de Santa Clara.' },
];

const statusColors: { [key: string]: string } = {
  'Concluída': 'bg-green-100 text-green-800 border border-green-200',
  'Concluído': 'bg-green-100 text-green-800 border border-green-200',
  'Validado': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  'Em Curso': 'bg-blue-100 text-blue-800 border border-blue-200',
  'Em Execução': 'bg-blue-100 text-blue-800 border border-blue-200',
  'Submetido': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  'Planeada': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  'Planeado': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  'Em Andamento': 'bg-sky-100 text-sky-800 border border-sky-200',
};

const GestaoGmoCentralPage: React.FC = () => {
    const { addNotification } = useNotification();
    const { hasRole, user } = useAuth();
    const isAdmin = hasRole('administrador');

    const [activeTab, setActiveTab] = useState<'planos' | 'atividades' | 'aprovacoes' | 'validados' | 'acompanhamento'>('planos');
    const [searchTerm, setSearchTerm] = useState('');
    
    // States
    const [planos, setPlanos] = useState(initialNationalPlans);
    const [isPlanoModalOpen, setIsPlanoModalOpen] = useState(false);
    const [planoToDelete, setPlanoToDelete] = useState<any | null>(null);
    const [expandedPlanoId, setExpandedPlanoId] = useState<string | null>(null);

    const [activities, setActivities] = useState(initialActivities);
    const [isAtividadeModalOpen, setIsAtividadeModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
    const [isAtividadeViewModalOpen, setIsAtividadeViewModalOpen] = useState(false);
    const [atividadeToDelete, setAtividadeToDelete] = useState<any | null>(null);
    const [atividadeToEdit, setAtividadeToEdit] = useState<any | null>(null);

    const [reportsForApproval, setReportsForApproval] = useState(initialReportsForApproval);
    const [validatedReports, setValidatedReports] = useState<any[]>([]); 
    const [selectedReport, setSelectedReport] = useState<any | null>(null);
    const [isRelatorioViewModalOpen, setIsRelatorioViewModalOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState<any | null>(null);

    // --- HANDLERS ---
    const handleSavePlano = (data: any) => {
        const newId = `PA-${String(planos.length + 1).padStart(2, '0')}`;
        setPlanos(current => [{ ...data, id: newId, progress: data.status === 'Planeado' ? 0 : 10 }, ...current]);
        addNotification(`Plano Nacional "${data.title}" registado.`, 'success', 'Gestão Estratégica');
    };

    const handleDeletePlano = () => {
        if (planoToDelete) {
            setPlanos(current => current.filter(p => p.id !== planoToDelete.id));
            addNotification(`Plano "${planoToDelete.title}" removido.`, 'success', 'Remoção');
            setPlanoToDelete(null);
        }
    };

    const handleSaveAtividade = (activityData: any) => {
        if (activityData.id) {
            setActivities(current => current.map(a => a.id === activityData.id ? activityData : a));
            addNotification(`Atividade Nacional atualizada com sucesso.`, 'success', 'Atualização');
        } else {
            const newActivity = {
                ...activityData,
                id: `ATV-${String(activities.length + 1).padStart(3, '0')}`,
                status: 'Planeada',
                progress: 0
            };
            setActivities(current => [newActivity, ...current]);
            addNotification(`Nova Atividade Nacional registada.`, 'success', 'Nova Atividade');
        }
    };

    const handleConfirmDeleteAtividade = () => {
        if (atividadeToDelete) {
            setActivities(acts => acts.filter(a => a.id !== atividadeToDelete.id));
            addNotification(`Atividade "${atividadeToDelete.title}" removida.`, 'error', 'Remoção');
            setAtividadeToDelete(null);
        }
    };

    const handleApproveReport = (reportId: string) => {
        const reportToApprove = reportsForApproval.find(r => r.id === reportId);
        if (reportToApprove) {
            const approvedReport = { 
                ...reportToApprove, 
                status: 'Validado', 
                validatedAt: new Date().toLocaleDateString('pt-AO') 
            };
            setValidatedReports(current => [approvedReport, ...current]);
            setReportsForApproval(current => current.filter(r => r.id !== reportId));
            addNotification(`Relatório ${reportId} validado estrategicamente.`, 'success', 'Aprovação');
        }
    };

    const handleReturnReport = (reportId: string) => {
        setReportsForApproval(current => current.filter(r => r.id !== reportId));
        addNotification(`Relatório ${reportId} devolvido para correções.`, 'info', 'Devolução');
    };

    const handleExportSingleReport = (report: any) => {
        addNotification(`A preparar exportação do relatório ${report.id}...`, 'info', 'Exportar');
        setTimeout(() => {
            addNotification(`Relatório ${report.id} exportado com sucesso.`, 'success', 'Concluído');
        }, 1500);
    };

    const handleConfirmDeleteReport = () => {
        if (reportToDelete) {
            setValidatedReports(current => current.filter(r => r.id !== reportToDelete.id));
            addNotification(`Relatório "${reportToDelete.id}" removido do arquivo.`, 'success', 'Remoção');
            setReportToDelete(null);
        }
    };

    const filteredPlanos = useMemo(() => 
        planos.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())), 
    [planos, searchTerm]);

    const filteredAtividades = useMemo(() => 
        activities.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())), 
    [activities, searchTerm]);

    const filteredReports = useMemo(() => 
        reportsForApproval.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase())),
    [reportsForApproval, searchTerm]);

    const filteredValidatedReports = useMemo(() => 
        validatedReports.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase())),
    [validatedReports, searchTerm]);

    return (
        <div className="w-full pb-10">
            {/* 1. HEADER ESTRATÉGICO */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Brain size={120} className="text-blue-900" />
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-2xl bg-blue-900 flex items-center justify-center shadow-lg transform -rotate-3 border-4 border-blue-800/30">
                            <ShieldCheck className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestão Estratégica GMO</h1>
                                <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                                    Perfil Estratégico
                                </span>
                            </div>
                            <p className="text-slate-500 mt-1 font-medium">Nível Estratégico – Alcance Nacional • Comité de Gestão Coordenada de Fronteiras</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Planos Nacionais</p>
                            <p className="text-2xl font-black text-blue-900">{planos.length}</p>
                        </div>
                        <div className="text-center border-x px-6">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Em Andamento</p>
                            <p className="text-2xl font-black text-amber-600">{activities.filter(a => a.status !== 'Concluída').length}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendentes Aprovação</p>
                            <p className="text-2xl font-black text-indigo-600">{reportsForApproval.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="bg-gray-100 p-1.5 rounded-xl flex flex-wrap gap-2 mb-8 w-fit mx-auto md:mx-0 shadow-inner">
                <button 
                    onClick={() => { setActiveTab('planos'); setSearchTerm(''); }}
                    className={`px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'planos' ? 'bg-white text-blue-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Plano de Ação
                </button>
                <button 
                    onClick={() => { setActiveTab('atividades'); setSearchTerm(''); }}
                    className={`px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'atividades' ? 'bg-white text-blue-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Atividades
                </button>
                <button 
                    onClick={() => { setActiveTab('aprovacoes'); setSearchTerm(''); }}
                    className={`px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'aprovacoes' ? 'bg-white text-blue-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Aprovações {reportsForApproval.length > 0 && <span className="ml-2 bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px]">{reportsForApproval.length}</span>}
                </button>
                <button 
                    onClick={() => { setActiveTab('validados'); setSearchTerm(''); }}
                    className={`px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'validados' ? 'bg-white text-blue-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Relatórios Validados {validatedReports.length > 0 && <span className="ml-2 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px]">{validatedReports.length}</span>}
                </button>
                <button 
                    onClick={() => { setActiveTab('acompanhamento'); setSearchTerm(''); }}
                    className={`px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'acompanhamento' ? 'bg-white text-blue-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Acompanhamento
                </button>
            </div>

            {/* BUSCA E AÇÕES GLOBAIS */}
            {activeTab !== 'acompanhamento' && (
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder={`Pesquisar em ${activeTab}...`} 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        />
                    </div>
                    <div className="flex gap-3">
                        {activeTab === 'planos' && (
                            <button onClick={() => setIsPlanoModalOpen(true)} className="bg-blue-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center shadow-lg transition-all active:scale-95">
                                <PlusCircle className="mr-2" size={16} /> Adicionar Plano
                            </button>
                        )}
                        {activeTab === 'atividades' && (
                            <button onClick={() => { setAtividadeToEdit(null); setIsAtividadeModalOpen(true); }} className="bg-blue-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center shadow-lg transition-all active:scale-95">
                                <PlusCircle className="mr-2" size={16} /> Adicionar Atividade
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* 2. SUBMÓDULO: PLANO DE ACÇÃO */}
            {activeTab === 'planos' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-4 py-4 w-12"></th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Plano</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Objetivo Estratégico</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsável</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest w-48">Progresso</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPlanos.map(plano => (
                                <Fragment key={plano.id}>
                                    <tr className="hover:bg-slate-50/50 cursor-pointer transition-colors group" onClick={() => setExpandedPlanoId(expandedPlanoId === plano.id ? null : plano.id)}>
                                        <td className="px-4 py-5 text-center">
                                            {expandedPlanoId === plano.id ? <ChevronDown size={18} className="text-blue-600" /> : <ChevronRight size={18} className="text-slate-300" />}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-black text-slate-900 text-sm group-hover:text-blue-900 transition-colors">{plano.title}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">Prazo: {plano.endDate}</div>
                                        </td>
                                        <td className="px-6 py-5 max-w-xs">
                                            <p className="text-xs text-slate-600 line-clamp-2 italic">{plano.objective}</p>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-bold text-slate-700">{plano.responsible}</td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[plano.status]}`}>
                                                {plano.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-grow bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                                                    <div className="bg-blue-900 h-full rounded-full transition-all duration-1000" style={{ width: `${plano.progress}%` }}></div>
                                                </div>
                                                <span className="text-xs font-black text-blue-900">{plano.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit size={18}/></button>
                                                <button onClick={(e) => { e.stopPropagation(); setPlanoToDelete(plano); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedPlanoId === plano.id && (
                                        <tr className="bg-slate-50/50">
                                            <td colSpan={7} className="px-12 py-6 border-l-4 border-blue-900">
                                                <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-4 flex items-center">
                                                    <List size={14} className="mr-2" /> Atividades Nacionais Vinculadas
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {activities.filter(a => a.planoAcaoId === plano.id).map(act => (
                                                        <div key={act.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center group/item hover:border-blue-300 transition-all">
                                                            <div>
                                                                <p className="font-bold text-slate-800 text-sm">{act.title}</p>
                                                                <div className="flex items-center gap-3 mt-1.5">
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase">{act.id}</span>
                                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${statusColors[act.status]}`}>{act.status}</span>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => { setSelectedActivity(act); setIsAtividadeViewModalOpen(true); }} className="text-xs font-black text-blue-900 hover:underline">Detalhes</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 3. SUBMÓDULO: ATIVIDADES */}
            {activeTab === 'atividades' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Atividade</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Plano Associado</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Alcance/Província</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Período</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Progresso</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredAtividades.map(activity => (
                                    <tr key={activity.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-slate-900 text-sm">{activity.title}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase mt-0.5 tracking-tighter">Responsável: {activity.responsible}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {activity.planoAcaoId ? (
                                                <div className="flex items-center text-xs font-bold text-indigo-600">
                                                    <ClipboardCheck size={14} className="mr-1.5" />
                                                    {planos.find(p => p.id === activity.planoAcaoId)?.title}
                                                </div>
                                            ) : <span className="text-slate-300 italic text-xs">Independente</span>}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center text-xs font-bold text-slate-700">
                                                <Target size={14} className="mr-1.5 text-blue-600" />
                                                {activity.province || 'Alcance Nacional'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[activity.status]}`}>
                                                {activity.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center text-xs font-medium text-slate-500">
                                            {activity.startDate} - {activity.endDate}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-black text-slate-800 mb-1">{activity.progress}%</span>
                                                <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden border border-slate-200">
                                                    <div className="bg-emerald-600 h-full rounded-full transition-all duration-1000" style={{ width: `${activity.progress}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => { setSelectedActivity(activity); setIsAtividadeViewModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all" title="Ver Detalhes"><Eye size={18} /></button>
                                                <button onClick={() => { setAtividadeToEdit(activity); setIsAtividadeModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-all" title="Editar"><Edit size={18} /></button>
                                                <button onClick={() => setAtividadeToDelete(activity)} className="p-2 text-slate-400 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all" title="Eliminar"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 4. SUBMÓDULO: APROVAÇÕES DE RELATÓRIOS (PENDENTES) */}
            {activeTab === 'aprovacoes' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                         <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center">
                             <FileCheck className="mr-2 text-indigo-600" size={20} /> Aprovações Pendentes
                         </h3>
                         <span className="text-xs text-slate-500 font-bold">Relatórios enviados pela Coordenação Operacional</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Relatório</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Autor</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Submissão</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredReports.length > 0 ? filteredReports.map(report => (
                                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-slate-900 text-sm">{report.title}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase mt-0.5 tracking-tighter">{report.id} • {report.month}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-2">
                                                <div className="p-1.5 bg-slate-100 rounded-full text-slate-500"><User size={14}/></div>
                                                <span className="text-sm font-bold text-slate-700">{report.createdBy}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center text-xs font-medium text-slate-500">
                                            {report.createdAt}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[report.status]}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button onClick={() => { setSelectedReport(report); setIsRelatorioViewModalOpen(true); }} className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center">
                                                    <Eye size={14} className="mr-1.5" /> Visualizar
                                                </button>
                                                <button onClick={() => handleApproveReport(report.id)} className="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center">
                                                    <CheckCircle2 size={14} className="mr-1.5" /> Validar
                                                </button>
                                                <button onClick={() => handleReturnReport(report.id)} className="bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center">
                                                    <CornerUpLeft size={14} className="mr-1.5" /> Devolver
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                                            <FileCheck size={48} className="mx-auto mb-4 opacity-10" />
                                            <p className="font-bold text-sm">Nenhum relatório pendente de aprovação estratégica.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 5. SUBMÓDULO: RELATÓRIOS VALIDADOS (HISTÓRICO) */}
            {activeTab === 'validados' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                         <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center">
                             <Archive className="mr-2 text-emerald-600" size={20} /> Histórico de Validados
                         </h3>
                         <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Arquivo Estratégico</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Relatório</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsável Operacional</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Aprovação em</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredValidatedReports.length > 0 ? filteredValidatedReports.map(report => (
                                    <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-slate-900 text-sm">{report.title}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase mt-0.5 tracking-tighter">{report.id} • {report.month}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-bold text-slate-700">{report.createdBy}</div>
                                        </td>
                                        <td className="px-6 py-5 text-center text-xs font-bold text-slate-500">
                                            {report.validatedAt}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[report.status]}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex justify-center items-center space-x-4">
                                                <button 
                                                    onClick={() => { setSelectedReport(report); setIsRelatorioViewModalOpen(true); }} 
                                                    className="inline-flex items-center text-xs font-black uppercase tracking-widest text-blue-900 hover:text-black transition-colors"
                                                >
                                                    <Eye size={16} className="mr-1.5" /> Visualizar
                                                </button>
                                                <button 
                                                    onClick={() => handleExportSingleReport(report)}
                                                    className="inline-flex items-center text-xs font-black uppercase tracking-widest text-emerald-700 hover:text-emerald-900 transition-colors"
                                                >
                                                    <Download size={16} className="mr-1.5" /> Exportar
                                                </button>
                                                {/* PERMISSÃO FULL PARA ADMIN */}
                                                {isAdmin && (
                                                    <>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setSelectedReport(report); setIsRelatorioViewModalOpen(true); }}
                                                            className="inline-flex items-center text-xs font-black uppercase tracking-widest text-indigo-700 hover:text-indigo-900 transition-colors"
                                                        >
                                                            <Edit size={16} className="mr-1.5" /> Editar
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setReportToDelete(report); }}
                                                            className="inline-flex items-center text-xs font-black uppercase tracking-widest text-red-700 hover:text-red-900 transition-colors"
                                                        >
                                                            <Trash2 size={16} className="mr-1.5" /> Eliminar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                                            <History size={48} className="mx-auto mb-4 opacity-10" />
                                            <p className="font-bold text-sm">Nenhum relatório validado no histórico.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 6. ACOMPANHAMENTO ESTRATÉGICO (GRÁFICOS) */}
            {activeTab === 'acompanhamento' && (
                <div className="space-y-6 animate-fadeIn">
                    {/* Cards de Métricas Rápidas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Eficácia Média', val: '84%', color: 'text-emerald-600', trend: '+2.1%', icon: TrendingUp },
                            { label: 'Meta Nacional 2024', val: '95%', color: 'text-blue-900', trend: 'Em curso', icon: Target },
                            { label: 'Missões Críticas', val: '04', color: 'text-red-600', trend: 'Atenção', icon: ShieldCheck },
                            { label: 'Budget Utilizado', val: '42.5%', color: 'text-indigo-600', trend: 'Dentro do limite', icon: Briefcase },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-slate-50 rounded-lg">
                                        <stat.icon size={20} className={stat.color} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{stat.trend}</span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Evolução de Execução */}
                        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
                                    <TrendingUp className="mr-2 text-blue-600" size={18} /> Evolução de Execução Nacional
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center text-[10px] font-bold text-blue-900"><span className="w-2 h-2 rounded-full bg-blue-900 mr-1"></span> Real</span>
                                    <span className="flex items-center text-[10px] font-bold text-slate-300"><span className="w-2 h-2 rounded-full bg-slate-200 mr-1"></span> Planeado</span>
                                </div>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyExecutionData}>
                                        <defs>
                                            <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#002B7F" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#002B7F" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                        <Tooltip 
                                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                            itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                                        />
                                        <Area type="monotone" dataKey="real" stroke="#002B7F" strokeWidth={3} fillOpacity={1} fill="url(#colorReal)" />
                                        <Area type="monotone" dataKey="planeado" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Distribuição por Natureza */}
                        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center mb-6">
                                <Activity className="mr-2 text-emerald-600" size={18} /> Natureza das Operações
                            </h3>
                            <div className="h-[250px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={missionTypeData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {missionTypeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-black text-slate-900">120</span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {missionTypeData.map(item => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                                        <span className="text-[10px] font-bold text-slate-600">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                         {/* Performance Regional */}
                         <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center mb-6">
                                <BarChart3 className="mr-2 text-indigo-600" size={18} /> Ranking de Performance Regional
                            </h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={provincePerformanceData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                        <XAxis type="number" domain={[0, 100]} hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} width={70} />
                                        <Tooltip cursor={{fill: '#f8fafc'}} />
                                        <Bar dataKey="perc" radius={[0, 4, 4, 0]}>
                                            {provincePerformanceData.map((entry, index) => (
                                                <Cell key={index} fill={entry.perc > 80 ? '#10B981' : entry.perc > 70 ? '#3B82F6' : '#F59E0B'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Distribuição por Atividade */}
                        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center">
                                    <MapPin className="mr-2" size={16} /> Foco Geográfico Recente
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {['Luanda', 'Cabinda', 'Zaire', 'Namibe', 'Benguela', 'Cunene'].map(prov => (
                                        <div key={prov} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group bg-slate-50/30">
                                            <p className="text-xs font-black text-slate-800 mb-2 group-hover:text-blue-900">{prov}</p>
                                            <div className="flex justify-between items-end">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Ativas</span>
                                                <span className="text-lg font-black text-slate-900 leading-none">{Math.floor(Math.random() * 15) + 1}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-6 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-blue-300 hover:text-blue-900 transition-all">
                                    Gerar Relatório Analítico Geográfico
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAIS */}
            <Suspense fallback={null}>
                {isPlanoModalOpen && (
                    <NovoPlanoAcaoModal 
                        isOpen={isPlanoModalOpen} 
                        onClose={() => setIsPlanoModalOpen(false)} 
                        onSave={handleSavePlano} 
                    />
                )}
                
                {isAtividadeModalOpen && (
                    <NovaAtividadeModal 
                        isOpen={isAtividadeModalOpen} 
                        onClose={() => setIsAtividadeModalOpen(false)} 
                        onSave={handleSaveAtividade} 
                        planosDeAcao={planos}
                        activityToEdit={atividadeToEdit}
                    />
                )}

                {isAtividadeViewModalOpen && (
                    <DetalheAtividadeModal 
                        isOpen={isAtividadeViewModalOpen} 
                        onClose={() => setIsAtividadeViewModalOpen(false)} 
                        activity={selectedActivity} 
                        planos={planos}
                        onEdit={isAdmin ? (act) => { setIsAtividadeViewModalOpen(false); setAtividadeToEdit(act); setIsAtividadeModalOpen(true); } : undefined}
                    />
                )}

                {isRelatorioViewModalOpen && (
                    <DetalheRelatorioModal 
                        isOpen={isRelatorioViewModalOpen} 
                        onClose={() => setIsRelatorioViewModalOpen(false)} 
                        report={selectedReport}
                        showEdit={isAdmin} // Apenas admin pode editar relatórios neste contexto (Validados ou Central)
                    />
                )}

                {planoToDelete && (
                    <ConfirmationModal 
                        isOpen={!!planoToDelete} 
                        onClose={() => setPlanoToDelete(null)} 
                        onConfirm={handleDeletePlano} 
                        title="Eliminar Plano Nacional" 
                        message={`Deseja realmente eliminar o plano estratégico "${planoToDelete?.title}"? Esta ação não pode ser desfeita.`} 
                    />
                )}

                {atividadeToDelete && (
                    <ConfirmationModal 
                        isOpen={!!atividadeToDelete} 
                        onClose={() => setAtividadeToDelete(null)} 
                        onConfirm={handleConfirmDeleteAtividade} 
                        title="Eliminar Atividade Nacional" 
                        message={`Deseja eliminar a atividade "${atividadeToDelete?.title}"?`} 
                    />
                )}

                {reportToDelete && (
                    <ConfirmationModal 
                        isOpen={!!reportToDelete} 
                        onClose={() => setReportToDelete(null)} 
                        onConfirm={handleConfirmDeleteReport} 
                        title="Eliminar Relatório Validado" 
                        message={`Deseja eliminar permanentemente o relatório ${reportToDelete?.id} do arquivo estratégico?`} 
                    />
                )}
            </Suspense>
        </div>
    );
};

export default GestaoGmoCentralPage;
