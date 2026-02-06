
import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  ClipboardCheck, 
  Search, 
  MapPin, 
  CheckCircle2, 
  History, 
  MessageSquare, 
  ArrowUpRight, 
  ShieldAlert, 
  FileText, 
  Send, 
  Filter,
  Eye,
  PlusCircle,
  Clock,
  ChevronRight,
  UserCheck,
  Zap,
  FileCheck,
  X,
  Upload,
  AlertTriangle,
  RefreshCw,
  Archive,
  BarChart3,
  Gavel
} from 'lucide-react';
import { useNotification } from '../components/Notification';
import { useAuth } from '../hooks/useAuth';

// --- TIPAGEM ---
interface ExecutionItem {
  id: string;
  province: string;
  process: string;
  responsible: string;
  status: 'Em Curso' | 'Pendente' | 'Concluído' | 'Crítico';
  criticality: 'Crítica' | 'Alta' | 'Média' | 'Baixa';
  lastUpdate: string;
}

interface ValidationItem {
  id: string;
  type: string;
  origin: string;
  submittedBy: string;
  date: string;
  status: string;
}

interface AuditItem {
  id: string;
  province: string;
  process: string;
  type: string;
  status: 'Em Curso' | 'Concluído';
  result: 'Pendente' | 'Conforme' | 'Não Conforme';
}

interface CorrectiveAction {
  id: string;
  incident: string;
  responsible: string;
  deadline: string;
  risk: 'Baixo' | 'Médio' | 'Alto';
  status: string;
}

// --- ESTILOS ---
const criticalityColors: Record<string, string> = {
  'Crítica': 'bg-rose-100 text-rose-800 border-rose-200',
  'Alta': 'bg-orange-100 text-orange-800 border-orange-200',
  'Média': 'bg-amber-100 text-amber-800 border-amber-200',
  'Baixa': 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const statusColors: Record<string, string> = {
  'Em Curso': 'bg-blue-100 text-blue-800',
  'Crítico': 'bg-rose-600 text-white',
  'Concluído': 'bg-emerald-100 text-emerald-800',
  'Pendente': 'bg-slate-100 text-slate-600',
};

const GestaoOperacionalCentralPage: React.FC = () => {
  const { addNotification } = useNotification();
  const { user } = useAuth();
  
  // Estados de Dados
  const [activeTab, setActiveTab] = useState<'supervisao' | 'validacao' | 'auditoria' | 'corretivas'>('supervisao');
  const [searchTerm, setSearchTerm] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('Todas');
  const [executions, setExecutions] = useState<ExecutionItem[]>([
    { id: 'EXE-101', province: 'Cabinda', process: 'Fiscalização de Redes Irregulares', responsible: 'Sofia Miguel', status: 'Em Curso', criticality: 'Alta', lastUpdate: '2024-07-28 10:15' },
    { id: 'EXE-102', province: 'Luanda', process: 'Auditoria Posto Aduaneiro Kwanza', responsible: 'Pedro Kiala', status: 'Crítico', criticality: 'Crítica', lastUpdate: '2024-07-27 16:30' },
    { id: 'EXE-103', province: 'Zaire', process: 'Operação Transfronteiriça Luvo', responsible: 'João N\'Gola', status: 'Concluído', criticality: 'Média', lastUpdate: '2024-07-28 09:00' },
    { id: 'EXE-104', province: 'Cunene', process: 'Monitorização Santa Clara', responsible: 'Gestor Provincial', status: 'Em Curso', criticality: 'Baixa', lastUpdate: '2024-07-28 11:20' },
  ]);
  
  const [validations, setValidations] = useState<ValidationItem[]>([
    { id: 'VAL-001', type: 'Relatório Mensal', origin: 'Cabinda', submittedBy: 'Sofia Miguel', date: '2024-07-27', status: 'Pendente' },
    { id: 'VAL-002', type: 'Termo de Referência', origin: 'Luanda', submittedBy: 'Pedro Kiala', date: '2024-07-28', status: 'Pendente' },
  ]);

  const [audits, setAudits] = useState<AuditItem[]>([
    { id: 'AUD-501', province: 'Benguela', process: 'Gestão de Património', type: 'Operacional', status: 'Em Curso', result: 'Pendente' },
    { id: 'AUD-502', province: 'Namibe', process: 'Controlo de Combustível', type: 'Financeira', status: 'Concluído', result: 'Conforme' },
  ]);

  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>([
    { id: 'COR-01', incident: 'Divergência em Inventário', responsible: 'Pedro Kiala', deadline: '2024-08-05', risk: 'Médio', status: 'Em Execução' },
  ]);

  // Estados de Modais
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [selectedForDecision, setSelectedForDecision] = useState<ValidationItem | null>(null);
  const [decisionType, setDecisionType] = useState<string>('');
  const [decisionComment, setDecisionComment] = useState('');

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedForAudit, setSelectedForAudit] = useState<AuditItem | null>(null);
  const [auditFindings, setAuditFindings] = useState('');

  const [isNewCorrectionModalOpen, setIsNewCorrectionModalOpen] = useState(false);

  // --- FILTRAGEM ---
  const filteredExecution = useMemo(() => {
    return executions.filter(item => 
      (provinceFilter === 'Todas' || item.province === provinceFilter) &&
      (item.process.toLowerCase().includes(searchTerm.toLowerCase()) || item.responsible.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [executions, searchTerm, provinceFilter]);

  // --- AÇÕES ---
  const handleOpenDecision = (item: ValidationItem, type: string) => {
    setSelectedForDecision(item);
    setDecisionType(type);
    setDecisionComment('');
    setIsDecisionModalOpen(true);
  };

  const confirmDecision = () => {
    if (!decisionComment.trim()) {
      addNotification('As observações são obrigatórias para qualquer decisão estratégica.', 'error', 'Validação');
      return;
    }
    setValidations(prev => prev.filter(v => v.id !== selectedForDecision?.id));
    addNotification(`Processo ${selectedForDecision?.id} - Ação "${decisionType}" concluída com sucesso.`, 'success', 'Supervisão');
    setIsDecisionModalOpen(false);
  };

  const handleOpenAudit = (item: AuditItem) => {
    setSelectedForAudit(item);
    setAuditFindings('');
    setIsAuditModalOpen(true);
  };

  const saveAuditFindings = () => {
    if (!auditFindings.trim()) {
      addNotification('Por favor, descreva as constatações da auditoria.', 'error', 'Auditoria');
      return;
    }
    setAudits(prev => prev.map(a => a.id === selectedForAudit?.id ? { ...a, status: 'Concluído', result: 'Conforme' } : a));
    addNotification('Constatações de auditoria registradas e enviadas ao Coordenador Estratégico.', 'success', 'Auditoria');
    setIsAuditModalOpen(false);
  };

  const openNewCorrectiveAction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAction: CorrectiveAction = {
      id: `COR-0${correctiveActions.length + 2}`,
      incident: formData.get('incident') as string,
      responsible: formData.get('responsible') as string,
      deadline: formData.get('deadline') as string,
      risk: formData.get('risk') as 'Baixo' | 'Médio' | 'Alto',
      status: 'Pendente'
    };
    setCorrectiveActions([newAction, ...correctiveActions]);
    addNotification('Nova ação corretiva aberta para intervenção imediata.', 'success', 'Ação Corretiva');
    setIsNewCorrectionModalOpen(false);
  };

  const handlePonteAction = (action: string) => {
    addNotification(`Solicitação de "${action}" encaminhada ao Coordenador Estratégico (GMO).`, 'info', 'Ponte Estratégica');
  };

  return (
    <div className="w-full pb-12 animate-fadeIn">
      {/* 1. HEADER OPERACIONAL COM INDICADORES DINÂMICOS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Activity size={140} className="text-blue-900" />
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 rounded-2xl bg-[#002B7F] flex items-center justify-center shadow-lg border-2 border-blue-800/30">
              <UserCheck className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Coordenador Operacional Central</h1>
                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                  Supervisão Nacional
                </span>
              </div>
              <p className="text-slate-500 mt-1 font-medium flex items-center text-sm">
                <MapPin size={14} className="mr-1.5 text-blue-600" /> Províncias em supervisão: <span className="font-bold text-slate-700 ml-1">Todas</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full lg:w-auto border-l-0 lg:border-l lg:pl-8 border-slate-200">
            <button onClick={() => setActiveTab('supervisao')} className="text-center lg:text-left hover:opacity-75 transition-opacity">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Supervisão</p>
              <p className="text-xl font-black text-slate-900">{executions.length}</p>
            </button>
            <button onClick={() => setActiveTab('validacao')} className="text-center lg:text-left hover:opacity-75 transition-opacity">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Validações</p>
              <p className="text-xl font-black text-blue-600">{validations.length}</p>
            </button>
            <div className="text-center lg:text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Críticos</p>
              <p className="text-xl font-black text-rose-600">{executions.filter(e => e.status === 'Crítico').length}</p>
            </div>
            <button onClick={() => setActiveTab('auditoria')} className="text-center lg:text-left hover:opacity-75 transition-opacity">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Auditorias</p>
              <p className="text-xl font-black text-indigo-600">{audits.length}</p>
            </button>
          </div>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="bg-slate-200/50 p-1.5 rounded-xl flex flex-wrap gap-1 mb-8 w-fit shadow-inner">
        {[
          { id: 'supervisao', label: 'Supervisão Nacional', icon: Activity },
          { id: 'validacao', label: 'Aprovação e Validação', icon: FileCheck },
          { id: 'auditoria', label: 'Auditoria Operacional', icon: ClipboardCheck },
          { id: 'corretivas', label: 'Ações Corretivas', icon: ShieldAlert },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center transition-all ${activeTab === tab.id ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <tab.icon size={14} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. CONTEÚDO DINÂMICO POR ABA */}
      <div className="space-y-6 min-h-[400px]">
        
        {activeTab === 'supervisao' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Pesquisar por processo ou responsável..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 shadow-sm outline-none"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter size={18} className="text-slate-400" />
                <select title="Filtrar por Província" 
                  value={provinceFilter}
                  onChange={(e) => setProvinceFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm outline-none"
                >
                  <option value="Todas">Nacional (Todas)</option>
                  <option value="Luanda">Luanda</option>
                  <option value="Cabinda">Cabinda</option>
                  <option value="Zaire">Zaire</option>
                  <option value="Cunene">Cunene</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Província</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Processo / Atividade</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsável Local</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Criticidade</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredExecution.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center text-sm font-bold text-slate-700">
                          <MapPin size={14} className="mr-2 text-blue-500" /> {item.province}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900 text-sm group-hover:text-blue-900 transition-colors">{item.process}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">Última att: {item.lastUpdate}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center text-sm font-medium text-slate-600">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mr-2 text-[10px] font-black text-slate-400 border border-slate-200">
                            {item.responsible.charAt(0)}
                          </div>
                          {item.responsible}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${statusColors[item.status]}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${criticalityColors[item.criticality]}`}>
                          {item.criticality}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Visualizar Detalhes"><Eye size={18}/></button>
                          <button onClick={() => setActiveTab('auditoria')} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Abrir Auditoria"><ClipboardCheck size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'validacao' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center mb-4">
                <Clock className="mr-2 text-blue-600" size={20} /> Pendentes de Validação Estratégica
              </h3>
              <div className="space-y-4">
                {validations.map(val => (
                  <div key={val.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-blue-300 transition-all group">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase border border-blue-100 font-mono">{val.id}</span>
                          <h4 className="font-black text-slate-900 text-base">{val.type}</h4>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">Origem: <span className="text-slate-800 font-bold">{val.origin}</span> • Submetido por {val.submittedBy} em {val.date}</p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={() => handleOpenDecision(val, 'Aprovar')} className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-md transition-all active:scale-95">Validar</button>
                        <button onClick={() => handleOpenDecision(val, 'Solicitar Ajustes')} className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Ajustes</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center border-b pb-4">
                <History className="mr-2 text-slate-400" size={16} /> Histórico de Decisões
              </h3>
              <div className="space-y-6">
                {[
                  { title: 'REL-Junho Nacional', decision: 'Validado', date: 'Há 1h', coord: 'Manuel Costa' },
                  { title: 'TDR-Patrulha Cabinda', decision: 'Ajuste Solicitado', date: 'Há 4h', coord: 'Manuel Costa' },
                  { title: 'PA-Especial Luanda', decision: 'Aprovado', date: 'Ontem', coord: 'Manuel Costa' },
                ].map((d, i) => (
                  <div key={i} className="flex justify-between items-start text-sm">
                    <div>
                      <p className="font-bold text-slate-700 leading-tight">{d.title}</p>
                      <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mt-1">{d.date} • {d.coord}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${d.decision === 'Aprovado' || d.decision === 'Validado' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {d.decision}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'auditoria' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center">
                <FileText className="mr-2 text-indigo-600" size={20} /> Auditorias Atribuídas (Alcance Nacional)
              </h3>
              <button className="bg-[#002B7F] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center shadow-lg transition-all">
                <Search className="mr-2" size={16} /> Pesquisar Auditorias
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left font-black text-slate-400 uppercase text-[10px] tracking-widest">Província</th>
                  <th className="px-6 py-4 text-left font-black text-slate-400 uppercase text-[10px] tracking-widest">Processo Auditado</th>
                  <th className="px-6 py-4 text-left font-black text-slate-400 uppercase text-[10px] tracking-widest">Tipo de Auditoria</th>
                  <th className="px-6 py-4 text-center font-black text-slate-400 uppercase text-[10px] tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-center font-black text-slate-400 uppercase text-[10px] tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {audits.map(audit => (
                  <tr key={audit.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-700 font-bold">{audit.province}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{audit.process}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase mt-0.5 font-mono">{audit.id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 uppercase text-[10px] font-black">{audit.type}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${audit.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                        {audit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleOpenAudit(audit)}
                        className="text-blue-900 hover:text-black font-black text-[10px] uppercase tracking-widest flex items-center mx-auto transition-colors"
                      >
                        Registrar Constatações <ChevronRight size={14} className="ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'corretivas' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl shadow-sm">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Ações Ativas</p>
                <p className="text-3xl font-black text-rose-900">{correctiveActions.length}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl shadow-sm">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Impacto Reduzido</p>
                <p className="text-3xl font-black text-emerald-900">08</p>
              </div>
              <button 
                onClick={() => setIsNewCorrectionModalOpen(true)}
                className="bg-[#002B7F] hover:bg-black text-white p-6 rounded-2xl flex flex-col items-center justify-center transition-all shadow-lg active:scale-95 group col-span-1 sm:col-span-2"
              >
                <Zap size={24} className="group-hover:scale-110 transition-transform mb-2 text-yellow-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Abrir Ação Corretiva em Operação Crítica</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b flex justify-between items-center bg-rose-50/20">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center">
                    <ShieldAlert className="mr-2 text-rose-600" size={20} /> Ações Corretivas em Execução
                  </h3>
               </div>
               <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {correctiveActions.map(action => (
                    <div key={action.id} className="border border-slate-100 bg-white rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg hover:border-blue-200 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="font-black text-slate-900 text-lg leading-tight mb-2 group-hover:text-blue-900 transition-colors">{action.incident}</h4>
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-black uppercase rounded font-mono">{action.id}</span>
                                <p className="text-xs text-slate-500 font-bold">Responsável Local: <span className="text-slate-700">{action.responsible}</span></p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase border ${action.risk === 'Alto' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>Risco {action.risk}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prazo Final</p>
                            <p className="text-sm font-bold text-slate-700 flex items-center"><Clock size={14} className="mr-1.5 text-slate-400" /> {action.deadline}</p>
                          </div>
                          <button className="bg-slate-900 hover:bg-[#002B7F] text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95">Acompanhar</button>
                        </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. PONTE COM O COORDENADOR ESTRATÉGICO */}
      <div className="mt-16 bg-gradient-to-br from-[#001a4c] to-slate-900 rounded-3xl p-10 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transform rotate-12 scale-150">
            <Send size={220} />
          </div>
          
          <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center">
                <ArrowUpRight className="mr-3 text-blue-400" size={32} /> Ponte Estratégica Nacional
              </h2>
              <p className="text-blue-100 font-medium text-lg mb-10 leading-relaxed">
                Área de comunicação direta para escalonamento de incidentes críticos, submissão de relatórios nacionais consolidados e recomendações ao Comité de Gestão GMO.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button onClick={() => handlePonteAction('Relatório Consolidado')} className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center transition-all active:scale-95 shadow-xl">
                  <FileText className="mr-2" size={18} /> Enviar Consolidado
                </button>
                <button onClick={() => handlePonteAction('Escalonamento de Incidente')} className="bg-blue-800/40 text-white hover:bg-blue-800 border border-blue-700/50 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center transition-all active:scale-95 shadow-lg">
                  <ShieldAlert className="mr-2" size={18} /> Escalar Incidente
                </button>
                <button onClick={() => handlePonteAction('Recomendação Operacional')} className="bg-blue-800/40 text-white hover:bg-blue-800 border border-blue-700/50 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center transition-all active:scale-95 shadow-lg">
                  <MessageSquare className="mr-2" size={18} /> Recomendar Medida
                </button>
              </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center text-blue-300/60 text-[10px] font-black uppercase tracking-[0.4em]">
            <span>Histórico de Comunicações Estratégicas</span>
            <button className="hover:text-white transition-colors flex items-center group">
                Ver Todo Histórico <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
      </div>

      {/* --- MODAIS DE FUNCIONALIDADE --- */}

      {/* Modal de Decisão (Aprovação/Validação) */}
      {isDecisionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{decisionType}: {selectedForDecision?.id}</h3>
              <button onClick={() => setIsDecisionModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-sm font-bold text-blue-900 mb-1">Processo: <span className="font-normal">{selectedForDecision?.type}</span></p>
                <p className="text-sm font-bold text-blue-900">Origem: <span className="font-normal">{selectedForDecision?.origin}</span></p>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Observações Estratégicas (Obrigatório)</label>
                <textarea 
                  value={decisionComment}
                  onChange={(e) => setDecisionComment(e.target.value)}
                  placeholder="Descreva os motivos da decisão ou recomendações..."
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t flex gap-3">
              <button onClick={() => setIsDecisionModalOpen(false)} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-800">Cancelar</button>
              <button onClick={confirmDecision} className="flex-1 bg-[#002B7F] text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 transition-all">Confirmar Decisão</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Auditoria (Registrar Constatações) */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b flex justify-between items-center bg-indigo-50">
              <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tight">Registro de Auditoria Operacional</h3>
              <button onClick={() => setIsAuditModalOpen(false)} className="p-2 hover:bg-indigo-100 rounded-full transition-colors text-indigo-900"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entidade Auditada</p>
                  <p className="text-sm font-bold text-slate-900">{selectedForAudit?.province} - {selectedForAudit?.process}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ID Auditoria</p>
                  <p className="text-sm font-bold text-slate-900 font-mono">{selectedForAudit?.id}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Relatório de Constatações</label>
                <textarea 
                  value={auditFindings}
                  onChange={(e) => setAuditFindings(e.target.value)}
                  placeholder="Liste as não conformidades ou pontos de melhoria detectados..."
                  className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Resultado Preliminar</label>
                  <select title="Selecionar resultado preliminar" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Conforme</option>
                    <option>Não Conforme</option>
                    <option>Melhoria Solicitada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Anexar Evidências (PDF/IMG)</label>
                  <button className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all">
                    <Upload size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">Carregar Arquivo</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t flex gap-3">
              <button onClick={() => setIsAuditModalOpen(false)} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-slate-500">Cancelar</button>
              <button onClick={saveAuditFindings} className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 active:scale-95 transition-all">Finalizar Registro</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ação Corretiva */}
      {isNewCorrectionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b flex justify-between items-center bg-rose-50">
              <h3 className="text-xl font-black text-rose-900 uppercase tracking-tight flex items-center"><Zap className="mr-2 text-yellow-500" size={20}/> Abrir Ação Corretiva Crítica</h3>
              <button onClick={() => setIsNewCorrectionModalOpen(false)} className="p-2 hover:bg-rose-100 rounded-full transition-colors text-rose-900"><X size={20}/></button>
            </div>
            <form onSubmit={openNewCorrectiveAction}>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Incidente / Problema Detectado</label>
                  <input name="incident" required placeholder="Ex: Falha Crítica de Segurança em Santa Clara" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Responsável Pela Correção</label>
                    <input name="responsible" required placeholder="Nome do Gestor Local" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Grau de Risco</label>
                    <select title="Selecionar grau de risco" name="risk" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-rose-600 outline-none focus:ring-2 focus:ring-rose-500">
                      <option value="Alto">Alto Risco</option>
                      <option value="Médio">Risco Médio</option>
                      <option value="Baixo">Risco Baixo</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Prazo Limite para Resolução</label>
                  <input title="Selecionar prazo limite para resolução" name="deadline" type="date" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500" />
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t flex gap-3">
                <button type="button" onClick={() => setIsNewCorrectionModalOpen(false)} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-slate-500">Descartar</button>
                <button type="submit" className="flex-1 bg-rose-600 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-900/20 active:scale-95 transition-all">Ativar Intervenção</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default GestaoOperacionalCentralPage;
