import React, { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, File, Search, Edit, Trash2, Eye, TrendingUp, TrendingDown, DollarSign, Clock, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const NovoTransacaoModal = lazy(() => import('../components/NovoTransacaoModal'));
const DetalheTransacaoModal = lazy(() => import('../components/DetalheTransacaoModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));

declare global {
    interface Window { jspdf: any; }
}

const mockLancamentosData = [
  { id: 'FIN-001', description: 'Pagamento de consultoria de segurança', category: 'Serviços de Terceiros', date: '2024-07-25', type: 'Despesa', status: 'Concluído', value: 1500000, responsible: 'Gestor 1' },
  { id: 'FIN-002', description: 'Receita de taxa portuária', category: 'Taxas Operacionais', date: '2024-07-22', type: 'Receita', status: 'Concluído', value: 750000, responsible: 'Admin' },
  { id: 'FIN-003', description: 'Compra de material de escritório', category: 'Material de Consumo', date: '2024-07-20', type: 'Despesa', status: 'Pendente', value: 85000, responsible: 'Gestor 2' },
  { id: 'FIN-004', description: 'Adiantamento para missão de fiscalização', category: 'Despesas Operacionais', date: '2024-07-18', type: 'Despesa', status: 'Concluído', value: 250000, responsible: 'Gestor 1' },
  { id: 'FIN-005', description: 'Reembolso de despesas de viagem', category: 'Recursos Humanos', date: '2024-07-28', type: 'Despesa', status: 'Pendente', value: 55000, responsible: 'Técnico A' },
  { id: 'FIN-006', description: 'Pagamento de fornecedor de combustível', category: 'Fornecedores', date: '2024-06-15', type: 'Despesa', status: 'Concluído', value: 350000, responsible: 'Gestor 1' },
  { id: 'FIN-007', description: 'Multa por infração ambiental', category: 'Receitas Diversas', date: '2024-06-10', type: 'Receita', status: 'Concluído', value: 120000, responsible: 'Gestor 2' },
];

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, color: string }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
            <p className="text-base font-medium text-gray-600">{title}</p>
            <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
);

const statusColors: { [key: string]: string } = {
  'Concluído': 'bg-green-100 text-green-800',
  'Pendente': 'bg-yellow-100 text-yellow-800',
};

const currencyFormatter = new Intl.NumberFormat('pt-AO', {
  style: 'currency',
  currency: 'AOA',
});

const ITEMS_PER_PAGE = 5;

const FinanceiroPage: React.FC = () => {
  const [lancamentos, setLancamentos] = useState(mockLancamentosData);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [lancamentoToEdit, setLancamentoToEdit] = useState<any | null>(null);
  const [selectedLancamento, setSelectedLancamento] = useState<any | null>(null);
  const [lancamentoToDelete, setLancamentoToDelete] = useState<any | null>(null);
  const [filters, setFilters] = useState({ searchTerm: '', type: 'Todos', status: 'Todos', startDate: '', endDate: '' });
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleSave = (data: any) => {
    if (data.id) {
        setLancamentos(current => current.map(l => l.id === data.id ? data : l));
    } else {
        const newId = `FIN-${String(lancamentos.length + 1).padStart(3, '0')}`;
        setLancamentos(current => [{ ...data, id: newId, responsible: 'Utilizador' }, ...current]);
    }
  };

  const handleOpenCreateModal = () => {
    setLancamentoToEdit(null);
    setIsCreateModalOpen(true);
  };
  
  const handleOpenEditModal = (lancamento: any) => {
    setLancamentoToEdit(lancamento);
    setIsCreateModalOpen(true);
  };

  const handleOpenDeleteModal = (lancamento: any) => {
    setLancamentoToDelete(lancamento);
  };

  const handleConfirmDelete = () => {
    if (lancamentoToDelete) {
        setLancamentos(current => current.filter(l => l.id !== lancamentoToDelete.id));
        setLancamentoToDelete(null);
    }
  };

  const handleViewDetails = (lancamento: any) => {
    setSelectedLancamento(lancamento);
    setIsDetailsModalOpen(true);
  };
  
  const filteredLancamentos = useMemo(() => {
    return lancamentos.filter(l => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      const matchesSearch = l.description.toLowerCase().includes(searchTermLower) || l.category.toLowerCase().includes(searchTermLower);
      const matchesType = filters.type === 'Todos' || l.type === filters.type;
      const matchesStatus = filters.status === 'Todos' || l.status === filters.status;
      const matchesDate = (!filters.startDate || l.date >= filters.startDate) && (!filters.endDate || l.date <= filters.endDate);
      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });
  }, [lancamentos, filters]);

  const paginatedLancamentos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLancamentos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLancamentos, currentPage]);

  const totalPages = Math.ceil(filteredLancamentos.length / ITEMS_PER_PAGE);
  
  const { receitaMes, despesaMes, pendentes } = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let receita = 0, despesa = 0, pend = 0;
    
    lancamentos.forEach(l => {
        const [year, month] = l.date.split('-').map(Number);
        if(year === currentYear && month === currentMonth + 1){
            if(l.type === 'Receita' && l.status === 'Concluído') receita += l.value;
            if(l.type === 'Despesa' && l.status === 'Concluído') despesa += l.value;
        }
        if(l.status === 'Pendente') pend++;
    });
    return { receitaMes: receita, despesaMes: despesa, pendentes: pend };
  }, [lancamentos]);
  
  const handleExport = (format: 'CSV' | 'PDF') => {
    setIsExporting(true);
    setTimeout(() => {
      if (format === 'CSV') {
        const headers = ["ID", "Descrição", "Categoria", "Data", "Tipo", "Estado", "Valor", "Responsável"];
        const csvContent = [
          headers.join(','),
          ...filteredLancamentos.map(l => [l.id, `"${l.description}"`, l.category, l.date, l.type, l.status, l.value, l.responsible].join(','))
        ].join('\n');
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "financeiro.csv";
        link.click();
      } else {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        (doc as any).autoTable({
          head: [['ID', 'Descrição', 'Categoria', 'Data', 'Tipo', 'Valor']],
          body: filteredLancamentos.map(l => [l.id, l.description, l.category, l.date, l.type, currencyFormatter.format(l.value)]),
        });
        doc.save('financeiro.pdf');
      }
      setIsExporting(false);
    }, 1000);
  };
  
  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Módulo Financeiro</h1>
            <p className="text-gray-600">Controle as receitas, despesas e o fluxo de caixa da unidade.</p>
          </div>
          <div className="flex items-center space-x-2">
              <button onClick={() => handleExport('PDF')} disabled={isExporting} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg flex items-center disabled:opacity-50">
                  {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <File className="h-4 w-4 mr-2" />} Exportar PDF
              </button>
              <button onClick={() => handleExport('CSV')} disabled={isExporting} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg flex items-center disabled:opacity-50">
                  {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <File className="h-4 w-4 mr-2" />} Exportar CSV
              </button>
              <button onClick={handleOpenCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" /> Novo Lançamento
              </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={TrendingUp} title="Receita (Mês)" value={currencyFormatter.format(receitaMes)} color="text-green-500" />
          <StatCard icon={TrendingDown} title="Despesa (Mês)" value={currencyFormatter.format(despesaMes)} color="text-red-500" />
          <StatCard icon={DollarSign} title="Saldo (Mês)" value={currencyFormatter.format(receitaMes - despesaMes)} color="text-blue-500" />
          <StatCard icon={Clock} title="Transações Pendentes" value={String(pendentes)} color="text-yellow-500" />
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="Pesquisar por descrição..." onChange={e => setFilters(f => ({...f, searchTerm: e.target.value}))} className="md:col-span-2 block w-full rounded-md border-gray-300"/>
            <select onChange={e => setFilters(f => ({...f, type: e.target.value}))} className="block w-full rounded-md border-gray-300"><option>Todos os Tipos</option><option>Receita</option><option>Despesa</option></select>
            <select onChange={e => setFilters(f => ({...f, status: e.target.value}))} className="block w-full rounded-md border-gray-300"><option>Todos os Estados</option><option>Concluído</option><option>Pendente</option></select>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Descrição', 'Categoria', 'Data', 'Tipo', 'Estado', 'Valor', 'Ações'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedLancamentos.map(l => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{l.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate">{l.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{l.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{l.date}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${l.type === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>{l.type}</td>
                  <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[l.status]}`}>{l.status}</span></td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{currencyFormatter.format(l.value)}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleViewDetails(l)} className="text-gray-500 hover:text-blue-700 p-1.5 rounded-full hover:bg-gray-100" title="Ver Detalhes"><Eye size={16}/></button>
                      <button onClick={() => handleOpenEditModal(l)} className="text-gray-500 hover:text-indigo-700 p-1.5 rounded-full hover:bg-gray-100" title="Editar"><Edit size={16}/></button>
                      <button onClick={() => handleOpenDeleteModal(l)} className="text-gray-500 hover:text-red-700 p-1.5 rounded-full hover:bg-gray-100" title="Apagar"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLancamentos.length === 0 && <p className="text-center text-gray-500 py-8">Nenhum lançamento encontrado.</p>}
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
        <NovoTransacaoModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleSave} lancamentoToEdit={lancamentoToEdit} />
        <DetalheTransacaoModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} lancamento={selectedLancamento} />
        <ConfirmationModal isOpen={!!lancamentoToDelete} onClose={() => setLancamentoToDelete(null)} onConfirm={handleConfirmDelete} title="Confirmar Exclusão" message={`Deseja realmente apagar o lançamento "${lancamentoToDelete?.description}"?`}/>
      </Suspense>
    </>
  );
};

export default FinanceiroPage;
