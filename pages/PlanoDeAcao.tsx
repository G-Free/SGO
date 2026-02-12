
import React, { useState, useMemo, lazy, Suspense } from 'react';
import { 
    PlusCircle, 
    Search, 
    Edit, 
    Trash2, 
    Clock, 
    ChevronDown, 
    ChevronRight, 
    Activity,
    Target,
    PlayCircle,
    Calendar,
    ArrowRight,
    Eye,
    ChevronLeft,
    List,
    Calendar as CalendarIcon
} from 'lucide-react';
import { useNotification } from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NovoPlanoAcaoModal = lazy(() => import('../components/NovoPlanoAcaoModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));

// Dados simulados de Planos
const mockPlanosData = [
  { id: 'PA-01', title: 'Modernização Tecnológica das Fronteiras', responsible: 'António Freire', startDate: '2024-01-15', endDate: '2024-12-20', status: 'Em Execução', progress: 60, description: 'Atualização da infraestrutura de rede e sistemas de monitorização em tempo real.' },
  { id: 'PA-02', title: 'Estratégia Nacional de Combate à Imigração Ilegal', responsible: 'Manuel Santos', startDate: '2024-02-01', endDate: '2024-11-30', status: 'Em Execução', progress: 45, description: 'Reforço da fiscalização em pontos cegos da fronteira terrestre.' },
];

// Atividades vinculadas (Relação de Muitos para Um)
const mockActivities = [
  { id: 'ATV-001', title: 'Fiscalização Costa Norte', status: 'Em Andamento', province: 'Cabinda', planoAcaoId: 'PA-02' },
  { id: 'ATV-002', title: 'Auditoria Posto Luvo', status: 'Em Curso', province: 'Zaire', planoAcaoId: 'PA-01' },
  { id: 'ATV-003', title: 'Upgrade de Servidores Centrais', status: 'Planeada', province: 'Luanda', planoAcaoId: 'PA-01' },
  { id: 'ATV-004', title: 'Vigilância Noturna Fronteira Sul', status: 'Em Andamento', province: 'Cunene', planoAcaoId: 'PA-02' },
];

const statusColors: { [key: string]: string } = {
  'Concluído': 'bg-green-100 text-green-800 border border-green-200',
  'Planeado': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  'Em Execução': 'bg-blue-100 text-blue-800 border border-blue-200',
};

const activityStatusColors: { [key: string]: string } = {
  'Em Andamento': 'bg-sky-100 text-sky-800',
  'Em Curso': 'bg-blue-100 text-blue-800',
  'Concluída': 'bg-green-100 text-green-800',
  'Planeada': 'bg-slate-100 text-slate-600',
};

// --- COMPONENTE DE CALENDÁRIO ESTRATÉGICO ---
const CalendarView: React.FC<{ planos: any[], onEdit: (p: any) => void }> = ({ planos, onEdit }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`empty-${i}`} className="h-32 bg-slate-50/30 border border-slate-100"></div>);

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        // Filtrar planos que estão ativos neste dia (startDate <= dateStr <= endDate)
        const dayPlanos = planos.filter(p => dateStr >= p.startDate && dateStr <= p.endDate);

        calendarDays.push(
            <div key={day} className="h-32 border border-slate-100 p-2 overflow-y-auto bg-white group hover:bg-indigo-50/20 transition-colors">
                <span className="text-[10px] font-black text-slate-300 group-hover:text-indigo-500">{day}</span>
                <div className="space-y-1 mt-1">
                    {dayPlanos.map(p => (
                        <div 
                            key={p.id} 
                            className={`text-[8px] font-black uppercase p-1 rounded truncate shadow-sm border ${statusColors[p.status] || 'bg-slate-100'}`}
                            title={`${p.title} (${p.status})`}
                        >
                            {p.title}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-fadeIn">
            <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 gap-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
                    <CalendarIcon className="mr-2 text-indigo-600" size={18} />
                    Cronograma de Planos
                </h3>
                
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <button onClick={handlePrevMonth} className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"><ChevronLeft size={16}/></button>
                        
                        <select title="Selecionar mês"
                            value={month} 
                            onChange={(e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1))}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        >
                            {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
                        </select>

                        <select title="Selecionar ano"
                            value={year} 
                            onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1))}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        >
                            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>

                        <button onClick={handleNextMonth} className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"><ChevronRight size={16}/></button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-px bg-slate-100 border-b border-slate-100">
                {daysOfWeek.map(day => <div key={day} className="py-3 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-px bg-slate-100">
                {calendarDays}
            </div>
        </div>
    );
};

const PlanoDeAcaoPage: React.FC = () => {
    const { hasRole } = useAuth();
    const [activeTab, setActiveTab] = useState<'lista' | 'calendario'>('lista');
    const [planos, setPlanos] = useState(mockPlanosData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [planoToDelete, setPlanoToDelete] = useState<any | null>(null);
    const [filters, setFilters] = useState({ searchTerm: '', status: 'Todos' });
    const { addNotification } = useNotification();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const navigate = useNavigate();

    // Permissão para Criar/Editar (Direção e Admin)
    const canManage = hasRole('administrador') || hasRole('coordenador_operacional_central');

    const handleSave = (data: any) => {
        const newId = `PA-${String(planos.length + 1).padStart(2, '0')}`;
        setPlanos(current => [{ ...data, id: newId, progress: 0 }, ...current]);
        addNotification(`Plano Nacional "${data.title}" criado com sucesso.`, 'success', 'Estratégia');
    };

    const handleConfirmDelete = () => {
        if (planoToDelete) {
            setPlanos(current => current.filter(p => p.id !== planoToDelete.id));
            addNotification(`Plano removido do sistema.`, 'info', 'Remoção');
            setPlanoToDelete(null);
        }
    };

    const filteredPlanos = useMemo(() => {
        return planos.filter(p =>
            p.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
            (filters.status === 'Todos' || p.status === filters.status)
        );
    }, [planos, filters]);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 uppercase tracking-tight">Plano de Acção</h1>
                    <p className="text-gray-600">Gestão de diretrizes nacionais e acompanhamento das atividades operacionais vinculadas.</p>
                </div>
                {canManage && (
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-900 hover:bg-black text-white font-bold py-2.5 px-6 rounded-xl flex items-center transition-all shadow-lg active:scale-95">
                        <PlusCircle className="h-5 w-5 mr-2" /> Novo Plano
                    </button>
                )}
            </div>

            {/* TAB NAVIGATION */}
            <div className="bg-slate-200/50 p-1.5 rounded-2xl flex flex-wrap gap-1 mb-8 w-fit shadow-inner">
                <button 
                    onClick={() => setActiveTab('lista')}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center transition-all ${activeTab === 'lista' ? 'bg-white text-blue-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <List size={14} className="mr-2" />
                    Lista de Planos
                </button>
                <button 
                    onClick={() => setActiveTab('calendario')}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center transition-all ${activeTab === 'calendario' ? 'bg-white text-blue-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <CalendarIcon size={14} className="mr-2" />
                    Calendário
                </button>
            </div>

            {activeTab === 'lista' ? (
                <>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 shadow-sm">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Pesquisar por título do plano..." 
                                value={filters.searchTerm}
                                onChange={e => setFilters({...filters, searchTerm: e.target.value})}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <select title="Filtrar por estado"
                            value={filters.status}
                            onChange={e => setFilters({...filters, status: e.target.value})}
                            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="Todos">Todos os Estados</option>
                            <option>Planeado</option>
                            <option>Em Execução</option>
                            <option>Concluído</option>
                        </select>
                    </div>

                    <div className="space-y-6">
                        {filteredPlanos.map(plano => {
                            const associatedActivities = mockActivities.filter(act => act.planoAcaoId === plano.id);
                            const isExpanded = expandedId === plano.id;

                            return (
                                <div key={plano.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                                    <div 
                                        className={`p-6 flex flex-col md:flex-row items-center justify-between transition-colors ${isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                                    >
                                        <div className="flex items-center gap-4 flex-grow">
                                            <div className={`p-4 rounded-2xl ${isExpanded ? 'bg-blue-900 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}>
                                                <Target size={28} />
                                            </div>
                                            <div className="ml-2">
                                                <h3 className="font-black text-slate-900 text-xl leading-tight">{plano.title}</h3>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{plano.id}</span>
                                                    <span className="text-xs font-bold text-slate-500 flex items-center">
                                                        <CalendarIcon size={12} className="mr-1.5" /> {plano.startDate} — {plano.endDate}
                                                    </span>
                                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                                        {associatedActivities.length} Atividades vinculadas
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 mt-4 md:mt-0">
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Estado</p>
                                                <span className={`mt-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[plano.status]}`}>
                                                    {plano.status}
                                                </span>
                                            </div>
                                            <div className="w-32 hidden sm:block">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">Progresso</span>
                                                    <span className="text-[10px] font-black text-blue-900">{plano.progress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-100">
                                                    <div className="bg-blue-900 h-full transition-all duration-1000" style={{ width: `${plano.progress}%` }}></div>
                                                </div>
                                            </div>
                                            
                                            {/* BOTÕES DE AÇÃO */}
                                            <div className="flex items-center gap-2 border-l pl-6 border-slate-100">
                                                <button 
                                                    onClick={() => setExpandedId(isExpanded ? null : plano.id)}
                                                    className={`p-2 rounded-lg transition-all border ${isExpanded ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-400 hover:text-blue-600 bg-white border-slate-200 hover:border-blue-200'}`}
                                                    title="Visualizar Detalhes"
                                                >
                                                    <Eye size={18}/>
                                                </button>
                                                {canManage && (
                                                    <>
                                                        <button 
                                                            className="p-2 text-slate-400 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-200 rounded-lg transition-all"
                                                            title="Editar Plano"
                                                        >
                                                            <Edit size={18}/>
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setPlanoToDelete(plano); }} 
                                                            className="p-2 text-slate-400 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 rounded-lg transition-all"
                                                            title="Remover Plano"
                                                        >
                                                            <Trash2 size={18}/></button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="p-8 border-t border-slate-100 bg-white animate-fadeIn">
                                            <div className="mb-8">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descrição do Plano</h4>
                                                <p className="text-sm text-slate-600 leading-relaxed italic">{plano.description}</p>
                                            </div>

                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="text-xs font-black text-blue-900 uppercase tracking-[0.2em] flex items-center">
                                                    <Activity size={16} className="mr-2" /> Atividades em Execução ({associatedActivities.length})
                                                </h4>
                                                {canManage && (
                                                    <button 
                                                        onClick={() => navigate('/atividades')}
                                                        className="text-[10px] font-black text-blue-600 border border-blue-100 bg-blue-50 px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        + Vincular Nova Atividade Operacional
                                                    </button>
                                                )}
                                            </div>

                                            {associatedActivities.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {associatedActivities.map(act => (
                                                        <div key={act.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between group hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                                                            <div className="flex items-center gap-4">
                                                                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-blue-600">
                                                                    <Activity size={20} />
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-slate-800 text-sm leading-tight">{act.title}</p>
                                                                    <div className="flex items-center gap-3 mt-1.5">
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{act.id} • {act.province}</span>
                                                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${activityStatusColors[act.status]}`}>
                                                                            {act.status}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => navigate('/atividades')}
                                                                className="p-3 bg-white text-blue-900 border border-slate-200 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all active:scale-95 flex items-center gap-2 hover:bg-blue-900 hover:text-white"
                                                            >
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Executar</span>
                                                                <ArrowRight size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-12 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                                                    <p className="text-sm text-slate-400 font-bold">Nenhuma atividade operacional vinculada a este plano nacional.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <CalendarView planos={planos} onEdit={() => {}} />
            )}

            <Suspense fallback={null}>
                <NovoPlanoAcaoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
                <ConfirmationModal 
                    isOpen={!!planoToDelete} 
                    onClose={() => setPlanoToDelete(null)} 
                    onConfirm={handleConfirmDelete} 
                    title="Eliminar Plano" 
                    message={`Deseja realmente remover o plano "${planoToDelete?.title}"? Todas as conexões operacionais serão desvinculadas mas as atividades não serão apagadas.`} 
                />
            </Suspense>
        </div>
    );
};

export default PlanoDeAcaoPage;
