
import React, { useState, lazy, Suspense, useMemo, useEffect } from 'react';
import { 
  MapPin, PlusCircle, Search, Edit, Trash2, Eye, ClipboardCheck, Filter, Activity,
  Calendar as CalendarIcon, FileText, ChevronLeft, ChevronRight, List, RefreshCw,
  CheckCircle2, Clock, AlertCircle, MessageSquare, User, CalendarDays, Download
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../components/Notification';

const NovaAtividadeModal = lazy(() => import('../components/NovaAtividadeModal'));
const DetalheAtividadeModal = lazy(() => import('../components/DetalheAtividadeModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));
const PdfViewerModal = lazy(() => import('../components/PdfViewerModal'));

const mockActivities = [
  { 
    id: 'ATV-001', 
    title: 'Fiscalização Costa Norte', 
    responsible: 'Cmdt. Manuel Santos', 
    startDate: '2024-07-01', 
    endDate: '2024-07-05', 
    status: 'Em Andamento', 
    priority: 'Alta',
    province: 'Cabinda',
    vessel: 'Patrulha Angola I',
    type: 'Marítima',
    coordinates: '-5.5° S, 12.2° E',
    infractions: 3,
    planoAcaoId: 'PA-02',
    objectives: ['Verificar cumprimento das normas de pesca', 'Inspecionar embarcações'],
    source: 'list'
  },
  { id: 'ATV-002', title: 'Auditoria Posto Luvo', responsible: 'Técnico B', startDate: '2024-07-12', endDate: '2024-07-12', status: 'Em Curso', priority: 'Alta', province: 'Zaire', type: 'Técnica/IT', planoAcaoId: 'PA-01', source: 'list' },
  { id: 'ATV-003', title: 'Upgrade de Servidores Centrais', responsible: 'Gestor 1', startDate: '2024-07-15', endDate: '2024-07-17', status: 'Planeada', priority: 'Média', province: 'Luanda', type: 'IT', planoAcaoId: 'PA-01', source: 'list' },
  { id: 'ATV-005', title: 'Verificação de Backups', responsible: 'Técnico A', startDate: '2024-07-08', endDate: '2024-07-08', status: 'Concluída', priority: 'Média', province: 'Luanda', type: 'Técnica/IT', planoAcaoId: 'PA-01', source: 'list' },
  { id: 'ATV-006', title: 'Patrulha Porto Pesqueiro', responsible: 'Dra. Sofia Lima', startDate: '2024-07-20', endDate: '2024-07-22', status: 'Planeada', priority: 'Alta', province: 'Benguela', type: 'Marítima', planoAcaoId: 'PA-02', source: 'list' },
];

const mockActivityReports = [
    { id: 'RAT-001', activityId: 'ATV-005', title: 'Relatório de Backup Trimestral', date: '2024-07-08', status: 'Validado', author: 'Técnico A', province: 'Luanda', feedback: 'Documentação impecável.' },
    { id: 'RAT-002', activityId: 'ATV-001', title: 'Relatório Fiscalização Costa Norte', date: '2024-07-05', status: 'Submetido', author: 'Manuel Santos', province: 'Cabinda' },
    { id: 'RAT-003', activityId: 'ATV-001', title: 'Fiscalização Massabi', date: '2024-07-28', status: 'Devolvido', author: 'Técnico Operação', province: 'Cabinda', feedback: 'As coordenadas registradas divergem do plano original.' },
];

const mockActivityReportsForApproval = [
    { id: 'RAT-004', activityId: 'ATV-001', title: 'Relatório Final Costa Norte', date: '2024-07-05', status: 'Pendente', author: 'Cmdt. Manuel Santos', province: 'Cabinda' },
];

const mockPlanos = [
    { id: 'PA-01', title: 'Modernização Tecnológica das Fronteiras' },
    { id: 'PA-02', title: 'Estratégia Nacional de Combate à Imigração Ilegal' }
];

const statusColors: { [key: string]: string } = {
  'Em Andamento': 'bg-blue-100 text-blue-800 border-blue-200',
  'Em Curso': 'bg-sky-100 text-sky-800 border-sky-200',
  'Concluída': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Planeada': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Atrasada': 'bg-red-100 text-red-800 border-red-200',
};

const reportStatusConfig: Record<string, { color: string, icon: any }> = {
    'Validado': { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    'Submetido': { color: 'bg-blue-100 text-blue-700', icon: Clock },
    'Devolvido': { color: 'bg-rose-100 text-rose-700', icon: AlertCircle },
};

const CalendarView: React.FC<{ activities: any[], onViewDetails: (act: any) => void }> = ({ activities, onViewDetails }) => {
    const [currentDate, setCurrentDate] = useState(new Date()); 
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Octubro", "Novembro", "Dezembro"];
    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarDays = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`empty-${i}`} className="h-32 bg-slate-50/30 border border-slate-100"></div>);
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayActivities = activities.filter(a => a.startDate === dateStr || (dateStr >= a.startDate && dateStr <= a.endDate));
        const isToday = dateStr === todayStr;
        calendarDays.push(
            <div key={day} className={`h-32 border border-slate-100 p-2 overflow-y-auto group transition-colors ${isToday ? 'bg-blue-50/30 ring-1 ring-inset ring-blue-200' : 'bg-white hover:bg-slate-50'}`}>
                <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-black ${isToday ? 'text-blue-600' : 'text-slate-300'} group-hover:text-blue-500`}>{day}</span>
                </div>
                <div className="space-y-1 mt-1">
                    {dayActivities.map(act => (
                        <div key={act.id} onClick={() => onViewDetails(act)} className={`text-[8px] font-black uppercase p-1 rounded truncate cursor-pointer shadow-sm border ${statusColors[act.status] || 'bg-slate-100'}`} title={act.title}>
                            {act.title}
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
                    <CalendarIcon className="mr-2 text-blue-600" size={18} /> Escala de Atividades
                </h3>
                <div className="flex items-center gap-3">
                    <button onClick={handlePrevMonth} className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 shadow-sm"><ChevronLeft size={16}/></button>
                    <span className="text-[10px] font-black uppercase tracking-widest">{months[month]} {year}</span>
                    <button onClick={handleNextMonth} className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 shadow-sm"><ChevronRight size={16}/></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-px bg-slate-100 border-b border-slate-100">
                {daysOfWeek.map(day => <div key={day} className="py-3 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-px bg-slate-100">{calendarDays}</div>
        </div>
    );
};

const AtividadesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasRole } = useAuth();
  const { addNotification } = useNotification();
  
  const [activeTab, setActiveTab] = useState<'lista' | 'calendario' | 'relatorios'>('lista');

  useEffect(() => {
    if (location.state?.activeTab) {
        setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const [activities, setActivities] = useState(mockActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('Todos');
  const [reportStatusFilter, setReportStatusFilter] = useState('Todos');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<any | null>(null);
  const [activityToEdit, setActivityToEdit] = useState<any | null>(null);
  const [pdfViewerState, setPdfViewerState] = useState({ isOpen: false, url: '', title: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  // FIX: Added handleSaveAtividade to handle activity creation and editing from the NovaAtividadeModal.
  const handleSaveAtividade = (data: any) => {
    if (data.id && activities.some(a => a.id === data.id)) {
      // Edit mode
      setActivities(prev => prev.map(a => a.id === data.id ? { ...a, ...data } : a));
      addNotification('Atividade atualizada com sucesso.', 'success', 'Sucesso');
    } else {
      // Creation mode
      const newActivity = {
        ...data,
        id: data.id || `ATV-${String(activities.length + 1).padStart(3, '0')}`,
        source: 'list'
      };
      setActivities(prev => [newActivity, ...prev]);
      addNotification('Nova atividade registada no sistema.', 'success', 'Sucesso');
    }
  };

  const isRegional = ['coordenador_utl_regional', 'gestor_operacao_provincial', 'tecnico_operacao_provincial'].includes(user?.profile.role || '');
  const userProvince = user?.province;
  const canManage = hasRole('administrador') || hasRole('coordenador_operacional_central') || hasRole('gestor_operacao_provincial');

  // REGRA DE ACESSO: Tecnico Operacional Central não vê Calendário
  const isTecnicoCentral = user?.profile.role === 'tecnico_operacional_central';

  const tabs = useMemo(() => {
    const baseTabs = [
        { id: 'lista', label: 'Lista de Atividades', icon: List },
        { id: 'calendario', label: 'Calendário de Atividades', icon: CalendarIcon },
        { id: 'relatorios', label: 'Relatórios de Atividade', icon: FileText }
    ];
    if (isTecnicoCentral) {
        return baseTabs.filter(t => t.id !== 'calendario');
    }
    return baseTabs;
  }, [isTecnicoCentral]);

  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
        if (isRegional && act.province !== userProvince) return false;
        const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase()) || act.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = selectedPlanId === 'Todos' || act.planoAcaoId === selectedPlanId;
        return matchesSearch && matchesPlan;
    });
  }, [activities, searchTerm, selectedPlanId, isRegional, userProvince]);

  const filteredReports = useMemo(() => {
    return mockActivityReports.filter(rep => {
        if (isRegional && rep.province !== userProvince) return false;
        const matchesSearch = rep.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             rep.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             rep.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = reportStatusFilter === 'Todos' || rep.status === reportStatusFilter;
        const matchesDate = (!dateFilter.start || rep.date >= dateFilter.start) && 
                            (!dateFilter.end || rep.date <= dateFilter.end);
        return matchesSearch && matchesStatus && matchesDate;
    });
  }, [searchTerm, reportStatusFilter, dateFilter, isRegional, userProvince]);

  const generateOfficialPDFBlob = async (report: any) => {
    if (!window.jspdf || !(window.jspdf as any).jsPDF) {
        addNotification("Biblioteca de PDF não carregada.", "error", "Falha");
        return null;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = 20;
    const contentWidth = pageWidth - (leftMargin * 2);
    doc.setFillColor(0, 43, 127); 
    doc.rect(10, 10, 5, 277, 'F'); 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("CONFIDENCIAL", pageWidth - 20, 15, { align: 'right' });
    doc.setTextColor(255, 0, 0);
    doc.setFontSize(32);
    doc.text("CGCF", pageWidth / 2, 50, { align: 'center' });
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text("GRUPO OPERACIONAL MULTISSECTORIAL", pageWidth / 2, 75, { align: 'center' });
    doc.setDrawColor(0, 43, 127);
    doc.setLineWidth(0.8);
    doc.rect(30, 95, 150, 45); 
    doc.setFontSize(16);
    doc.text("RELATÓRIO DA OPERAÇÃO NO ÂMBITO DO", pageWidth / 2, 112, { align: 'center' });
    doc.setFontSize(14);
    const titleLines = doc.splitTextToSize(report.title?.toUpperCase() || "RELATÓRIO OPERACIONAL", 130);
    doc.text(titleLines, pageWidth / 2, 124, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`PROVÍNCIA: ${report.province?.toUpperCase() || "CABINDA"}`, pageWidth / 2, 160, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`*Janeiro de 2026*`, pageWidth / 2, 230, { align: 'center' });
    doc.addPage();
    return doc.output('blob');
  };

  const openPdfViewer = async (report: any) => {
      setIsGenerating(true);
      const blob = await generateOfficialPDFBlob(report);
      if (blob) {
          setPdfViewerState({ isOpen: true, url: URL.createObjectURL(blob), title: `Relatório: ${report.id}` });
      }
      setIsGenerating(false);
  };

  const downloadReport = async (report: any) => {
      setIsGenerating(true);
      const blob = await generateOfficialPDFBlob(report);
      if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Relatorio_${report.id}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          addNotification(`Download concluído: ${report.id}`, "success", "Sucesso");
      }
      setIsGenerating(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Atividades</h1>
          <p className="text-slate-500 mt-1 font-bold text-sm flex items-center">
             <Activity className="h-4 w-4 mr-2 text-blue-600" /> Coordenação e Execução de Atividades em Território Nacional
          </p>
        </div>
        {canManage && (
          <button onClick={() => { setActivityToEdit(null); setIsCreateModalOpen(true); }} className="bg-blue-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest py-3 px-6 rounded-xl flex items-center shadow-lg transition-all active:scale-95">
            <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Atividade
          </button>
        )}
      </div>

      <div className="bg-slate-200/50 p-1.5 rounded-2xl flex flex-wrap gap-1 mb-8 w-fit shadow-inner">
        {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center transition-all ${activeTab === tab.id ? 'bg-white text-blue-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
                <tab.icon size={14} className="mr-2" /> {tab.label}
            </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 shadow-sm items-end animate-fadeIn">
          <div className="flex-grow w-full md:w-auto">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Pesquisa Tática</label>
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder={activeTab === 'relatorios' ? "Pesquisar por título, ID ou autor..." : "Pesquisar atividade..."} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"/>
              </div>
          </div>
          {activeTab === 'relatorios' ? (
              <>
                <div className="w-full md:w-48">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Estado</label>
                    <select title="Filtro de Estado" value={reportStatusFilter} onChange={e => setReportStatusFilter(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase text-slate-700 outline-none shadow-sm"><option value="Todos">Todos os Estados</option><option value="Submetido">Submetidos</option><option value="Devolvido">Devolvidos</option><option value="Validado">Validados</option></select>
                </div>
                <div className="w-full md:w-auto flex gap-2">
                    <div className="w-full md:w-32">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Desde</label>
                        <input title="Data Inicial" type="date" value={dateFilter.start} onChange={e => setDateFilter({...dateFilter, start: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl px-3 py-2 text-[10px] font-bold text-slate-700 outline-none shadow-sm" />
                    </div>
                    <div className="w-full md:w-32">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Até</label>
                        <input title="Data Final" type="date" value={dateFilter.end} onChange={e => setDateFilter({...dateFilter, end: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl px-3 py-2 text-[10px] font-bold text-slate-700 outline-none shadow-sm" />
                    </div>
                </div>
              </>
          ) : (
              <div className="w-full md:w-64">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Plano Nacional</label>
                <select title="Filtro de Plano Nacional" value={selectedPlanId} onChange={e => setSelectedPlanId(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase text-slate-700 outline-none shadow-sm"><option value="Todos">Todos os Planos</option>{mockPlanos.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select>
              </div>
          )}
      </div>

      <div className="min-h-[500px]">
          {activeTab === 'lista' && (
              <div className="animate-fadeIn">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Atividade / ID</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsável</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Localização</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Período</th>
                        <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                        <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredActivities.map(act => (
                            <tr key={act.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => { setSelectedActivity(act); setIsDetailsModalOpen(true); }}>
                            <td className="px-6 py-5">
                                <div className="font-black text-slate-900 text-sm">{act.title}</div>
                                <div className="text-[9px] text-blue-600 font-black uppercase mt-0.5 tracking-tighter">ID: {act.id}</div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center text-xs font-bold text-slate-600 uppercase tracking-tighter"><User size={14} className="mr-2 text-slate-400" /> {act.responsible}</div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center text-xs font-black text-slate-500 uppercase tracking-tighter"><MapPin size={14} className="mr-2 text-rose-500" /> {act.province}</div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-tighter"><CalendarIcon size={12} className="mr-1.5 text-slate-400" /> {act.startDate} - {act.endDate}</div>
                            </td>
                            <td className="px-6 py-5 text-center"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusColors[act.status] || 'bg-slate-100'}`}>{act.status}</span></td>
                            <td className="px-6 py-5 text-center">
                                <div className="flex justify-center items-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); setSelectedActivity(act); setIsDetailsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Eye size={18} /></button>
                                {canManage && (
                                    <>
                                    {/* FIX: Corrigido o nome da função de 'setAtividadeToEdit' para 'setActivityToEdit' */}
                                    <button onClick={(e) => { e.stopPropagation(); setActivityToEdit(act); setIsCreateModalOpen(true); }} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg"><Edit size={18} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); setActivityToDelete(act); }} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={18} /></button>
                                    </>
                                )}
                                </div>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
              </div>
          )}
          {activeTab === 'calendario' && !isTecnicoCentral && <CalendarView activities={filteredActivities} onViewDetails={(act) => { setSelectedActivity(act); setIsDetailsModalOpen(true); }} />}
          {activeTab === 'relatorios' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                  <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
                          <FileText className="mr-2 text-indigo-600" size={18} /> Central de Relatórios de Atividade
                      </h3>
                      {isGenerating && <div className="flex items-center gap-2 text-blue-600 font-bold text-xs animate-pulse"><RefreshCw className="animate-spin" size={14} /> Gerando Documento...</div>}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Código</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Título / Referência</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Autor / Responsável</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredReports.map(rep => {
                                const cfg = reportStatusConfig[rep.status] || { color: 'bg-slate-100 text-slate-700', icon: Clock };
                                return (
                                    <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5 font-mono text-[10px] font-black text-blue-900">{rep.id}</td>
                                        <td className="px-6 py-5"><div className="font-bold text-slate-800 text-sm">{rep.title}</div><div className="text-[9px] text-slate-400 font-bold uppercase mt-1">Ref: {rep.activityId} • {rep.province}</div></td>
                                        <td className="px-6 py-5"><div className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700"><User size={12} className="mr-2" /><span className="text-[10px] font-black uppercase tracking-tight">{rep.author}</span></div></td>
                                        <td className="px-6 py-5 text-center text-[10px] font-bold text-slate-500 uppercase">{rep.date}</td>
                                        <td className="px-6 py-5 text-center"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm inline-flex items-center gap-1.5 ${cfg.color}`}><cfg.icon size={12} /> {rep.status}</span></td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openPdfViewer(rep)} className="bg-white border border-slate-200 text-slate-600 hover:text-blue-900 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 disabled:opacity-50" disabled={isGenerating}><Eye size={12} /> Ver</button>
                                                <button onClick={() => downloadReport(rep)} className="bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 disabled:opacity-50" disabled={isGenerating}><Download size={12} /> Baixar</button>
                                                <button onClick={() => navigate(`/atividades/${rep.activityId}/relatorio`)} className="bg-white border border-slate-200 text-indigo-600 hover:text-indigo-900 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5"><Edit size={12} /> Editar</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredReports.length === 0 && <div className="py-20 text-center flex flex-col items-center"><FileText size={48} className="text-slate-200 mb-4" /><p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhum relatório encontrado para os filtros selecionados.</p></div>}
                  </div>
              </div>
          )}
      </div>

      <Suspense fallback={null}>
        <NovaAtividadeModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleSaveAtividade} planosDeAcao={mockPlanos} activityToEdit={activityToEdit} />
        {/* FIX: Corrigido o nome da função de 'setAtividadeToEdit' para 'setActivityToEdit' no callback onEdit */}
        <DetalheAtividadeModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} activity={selectedActivity} planos={mockPlanos} onEdit={canManage ? (act) => { setIsDetailsModalOpen(false); setActivityToEdit(act); setIsCreateModalOpen(true); } : undefined} />
        <ConfirmationModal isOpen={!!activityToDelete} onClose={() => setActivityToDelete(null)} onConfirm={() => setActivities(prev => prev.filter(a => a.id !== activityToDelete.id))} title="Eliminar Atividade" message={`Tem a certeza que deseja eliminar "${activityToDelete?.title}"?`} />
        <PdfViewerModal isOpen={pdfViewerState.isOpen} onClose={() => setPdfViewerState({ ...pdfViewerState, isOpen: false })} pdfUrl={pdfViewerState.url} title={pdfViewerState.title} />
      </Suspense>
    </div>
  );
};

export default AtividadesPage;
