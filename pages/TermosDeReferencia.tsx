import React, { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, FileText, Trash2, ArrowLeft, File, Search, Briefcase, Calendar } from 'lucide-react';

const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));
const DetalheTdrModal = lazy(() => import('../components/DetalheTdrModal'));


declare global {
    interface Window { jspdf: any; }
}

// Mock data for Terms of Reference
const mockTdRData = [
  { id: 'TDR-001', title: 'Contratação de Serviços de Consultoria para Auditoria de Segurança', proponent: 'Departamento de IT', status: 'Aprovado', createdAt: '2024-06-15', expiryDate: '2024-09-15', budget: 5000000, description: 'Contratação de uma empresa externa para realizar uma auditoria de segurança completa nos sistemas do SGO, incluindo testes de penetração e análise de vulnerabilidades.', objectives: '1. Identificar vulnerabilidades críticas.\n2. Propor plano de mitigação detalhado.\n3. Assegurar conformidade com as normas ISO 27001.' },
  { id: 'TDR-002', title: 'Aquisição de Novas Embarcações de Patrulha', proponent: 'Departamento de Operações', status: 'Em Elaboração', createdAt: '2024-07-20', expiryDate: '2024-10-20', budget: 150000000, description: 'Aquisição de duas novas lanchas rápidas para reforçar a capacidade de patrulha na costa sul.', objectives: '1. Aumentar a área de cobertura de patrulha em 30%.\n2. Reduzir o tempo de resposta a incidentes.' },
  { id: 'TDR-003', title: 'Desenvolvimento de Módulo de Análise Preditiva', proponent: 'Direção Geral', status: 'Aprovado', createdAt: '2024-05-10', expiryDate: '2024-08-10', budget: 12500000, description: 'Desenvolvimento e integração de um módulo de IA para análise preditiva de incidentes baseados em dados históricos.', objectives: '1. Prever focos de atividade ilegal com 75% de precisão.\n2. Otimizar o alocamento de recursos de patrulha.' },
  { id: 'TDR-004', title: 'Manutenção Preventiva de Equipamentos de Comunicação', proponent: 'Departamento de IT', status: 'Rejeitado', createdAt: '2024-07-01', expiryDate: '2024-07-31', budget: 2000000, description: 'Contrato de manutenção anual para todos os equipamentos de rádio e satélite da unidade.', objectives: '1. Garantir 99.9% de uptime nos sistemas de comunicação.' },
];

const statusColors: { [key: string]: string } = {
  'Aprovado': 'bg-green-100 text-green-800',
  'Em Elaboração': 'bg-yellow-100 text-yellow-800',
  'Rejeitado': 'bg-red-100 text-red-800',
};

const TermosDeReferenciaPage: React.FC = () => {
  const navigate = useNavigate();
  const [tdrs, setTdrs] = useState(mockTdRData);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [tdrToDelete, setTdrToDelete] = useState<typeof mockTdRData[0] | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTdr, setSelectedTdr] = useState<(typeof mockTdRData[0]) | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleOpenDeleteModal = (tdr: typeof mockTdRData[0]) => {
    setTdrToDelete(tdr);
  };

  const handleConfirmDelete = () => {
    if (tdrToDelete) {
      setTdrs(currentTdrs => currentTdrs.filter(tdr => tdr.id !== tdrToDelete.id));
      setTdrToDelete(null);
    }
  };

  const handleEdit = (tdr: typeof mockTdRData[0]) => {
    navigate(`/termos-de-referencia/editar/${tdr.id}`, { state: { tdr } });
  };
  
  const handleViewDetails = (tdr: typeof mockTdRData[0]) => {
    setSelectedTdr(tdr);
    setIsDetailsModalOpen(true);
  };

  const filteredTdRs = useMemo(() => {
    return tdrs.filter(tdr => {
      const normalizedSearchTerm = debouncedSearchTerm.toLowerCase();
      const matchesSearch = normalizedSearchTerm === '' ||
        tdr.id.toLowerCase().includes(normalizedSearchTerm) ||
        tdr.title.toLowerCase().includes(normalizedSearchTerm) ||
        tdr.proponent.toLowerCase().includes(normalizedSearchTerm);

      const matchesStatus = statusFilter === 'Todos' || tdr.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tdrs, debouncedSearchTerm, statusFilter]);

  const handleExportCSV = () => {
    if (filteredTdRs.length === 0) {
      alert("Não há dados para exportar com os filtros atuais.");
      return;
    }

    const headers = ["ID", "Título", "Proponente", "Estado", "Data de Criação", "Data de Expiração"];
    
    const escapeCSV = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.join(','),
      ...filteredTdRs.map(tdr => [
        escapeCSV(tdr.id),
        escapeCSV(tdr.title),
        escapeCSV(tdr.proponent),
        escapeCSV(tdr.status),
        escapeCSV(tdr.createdAt),
        escapeCSV(tdr.expiryDate)
      ].join(','))
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "termos_de_referencia.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleExportPDF = () => {
    if (filteredTdRs.length === 0) {
      alert("Não há dados para exportar com os filtros atuais.");
      return;
    }

    if (!window.jspdf || !(window.jspdf as any).jsPDF) {
      alert("Erro ao carregar a funcionalidade de PDF. Por favor, recarregue a página.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    if (typeof (doc as any).autoTable !== 'function') {
        alert("Erro ao carregar a funcionalidade de tabela PDF. Por favor, recarregue a página.");
        return;
    }

    const logoSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAABDCAYAAAC2+lYkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAd8SURBVHhe7Z1/bBxlHMc/s8zKsh/BhmEDExiMMWEi16W5NEmTNC0tDVLbFGqjth80bf2x/bFJk6Zp2rRNWv2xTVWb6oc2DZImaVq6lK7JTSmJuW5iAgMMGOwgK8uyLPv8I3e5d3Zmdnd2d9d9fz8vB3be2Z3f/X7e5/l5dhcQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCATrgmEYx+vr678MDAx8tbS09PHAwMC35+fn/6FQKPzMzMy3UqlUHxsb+0ZFRfWv0tLS7x4eHj6VSqU+Pj4+vrCw8J+Tk5NPzs7OfqRSqV+o1f9/hUIhMpnMPzo6+tX4+Pgvj46O/k6lUj+YnZ39ZHt7+60xMTGfjI2Nfb5arT4xOTn5xezs7C/FYvEbvb29b6VS6Z+1tbX/0Nra+kQ8Hv98PB7/x/F4/N3xePyT8Xj89+Px+Cfj8fiPx+Px347H4x+Nx+N/HI/H/zgej/+beDz+R/F4/I/i8fgfx+PxP4rH438aj8f/MB6P/2E8Hv+DeDz+X4jH498lHo/fJR6P3ycej98lHo/fJh6P3yIej18jHo9fJR6PXyMej18lHo9fIh6PXyAej18gHo9fIB6PXyAej18gHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fIB6PXyAej18gHo9fIB6PXyIej18hHo9fIR6PXyEej18hHo9fIR6PXyEej18hHo9fIR6PXyMeb7+vX78KHo9fIR6PXykejy8SjycSjycSj6cRj6cSj6cRjyYQj0YSj6cRj5cQj5cQj6cSj1cRj1cRj1cQj1cQjxcRj5eIxyuIx2uIxmuIxyuIxyuIx4uIx+OIxyOIxyOIx1OIxxOIxxOIx4OIx4OIxwOIxwOIx4OIx9OIx9OIxxOIxyOJxxKJxyKJxxKJxyOJxxKIx5KIRxKIxxKIR1KIhxKIRyKIRyKIR4SIR1KIRySIRzKIR3KIRzKIRyKIRwKIR4KEIxHEIyHEIx6EIx6EIRwKIhwSIRwSIRwKIhwKEQ4FIRwKEQ4FEA96EI92kI92kI92kI9kEA8kEA8kEI9kEA8kEI8EkA8lkI/EkA/FkA/HkA/GEI/GEY/FEY/FEY/EEA/HEI/HEI/FEo/FEY/FEQ/Hkg/Hkg/FkA/FkA/Hkg/HkQ/HkQ/FkQ/GkY/GEY/GkY/GEY9GkI/GkY9GEI+GEA/6EY/4EY/2EA/3EI93kI92kI/0kI8EEg/2kI9kEI+mkA8nkI9nkI9nkI8mkA8nkI8kkI/FEI+FEI9FEo9EEo9GEo9GEg+6EY+6EQ+7EI+7EI+5kI84kI84kI84kI84kI84EI8YkI8IkA8IEA8IkA8IkI+okA+okI+skA9kkI9EkA9mkA/mkA+WkA9UkA9UkA8kkI+mkI+kkI/nkI+nkI/nkI+GkA8lkA8mEI8mEI9GEg+mEA9GkI+GEA8GEQ8GEg+GEg8EkI8AkA8CEg4GEA8GEA4GkA4EkA8CkAwHkAyHkA4GkA4EkAoGEAwGEAwEkAkFkAyEEAkFkAyEkAmEkAmEkAmGkAmEkAmEEAmEkAmEEAmEkAmEkAmEkAmEkAmEkAmEEAmEkAmGEAmGEAmEkAmEkAmEkAl6kAl6kAkGkAkEEAmEEAmGEAmGEAmEkAmEkAmEkAmEkAmEkAmGEAmEEAmEEAmEEAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmGEAkGEAkGEAkEkAkEEAmEEAmEEAmGEAkGEAmEEAl1kAqFQKBSCQiFQKAKFQKBSCQSCQCAQCIRCIRAIBAKBYD3gfwD88c+E9jG3SwAAAABJRU5kJggg==';

    // Header
    doc.addImage(logoSrc, 'PNG', 15, 10, 90, 10);
    doc.setFontSize(18);
    doc.text("Termos de Referência", 110, 17);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-AO')}`, 15, 30);

    // Table
    (doc as any).autoTable({
        startY: 40,
        head: [['ID', 'Título', 'Proponente', 'Estado', 'Data de Criação']],
        body: filteredTdRs.map(tdr => [
            tdr.id,
            tdr.title,
            tdr.proponent,
            tdr.status,
            tdr.createdAt
        ]),
        theme: 'striped',
        headStyles: { fillColor: [0, 43, 127] },
        didDrawPage: (data: any) => {
            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Página ${data.pageNumber} de ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
            doc.text("SGO - Sistema de Gestão de Operação", doc.internal.pageSize.getWidth() - data.settings.margin.right, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
        },
    });
    
    doc.save('termos_de_referencia.pdf');
  };

  const handleExportSinglePDF = (tdr: typeof mockTdRData[0]) => {
    if (!window.jspdf || !(window.jspdf as any).jsPDF) {
      alert("Erro ao carregar a funcionalidade de PDF. Por favor, recarregue a página.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const logoSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAABDCAYAAAC2+lYkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAd8SURBVHhe7Z1/bBxlHMc/s8zKsh/BhmEDExiMMWEi16W5NEmTNC0tDVLbFGqjth80bf2x/bFJk6Zp2rRNWv2xTVWb6oc2DZImaVq6lK7JTSmJuW5iAgMMGOwgK8uyLPv8I3e5d3Zmdnd2d9d9fz8vB3be2Z3f/X7e5/l5dhcQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCATrgmEYx+vr678MDAx8tbS09PHAwMC35+fn/6FQKPzMzMy3UqlUHxsb+0ZFRfWv0tLS7x4eHj6VSqU+Pj4+vrCw8J+Tk5NPzs7OfqRSqV+o1f9/hUIhMpnMPzo6+tX4+Pgvj46O/k6lUj+YnZ39ZHt7+60xMTGfjI2Nfb5arT4xOTn5xezs7C/FYvEbvb29b6VS6Z+1tbX/0Nra+kQ8Hv98PB7/x/F4/N3xePyT8Xj89+Px+Cfj8fiPx+Px347H4x+Nx+N/HI/H/zgej/+beDz+R/F4/I/i8fgfx+PxP4rH438aj8f/MB6P/2E8Hv+DeDz+X4jH498lHo/fJR6P3ycej98lHo/fJh6P3yIej18jHo9fJR6PXyMej18lHo9fIh6PXyAej18gHo9fIB6PXyAej18gHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fIB6PXyAej18gHo9fIB6PXyIej18hHo9fIR6PXyEej18hHo9fIR6PXyEej18hHo9fIR6PXyMeb7+vX78KHo9fIR6PXykejy8SjycSjycSj6cRj6cSj6cRjyYQj0YSj6cRj5cQj5cQj6cSj1cRj1cRj1cQj1cQjxcRj5eIxyuIx2uIxmuIxyuIxyuIx4uIx+OIxyOIxyOIx1OIxxOIxxOIx4OIx4OIxwOIxwOIx4OIx9OIx9OIxxOIxyOJxxKJxyKJxxKJxyOJxxKIx5KIRxKIxxKIR1KIhxKIRyKIRyKIR4SIR1KIRySIRzKIR3KIRzKIRyKIRwKIR4KEIxHEIyHEIx6EIx6EIRwKIhwSIRwSIRwKIhwKEQ4FIRwKEQ4FEA96EI92kI92kI92kI9kEA8kEA8kEI9kEA8kEI8EkA8lkI/EkA/FkA/HkA/GEI/GEY/FEY/FEY/EEA/HEI/HEI/FEo/FEY/FEQ/Hkg/Hkg/FkA/FkA/Hkg/HkQ/HkQ/FkQ/GkY/GEY/GkY/GEY9GkI/GkY9GEI+GEA/6EY/4EY/2EA/3EI93kI92kI/0kI8EEg/2kI9kEI+mkA8nkI9nkI9nkI8mkA8nkI8kkI/FEI+FEI9FEo9EEo9GEo9GEg+6EY+6EQ+7EI+7EI+5kI84kI84kI84kI84kI84EI8YkI8IkA8IEA8IkA8IkI+okA+okI+skA9kkI9EkA9mkA/mkA+WkA9UkA9UkA8kkI+mkI+kkI/nkI+nkI/nkI+GkA8lkA8mEI8mEI9GEg+mEA9GkI+GEA8GEQ8GEg+GEg8EkI8AkA8CEg4GEA8GEA4GkA4EkA8CkAwHkAyHkA4GkA4EkAoGEAwGEAwEkAkFkAyEEAkFkAyEkAmEkAmEkAmGkAmEkAmEEAmEkAmEEAmEkAmEkAmEkAmEkAmEkAmEEAmEkAmGEAmGEAmEkAmEkAmEkAl6kAl6kAkGkAkEEAmEEAmGEAmGEAmEkAmEkAmEkAmEkAmEkAmGEAmEEAmEEAmEEAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmGEAkGEAkGEAkEkAkEEAmEEAmEEAmGEAkGEAmEEAl1kAqFQKBSCQiFQKAKFQKBSCQSCQCAQCIRCIRAIBAKBYD3gfwD88c+E9jG3SwAAAABJRU5kJggg==';

    // Header
    doc.addImage(logoSrc, 'PNG', 15, 10, 90, 10);
    doc.setFontSize(18);
    doc.text("Termo de Referência", 15, 35);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`ID: ${tdr.id} | Estado: ${tdr.status}`, 15, 43);

    // Body
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Título: ${tdr.title}`, 15, 60);
    doc.text(`Departamento Proponente: ${tdr.proponent}`, 15, 70);
    doc.text(`Data de Criação: ${tdr.createdAt}`, 15, 80);

    doc.save(`TDR_${tdr.id}.pdf`);
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Módulo de Termos de Referência</h1>
            <p className="text-gray-600">Crie, aprove e gira os Termos de Referência (TdR) da unidade.</p>
          </div>
          <div className="flex items-center space-x-2">
              <button 
                  onClick={handleExportPDF}
                  className="bg-white border border-gray-300 text-gray-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  Exportar PDF
              </button>
              <button 
                  onClick={handleExportCSV}
                  className="bg-white border border-gray-300 text-gray-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  Exportar CSV
              </button>
              <button
                onClick={() => navigate('/termos-de-referencia/novo')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 text-base"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Criar Novo TdR
              </button>
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                  <label htmlFor="search-tdr" className="block text-sm font-medium text-gray-700 mb-1">
                      Pesquisar
                  </label>
                  <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                          type="text"
                          id="search-tdr"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Pesquisar por ID, Título, Proponente..."
                          className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
                      />
                  </div>
              </div>

              <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Filtrar por Estado
                  </label>
                  <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
                  >
                      <option>Todos</option>
                      <option>Aprovado</option>
                      <option>Em Elaboração</option>
                      <option>Rejeitado</option>
                  </select>
              </div>
          </div>
        </div>

        <div className="w-full mt-8">
          {filteredTdRs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTdRs.map((tdr) => (
                <div 
                  key={tdr.id} 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col cursor-pointer"
                  onClick={() => handleViewDetails(tdr)}
                >
                  {/* Card Header */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[tdr.status] || ''}`}>
                        {tdr.status}
                      </span>
                      <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{tdr.id}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 mt-2 truncate" title={tdr.title}>{tdr.title}</h3>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-3 flex-grow space-y-2 text-xs">
                    <div className="flex items-center text-gray-600">
                      <Briefcase size={12} className="mr-1.5 flex-shrink-0" />
                      <span className="truncate">Proponente: <span className="font-medium text-gray-800">{tdr.proponent}</span></span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar size={12} className="mr-1.5 flex-shrink-0" />
                      <span>Criado em: <span className="font-medium text-gray-800">{tdr.createdAt}</span></span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Calendar size={12} className="mr-1.5 flex-shrink-0" />
                        <span>Expira em: <span className={`font-medium ${new Date(tdr.expiryDate) < new Date() && tdr.status !== 'Aprovado' ? 'text-red-600' : 'text-gray-800'}`}>{tdr.expiryDate}</span></span>
                    </div>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-end items-center space-x-1">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(tdr); }} className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-100 transition-colors" title="Editar">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleExportSinglePDF(tdr); }} className="text-green-600 hover:text-green-900 p-1.5 rounded-full hover:bg-green-100 transition-colors" title="Ver PDF">
                      <FileText className="h-4 w-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleOpenDeleteModal(tdr); }} className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-100 transition-colors" title="Apagar">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum Termo de Referência encontrado</h3>
                <p className="mt-1 text-base text-gray-500">Tente ajustar os seus filtros de pesquisa.</p>
            </div>
          )}
        </div>
      </div>
      <Suspense fallback={null}>
        <ConfirmationModal
          isOpen={!!tdrToDelete}
          onClose={() => setTdrToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Confirmar Exclusão de TdR"
          message={`Tem a certeza que deseja excluir o TdR "${tdrToDelete?.title || ''}"? Esta ação não pode ser desfeita.`}
        />
        <DetalheTdrModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            tdr={selectedTdr}
        />
      </Suspense>
    </>
  );
};

export default TermosDeReferenciaPage;
