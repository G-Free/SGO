
import React, { useState, lazy, Suspense, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Search, File, Edit, Trash2 } from 'lucide-react';

const NovoAtivoMeioModal = lazy(() => import('../components/NovoAtivoMeioModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));


declare global {
    interface Window { jspdf: any; }
}

const mockUnifiedAssets = [
  { id: 'PAT-001', name: 'Viatura Toyota Hilux', category: 'Viatura', identifier: 'LD-25-88-GG', location: 'Garagem Central', acquisitionDate: '2021-11-10', status: 'Operacional' },
  { id: 'PAT-002', name: 'Lancha Rápida II', category: 'Embarcação', identifier: 'CS-L58B', location: 'Baía de Luanda', acquisitionDate: '2022-03-15', status: 'Operacional' },
  { id: 'PAT-003', name: 'Drone de Vigilância DJI', category: 'Equipamento Operacional', identifier: 'DJI-M300-84521', location: 'Armazém', acquisitionDate: '2023-09-30', status: 'Em Manutenção' },
  { id: 'PAT-004', name: 'Patrulha Angola I', category: 'Embarcação', identifier: 'PA-01-MGA', location: 'Porto de Luanda', acquisitionDate: '2020-05-20', status: 'Operacional' },
  { id: 'PAT-005', name: 'Viatura Nissan Patrol', category: 'Viatura', identifier: 'LD-19-02-KL', location: 'Garagem Central', acquisitionDate: '2020-08-12', status: 'Inativo' },
  { id: 'PAT-006', name: 'Servidor Dell PowerEdge', category: 'Equipamento IT', identifier: 'SRV-DELL-987XYZ', location: 'Data Center', acquisitionDate: '2023-01-20', status: 'Operacional' },
  { id: 'PAT-007', name: 'Computador Portátil HP', category: 'Equipamento IT', identifier: 'HP-LT-123ABC', location: 'Gabinete 3', acquisitionDate: '2024-02-05', status: 'Operacional' },
];


const estadoColors: { [key: string]: string } = {
  'Operacional': 'bg-green-100 text-green-800',
  'Em Manutenção': 'bg-yellow-100 text-yellow-800',
  'Inativo': 'bg-gray-100 text-gray-800',
  'Em Stock': 'bg-blue-100 text-blue-800',
};

const PatrimonioEMeiosPage: React.FC = () => {
  const navigate = useNavigate();
  const [ativos, setAtivos] = useState(mockUnifiedAssets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ativoToEdit, setAtivoToEdit] = useState<any | null>(null);
  const [ativoToDelete, setAtivoToDelete] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSave = (ativoData: any) => {
    if (ativoData.id && ativos.some(a => a.id === ativoData.id)) { // Edit
        setAtivos(current => current.map(a => a.id === ativoData.id ? ativoData : a));
    } else { // Create
        setAtivos(current => [...current, ativoData]);
    }
  };
  
  const handleOpenCreateModal = () => {
      setAtivoToEdit(null);
      setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (ativo: any) => {
      setAtivoToEdit(ativo);
      setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (ativo: any) => {
      setAtivoToDelete(ativo);
  };

  const handleConfirmDelete = () => {
    if (ativoToDelete) {
        setAtivos(current => current.filter(a => a.id !== ativoToDelete.id));
        setAtivoToDelete(null);
    }
  };

  const filteredAtivos = useMemo(() => {
    return ativos.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.identifier.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ativos, searchTerm]);


  const handleExportCSV = () => {
    const headers = ["ID", "Nome", "Categoria", "Matrícula/Nº Série", "Localização", "Data Aquisição", "Estado"];
    
    // FIX: The original function was incomplete and missing a return statement, causing a TypeScript error.
    const escapeCSV = (value: any): string => {
      const strValue = String(value ?? '');
      if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    };

    const csvContent = [
      headers.join(','),
      ...filteredAtivos.map(ativo => [
        escapeCSV(ativo.id),
        escapeCSV(ativo.name),
        escapeCSV(ativo.category),
        escapeCSV(ativo.identifier),
        escapeCSV(ativo.location),
        escapeCSV(ativo.acquisitionDate),
        escapeCSV(ativo.status)
      ].join(','))
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "patrimonio_e_meios.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
    const handleExportPDF = () => {
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

    doc.addImage(logoSrc, 'PNG', 15, 10, 90, 10);
    doc.setFontSize(18);
    doc.text("Inventário de Património e Meios", 110, 17);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-AO')}`, 15, 30);
    
    (doc as any).autoTable({
        startY: 40,
        head: [['Nome', 'Categoria', 'Identificador', 'Localização', 'Estado']],
        body: filteredAtivos.map(a => [
            a.name,
            a.category,
            a.identifier,
            a.location,
            a.status
        ]),
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
    
    doc.save('patrimonio_e_meios.pdf');
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Património e Meios</h1>
            <p className="text-gray-600">Inventarie e controle todos os ativos, viaturas e equipamentos.</p>
          </div>
          <div className="flex items-center space-x-2">
              <button onClick={handleExportPDF} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg flex items-center">
                  <File className="h-4 w-4 mr-2" /> Exportar PDF
              </button>
              <button onClick={handleExportCSV} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg flex items-center">
                  <File className="h-4 w-4 mr-2" /> Exportar CSV
              </button>
              <button onClick={handleOpenCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" /> Adicionar Ativo/Meio
              </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Inventário de Ativos</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-base" />
                </div>
            </div>
          <div className="w-full overflow-x-auto">
              <table className="w-full">
                  <thead>
                      <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Ativo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Aquisição</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAtivos.map(ativo => (
                          <tr key={ativo.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                  <div className="text-base font-medium text-gray-900">{ativo.name}</div>
                                  <div className="text-sm text-gray-500">{ativo.identifier}</div>
                              </td>
                              <td className="px-6 py-4 text-base text-gray-500">{ativo.category}</td>
                              <td className="px-6 py-4 text-base text-gray-500">{ativo.location}</td>
                              <td className="px-6 py-4 text-base text-gray-500">{ativo.acquisitionDate}</td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoColors[ativo.status]}`}>
                                      {ativo.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-center text-base">
                                <div className="flex justify-center items-center space-x-2">
                                  <button onClick={() => handleOpenEditModal(ativo)} className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-gray-100" title="Editar"><Edit size={16}/></button>
                                  <button onClick={() => handleOpenDeleteModal(ativo)} className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-gray-100" title="Apagar"><Trash2 size={16}/></button>
                                </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <NovoAtivoMeioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          ativoToEdit={ativoToEdit}
        />
        <ConfirmationModal
            isOpen={!!ativoToDelete}
            onClose={() => setAtivoToDelete(null)}
            onConfirm={handleConfirmDelete}
            title="Confirmar Exclusão"
            message={`Tem a certeza que deseja excluir o ativo "${ativoToDelete?.name}"? Esta ação não pode ser desfeita.`}
        />
      </Suspense>
    </>
  );
};

export default PatrimonioEMeiosPage;
