import React, { useState, useRef, useEffect, lazy, Suspense, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, MoreHorizontal, UserCircle, Calendar, Trash2, File, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));
const ProjectDetailsModal = lazy(() => import('../components/ProjectDetailsModal'));
const NovoProjetoModal = lazy(() => import('../components/NovoProjetoModal'));


declare global {
    interface Window { jspdf: any; }
}

const mockProjectsData = [
  { id: 'PROJ-01', title: 'Implementação do Módulo de Relatórios', manager: 'Gestor 1', status: 'Concluído', progress: 100, startDate: '2024-05-01', endDate: '2024-06-25', dueDate: '2024-06-30', notes: 'Módulo finalizado e validado pela equipa de gestão. Pendente de documentação final.' },
  { id: 'PROJ-02', title: 'Desenvolvimento do Módulo Financeiro', manager: 'Gestor 2', status: 'Em Execução', progress: 65, startDate: '2024-06-10', endDate: '2024-08-10', dueDate: '2024-08-15', notes: 'Fase de testes de integração a decorrer. Próximo passo: UAT.' },
  { id: 'PROJ-03', title: 'Migração de Servidores para a Cloud', manager: 'Técnico A', status: 'Em Execução', progress: 40, startDate: '2024-07-01', endDate: '2024-08-25', dueDate: '2024-09-01', notes: 'Aguardando credenciais do novo provedor de cloud.' },
  { id: 'PROJ-04', title: 'Planeamento Estratégico 2025', manager: 'Administrador', status: 'Planeado', progress: 10, startDate: '2024-09-01', endDate: '2024-10-15', dueDate: '2024-10-20', notes: '' },
  { id: 'PROJ-05', title: 'Atualização da Infraestrutura de Rede', manager: 'Técnico B', status: 'Planeado', progress: 0, startDate: '2024-06-01', endDate: '2024-07-10', dueDate: '2024-07-15', notes: 'Orçamentos em análise.' }, // Due date in the past for testing 'Atrasado'
  { id: 'PROJ-06', title: 'Auditoria de Segurança Anual', manager: 'Gestor 1', status: 'Concluído', progress: 100, startDate: '2024-04-15', endDate: '2024-05-15', dueDate: '2024-05-20', notes: 'Relatório de auditoria entregue. Sem inconformidades críticas.' },
];

interface Project {
  id: string;
  title: string;
  manager: string;
  status: 'Planeado' | 'Em Execução' | 'Concluído';
  progress: number;
  startDate: string;
  endDate: string;
  dueDate: string;
  notes: string;
}
interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onViewDetails: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete, onViewDetails }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleCardClick = (e: React.MouseEvent) => {
    if (menuRef.current && menuRef.current.contains(e.target as Node)) {
      return;
    }
    onViewDetails(project);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', project.id);
  };

  return (
    <div 
        className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab"
        onClick={handleCardClick}
        draggable
        onDragStart={handleDragStart}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-gray-800 text-sm mb-1.5">{project.title}</h4>
        <div className="relative" ref={menuRef}>
            <button onClick={(e) => { e.stopPropagation(); setMenuOpen(prev => !prev); }} className="text-gray-400 hover:text-gray-600 p-1 rounded-full">
                <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border">
                <ul className="py-1">
                <li>
                    <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(project.id);
                        setMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                    <Trash2 size={14} className="mr-2" />
                    Excluir
                    </button>
                </li>
                </ul>
            </div>
            )}
        </div>
      </div>
      <div className="flex items-center text-xs text-gray-500 mb-2">
        <UserCircle size={12} className="mr-1.5" />
        <span>{project.manager}</span>
      </div>
      <div className="mb-2">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
          <span>Progresso</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
        </div>
      </div>
      <div className="flex items-center text-xs text-gray-500">
        <Calendar size={12} className="mr-1.5" />
        <span>Prazo: {project.dueDate}</span>
      </div>
    </div>
  );
};

interface ProjectsColumnProps {
  title: string;
  projects: Project[];
  color: string;
  statusToSet?: 'Planeado' | 'Em Execução' | 'Concluído';
  onDropProject?: (projectId: string, newStatus: 'Planeado' | 'Em Execução' | 'Concluído') => void;
  onDelete: (id: string) => void;
  onViewDetails: (project: Project) => void;
}

const ProjectsColumn: React.FC<ProjectsColumnProps> = ({ title, projects, color, statusToSet, onDropProject, onDelete, onViewDetails }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (statusToSet) {
      e.preventDefault();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    if (statusToSet && onDropProject) {
      e.preventDefault();
      const projectId = e.dataTransfer.getData('text/plain');
      if (projectId) {
        onDropProject(projectId, statusToSet);
      }
      setIsDragOver(false);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      className={`bg-gray-50 rounded-lg p-4 w-full md:w-1/4 transition-all duration-300 ${isDragOver ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}
    >
      <h3 className={`font-bold text-gray-700 mb-4 pb-2 border-b-2 ${color}`}>{title} ({projects.length})</h3>
      <div className="space-y-4 h-full min-h-[200px]">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} onDelete={onDelete} onViewDetails={onViewDetails} />
        ))}
      </div>
    </div>
  );
};

const projectStatusColors: { [key: string]: string } = {
  'Concluído': 'bg-green-100 text-green-800 hover:bg-green-200',
  'Em Execução': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  'Planeado': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  'Atrasado': 'bg-red-100 text-red-800 hover:bg-red-200',
};

const CalendarView: React.FC<{ projects: Project[], onViewDetails: (project: Project) => void }> = ({ projects, onViewDetails }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const parseDateAsUTC = (dateString: string): Date => {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    };

    const availableYears = React.useMemo(() => {
        const years = new Set(projects.map(p => new Date(p.startDate).getFullYear()));
        const currentSystemYear = new Date().getFullYear();
        years.add(currentSystemYear);
        // FIX: The sort method's callback parameters `a` and `b` might not be inferred as numbers,
        // causing a TypeScript error. Explicitly casting them to `Number` ensures the subtraction is valid.
        return Array.from(years).sort((a, b) => Number(a) - Number(b));
    }, [projects]);

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentDate(new Date(parseInt(e.target.value, 10), currentDate.getMonth(), 1));

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarDays = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`empty-${i}`} className="border border-gray-200 rounded-md h-32"></div>);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
        const currentCalendarDate = new Date(year, month, day);
        currentCalendarDate.setHours(0,0,0,0);

        const projectsOnThisDay = projects.filter(p => {
            const projectStartDate = new Date(p.startDate);
            projectStartDate.setHours(0,0,0,0);
            const projectEndDate = new Date(p.endDate);
            projectEndDate.setHours(0,0,0,0);
            return currentCalendarDate >= projectStartDate && currentCalendarDate <= projectEndDate;
        });

        calendarDays.push(
            <div key={day} className="border border-gray-200 rounded-md h-32 p-2 text-base overflow-y-auto flex flex-col">
                <span className="font-semibold text-gray-700 self-start">{day}</span>
                 <div className="flex-grow space-y-1 mt-1">
                    {projectsOnThisDay.map(project => {
                        const dueDate = new Date(project.dueDate);
                        dueDate.setHours(0,0,0,0);
                        const isDelayed = project.status !== 'Concluído' && dueDate < today;
                        const statusKey = isDelayed ? 'Atrasado' : project.status;

                        return (
                             <div 
                                key={project.id} 
                                onClick={() => onViewDetails(project)}
                                className={`text-sm font-semibold rounded px-2 py-1 truncate cursor-pointer ${projectStatusColors[statusKey]}`} 
                                title={project.title}
                            >
                                {project.title}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                    {currentDate.toLocaleString('pt-AO', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
                </h3>
                 <div className="flex items-center space-x-2">
                    <select value={currentDate.getFullYear()} onChange={handleYearChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100 transition-colors"><ChevronLeft className="h-5 w-5 text-gray-600" /></button>
                    <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100 transition-colors"><ChevronRight className="h-5 w-5 text-gray-600" /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-600 text-base">
                {daysOfWeek.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 mt-1">
                {calendarDays}
            </div>
        </div>
    );
};


const ProjetosPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(mockProjectsData as Project[]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('kanban'); // 'kanban' or 'calendar'
  
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);

  const handleOpenDeleteModal = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setProjectToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    setTimeout(() => {
      setProjects(currentProjects => currentProjects.filter(p => p.id !== projectToDelete));
      handleCloseDeleteModal();
      setIsDeleting(false);
    }, 1000);
  };
  
  const handleOpenDetailsModal = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setSelectedProject(null);
    setIsDetailsModalOpen(false);
  };

  const handleSaveProjectDetails = (updatedProject: Project) => {
    setProjects(currentProjects => 
      currentProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
  };
  
  const handleAddProject = (newProject: Omit<Project, 'id' | 'progress'>) => {
      const projectToAdd: Project = {
        ...newProject,
        id: `PROJ-${Math.floor(Math.random() * 900) + 100}`,
        progress: newProject.status === 'Planeado' ? 0 : 10,
      }
      setProjects(currentProjects => [projectToAdd, ...currentProjects]);
  };

  const handleDropProject = (projectId: string, newStatus: 'Planeado' | 'Em Execução' | 'Concluído') => {
    setProjects(currentProjects =>
        currentProjects.map(p => {
            if (p.id === projectId) {
                const updatedProject = { ...p, status: newStatus };

                // Update progress based on the new status
                switch (newStatus) {
                    case 'Planeado':
                        updatedProject.progress = 0;
                        break;
                    case 'Em Execução':
                        if (p.status === 'Concluído') {
                            updatedProject.progress = 75; // Moving back from completed
                        } else if (p.status === 'Planeado') {
                            updatedProject.progress = 10; // Moving from planned
                        }
                        // If moving from 'Em Execução' (e.g. from Delayed) to 'Em Execução', progress is maintained
                        break;
                    case 'Concluído':
                        updatedProject.progress = 100;
                        break;
                }
                
                // Fix: If a currently delayed project is moved to an active column, update its due date.
                // This prevents it from being immediately filtered back into the "Atrasado" column.
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isDelayed = p.status !== 'Concluído' && new Date(p.dueDate) < today;

                if (isDelayed && (newStatus === 'Planeado' || newStatus === 'Em Execução')) {
                    const futureDate = new Date();
                    futureDate.setDate(futureDate.getDate() + 7); // Set a new due date 1 week in the future
                    updatedProject.dueDate = futureDate.toISOString().split('T')[0];
                }

                return updatedProject;
            }
            return p;
        })
    );
  };

  const {
    plannedProjects,
    inProgressProjects,
    delayedProjects,
    completedProjects,
  } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const delayed = projects.filter(
      p => p.status !== 'Concluído' && new Date(p.dueDate) < today
    );
    const delayedIds = new Set(delayed.map(p => p.id));

    const completed = projects.filter(p => p.status === 'Concluído');
    
    const planned = projects.filter(
      p => p.status === 'Planeado' && !delayedIds.has(p.id)
    );
    
    const inProgress = projects.filter(
      p => p.status === 'Em Execução' && !delayedIds.has(p.id)
    );

    return {
      plannedProjects: planned,
      inProgressProjects: inProgress,
      delayedProjects: delayed,
      completedProjects: completed,
    };
  }, [projects]);


  const handleExportCSV = () => {
    setIsExportingCSV(true);
    setTimeout(() => {
        if (projects.length === 0) {
        alert("Não há projetos para exportar.");
        setIsExportingCSV(false);
        return;
        }

        const headers = ["ID", "Título", "Gestor", "Estado", "Progresso (%)", "Data Início", "Data Fim", "Prazo"];
        
        const escapeCSV = (value: any): string => {
        const strValue = String(value ?? '');
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
            return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
        };

        const csvContent = [
        headers.join(','),
        ...[...projects].sort((a, b) => a.status.localeCompare(b.status)).map(p => [
            escapeCSV(p.id),
            escapeCSV(p.title),
            escapeCSV(p.manager),
            escapeCSV(p.status),
            escapeCSV(p.progress),
            escapeCSV(p.startDate),
            escapeCSV(p.endDate),
            escapeCSV(p.dueDate)
        ].join(','))
        ].join('\n');

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "projetos.csv");
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
        if (projects.length === 0) {
        alert("Não há projetos para exportar.");
        setIsExportingPDF(false);
        return;
        }

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

        const statusOrder: { [key: string]: number } = { 'Planeado': 1, 'Em Execução': 2, 'Concluído': 3 };
        const sortedProjects = [...projects].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

        // Header
        doc.addImage(logoSrc, 'PNG', 15, 10, 90, 10);
        doc.setFontSize(18);
        doc.text("Lista de Projetos", 110, 17);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-AO')}`, 15, 30);

        // Table
        (doc as any).autoTable({
            startY: 40,
            head: [['ID', 'Título', 'Gestor', 'Estado', 'Progresso', 'Início', 'Fim', 'Prazo']],
            body: sortedProjects.map(p => [
                p.id,
                p.title,
                p.manager,
                p.status,
                `${p.progress}%`,
                p.startDate,
                p.endDate,
                p.dueDate
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
        
        doc.save('projetos.pdf');
        setIsExportingPDF(false);
    }, 1500);
  };

  const projectToDeleteDetails = projects.find(p => p.id === projectToDelete);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Módulo de Projetos</h1>
          <p className="text-gray-600">Acompanhe o progresso dos projetos em formato Kanban.</p>
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
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
              <PlusCircle className="h-5 w-5 mr-2" />
              Novo Projeto
            </button>
        </div>
      </div>
      
      <div className="w-full sm:w-auto bg-gray-100 rounded-lg p-1 flex space-x-1 mb-6 max-w-xs">
          <button
              onClick={() => setActiveView('kanban')}
              className={`w-full px-6 py-2 text-base font-semibold rounded-md transition-colors duration-200 text-center ${
                  activeView === 'kanban' ? 'bg-white text-gray-800 shadow' : 'bg-transparent text-gray-600 hover:bg-gray-200'
              }`}
          >
              Kanban
          </button>
          <button
              onClick={() => setActiveView('calendar')}
              className={`w-full px-6 py-2 text-base font-semibold rounded-md transition-colors duration-200 text-center ${
                  activeView === 'calendar' ? 'bg-white text-gray-800 shadow' : 'bg-transparent text-gray-600 hover:bg-gray-200'
              }`}
          >
              Calendário
          </button>
      </div>

      {activeView === 'kanban' ? (
        <div className="flex flex-col md:flex-row gap-6">
          <ProjectsColumn 
              title="Planeado" 
              projects={plannedProjects} 
              color="border-yellow-400" 
              onDelete={handleOpenDeleteModal} 
              onViewDetails={handleOpenDetailsModal} 
              statusToSet="Planeado"
              onDropProject={handleDropProject}
          />
          <ProjectsColumn 
              title="Em Execução" 
              projects={inProgressProjects} 
              color="border-blue-500" 
              onDelete={handleOpenDeleteModal} 
              onViewDetails={handleOpenDetailsModal}
              statusToSet="Em Execução"
              onDropProject={handleDropProject}
          />
          <ProjectsColumn 
              title="Atrasado" 
              projects={delayedProjects} 
              color="border-red-500" 
              onDelete={handleOpenDeleteModal} 
              onViewDetails={handleOpenDetailsModal} 
              // This column is not a drop target, but can be a source
          />
          <ProjectsColumn 
              title="Concluído" 
              projects={completedProjects} 
              color="border-green-500" 
              onDelete={handleOpenDeleteModal} 
              onViewDetails={handleOpenDetailsModal} 
              statusToSet="Concluído"
              onDropProject={handleDropProject}
          />
        </div>
      ) : (
        <CalendarView projects={projects} onViewDetails={handleOpenDetailsModal} />
      )}
      
      <Suspense fallback={null}>
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Confirmar Exclusão de Projeto"
          message={`Tem a certeza de que deseja excluir o projeto "${projectToDeleteDetails?.title || ''}"? Esta ação não pode ser desfeita.`}
          isLoading={isDeleting}
        />
        
        <ProjectDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          onSave={handleSaveProjectDetails}
          project={selectedProject}
        />
        
        <NovoProjetoModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSave={handleAddProject}
        />
      </Suspense>
    </div>
  );
};

export default ProjetosPage;