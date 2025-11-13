import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, FileText, Trash2, ArrowLeft, File, Search, User, Calendar, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));
const DetalheRelatorioModal = lazy(() => import('../components/DetalheRelatorioModal'));


declare global {
    interface Window { jspdf: any; }
}

const mockReportsData = [
  { id: 'REL-001', version: 2, month: 'Maio/2024', status: 'Validado', createdBy: 'Admin', createdAt: '2024-06-03', updatedBy: 'Admin', updatedAt: '2024-06-05', summary: 'Relatório validado. Todas as metas foram atingidas.', kpiMissions: 12, kpiInfractions: 5, kpiProjects: 2, activitiesSummary: 'Fiscalização na costa norte concluída com sucesso.', challenges: 'Nenhum desafio significativo encontrado.', nextMonthPlan: 'Iniciar planeamento da auditoria de segurança anual.', history: [{ version: 1, status: 'Em Edição', updatedBy: 'Admin', updatedAt: '2024-06-03', summary: 'Versão inicial do relatório de Maio.' }] },
  { id: 'REL-002', version: 1, month: 'Junho/2024', status: 'Em Edição', createdBy: 'Gestor 1', createdAt: '2024-07-01', updatedBy: 'Gestor 1', updatedAt: '2024-07-01', summary: 'Relatório em fase de elaboração.', kpiMissions: 15, kpiInfractions: 8, kpiProjects: 1, activitiesSummary: 'Atividades do mês de Junho em andamento.', challenges: 'Atraso na entrega de equipamentos.', nextMonthPlan: 'Concluir a migração dos servidores.', history: [] },
  { id: 'REL-003', version: 1, month: 'Abril/2024', status: 'Validado', createdBy: 'Admin', createdAt: '2024-05-04', updatedBy: 'Admin', updatedAt: '2024-05-04', summary: 'Resultados de Abril superaram as expectativas.', kpiMissions: 10, kpiInfractions: 3, kpiProjects: 3, activitiesSummary: 'Formação de novos colaboradores e auditoria interna.', challenges: 'Reestruturação da equipa de fiscalização.', nextMonthPlan: 'Aquisição de novas viaturas.', history: [] },
  { id: 'REL-004', version: 2, month: 'Março/2024', status: 'Submetido', createdBy: 'Gestor 2', createdAt: '2024-04-06', updatedBy: 'Gestor 2', updatedAt: '2024-04-06', summary: 'Relatório submetido para validação da direção.', kpiMissions: 8, kpiInfractions: 10, kpiProjects: 1, activitiesSummary: 'Foco em operações na província de Benguela.', challenges: 'Condições meteorológicas adversas impactaram 2 missões.', nextMonthPlan: 'Revisar procedimentos de segurança em alto mar.', history: [{ version: 1, status: 'Em Edição', updatedBy: 'Gestor 2', updatedAt: '2024-04-05', summary: 'Versão de rascunho.'}] },
  { id: 'REL-005', version: 1, month: 'Julho/2024', status: 'Em Edição', createdBy: 'Gestor 1', createdAt: '2024-07-28', updatedBy: 'Gestor 1', updatedAt: '2024-07-28', summary: 'Relatório do mês corrente.', kpiMissions: 5, kpiInfractions: 2, kpiProjects: 0, activitiesSummary: 'Missões iniciais do mês.', challenges: 'Aguardando dados consolidados.', nextMonthPlan: 'Finalizar o relatório até o dia 5.', history: [] },
  { id: 'REL-006', version: 1, month: 'Fevereiro/2024', status: 'Validado', createdBy: 'Admin', createdAt: '2024-03-05', updatedBy: 'Admin', updatedAt: '2024-03-05', summary: 'Relatório de Fevereiro validado.', kpiMissions: 9, kpiInfractions: 4, kpiProjects: 1, activitiesSummary: 'Operação Carnaval Segura.', challenges: 'Aumento de pequenas infrações.', nextMonthPlan: 'Análise de dados da operação.', history: [] },
  { id: 'REL-007', version: 1, month: 'Janeiro/2024', status: 'Validado', createdBy: 'Admin', createdAt: '2024-02-04', updatedBy: 'Admin', updatedAt: '2024-02-04', summary: 'Relatório de início de ano.', kpiMissions: 7, kpiInfractions: 1, kpiProjects: 2, activitiesSummary: 'Planeamento anual e primeiras missões.', challenges: 'Adaptação às novas diretrizes.', nextMonthPlan: 'Aumentar número de fiscalizações.', history: [] },
];

const statusColors: { [key: string]: string } = {
  'Validado': 'bg-green-100 text-green-800',
  'Em Edição': 'bg-yellow-100 text-yellow-800',
  'Submetido': 'bg-blue-100 text-blue-800',
};

const ITEMS_PER_PAGE = 5;

type SortableKeys = 'status' | 'createdAt' | 'updatedAt';

const RelatoriosPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState(mockReportsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Em Edição');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [reportToDelete, setReportToDelete] = useState<typeof mockReportsData[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' } | null>({ key: 'updatedAt', direction: 'desc' });
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof mockReportsData[0] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const handleOpenDeleteModal = (report: typeof mockReportsData[0]) => {
    setReportToDelete(report);
  };

  const handleConfirmDelete = () => {
    if (reportToDelete) {
      setIsDeleting(true);
      setTimeout(() => {
        setReports(currentReports => currentReports.filter(report => report.id !== reportToDelete.id));
        setReportToDelete(null);
        setIsDeleting(false);
      }, 1000);
    }
  };

  const handleEditReport = (report: typeof mockReportsData[0]) => {
    navigate(`/relatorios/editar/${report.id}`, { state: { report } });
  };
  
  const handleViewDetails = (report: typeof mockReportsData[0]) => {
    setSelectedReport(report);
  };

  const processedReports = useMemo(() => {
    let sortableItems = [...reports];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems.filter(report => {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = normalizedSearchTerm === '' ||
        [report.id, report.month, report.status, report.createdBy].some(field =>
          field && typeof field === 'string' && field.toLowerCase().includes(normalizedSearchTerm)
        );

      const matchesStatus = statusFilter === 'Todos' || report.status === statusFilter;

      const reportDateStr = report.createdAt;
      const startDateStr = dateFilter.start;
      const endDateStr = dateFilter.end;
      const matchesDate = (!startDateStr || reportDateStr >= startDateStr) && (!endDateStr || reportDateStr <= endDateStr);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [reports, searchTerm, statusFilter, dateFilter, sortConfig]);

  const totalPages = Math.ceil(processedReports.length / ITEMS_PER_PAGE);

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedReports.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedReports, currentPage]);

  const requestSort = (key: SortableKeys) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: SortableKeys) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="h-4 w-4 ml-1 inline-block" />;
    }
    return <ArrowDown className="h-4 w-4 ml-1 inline-block" />;
  };

  const handleExportCSV = () => {
    if (processedReports.length === 0) {
      alert("Não há dados para exportar com os filtros atuais.");
      return;
    }
    setIsExportingCSV(true);
    setTimeout(() => {
        const headers = ["ID", "Mês/Ano", "Estado", "Criado Por", "Data Criação", "Data Modificação"];
        const escapeCSV = (value: string) => `"${(value || '').replace(/"/g, '""')}"`;
        const csvContent = [
          headers.join(','),
          ...processedReports.map(report => [
            escapeCSV(report.id), escapeCSV(report.month), escapeCSV(report.status), escapeCSV(report.createdBy), escapeCSV(report.createdAt), escapeCSV(report.updatedAt)
          ].join(','))
        ].join('\n');
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", "relatorios.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsExportingCSV(false);
    }, 1500);
  };
  
  const handleExportPDF = () => {
    if (processedReports.length === 0) {
      alert("Não há dados para exportar com os filtros atuais.");
      return;
    }
    setIsExportingPDF(true);
    setTimeout(() => {
        if (!window.jspdf || !(window.jspdf as any).jsPDF) {
            setIsExportingPDF(false);
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        if (typeof (doc as any).autoTable !== 'function') {
             setIsExportingPDF(false);
            return;
        }

        const logoSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAABDCAYAAAC2+lYkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAd8SURBVHhe7Z1/bBxlHMc/s8zKsh/BhmEDExiMMWEi16W5NEmTNC0tDVLbFGqjth80bf2x/bFJk6Zp2rRNWv2xTVWb6oc2DZImaVq6lK7JTSmJuW5iAgMMGOwgK8uyLPv8I3e5d3Zmdnd2d9d9fz8vB3be2Z3f/X7e5/l5dhcQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCATrgmEYx+vr678MDAx8tbS09PHAwMC35+fn/6FQKPzMzMy3UqlUHxsb+0ZFRfWv0tLS7x4eHj6VSqU+Pj4+vrCw8J+Tk5NPzs7OfqRSqV+o1f9/hUIhMpnMPzo6+tX4+Pgvj46O/k6lUj+YnZ39ZHt7+60xMTGfjI2Nfb5arT4xOTn5xezs7C/FYvEbvb29b6VS6Z+1tbX/0Nra+kQ8Hv98PB7/x/F4/N3xePyT8Xj89+Px+Cfj8fiPx+Px347H4x+Nx+N/HI/H/zgej/+beDz+R/F4/I/i8fgfx+PxP4rH438aj8f/MB6P/2E8Hv+DeDz+X4jH498lHo/fJR6P3ycej98lHo/fJh6P3yIej18jHo9fJR6PXyMej18lHo9fIh6PXyAej18gHo9fIB6PXyAej18gHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fIB6PXyAej18gHo9fIB6PXyIej18hHo9fIR6PXyEej18hHo9fIR6PXyEej18hHo9fIR6PXyMeb7+vX78KHo9fIR6PXykejy8SjycSjycSj6cRj6cSj6cRjyYQj0YSj6cRj5cQj5cQj6cSj1cRj1cRj1cQj1cQjxcRj5eIxyuIx2uIxmuIxyuIxyuIx4uIx+OIxyOIxyOIx1OIxxOIxxOIx4OIx4OIxwOIxwOIx4OIx9OIx9OIxxOIxyOJxxKJxyKJxxKJxyOJxxKIx5KIRxKIxxKIR1KIhxKIRyKIRyKIR4SIR1KIRySIRzKIR3KIRzKIRyKIRwKIR4KEIxHEIyHEIx6EIx6EIRwKIhwSIRwSIRwKIhwKEQ4FIRwKEQ4FEA96EI92kI92kI92kI9kEA8kEA8kEI9kEA8kEI8EkA8lkI/EkA/FkA/HkA/GEI/GEY/FEY/FEY/EEA/HEI/HEI/FEo/FEY/FEQ/Hkg/Hkg/FkA/FkA/Hkg/HkQ/HkQ/FkQ/GkY/GEY/GkY/GEY9GkI/GkY9GEI+GEA/6EY/4EY/2EA/3EI93kI92kI/0kI8EEg/2kI9kEI+mkA8nkI9nkI9nkI8mkA8nkI8kkI/FEI+FEI9FEo9EEo9GEo9GEg+6EY+6EQ+7EI+7EI+5kI84kI84kI84kI84kI84EI8YkI8IkA8IEA8IkA8IkI+okA+okI+skA9kkI9EkA9mkA/mkA+WkA9UkA9UkA8kkI+mkI+kkI/nkI+nkI/nkI+GkA8lkA8mEI8mEI9GEg+mEA9GkI+GEA8GEQ8GEg+GEg8EkI8AkA8CEg4GEA8GEA4GkA4EkA8CkAwHkAyHkA4GkA4EkAoGEAwGEAwEkAkFkAyEEAkFkAyEkAmEkAmEkAmGkAmEkAmEEAmEkAmEEAmEkAmEkAmEkAmEkAmEkAmEEAmEkAmGEAmGEAmEkAmEkAmEkAl6kAl6kAkGkAkEEAmEEAmGEAmGEAmEkAmEkAmEkAmEkAmEkAmGEAmEEAmEEAmEEAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmGEAkGEAkGEAkEkAkEEAmEEAmEEAmGEAkGEAmEEAl1kAqFQKBSCQiFQKAKFQKBSCQSCQCAQCIRCIRAIBAKBYD3gfwD88c+E9jG3SwAAAABJRU5kJggg==';
        doc.addImage(logoSrc, 'PNG', 15, 10, 90, 10);
        doc.text("Lista de Relatórios", 110, 17);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-AO')}`, 15, 30);
        (doc as any).autoTable({
            startY: 40,
            head: [['ID', 'Mês/Ano', 'Estado', 'Criado Por', 'Data Modificação']],
            body: processedReports.map(r => [r.id, r.month, r.status, r.createdBy, r.updatedAt]),
            theme: 'striped',
            headStyles: { fillColor: [0, 43, 127] },
            didDrawPage: (data: any) => {
                const pageCount = doc.internal.getNumberOfPages();
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(`Página ${data.pageNumber} de ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
                doc.text("SGO - Sistema de Gestão de Operação", doc.internal.pageSize.getWidth() - data.settings.margin.right, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
            },
        });
        doc.save('relatorios.pdf');
        setIsExportingPDF(false);
    }, 2000);
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Módulo de Relatórios</h1>
            <p className="text-gray-600">Crie, edite e gere relatórios mensais.</p>
          </div>
          <div className="flex items-center space-x-2">
              <button 
                onClick={handleExportPDF} 
                className="bg-white border border-gray-300 text-gray-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isExportingPDF || isExportingCSV}
              >
                  {isExportingPDF ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <File className="h-4 w-4 mr-2" />}
                  {isExportingPDF ? 'A Exportar...' : 'Exportar PDF'}
              </button>
              <button 
                onClick={handleExportCSV} 
                className="bg-white border border-gray-300 text-gray-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isExportingPDF || isExportingCSV}
              >
                  {isExportingCSV ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <File className="h-4 w-4 mr-2" />}
                  {isExportingCSV ? 'A Exportar...' : 'Exportar CSV'}
              </button>
              <button onClick={() => navigate('/relatorios/novo')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 text-base"><PlusCircle className="h-5 w-5 mr-2" />Criar Novo Relatório</button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2">
                  <label htmlFor="search-report" className="block text-sm font-medium text-gray-700 mb-1">Pesquisar</label>
                  <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Search className="h-5 w-5 text-gray-400" /></div>
                      <input type="text" id="search-report" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pesquisar por ID, mês, estado..." className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"/>
                  </div>
              </div>

              <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Estado</label>
                  <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base">
                      <option>Todos</option><option>Validado</option><option>Em Edição</option><option>Submetido</option>
                  </select>
              </div>

              <div className="flex items-end space-x-2">
                  <div className="flex-1">
                      <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">De</label>
                      <input type="date" id="start-date" value={dateFilter.start} onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"/>
                  </div>
                  <div className="flex-1">
                      <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Até</label>
                      <input type="date" id="end-date" value={dateFilter.end} onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"/>
                  </div>
              </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            {paginatedReports.length > 0 ? (
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID do Relatório</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mês/Ano</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => requestSort('status')} className="flex items-center">
                                    Estado {getSortIcon('status')}
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado Por</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => requestSort('updatedAt')} className="flex items-center">
                                    Data Modificação {getSortIcon('updatedAt')}
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedReports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleViewDetails(report)}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{report.month}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[report.status] || ''}`}>{report.status}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.createdBy}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.updatedAt}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end items-center space-x-2">
                                        <button onClick={(e) => { e.stopPropagation(); handleEditReport(report); }} className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-100" title="Editar"><Edit className="h-5 w-5" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenDeleteModal(report); }} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100" title="Apagar"><Trash2 className="h-5 w-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center py-16">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum relatório encontrado</h3>
                    <p className="mt-1 text-base text-gray-500">Tente ajustar os seus filtros de pesquisa.</p>
                </div>
            )}
        </div>

        {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-2">
                <span className="text-sm text-gray-700">Página <span className="font-bold">{currentPage}</span> de <span className="font-bold">{totalPages}</span></span>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-50"><ChevronLeft className="h-5 w-5"/></button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-50"><ChevronRight className="h-5 w-5"/></button>
                </div>
            </div>
        )}
      </div>
      <Suspense fallback={null}>
        <ConfirmationModal
          isOpen={!!reportToDelete}
          onClose={() => setReportToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Confirmar Exclusão de Relatório"
          message={`Tem a certeza que deseja excluir o relatório "${reportToDelete?.id || ''}"? Esta ação não pode ser desfeita.`}
          isLoading={isDeleting}
        />
        <DetalheRelatorioModal
            isOpen={!!selectedReport}
            onClose={() => setSelectedReport(null)}
            report={selectedReport}
        />
      </Suspense>
    </>
  );
};

export default RelatoriosPage;