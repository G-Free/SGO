import React, { useState, lazy, Suspense, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, MoreVertical, ShieldCheck, ShieldOff, File, Edit, Trash2, Briefcase, Wrench, Server, User, Eye, Check } from 'lucide-react';
import { UserRole } from '../types';

const ConvidarUtilizadorModal = lazy(() => import('../components/ConvidarUtilizadorModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));


declare global {
    interface Window { jspdf: any; }
}

const mockUsersData = [
  { id: 1, name: 'Geiger Carlos', email: 'glcarlos@sga.co.ao', role: 'Administrador', lastAccess: '2024-07-26 10:00', status: 'Ativo', password: 'siif2024' },
  { id: 2, name: 'Gestor de Operações', email: 'gestor@sgo.cgcf.gov.ao', role: 'Gestor', lastAccess: '2024-07-26 09:30', status: 'Ativo', password: 'siif2024' },
  { id: 3, name: 'Técnico de Operação', email: 'tecnico.op@sgo.cgcf.gov.ao', role: 'Técnico de Operação', lastAccess: '2024-07-25 15:12', status: 'Ativo', password: 'siif2024' },
  { id: 4, name: 'Técnico de SI', email: 'tecnico.si@sgo.cgcf.gov.ao', role: 'Técnico de SI', lastAccess: '2024-07-26 11:00', status: 'Ativo', password: 'siif2024' },
  { id: 5, name: 'Usuário Padrão', email: 'padrao@sgo.cgcf.gov.ao', role: 'Padrão', lastAccess: '2024-07-24 18:30', status: 'Ativo', password: 'siif2024' },
  { id: 6, name: 'Consultor Externo', email: 'consultor@externo.com', role: 'Consultor', lastAccess: '2024-07-22 11:05', status: 'Inativo', password: 'siif2024' },
];

const profilePermissions: Record<UserRole, { title: string; icon: React.ElementType; description: string; permissions: string[] }> = {
  administrador: {
    title: 'Administrador',
    icon: ShieldCheck,
    description: 'Acesso total e irrestrito a todas as funcionalidades do sistema, incluindo configurações críticas.',
    permissions: [
      'Gerir Utilizadores e Perfis', 'Configurar o Sistema', 'Aceder a todos os relatórios e módulos',
      'Gerir Orçamento e Finanças', 'Visualizar logs de auditoria e segurança', 'Acesso a todos os dados sem restrição'
    ],
  },
  gestor: {
    title: 'Gestor',
    icon: Briefcase,
    description: 'Acesso a funcionalidades de gestão, supervisão de equipas e tomada de decisão estratégica.',
    permissions: [
      'Criar e aprovar Relatórios e TdR', 'Visualizar dashboards e análises', 'Gerir Atividades e Projetos da sua equipa',
      'Aceder a módulos de RH e Financeiro', 'Aprovar Ocorrências e Ordens de Serviço',
    ],
  },
  tecnico_op: {
    title: 'Técnico de Operação',
    icon: Wrench,
    description: 'Executa atividades de campo, fiscalização e operações diárias, reportando o seu progresso.',
    permissions: [
      'Registar e atualizar Atividades', 'Executar Ordens de Serviço', 'Consultar Património e Meios alocados',
      'Abrir Ocorrências', 'Gerar relatórios das suas atividades',
    ],
  },
  tecnico_si: {
    title: 'Técnico de SI',
    icon: Server,
    description: 'Gerencia a infraestrutura de TI, sistemas e segurança da informação.',
    permissions: [
      'Aceder ao módulo de Configurações', 'Resolver Ocorrências técnicas', 'Gerir backups e integrações',
      'Monitorar a performance do sistema', 'Gerir Património de TI',
    ],
  },
  padrao: {
    title: 'Padrão',
    icon: User,
    description: 'Acesso básico ao sistema, para consulta de informações e realização de tarefas simples.',
    permissions: [
      'Consultar informações públicas', 'Abrir Ocorrências de suporte', 'Visualizar o seu próprio perfil',
      'Acesso limitado a relatórios específicos',
    ],
  },
  consultor: {
    title: 'Consultor',
    icon: Eye,
    description: 'Acesso de apenas leitura a áreas específicas do sistema, para fins de auditoria ou consulta.',
    permissions: [
      'Visualizar Relatórios e Dashboards', 'Consultar dados de Atividades e Projetos', 'Não pode criar ou editar registos',
      'Acesso restrito a informações sensíveis',
    ],
  },
};

const statusColors: { [key: string]: string } = {
  'Ativo': 'bg-green-100 text-green-800',
  'Inativo': 'bg-gray-100 text-gray-800',
};

const roleColors: { [key: string]: string } = {
  'Administrador': 'bg-red-100 text-red-800',
  'Gestor': 'bg-purple-100 text-purple-800',
  'Técnico de Operação': 'bg-blue-100 text-blue-800',
  'Técnico de SI': 'bg-teal-100 text-teal-800',
  'Padrão': 'bg-gray-100 text-gray-800',
  'Consultor': 'bg-yellow-100 text-yellow-800',
};

const ActionsMenu: React.FC<{ user: any, onEdit: (user: any) => void, onDelete: (user: any) => void, onToggleStatus: (user: any) => void }> = ({ user, onEdit, onDelete, onToggleStatus }) => {
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                    <ul className="py-1">
                        <li>
                            <button onClick={() => { onEdit(user); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Edit size={14} className="mr-2" /> Editar Perfil
                            </button>
                        </li>
                        <li>
                            <button onClick={() => { onToggleStatus(user); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                {user.status === 'Ativo' ? <ShieldOff size={14} className="mr-2" /> : <ShieldCheck size={14} className="mr-2" />}
                                {user.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                            </button>
                        </li>
                        <li>
                            <button onClick={() => { onDelete(user); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                <Trash2 size={14} className="mr-2" /> Apagar Utilizador
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

const UtilizadoresPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsersData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any | null>(null);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  
  const handleSaveUser = (userData: any) => {
    if(userData.id) { // Edit
        setUsers(current => current.map(u => u.id === userData.id ? { ...u, ...userData } : u));
    } else { // Create
        setUsers(current => [
            ...current,
            {
                ...userData,
                id: current.length + 1,
                lastAccess: 'Pendente',
                status: 'Ativo'
            }
        ]);
    }
  };

  const handleOpenCreateModal = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (user: any) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (user: any) => {
    setUserToDelete(user);
  };
  
  const handleConfirmDelete = () => {
    if (userToDelete) {
        setUsers(current => current.filter(u => u.id !== userToDelete.id));
        setUserToDelete(null);
    }
  };

  const handleToggleStatus = (user: any) => {
    setUsers(current => current.map(u => 
        u.id === user.id ? { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' } : u
    ));
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Nome", "Email", "Perfil de Acesso", "Último Acesso", "Estado"];
    
    const escapeCSV = (value: any): string => {
      const strValue = String(value ?? '');
      if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    };

    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        escapeCSV(user.id),
        escapeCSV(user.name),
        escapeCSV(user.email),
        escapeCSV(user.role),
        escapeCSV(user.lastAccess),
        escapeCSV(user.status)
      ].join(','))
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "utilizadores.csv");
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
    doc.text("Lista de Utilizadores", 110, 17);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-AO')}`, 15, 30);

    // Table
    (doc as any).autoTable({
        startY: 40,
        head: [['Nome', 'Email', 'Perfil de Acesso', 'Último Acesso', 'Estado']],
        body: users.map(user => [
            user.name,
            user.email,
            user.role,
            user.lastAccess,
            user.status
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
    
    doc.save('utilizadores.pdf');
  };
  
  const userToEditWithFullRole = userToEdit ? { ...userToEdit, role: Object.values(profilePermissions).find(p => p.title === userToEdit.role) ? userToEdit.role : 'Padrão' } : null;


  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Utilizadores, Perfis e Permissões</h1>
            <p className="text-gray-600">Gira as contas de utilizador e compreenda o que cada perfil pode fazer.</p>
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
                  onClick={handleOpenCreateModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
                <UserPlus className="h-5 w-5 mr-2" />
                Convidar Utilizador
              </button>
          </div>
        </div>

        <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Perfis de Acesso e Permissões</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Object.keys(profilePermissions) as Array<UserRole>).map(role => {
                    const profile = profilePermissions[role];
                    const Icon = profile.icon;
                    return (
                        <div key={role} className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start mb-3">
                                <Icon className="h-8 w-8 text-blue-600 mr-4 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{profile.title}</h3>
                                    <p className="text-sm text-gray-600">{profile.description}</p>
                                </div>
                            </div>
                            <div className="mt-auto pt-3 border-t">
                                <ul className="space-y-2">
                                    {profile.permissions.map((perm, index) => (
                                        <li key={index} className="flex items-start text-sm text-gray-700">
                                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            <span>{perm}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Lista de Utilizadores</h3>
          <div className="w-full">
              <table className="w-full">
                  <thead>
                      <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil de Acesso</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Palavra-passe</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Acesso</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                          <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                  <div className="text-base font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[user.role] || roleColors['Padrão']}`}>
                                    {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-base text-gray-500 font-mono">{user.password}</td>
                              <td className="px-6 py-4 text-base text-gray-500 whitespace-nowrap">{user.lastAccess}</td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[user.status]}`}>
                                      {user.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-center text-base">
                                  <ActionsMenu user={user} onEdit={handleOpenEditModal} onDelete={handleOpenDeleteModal} onToggleStatus={handleToggleStatus} />
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <ConvidarUtilizadorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          userToEdit={userToEditWithFullRole}
        />
        <ConfirmationModal
            isOpen={!!userToDelete}
            onClose={() => setUserToDelete(null)}
            onConfirm={handleConfirmDelete}
            title="Confirmar Exclusão"
            message={`Tem a certeza que deseja excluir o utilizador "${userToDelete?.name}"? Esta ação não pode ser desfeita.`}
        />
      </Suspense>
    </>
  );
};

export default UtilizadoresPage;
