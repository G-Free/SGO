import React, { useState, lazy, Suspense } from 'react';
import { Shield, AlertTriangle, Users, Camera, MapPin, User, Ship, Calendar as CalendarIcon, Info, ArrowLeft, TrendingUp, PlusCircle, Clock, CheckCircle, ListTodo, Edit, Trash2, File, RefreshCw, Eye, PlayCircle, ChevronLeft, ChevronRight, FileText, ClipboardCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { samplePdfDataUri } from '../data/sample-report';

const NovaAtividadeModal = lazy(() => import('../components/NovaAtividadeModal'));
const DetalheAtividadeModal = lazy(() => import('../components/DetalheAtividadeModal'));
const PdfViewerModal = lazy(() => import('../components/PdfViewerModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));

declare global {
    interface Window { jspdf: any; }
}

const mockPlanosData = [
  { id: 'PA-01', title: 'Modernização Tecnológica das Fronteiras', responsible: 'Departamento de IT', startDate: '2024-01-15', endDate: '2024-12-20', status: 'Em Execução', progress: 60 },
  { id: 'PA-02', title: 'Estratégia de Combate à Imigração Ilegal 2024', responsible: 'Direção de Operações', startDate: '2024-02-01', endDate: '2024-11-30', status: 'Em Execução', progress: 45 },
  { id: 'PA-03', title: 'Formação Contínua dos Agentes', responsible: 'Recursos Humanos', startDate: '2024-03-01', endDate: '2024-09-15', status: 'Planeado', progress: 10 },
  { id: 'PA-04', title: 'Auditoria de Processos Internos 2023', responsible: 'Gabinete de Qualidade', startDate: '2023-09-01', endDate: '2023-12-15', status: 'Concluído', progress: 100 },
];

const mockActivities = [
  { 
    id: 'ATV-001', 
    title: 'Fiscalização Costa Norte', 
    responsible: 'Cmdt. Manuel Santos', 
    startDate: '01/07/2024', 
    endDate: '05/07/2024', 
    status: 'Em Andamento', 
    priority: 'Alta',
    province: 'Cabinda',
    vessel: 'Patrulha Angola I',
    type: 'Marítima',
    coordinates: '-5.5° S, 12.2° E',
    infractions: 3,
    planoAcaoId: 'PA-02',
    objectives: [
      'Verificar cumprimento das normas de pesca na região',
      'Inspecionar embarcações e equipamentos de pesca',
      'Aplicar sanções em caso de infrações detectadas',
      'Coletar dados sobre atividades pesqueiras',
      'Promover educação ambiental junto aos pescadores',
    ],
    equipa: [
        { nome: 'João Santos', cargo: 'Fiscal Chefe', anos: 8 },
        { nome: 'Maria Silva', cargo: 'Fiscal Sénior', anos: 5 },
        { nome: 'Pedro Costa', cargo: 'Fiscal Júnior', anos: 2 },
    ],
    infracoes: [
        { descricao: 'Pesca sem licença', multa: '150.000 Kz', status: 'Processando', gravidade: 'Grave' },
        { descricao: 'Uso de rede proibida', multa: '75.000 Kz', status: 'Resolvida', gravidade: 'Média' },
        { descricao: 'Captura de espécie protegida', multa: '300.000 Kz', status: 'Em análise', gravidade: 'Muito Grave' },
    ],
    evidencias: [
        { nome: 'Rede apreendida', tipo: 'Foto', data: '2024-07-02', tamanho: '2.4 MB' },
        { nome: 'Captura ilegal', tipo: 'Vídeo', data: '2024-07-02', tamanho: '15.8 MB' },
        { nome: 'Auto de infração', tipo: 'Documento', data: '2024-07-03', tamanho: '0.8 MB' },
    ]
  },
  { id: 'ATV-002', title: 'Atualização do Sistema Integrado de Gestão', responsible: 'Técnico B', startDate: '12/07/2024', endDate: '12/07/2024', status: 'Em Curso', priority: 'Alta', planoAcaoId: 'PA-01' },
  { id: 'ATV-003', title: 'Formação de utilizadores para o novo módulo de relatórios', responsible: 'Gestor 1', startDate: '15/07/2024', endDate: '17/07/2024', status: 'Planeada', priority: 'Média', planoAcaoId: 'PA-01' },
  { id: 'ATV-004', title: 'Relatório mensal de atividades operacionais', responsible: 'Gestor 2', startDate: '20/07/2024', endDate: '25/07/2024', status: 'Planeada', priority: 'Baixa' },
  { 
    id: 'ATV-005', 
    title: 'Verificação de backups e integridade dos dados', 
    responsible: 'Técnico A', 
    startDate: '08/07/2024', 
    endDate: '08/07/2024', 
    status: 'Concluída', 
    priority: 'Média',
    province: 'Luanda (Central)',
    vessel: 'N/A',
    type: 'Técnica/IT',
    coordinates: 'N/A',
    infractions: 0,
    reportId: 'REL-ATV-005',
    reportUrl: samplePdfDataUri,
    objectives: [
      'Assegurar a integridade dos backups diários do sistema SIG-GMA',
      'Executar testes de restauração de dados',
    ],
    equipa: [
        { nome: 'António Freire', cargo: 'Técnico de IT Sénior', anos: 6 },
    ],
    infracoes: [],
    evidencias: []
  },
  { 
    id: 'ATV-006', 
    title: 'Patrulha de rotina na Baía de Luanda', 
    responsible: 'Chefe de Equipa Bravo', 
    startDate: '10/07/2024', 
    endDate: '10/07/2024', 
    status: 'Concluída', 
    priority: 'Média',
    province: 'Luanda',
    vessel: 'Lancha Rápida II',
    type: 'Marítima',
    coordinates: '-8.8° S, 13.2° E',
    infractions: 1,
    reportId: 'REL-ATV-006',
    reportUrl: samplePdfDataUri,
    objectives: ['Verificar documentação de embarcações de recreio', 'Monitorizar atividade de pesca artesanal'],
    equipa: [{ nome: 'Carlos Mendes', cargo: 'Fiscal', anos: 4 }],
    infracoes: [{ descricao: 'Falta de coletes salva-vidas', multa: '25.000 Kz', status: 'Resolvida', gravidade: 'Média' }],
    evidencias: []
  },
  { 
    id: 'ATV-007', 
    title: 'Inspeção a unidades de processamento de pescado', 
    responsible: 'Dra. Sofia Lima', 
    startDate: '22/07/2024', 
    endDate: '24/07/2024', 
    status: 'Planeada', 
    priority: 'Alta',
    province: 'Benguela',
    vessel: 'N/A',
    type: 'Terrestre',
    coordinates: '12.57° S, 13.4° E',
    infractions: 0,
    planoAcaoId: 'PA-02',
    objectives: ['Verificar condições higieno-sanitárias', 'Analisar conformidade com as normas de exportação'],
    equipa: [],
    infracoes: [],
    evidencias: []
  },
  { 
    id: 'ATV-008', 
    title: 'Monitorização de Área Marinha Protegida', 
    responsible: 'Biólogo Chefe', 
    startDate: '29/07/2024', 
    endDate: '02/08/2024', 
    status: 'Planeada', 
    priority: 'Média',
    province: 'Namibe',
    vessel: 'Navio de Investigação',
    type: 'Científica',
    coordinates: '15.16° S, 12.15° E',
    infractions: 0,
    objectives: ['Coleta de amostras de água', 'Observação de mamíferos marinhos', 'Verificação de atividades ilegais na área'],
    equipa: [],
    infracoes: [],
    evidencias: []
  },
  {
    id: 'ATV-009',
    title: 'Planeamento Estratégico Anual 2025',
    responsible: 'Direção Geral',
    startDate: '15/01/2025',
    endDate: '20/01/2025',
    status: 'Planeada',
    priority: 'Alta',
    province: 'Luanda',
    vessel: 'N/A',
    type: 'Administrativa',
    coordinates: 'N/A',
    infractions: 0,
    planoAcaoId: 'PA-01',
    objectives: ['Definir metas e objetivos para 2025', 'Alinhar estratégias interdepartamentais'],
    equipa: [],
    infracoes: [],
    evidencias: []
  },
  {
    id: 'ATV-010',
    title: 'Formação em Primeiros Socorros',
    responsible: 'Recursos Humanos',
    startDate: '03/02/2025',
    endDate: '05/02/2025',
    status: 'Planeada',
    priority: 'Média',
    province: 'Benguela',
    vessel: 'N/A',
    type: 'Formação',
    coordinates: 'N/A',
    infractions: 0,
    objectives: ['Capacitar 20 colaboradores em suporte básico de vida'],
    equipa: [],
    infracoes: [],
    evidencias: []
  },
];

const StatCard: React.FC<{
  icon: React.ElementType;
  title: string;
  value: string;
  subtitle: string;
}> = ({ icon: Icon, title, value, subtitle }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-center justify-between">
        <div>
            <p className="text-base font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
        </div>
        <Icon className="h-6 w-6 text-gray-400" />
    </div>
);

const statusColors: { [key: string]: string } = {
  'Concluída': 'bg-green-100 text-green-800',
  'Em Curso': 'bg-blue-100 text-blue-800',
  'Planeada': 'bg-yellow-100 text-yellow-800',
  'Em Andamento': 'bg-sky-100 text-sky-800',
};

const priorityColors: { [key: string]: string } = {
    'Alta': 'bg-red-100 text-red-800',
    'Média': 'bg-orange-100 text-orange-800',
    'Baixa': 'bg-gray-100 text-gray-800',
  };


const ActivitiesListView: React.FC<{
    onView: (activity: any) => void;
    activities: typeof mockActivities;
    setActivities: React.Dispatch<React.SetStateAction<typeof mockActivities>>;
    onDelete: (activity: any) => void;
    planos: typeof mockPlanosData;
}> = ({ onView, activities, setActivities, onDelete, planos }) => {
    const [statusFilter, setStatusFilter] = useState('Todos');
    const navigate = useNavigate();

    const handleConcluirAtividade = (activityId: string) => {
        setActivities(currentActivities => 
            currentActivities.map(activity => 
                activity.id === activityId 
                    ? { ...activity, status: 'Concluída' } 
                    : activity
            )
        );
    };

    const handleProsseguirAtividade = (activityId: string) => {
        setActivities(currentActivities => 
            currentActivities.map(activity => 
                activity.id === activityId 
                    ? { ...activity, status: 'Em Curso' } 
                    : activity
            )
        );
    };

    const filteredActivities = activities.filter(activity => 
        statusFilter === 'Todos' || activity.status === statusFilter
    );

    const handleExportCSV = () => {
        if (filteredActivities.length === 0) {
          alert("Não há dados para exportar com os filtros atuais.");
          return;
        }

        const headers = ["ID", "Título", "Responsável", "Data de Início", "Data de Fim", "Estado", "Prioridade", "Província", "Tipo de meio", "Tipo"];
        
        const escapeCSV = (value: any): string => {
          const strValue = String(value ?? '');
          if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
            return `"${strValue.replace(/"/g, '""')}"`;
          }
          return strValue;
        };

        const csvContent = [
          headers.join(','),
          ...filteredActivities.map(act => [
            escapeCSV(act.id),
            escapeCSV(act.title),
            escapeCSV(act.responsible),
            escapeCSV(act.startDate),
            escapeCSV(act.endDate),
            escapeCSV(act.status),
            escapeCSV(act.priority),
            escapeCSV(act.province),
            escapeCSV(act.vessel),
            escapeCSV(act.type)
          ].join(','))
        ].join('\n');

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "atividades.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    const handleExportPDF = () => {
        if (filteredActivities.length === 0) {
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
        doc.text("Lista de Atividades", 110, 17);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-AO')}`, 15, 30);
    
        // Table
        (doc as any).autoTable({
            startY: 40,
            head: [['Título', 'Responsável', 'Período', 'Prioridade', 'Estado']],
            body: filteredActivities.map(act => [
                act.title,
                act.responsible,
                `${act.startDate} - ${act.endDate}`,
                act.priority,
                act.status
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
        
        doc.save('atividades.pdf');
    };

    return (
        <div className="bg-white p-6 md:p-12 rounded-lg border border-gray-200">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-bold text-gray-800">Lista de Atividades</h3>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="status-filter" className="text-base font-medium text-gray-700">Estado:</label>
                        <select 
                            id="status-filter" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option>Todos</option>
                            <option>Planeada</option>
                            <option>Em Curso</option>
                            <option>Em Andamento</option>
                            <option>Concluída</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="bg-white border border-gray-300 text-gray-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
                    </button>
                    <button 
                        onClick={handleExportPDF}
                        className="bg-white border border-gray-300 text-gray-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                        <File className="h-4 w-4 mr-2" /> Exportar PDF
                    </button>
                     <button 
                        onClick={handleExportCSV}
                        className="bg-white border border-gray-300 text-gray-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                        <File className="h-4 w-4 mr-2" /> Exportar CSV
                    </button>
                </div>
            </div>

            <div className="w-full">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredActivities.map(activity => {
                            const plano = activity.planoAcaoId ? planos.find(p => p.id === activity.planoAcaoId) : null;
                            return (
                                <tr key={activity.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-base font-medium text-gray-900 truncate max-w-xs" title={activity.title}>{activity.title}</div>
                                        {plano && (
                                            <div className="flex items-center mt-1 text-xs text-indigo-600 font-semibold">
                                                <ClipboardCheck size={12} className="mr-1.5" />
                                                {plano.title}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-base text-gray-500">{activity.responsible}</td>
                                    <td className="px-6 py-4 text-base text-gray-500">{activity.startDate} - {activity.endDate}</td>
                                    <td className="px-6 py-4 text-center text-base">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[activity.priority]}`}>
                                            {activity.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-base">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[activity.status]}`}>
                                            {activity.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-base font-medium text-center">
                                        <div className="flex justify-center items-center space-x-3">
                                            <button onClick={() => onView(activity)} className="text-gray-500 hover:text-blue-700" title="Visualizar"><Eye className="h-5 w-5" /></button>
                                            {activity.status === 'Planeada' && (
                                                <button onClick={() => handleProsseguirAtividade(activity.id)} className="text-blue-600 hover:text-blue-900" title="Prosseguir"><PlayCircle className="h-5 w-5" /></button>
                                            )}
                                            {(activity.status === 'Em Andamento' || activity.status === 'Em Curso') && (
                                                <>
                                                    <button onClick={() => navigate(`/atividades/${activity.id}/relatorio`)} className="text-indigo-600 hover:text-indigo-900" title="Editar Relatório"><Edit className="h-5 w-5" /></button>
                                                    <button onClick={() => handleConcluirAtividade(activity.id)} className="text-green-600 hover:text-green-900" title="Concluir"><CheckCircle className="h-5 w-5" /></button>
                                                </>
                                            )}
                                            <button onClick={() => onDelete(activity)} className="text-red-600 hover:text-red-900" title="Eliminar"><Trash2 className="h-5 w-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const CalendarView: React.FC<{ activities: typeof mockActivities, onView: (activity: any) => void }> = ({ activities, onView }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [statusFilter, setStatusFilter] = useState('Todos');
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const availableYears = React.useMemo(() => {
        const years = new Set(activities.map(act => {
            if (!act.startDate) return null;
            const parts = act.startDate.split('/');
            return parts.length === 3 ? parseInt(parts[2], 10) : null;
        }).filter(Boolean));
        
        const currentSystemYear = new Date().getFullYear();
        years.add(currentSystemYear);
        
        // FIX: The sort method's callback parameters `a` and `b` might not be inferred as numbers,
        // causing a TypeScript error. Explicitly casting them to `Number` ensures the subtraction is valid.
        return Array.from(years).sort((a, b) => Number(a) - Number(b));
    }, [activities]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = parseInt(e.target.value, 10);
        setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarDays = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="border border-gray-200 rounded-md h-32"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const currentCalendarDate = new Date(year, month, day);
        // Normalize to ignore time and timezone
        currentCalendarDate.setHours(0, 0, 0, 0);

        const activitiesOnThisDay = activities.filter(act => {
             if (!act.startDate || !act.endDate) return false;
            
            const [startDay, startMonth, startYear] = act.startDate.split('/').map(Number);
            const [endDay, endMonth, endYear] = act.endDate.split('/').map(Number);

            const activityStartDate = new Date(startYear, startMonth - 1, startDay);
            const activityEndDate = new Date(endYear, endMonth - 1, endDay);
            activityStartDate.setHours(0,0,0,0);
            activityEndDate.setHours(0,0,0,0);

            const isInDateRange = currentCalendarDate >= activityStartDate && currentCalendarDate <= activityEndDate;
            const matchesStatus = statusFilter === 'Todos' || act.status === statusFilter;

            return isInDateRange && matchesStatus;
        });

        calendarDays.push(
            <div key={day} className="border border-gray-200 rounded-md h-32 p-2 text-base overflow-y-auto flex flex-col">
                <span className="font-semibold text-gray-700 self-start">{day}</span>
                 <div className="flex-grow space-y-1 mt-1">
                    {activitiesOnThisDay.map(activity => {
                        const isCompleted = activity.status === 'Concluída' && (activity as any).reportId;
                        const displayText = isCompleted ? `Rel: ${(activity as any).reportId}` : activity.title;
                        const itemClassName = isCompleted 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200';

                        return (
                             <div 
                                key={activity.id} 
                                onClick={() => onView(activity)}
                                className={`text-sm font-semibold rounded px-2 py-1 truncate cursor-pointer ${itemClassName}`} 
                                title={activity.title}
                            >
                                {displayText}
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
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                    >
                        <option value="Todos">Todos os Estados</option>
                        <option value="Planeada">Planeada</option>
                        <option value="Em Curso">Em Curso</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Concluída">Concluída</option>
                    </select>
                    <select
                        value={currentDate.getFullYear()}
                        onChange={handleYearChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
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

const ReportsView: React.FC<{ 
    activities: typeof mockActivities;
    onViewPdf: (url: string, title: string) => void;
}> = ({ activities, onViewPdf }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter for activities that are completed and have a report ID.
    const reports = activities.filter(act => act.status === 'Concluída' && (act as any).reportId);
    
    const totalPages = Math.ceil(reports.length / itemsPerPage);
    const paginatedReports = reports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    
    const handleExportListPDF = () => {
        if (reports.length === 0) {
          alert("Não há relatórios para exportar.");
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
        doc.text("Relatórios de Atividades", 110, 17);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-AO')}`, 15, 30);
    
        // Table
        (doc as any).autoTable({
            startY: 40,
            head: [['Atividade', 'ID do Relatório', 'Data de Conclusão']],
            body: reports.map(report => [
                (report as any).title,
                (report as any).reportId,
                (report as any).endDate
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
        
        doc.save('relatorios_de_atividades.pdf');
    };

    return (
        <div className="bg-white p-6 md:p-12 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-800">Relatórios de Atividades</h3>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onViewPdf(samplePdfDataUri, 'Exemplo de Relatório PDF')}
                        className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-base font-semibold py-2 px-3 rounded-lg transition-colors flex items-center"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        Exemplo PDF
                    </button>
                    <button 
                        onClick={handleExportListPDF}
                        className="bg-white border border-gray-300 text-gray-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                        <File className="h-4 w-4 mr-2" /> Exportar Lista PDF
                    </button>
                </div>
            </div>
            <div className="w-full">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atividade</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID do Relatório</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Conclusão</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedReports.map(report => (
                            <tr key={(report as any).reportId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-base font-medium text-gray-900 truncate max-w-xs" title={(report as any).title}>{(report as any).title}</td>
                                <td className="px-6 py-4 text-base text-gray-500">{(report as any).reportId}</td>
                                <td className="px-6 py-4 text-base text-gray-500">{(report as any).endDate}</td>
                                <td className="px-6 py-4 text-base text-center">
                                    <button 
                                        onClick={() => onViewPdf((report as any).reportUrl, `Relatório: ${(report as any).title}`)}
                                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-bold py-2 px-3 rounded-lg flex items-center justify-center transition-colors duration-200"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        Visualizar PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {reports.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        <p>Não existem relatórios de atividades concluídas para exibir.</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <span className="text-base text-gray-700">
                        Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
                    </span>
                    <div className="inline-flex">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-base font-medium text-gray-500 bg-white border-t border-b border-r border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AtividadesPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('atividades');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
    const [activities, setActivities] = useState(mockActivities);
    const [pdfViewerState, setPdfViewerState] = useState({ isOpen: false, url: '', title: '' });
    const [activityToDelete, setActivityToDelete] = useState<any | null>(null);
    const navigate = useNavigate();

    const handleAddActivity = (newActivityData: any) => {
        const newActivity = {
            ...newActivityData,
            id: `ATV-${String(activities.length + 1).padStart(3, '0')}`,
            status: 'Planeada',
        };
        setActivities(current => [newActivity, ...current]);
    };

    const stats = [
        { title: 'Atividades Em Curso', value: activities.filter(a => a.status === 'Em Curso' || a.status === 'Em Andamento').length.toString(), subtitle: 'Trabalho a decorrer', icon: Clock },
        { title: 'Atividades Planeadas', value: activities.filter(a => a.status === 'Planeada').length.toString(), subtitle: 'Aguardando início', icon: ListTodo },
        { title: 'Atividades Concluídas', value: activities.filter(a => a.status === 'Concluída').length.toString(), subtitle: 'Este mês', icon: CheckCircle },
        { title: 'Prioridade Alta', value: activities.filter(a => a.priority === 'Alta').length.toString(), subtitle: 'Atividades urgentes', icon: AlertTriangle }
    ];

    const tabs = [
        { id: 'atividades', label: 'Lista de Atividades' },
        { id: 'calendário', label: 'Calendário' },
        { id: 'relatórios', label: 'Relatórios' }
    ];
    
    const handleViewActivity = (activity: any, source: 'list' | 'calendar') => {
        setSelectedActivity({ ...activity, source });
        setIsViewModalOpen(true);
    };
    
    const handleOpenDeleteModal = (activity: any) => {
        setActivityToDelete(activity);
    };

    const handleConfirmDelete = () => {
        if (activityToDelete) {
            setActivities(acts => acts.filter(a => a.id !== activityToDelete.id));
            setActivityToDelete(null);
        }
    };

    const handleOpenPdfViewer = (url: string, title: string) => {
        setPdfViewerState({ isOpen: true, url, title });
    };

    const handleClosePdfViewer = () => {
        setPdfViewerState({ isOpen: false, url: '', title: '' });
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Módulo de Atividades</h1>
                <p className="text-gray-600">Registe, acompanhe e controle as atividades técnicas e operacionais.</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Nova Atividade
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map(stat => (
                    <StatCard 
                        key={stat.title} 
                        icon={stat.icon} 
                        title={stat.title}
                        value={stat.value}
                        subtitle={stat.subtitle}
                    />
                ))}
            </div>

            <div className="w-full sm:w-auto bg-gray-100 rounded-lg p-1 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 mb-6">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full px-6 py-2 text-base font-semibold rounded-md transition-colors duration-200 text-center ${
                            activeTab === tab.id ? 'bg-white text-gray-800 shadow' : 'bg-transparent text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            
            <div>
                {activeTab === 'atividades' && <ActivitiesListView onView={(act) => handleViewActivity(act, 'list')} activities={activities} setActivities={setActivities} onDelete={handleOpenDeleteModal} planos={mockPlanosData} />}
                {activeTab === 'calendário' && <CalendarView activities={activities} onView={(act) => handleViewActivity(act, 'calendar')} />}
                {activeTab === 'relatórios' && <ReportsView activities={activities} onViewPdf={handleOpenPdfViewer} />}
            </div>

            <Suspense fallback={null}>
                <NovaAtividadeModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleAddActivity} planosDeAcao={mockPlanosData} />
                <DetalheAtividadeModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} activity={selectedActivity} planos={mockPlanosData} />
                <PdfViewerModal 
                    isOpen={pdfViewerState.isOpen}
                    onClose={handleClosePdfViewer}
                    pdfUrl={pdfViewerState.url}
                    title={pdfViewerState.title}
                />
                <ConfirmationModal
                    isOpen={!!activityToDelete}
                    onClose={() => setActivityToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    title="Confirmar Exclusão de Atividade"
                    message={`Tem a certeza que deseja excluir a atividade "${activityToDelete?.title}"? Esta ação não pode ser desfeita.`}
                />
            </Suspense>
        </div>
    );
};

export default AtividadesPage;