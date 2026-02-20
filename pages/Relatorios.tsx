import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, FileText, Trash2, ArrowLeft, File, Search, User, Calendar, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));
const DetalheRelatorioModal = lazy(() => import('../components/DetalheRelatorioModal'));

declare global {
    interface Window { jspdf: any; }
}

const mockReportsData = [
  { id: 'REL-001', version: 2, month: 'Maio/2024', province: 'Luanda', status: 'Validado', createdBy: 'Admin', createdAt: '2024-06-03', updatedBy: 'Admin', updatedAt: '2024-06-05', summary: 'Relatório validado. Todas as metas foram atingidas.', kpiMissions: 12, kpiInfractions: 5, kpiProjects: 2, activitiesSummary: 'Fiscalização na costa norte concluída com sucesso.', challenges: 'Nenhum desafio significativo encontrado.', nextMonthPlan: 'Iniciar planeamento da auditoria de segurança anual.', history: [{ version: 1, status: 'Em Edição', updatedBy: 'Admin', updatedAt: '2024-06-03', summary: 'Versão inicial do relatório de Maio.' }] },
  { id: 'REL-002', version: 1, month: 'Junho/2024', province: 'Zaire', status: 'Rascunho', createdBy: 'Gestor 1', createdAt: '2024-07-01', updatedBy: 'Gestor 1', updatedAt: '2024-07-01', summary: 'Relatório em fase de elaboração.', kpiMissions: 15, kpiInfractions: 8, kpiProjects: 1, activitiesSummary: 'Atividades do mês de Junho em andamento.', challenges: 'Atraso na entrega de equipamentos.', nextMonthPlan: 'Concluir a migração dos servidores.', history: [] },
  { id: 'REL-003', version: 1, month: 'Abril/2024', province: 'Benguela', status: 'Validado', createdBy: 'Admin', createdAt: '2024-05-04', updatedBy: 'Admin', updatedAt: '2024-05-04', summary: 'Resultados de Abril superaram as expectativas.', kpiMissions: 10, kpiInfractions: 3, kpiProjects: 3, activitiesSummary: 'Formação de novos colaboradores e auditoria interna.', challenges: 'Reestruturação da equipa de fiscalização.', nextMonthPlan: 'Aquisição de novas viaturas.', history: [] },
  { id: 'REL-004', version: 2, month: 'Março/2024', province: 'Cabinda', status: 'Encaminhado', createdBy: 'Gestor 2', createdAt: '2024-04-06', updatedBy: 'Gestor 2', updatedAt: '2024-04-06', summary: 'Relatório encaminhado para o GMO Central.', kpiMissions: 8, kpiInfractions: 10, kpiProjects: 1, activitiesSummary: 'Foco em operações na província de Benguela.', challenges: 'Condições meteorológicas adversas impactaram 2 missões.', nextMonthPlan: 'Revisar procedimentos de segurança em alto mar.', history: [{ version: 1, status: 'Em Edição', updatedBy: 'Gestor 2', updatedAt: '2024-04-05', summary: 'Versão de rascunho.'}] },
  { id: 'REL-005', version: 1, month: 'Julho/2024', province: 'Zaire', status: 'Submetido', createdBy: 'Gestor 1', createdAt: '2024-07-28', updatedBy: 'Gestor 1', updatedAt: '2024-07-28', summary: 'Relatório submetido ao Coordenador Operacional.', kpiMissions: 5, kpiInfractions: 2, kpiProjects: 0, activitiesSummary: 'Missões iniciais do mês.', challenges: 'Aguardando dados consolidados.', nextMonthPlan: 'Finalizar o relatório até o dia 5.', history: [] },
];

const statusColors: { [key: string]: string } = {
  'Validado': 'bg-green-100 text-green-800',
  'Rascunho': 'bg-gray-100 text-gray-800',
  'Em Edição': 'bg-yellow-100 text-yellow-800',
  'Submetido': 'bg-blue-100 text-blue-800',
  'Encaminhado': 'bg-indigo-100 text-indigo-800',
};

const ITEMS_PER_PAGE = 5;

type SortableKeys = 'status' | 'createdAt' | 'updatedAt';

const RelatoriosPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState(mockReportsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [reportToDelete, setReportToDelete] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' } | null>({ key: 'updatedAt', direction: 'desc' });
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isRegionalUser = !!user?.province;

  const processedReports = useMemo(() => {
    let items = [...reports];
    
    // Filtro de Província (Secretariado Regional)
    if (isRegionalUser) {
        items = items.filter(r => r.province === user.province);
    }

    if (sortConfig !== null) {
      items.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return items.filter(report => {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = normalizedSearchTerm === '' ||
        [report.id, report.month, report.status, report.createdBy].some(field =>
          field && typeof field === 'string' && field.toLowerCase().includes(normalizedSearchTerm)
        );
      const matchesStatus = statusFilter === 'Todos' || report.status === statusFilter;
      const reportDateStr = report.createdAt;
      const matchesDate = (!dateFilter.start || reportDateStr >= dateFilter.start) && (!dateFilter.end || reportDateStr <= dateFilter.end);
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [reports, searchTerm, statusFilter, dateFilter, sortConfig, user, isRegionalUser]);

  const totalPages = Math.ceil(processedReports.length / ITEMS_PER_PAGE);
  const paginatedReports = useMemo(() => processedReports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [processedReports, currentPage]);

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 uppercase tracking-tight">Gestão de Relatórios {isRegionalUser && ` - ${user.province}`}</h1>
            <p className="text-gray-600">{isRegionalUser ? `Acesso restrito aos documentos da jurisdição de ${user.province}.` : 'Arquivo central de relatórios nacionais.'}</p>
          </div>
          <div className="flex items-center space-x-2">
              <button onClick={() => navigate('/relatorios/novo')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center transition-all text-sm uppercase tracking-widest"><PlusCircle className="h-5 w-5 mr-2" />Criar Novo Relatório</button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pesquisar</label>
                  <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3"><Search className="h-4 w-4 text-gray-400" /></div>
                      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ID, mês, estado..." className="block w-full rounded-lg border-gray-200 pl-10 py-2 text-sm font-bold"/>
                  </div>
              </div>
              <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado</label>
                  <select title="Filtrar por estado" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="block w-full rounded-lg border-gray-200 py-2 text-sm font-bold">
                      <option>Todos</option><option>Validado</option><option>Rascunho</option><option>Em Edição</option><option>Submetido</option>
                  </select>
              </div>
              <div className="flex items-end space-x-2">
                  <input title="Data inicial" type="date" value={dateFilter.start} onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })} className="block w-full rounded-lg border-gray-200 py-2 text-xs font-bold"/>
                  <input title="Data final" type="date" value={dateFilter.end} onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })} className="block w-full rounded-lg border-gray-200 py-2 text-xs font-bold"/>
              </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {paginatedReports.length > 0 ? (
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Período</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Autor</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Modificação</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paginatedReports.map((report) => (
                            <tr key={report.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => setSelectedReport(report)}>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-black text-slate-900">{report.id}</div>
                                    <div className="text-[10px] font-bold text-blue-600 uppercase">{report.month}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full ${statusColors[report.status] || ''}`}>{report.status}</span>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-600">{report.createdBy}</td>
                                <td className="px-6 py-4 text-xs font-medium text-slate-400">{report.updatedAt}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); navigate(`/relatorios/editar/${report.id}`, { state: { report } }); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit size={18} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); setReportToDelete(report); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center py-20">
                    <FileText className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Nenhum relatório encontrado</h3>
                </div>
            )}
        </div>
      </div>
      <Suspense fallback={null}>
        <ConfirmationModal isOpen={!!reportToDelete} onClose={() => setReportToDelete(null)} onConfirm={() => { setReports(prev => prev.filter(r => r.id !== reportToDelete.id)); setReportToDelete(null); }} title="Eliminar Relatório" message={`Deseja excluir permanentemente o relatório ${reportToDelete?.id}?`} />
        <DetalheRelatorioModal isOpen={!!selectedReport} onClose={() => setSelectedReport(null)} report={selectedReport} />
      </Suspense>
    </>
  );
};

export default RelatoriosPage;