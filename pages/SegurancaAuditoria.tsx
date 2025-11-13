import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, File, UserCheck, UserX, ShieldCheck, Clock, PlusCircle, Edit, LogOut, FileText } from 'lucide-react';

declare global {
    interface Window { jspdf: any; }
}

const mockAuditLogs = [
  { id: 1, timestamp: '2024-07-26 10:00:15', user: 'Administrador GMA', action: 'LOGIN_SUCCESS', description: 'Login bem-sucedido.', ipAddress: '192.168.1.10' },
  { id: 2, timestamp: '2024-07-26 09:45:30', user: 'Gestor 1', action: 'CREATE_REPORT', description: 'Criou o relatório mensal REL-002.', ipAddress: '192.168.1.12' },
  { id: 3, timestamp: '2024-07-26 09:30:05', user: 'Técnico A', action: 'UPDATE_TICKET', description: 'Atualizou o estado do ticket TIC-002 para "Em Progresso".', ipAddress: '192.168.1.15' },
  { id: 4, timestamp: '2024-07-26 09:15:22', user: 'admin@gma.gov.ao', action: 'LOGIN_FAILURE', description: 'Tentativa de login falhada (palavra-passe incorreta).', ipAddress: '203.0.113.5' },
  { id: 5, timestamp: '2024-07-25 18:00:45', user: 'Administrador GMA', action: 'CREATE_USER', description: 'Convidou o utilizador "Novo Colaborador" (colab@gma.gov.ao).', ipAddress: '192.168.1.10' },
  { id: 6, timestamp: '2024-07-25 15:12:10', user: 'Técnico A', action: 'LOGOUT', description: 'Logout do sistema.', ipAddress: '192.168.1.15' },
];

const StatCard = ({ icon: Icon, title, value, color }: { icon: React.ElementType, title: string, value: string, color: string }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
            <p className="text-base font-medium text-gray-600">{title}</p>
            <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
);

const ActionCell: React.FC<{ action: string }> = ({ action }) => {
    let icon: React.ReactElement;
    let colorClasses: string;
    let text: string;

    switch (action) {
        case 'LOGIN_SUCCESS':
            icon = <UserCheck size={14} className="mr-1.5" />;
            colorClasses = 'bg-green-100 text-green-800';
            text = 'Login Válido';
            break;
        case 'LOGIN_FAILURE':
            icon = <UserX size={14} className="mr-1.5" />;
            colorClasses = 'bg-red-100 text-red-800';
            text = 'Login Falhou';
            break;
        case 'CREATE_REPORT':
        case 'CREATE_USER':
            icon = <PlusCircle size={14} className="mr-1.5" />;
            colorClasses = 'bg-blue-100 text-blue-800';
            text = 'Criação';
            break;
        case 'UPDATE_TICKET':
            icon = <Edit size={14} className="mr-1.5" />;
            colorClasses = 'bg-purple-100 text-purple-800';
            text = 'Atualização';
            break;
        case 'LOGOUT':
            icon = <LogOut size={14} className="mr-1.5" />;
            colorClasses = 'bg-gray-100 text-gray-700';
            text = 'Logout';
            break;
        default:
            icon = <FileText size={14} className="mr-1.5" />;
            colorClasses = 'bg-gray-100 text-gray-700';
            text = action;
            break;
    }

    return (
        <span className={`px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-full ${colorClasses}`}>
            {icon}
            {text}
        </span>
    );
};

const SegurancaAuditoriaPage: React.FC = () => {
  const navigate = useNavigate();
  const [logs] = useState(mockAuditLogs);
  const [filters, setFilters] = useState({
    searchTerm: '',
    startDate: '',
    endDate: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const logDate = new Date(log.timestamp.split(' ')[0]);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      const searchTerm = filters.searchTerm.toLowerCase();

      if (startDate && logDate < startDate) return false;
      if (endDate && logDate > endDate) return false;
      if (searchTerm && !(log.user.toLowerCase().includes(searchTerm) || log.action.toLowerCase().includes(searchTerm) || log.description.toLowerCase().includes(searchTerm))) return false;

      return true;
    });
  }, [logs, filters]);

  const handleExportCSV = () => {
    const headers = ["ID", "Timestamp", "Utilizador", "Ação", "Descrição", "Endereço IP"];
    const escapeCSV = (value: any) => `"${String(value).replace(/"/g, '""')}"`;
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        escapeCSV(log.id),
        escapeCSV(log.timestamp),
        escapeCSV(log.user),
        escapeCSV(log.action),
        escapeCSV(log.description),
        escapeCSV(log.ipAddress)
      ].join(','))
    ].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "auditoria.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };
  
  const handleExportPDF = () => {
    if (!window.jspdf || !(window.jspdf as any).jsPDF) {
      alert("Erro ao carregar a funcionalidade de PDF. Por favor, recarregue a página.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const logoSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAABDCAYAAAC2+lYkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAd8SURBVHhe7Z1/bBxlHMc/s8zKsh/BhmEDExiMMWEi16W5NEmTNC0tDVLbFGqjth80bf2x/bFJk6Zp2rRNWv2xTVWb6oc2DZImaVq6lK7JTSmJuW5iAgMMGOwgK8uyLPv8I3e5d3Zmdnd2d9d9fz8vB3be2Z3f/X7e5/l5dhcQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCATrgmEYx+vr678MDAx8tbS09PHAwMC35+fn/6FQKPzMzMy3UqlUHxsb+0ZFRfWv0tLS7x4eHj6VSqU+Pj4+vrCw8J+Tk5NPzs7OfqRSqV+o1f9/hUIhMpnMPzo6+tX4+Pgvj46O/k6lUj+YnZ39ZHt7+60xMTGfjI2Nfb5arT4xOTn5xezs7C/FYvEbvb29b6VS6Z+1tbX/0Nra+kQ8Hv98PB7/x/F4/N3xePyT8Xj89+Px+Cfj8fiPx+Px347H4x+Nx+N/HI/H/zgej/+beDz+R/F4/I/i8fgfx+PxP4rH438aj8f/MB6P/2E8Hv+DeDz+X4jH498lHo/fJR6P3ycej98lHo/fJh6P3yIej18jHo9fJR6PXyMej18lHo9fIh6PXyAej18gHo9fIB6PXyAej18gHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fIB6PXyAej18gHo9fIB6PXyIej18hHo9fIR6PXyEej18hHo9fIR6PXyEej18hHo9fIR6PXyMeb7+vX78KHo9fIR6PXykejy8SjycSjycSj6cRj6cSj6cRjyYQj0YSj6cRj5cQj5cQj6cSj1cRj1cRj1cQj1cQjxcRj5eIxyuIx2uIxmuIxyuIxyuIx4uIx+OIxyOIxyOIx1OIxxOIxxOIx4OIx4OIxwOIxwOIx4OIx9OIx9OIxxOIxyOJxxKJxyKJxxKJxyOJxxKIx5KIRxKIxxKIR1KIhxKIRyKIRyKIR4SIR1KIRySIRzKIR3KIRzKIRyKIRwKIR4KEIxHEIyHEIx6EIx6EIRwKIhwSIRwSIRwKIhwKEQ4FIRwKEQ4FEA96EI92kI92kI92kI9kEA8kEA8kEI9kEA8kEI8EkA8lkI/EkA/FkA/HkA/GEI/GEY/FEY/FEY/EEA/HEI/HEI/FEo/FEY/FEQ/Hkg/Hkg/FkA/FkA/Hkg/HkQ/HkQ/FkQ/GkY/GEY/GkY/GEY9GkI/GkY9GEI+GEA/6EY/4EY/2EA/3EI93kI92kI/0kI8EEg/2kI9kEI+mkA8nkI9nkI9nkI8mkA8nkI8kkI/FEI+FEI9FEo9EEo9GEo9GEg+6EY+6EQ+7EI+7EI+5kI84kI84kI84kI84kI84EI8YkI8IkA8IEA8IkA8IkI+okA+okI+skA9kkI9EkA9mkA/mkA+WkA9UkA9UkA8kkI+mkI+kkI/nkI+nkI/nkI+GkA8lkA8mEI8mEI9GEg+mEA9GkI+GEA8GEQ8GEg+GEg8EkI8AkA8CEg4GEA8GEA4GkA4EkA8CkAwHkAyHkA4GkA4EkAoGEAwGEAwEkAkFkAyEEAkFkAyEkAmEkAmEkAmGkAmEkAmEEAmEkAmEEAmEkAmEkAmEkAmEkAmEkAmEEAmEkAmGEAmGEAmEkAmEkAmEkAl6kAl6kAkGkAkEEAmEEAmGEAmGEAmEkAmEkAmEkAmEkAmEkAmGEAmEEAmEEAmEEAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmGEAkGEAkGEAkEkAkEEAmEEAmEEAmGEAkGEAmEEAl1kAqFQKBSCQiFQKAKFQKBSCQSCQCAQCIRCIRAIBAKBYD3gfwD88c+E9jG3SwAAAABJRU5kJggg==';

    if (typeof (doc as any).autoTable !== 'function') {
        alert("Erro ao carregar a funcionalidade de tabela PDF. Por favor, recarregue a página.");
        return;
    }
    
    doc.addImage(logoSrc, 'PNG', 15, 10, 90, 10);
    doc.setFontSize(18);
    doc.text("Log de Auditoria", 110, 17);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-AO')}`, 15, 30);
    (doc as any).autoTable({
        startY: 40,
        head: [['Timestamp', 'Utilizador', 'Ação', 'Descrição', 'Endereço IP']],
        body: filteredLogs.map(log => [
            log.timestamp,
            log.user,
            log.action,
            log.description,
            log.ipAddress
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
    doc.save('auditoria.pdf');
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Segurança e Auditoria</h1>
          <p className="text-gray-600">Monitorize os acessos e atividades no sistema.</p>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={handleExportPDF} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg flex items-center">
                <File className="h-4 w-4 mr-2" /> Exportar PDF
            </button>
            <button onClick={handleExportCSV} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg flex items-center">
                <File className="h-4 w-4 mr-2" /> Exportar CSV
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={UserCheck} title="Logins com Sucesso (24h)" value="23" color="text-green-500" />
        <StatCard icon={UserX} title="Falhas de Login (24h)" value="1" color="text-red-500" />
        <StatCard icon={ShieldCheck} title="Ações de Admin (24h)" value="5" color="text-blue-500" />
        <StatCard icon={Clock} title="Média de Sessão" value="45 min" color="text-purple-500" />
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
            <div className="md:col-span-1">
                <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">Pesquisar</label>
                <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" name="searchTerm" id="searchTerm" value={filters.searchTerm} onChange={handleFilterChange} placeholder="Utilizador, ação, descrição..." className="pl-9 w-full border border-gray-300 rounded-lg text-base py-2" />
                </div>
            </div>
            <div className="flex items-end space-x-2">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">De</label>
                    <input type="date" name="startDate" id="startDate" value={filters.startDate} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 py-2" />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Até</label>
                    <input type="date" name="endDate" id="endDate" value={filters.endDate} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 py-2" />
                </div>
            </div>
        </div>
        
        <div className="w-full overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilizador</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço IP</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.map(log => (
                        <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-base text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                            <td className="px-6 py-4 text-base font-medium text-gray-900">{log.user}</td>
                            <td className="px-6 py-4 text-base"><ActionCell action={log.action} /></td>
                            <td className="px-6 py-4 text-base text-gray-800">{log.description}</td>
                            <td className="px-6 py-4 text-base text-gray-500">{log.ipAddress}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default SegurancaAuditoriaPage;