import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, AlertCircle, CheckCircle, Flame, File, Eye, Trash2 } from 'lucide-react';

const NovoTicketModal = lazy(() => import('../components/NovoTicketModal'));
const DetalheTicketModal = lazy(() => import('../components/DetalheTicketModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));


declare global {
    interface Window { jspdf: any; }
}

const mockTicketsData = [
  { id: 'TIC-001', subject: 'Não consigo aceder ao sistema de relatórios', requester: 'Gestor 2', assignedTo: 'Técnico A', priority: 'Alta', status: 'Aberto', openedDate: '2024-07-26', description: 'Ao tentar aceder ao módulo de relatórios, recebo um erro de permissão. Tenho uma reunião importante e preciso de acesso urgente.' },
  { id: 'TIC-002', subject: 'Problema com a impressora do 2º andar', requester: 'Fiscal Chefe', assignedTo: 'Técnico B', priority: 'Média', status: 'Em Progresso', openedDate: '2024-07-25', description: 'A impressora HP LaserJet no corredor do segundo andar não está a imprimir. A luz de erro está a piscar.' },
  { id: 'TIC-003', subject: 'Pedido de nova conta de email', requester: 'Novo Colaborador', assignedTo: 'Técnico A', priority: 'Baixa', status: 'Resolvido', openedDate: '2024-07-24', description: 'Necessito de uma conta de email para o novo estagiário, João Silva.' },
  { id: 'TIC-004', subject: 'Sistema SIG-GMA lento', requester: 'Administrador', assignedTo: 'Técnico A', priority: 'Alta', status: 'Aberto', openedDate: '2024-07-26', description: 'O sistema está a apresentar lentidão geral desde a manhã de hoje, impactando todas as operações.' },
];

const statusColors: { [key: string]: string } = {
  'Aberto': 'bg-red-100 text-red-800',
  'Em Progresso': 'bg-blue-100 text-blue-800',
  'Resolvido': 'bg-green-100 text-green-800',
};

const priorityColors: { [key: string]: string } = {
    'Alta': 'text-red-600',
    'Média': 'text-orange-500',
    'Baixa': 'text-gray-500',
};

const StatCard = ({ icon: Icon, title, value }: { icon: React.ElementType, title: string, value: string }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
            <p className="text-base font-medium text-gray-600">{title}</p>
            <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
);

const OcorrenciasPage: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(mockTicketsData);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<any | null>(null);

  const handleAddTicket = (newTicket: any) => {
      setTickets(current => [
          {
              ...newTicket,
              id: `TIC-00${current.length + 1}`,
              requester: 'Utilizador Atual', // Simulando o utilizador logado
              assignedTo: 'Não Atribuído',
              status: 'Aberto',
              openedDate: new Date().toISOString().split('T')[0]
          },
          ...current
      ]);
  };
  
  const handleViewDetails = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (ticket: any) => {
    setTicketToDelete(ticket);
  };

  const handleConfirmDelete = () => {
    if (ticketToDelete) {
        setTickets(current => current.filter(t => t.id !== ticketToDelete.id));
        setTicketToDelete(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Assunto", "Solicitante", "Atribuído a", "Prioridade", "Estado", "Data de Abertura"];
    
    const escapeCSV = (value: any): string => {
      const strValue = String(value ?? '');
      if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    };

    const csvContent = [
      headers.join(','),
      ...tickets.map(ticket => [
        escapeCSV(ticket.id),
        escapeCSV(ticket.subject),
        escapeCSV(ticket.requester),
        escapeCSV(ticket.assignedTo),
        escapeCSV(ticket.priority),
        escapeCSV(ticket.status),
        escapeCSV(ticket.openedDate)
      ].join(','))
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "ocorrencias.csv");
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

    // Header
    doc.addImage(logoSrc, 'PNG', 15, 10, 90, 10);
    doc.setFontSize(18);
    doc.text("Lista de Ocorrências / Tickets", 110, 17);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-AO')}`, 15, 30);

    // Table
    (doc as any).autoTable({
        startY: 40,
        head: [['ID', 'Assunto', 'Solicitante', 'Atribuído a', 'Prioridade', 'Estado', 'Data de Abertura']],
        body: tickets.map(ticket => [
            ticket.id,
            ticket.subject,
            ticket.requester,
            ticket.assignedTo,
            ticket.priority,
            ticket.status,
            ticket.openedDate
        ]),
        theme: 'striped',
        headStyles: { fillColor: [0, 43, 127] },
        didDrawPage: (data: any) => {
            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Página ${data.pageNumber} de ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
            doc.text("SGO - Sistema de Gestão de Operações", doc.internal.pageSize.getWidth() - data.settings.margin.right, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
        },
    });
    
    doc.save('ocorrencias.pdf');
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Módulo de Ocorrências / Suporte Técnico</h1>
            <p className="text-gray-600">Gira pedidos de suporte e incidentes técnicos.</p>
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
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
                <PlusCircle className="h-5 w-5 mr-2" />
                Criar Novo Ticket
              </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard icon={AlertCircle} title="Tickets Abertos" value={tickets.filter(t => t.status === 'Aberto').length.toString()} />
          <StatCard icon={CheckCircle} title="Tickets Resolvidos (Mês)" value="15" />
          <StatCard icon={Flame} title="Prioridade Alta" value={tickets.filter(t => t.priority === 'Alta').length.toString()} />
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Lista de Tickets</h3>
          <div className="w-full">
              <table className="w-full">
                  <thead>
                      <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assunto</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atribuído a</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abertura</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {tickets.map(ticket => (
                          <tr key={ticket.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-base font-medium text-gray-900">{ticket.id}</td>
                              <td className="px-6 py-4 text-base text-gray-800 truncate max-w-xs" title={ticket.subject}>{ticket.subject}</td>
                              <td className="px-6 py-4 text-base text-gray-500">{ticket.requester}</td>
                              <td className="px-6 py-4 text-base text-gray-500">{ticket.assignedTo}</td>
                              <td className="px-6 py-4 text-base font-semibold">
                                  <span className={priorityColors[ticket.priority]}>{ticket.priority}</span>
                              </td>
                              <td className="px-6 py-4 text-base">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[ticket.status]}`}>
                                      {ticket.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-base text-gray-500">{ticket.openedDate}</td>
                              <td className="px-6 py-4 text-center">
                                  <div className="flex justify-center items-center space-x-3">
                                      <button onClick={() => handleViewDetails(ticket)} className="text-blue-600 hover:text-blue-900" title="Ver Detalhes">
                                          <Eye className="h-5 w-5" />
                                      </button>
                                      <button onClick={() => handleDelete(ticket)} className="text-red-600 hover:text-red-900" title="Apagar">
                                          <Trash2 className="h-5 w-5" />
                                      </button>
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
        <NovoTicketModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleAddTicket}
        />
        <DetalheTicketModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            ticket={selectedTicket}
        />
        <ConfirmationModal
            isOpen={!!ticketToDelete}
            onClose={() => setTicketToDelete(null)}
            onConfirm={handleConfirmDelete}
            title="Confirmar Exclusão de Ticket"
            message={`Tem a certeza de que deseja excluir o ticket "${ticketToDelete?.subject}"?`}
        />
      </Suspense>
    </>
  );
};

export default OcorrenciasPage;