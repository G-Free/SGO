import React, { useState, lazy, Suspense, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, File, Users, Briefcase, Phone, Search, MoreVertical, Edit, Trash2, Loader2 } from 'lucide-react';

const NovoColaboradorModal = lazy(() => import('../components/NovoColaboradorModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));

declare global {
    interface Window { jspdf: any; }
}

const mockEmployeesData = [
  { id: 1, name: 'Administrador GMA', position: 'Administrador', department: 'Direção', contact: 'admin@gma.gov.ao', origin: 'GMA-CGCF', avatar: 'https://i.pravatar.cc/40?u=1' },
  { id: 2, name: 'Manuel Santos', position: 'Comandante', department: 'Operações', contact: 'm.santos@gma.gov.ao', origin: 'Marinha de Guerra', avatar: 'https://i.pravatar.cc/40?u=2' },
  { id: 3, name: 'Sofia Lima', position: 'Inspetora Chefe', department: 'Fiscalização', contact: 's.lima@gma.gov.ao', origin: 'Polícia Fiscal', avatar: 'https://i.pravatar.cc/40?u=3' },
  { id: 4, name: 'António Freire', position: 'Técnico de IT Sénior', department: 'Tecnologia', contact: 'a.freire@gma.gov.ao', origin: 'SME', avatar: 'https://i.pravatar.cc/40?u=4' },
  { id: 5, name: 'Carlos Mendes', position: 'Fiscal', department: 'Fiscalização', contact: 'c.mendes@gma.gov.ao', origin: 'Capitania', avatar: 'https://i.pravatar.cc/40?u=5' },
];

const StatCard = ({ icon: Icon, title, value }: { icon: React.ElementType, title: string, value: string }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
            <p className="text-base font-medium text-gray-600">{title}</p>
            <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
);

const ActionsMenu: React.FC<{ employee: any, onEdit: (employee: any) => void, onDelete: (employee: any) => void }> = ({ employee, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full">
                <MoreVertical size={18} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border">
                    <ul className="py-1">
                        <li>
                            <button onClick={() => { onEdit(employee); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Edit size={14} className="mr-2" /> Editar
                            </button>
                        </li>
                        <li>
                            <button onClick={() => { onDelete(employee); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                <Trash2 size={14} className="mr-2" /> Apagar
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

const RecursosHumanosPage: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState(mockEmployeesData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<any | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);


  const handleSave = (employeeData: any) => {
    if (employeeData.id) { // Editing existing
        setEmployees(emps => emps.map(e => e.id === employeeData.id ? employeeData : e));
    } else { // Creating new
        setEmployees(current => [
            ...current, 
            { ...employeeData, id: current.length + 1, avatar: `https://i.pravatar.cc/40?u=${current.length + 1}` }
        ]);
    }
  };

  const handleOpenCreateModal = () => {
      setEmployeeToEdit(null);
      setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (employee: any) => {
      setEmployeeToEdit(employee);
      setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (employee: any) => {
      setEmployeeToDelete(employee);
  };

  const handleConfirmDelete = () => {
      if (employeeToDelete) {
          setIsDeleting(true);
          setTimeout(() => {
              setEmployees(emps => emps.filter(e => e.id !== employeeToDelete.id));
              setEmployeeToDelete(null);
              setIsDeleting(false);
          }, 1000);
      }
  };
  
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    setIsExportingCSV(true);
    setTimeout(() => {
        const headers = ["ID", "Nome", "Cargo", "Departamento", "Contacto", "Orgão de Origem"];
        
        const escapeCSV = (value: any): string => {
        const strValue = String(value ?? '');
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
            return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
        };

        const csvContent = [
        headers.join(','),
        ...filteredEmployees.map(emp => [
            escapeCSV(emp.id),
            escapeCSV(emp.name),
            escapeCSV(emp.position),
            escapeCSV(emp.department),
            escapeCSV(emp.contact),
            escapeCSV(emp.origin)
        ].join(','))
        ].join('\n');

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "recursos_humanos.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsExportingCSV(false);
    }, 1500);
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
        if (!window.jspdf || !(window.jspdf as any).jsPDF) {
        alert("Erro ao carregar a funcionalidade de PDF. Por favor, recarregue a página.");
        setIsExportingPDF(false);
        return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        if (typeof (doc as any).autoTable !== 'function') {
            alert("Erro ao carregar a funcionalidade de tabela PDF. Por favor, recarregue a página.");
            setIsExportingPDF(false);
            return;
        }

        const logoSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAABDCAYAAAC2+lYkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAd8SURBVHhe7Z1/bBxlHMc/s8zKsh/BhmEDExiMMWEi16W5NEmTNC0tDVLbFGqjth80bf2x/bFJk6Zp2rRNWv2xTVWb6oc2DZImaVq6lK7JTSmJuW5iAgMMGOwgK8uyLPv8I3e5d3Zmdnd2d9d9fz8vB3be2Z3f/X7e5/l5dhcQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCATrgmEYx+vr678MDAx8tbS09PHAwMC35+fn/6FQKPzMzMy3UqlUHxsb+0ZFRfWv0tLS7x4eHj6VSqU+Pj4+vrCw8J+Tk5NPzs7OfqRSqV+o1f9/hUIhMpnMPzo6+tX4+Pgvj46O/k6lUj+YnZ39ZHt7+60xMTGfjI2Nfb5arT4xOTn5xezs7C/FYvEbvb29b6VS6Z+1tbX/0Nra+kQ8Hv98PB7/x/F4/N3xePyT8Xj89+Px+Cfj8fiPx+Px347H4x+Nx+N/HI/H/zgej/+beDz+R/F4/I/i8fgfx+PxP4rH438aj8f/MB6P/2E8Hv+DeDz+X4jH498lHo/fJR6P3ycej98lHo/fJh6P3yIej18jHo9fJR6PXyMej18lHo9fIh6PXyAej18gHo9fIB6PXyAej18gHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fIB6PXyAej18gHo9fIB6PXyIej18hHo9fIR6PXyEej18hHo9fIR6PXyEej18hHo9fIR6PXyMeb7+vX78KHo9fIR6PXykejy8SjycSjycSj6cRj6cSj6cRjyYQj0YSj6cRj5cQj5cQj6cSj1cRj1cRj1cQj1cQjxcRj5eIxyuIx2uIxmuIxyuIxyuIx4uIx+OIxyOIxyOIx1OIxxOIxxOIx4OIx4OIxwOIxwOIx4OIx9OIx9OIxxOIxyOJxxKJxyKJxxKJxyOJxxKIx5KIRxKIxxKIR1KIhxKIRyKIRyKIR4SIR1KIRySIRzKIR3KIRzKIRyKIRwKIR4KEIxHEIyHEIx6EIx6EIRwKIhwSIRwSIRwKIhwKEQ4FIRwKEQ4FEA96EI92kI92kI92kI9kEA8kEA8kEI9kEA8kEI8EkA8lkI/EkA/FkA/HkA/GEI/GEY/FEY/FEY/EEA/HEI/HEI/FEo/FEY/FEQ/Hkg/Hkg/FkA/FkA/Hkg/HkQ/HkQ/FkQ/GkY/GEY/GkY/GEY9GkI/GkY9GEI+GEA/6EY/4EY/2EA/3EI93kI92kI/0kI8EEg/2kI9kEI+mkA8nkI9nkI9nkI8mkA8nkI8kkI/FEI+FEI9FEo9EEo9GEo9GEg+6EY+6EQ+7EI+7EI+5kI84kI84kI84kI84kI84EI8YkI8IkA8IEA8IkA8IkI+okA+okI+skA9kkI9EkA9mkA/mkA+WkA9UkA9UkA8kkI+mkI+kkI/nkI+nkI/nkI+GkA8lkA8mEI8mEI9GEg+mEA9GkI+GEA8GEQ8GEg+GEg8EkI8AkA8CEg4GEA8GEA4GkA4EkA8CkAwHkAyHkA4GkA4EkAoGEAwGEAwEkAkFkAyEEAkFkAyEkAmEkAmEkAmGkAmEkAmEEAmEkAmEEAmEkAmEkAmEkAmEkAmEkAmEEAmEkAmGEAmGEAmEkAmEkAmEkAl6kAl6kAkGkAkEEAmEEAmGEAmGEAmEkAmEkAmEkAmEkAmEkAmGEAmEEAmEEAmEEAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmGEAkGEAkGEAkEkAkEEAmEEAmEEAmGEAkGEAmEEAl1kAqFQKBSCQiFQKAKFQKBSCQSCQCAQCIRCIRAIBAKBYD3gfwD88c+E9jG3SwAAAABJRU5kJggg==';

        // Header
        doc.addImage(logoSrc, 'PNG', 15, 10, 90, 10);
        doc.setFontSize(18);
        doc.text("Lista de Colaboradores", 110, 17);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-AO')}`, 15, 30);

        // Table
        (doc as any).autoTable({
            startY: 40,
            head: [['Nome', 'Cargo', 'Departamento', 'Orgão de Origem', 'Contacto']],
            body: filteredEmployees.map(emp => [
                emp.name,
                emp.position,
                emp.department,
                emp.origin,
                emp.contact
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
        
        doc.save('recursos_humanos.pdf');
        setIsExportingPDF(false);
    }, 1500);
  };
  

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Módulo de Recursos Humanos</h1>
            <p className="text-gray-600">Gira as informações dos colaboradores da GMA.</p>
          </div>
          <div className="flex items-center space-x-2">
              <button 
                  onClick={handleExportPDF}
                  disabled={isExportingPDF || isExportingCSV}
                  className="bg-white border border-gray-300 text-gray-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                  {isExportingPDF ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <File className="h-4 w-4 mr-2" />}
                  {isExportingPDF ? 'A Exportar...' : 'Exportar PDF'}
              </button>
              <button 
                  onClick={handleExportCSV}
                  disabled={isExportingPDF || isExportingCSV}
                  className="bg-white border border-gray-300 text-gray-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                  {isExportingCSV ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <File className="h-4 w-4 mr-2" />}
                  {isExportingCSV ? 'A Exportar...' : 'Exportar CSV'}
              </button>
              <button 
                  onClick={handleOpenCreateModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
                <PlusCircle className="h-5 w-5 mr-2" />
                Adicionar Colaborador
              </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Users} title="Total de Colaboradores" value={employees.length.toString()} />
          <StatCard icon={Briefcase} title="Departamentos" value="4" />
          <StatCard icon={Phone} title="Férias Agendadas" value="3" />
          <StatCard icon={Users} title="Novas Contratações" value="1" />
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Lista de Colaboradores</h3>
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-base" />
              </div>
          </div>
          <div className="w-full">
              <table className="w-full">
                  <thead>
                      <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEmployees.map(employee => (
                          <tr key={employee.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                  <div className="flex items-center">
                                      <img className="h-10 w-10 rounded-full" src={employee.avatar} alt={employee.name} loading="lazy" decoding="async" width="40" height="40" />
                                      <div className="ml-4">
                                          <div className="text-base font-medium text-gray-900">{employee.name}</div>
                                          <div className="text-sm text-gray-500">{employee.origin}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-base text-gray-500">{employee.position}</td>
                              <td className="px-6 py-4 text-base text-gray-500">{employee.department}</td>
                              <td className="px-6 py-4 text-base text-gray-500">{employee.contact}</td>
                              <td className="px-6 py-4 text-center text-base">
                                  <ActionsMenu employee={employee} onEdit={handleOpenEditModal} onDelete={handleOpenDeleteModal} />
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <NovoColaboradorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          employeeToEdit={employeeToEdit}
        />
        <ConfirmationModal
            isOpen={!!employeeToDelete}
            onClose={() => setEmployeeToDelete(null)}
            onConfirm={handleConfirmDelete}
            title="Confirmar Exclusão"
            message={`Tem a certeza que deseja excluir o colaborador "${employeeToDelete?.name}"? Esta ação não pode ser desfeita.`}
            isLoading={isDeleting}
        />
      </Suspense>
    </>
  );
};

export default RecursosHumanosPage;