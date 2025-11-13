import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, FileText, BarChart2, ListChecks, AlertTriangle, Target, Calendar, RefreshCw, Paperclip, Upload, Trash2 } from 'lucide-react';

// Mock data copied from other modules to simulate data fetching based on date range.
// In a real application, this would come from an API call.
const mockActivitiesData = [
    { id: 'ATV-001', startDate: '01/07/2024', endDate: '05/07/2024', infractions: 3 },
    { id: 'ATV-002', startDate: '12/07/2024', endDate: '12/07/2024', infractions: 0 },
    { id: 'ATV-003', startDate: '15/07/2024', endDate: '17/07/2024', infractions: 0 },
    { id: 'ATV-004', startDate: '20/07/2024', endDate: '25/07/2024', infractions: 1 },
    { id: 'ATV-005', startDate: '08/07/2024', endDate: '08/07/2024', status: 'Concluída', infractions: 0 },
    { id: 'ATV-006', startDate: '10/06/2024', endDate: '10/06/2024', status: 'Concluída', infractions: 1 },
    { id: 'ATV-007', startDate: '22/08/2024', endDate: '24/08/2024', status: 'Planeada', infractions: 0 },
];

const mockProjectsData = [
  { id: 'PROJ-01', status: 'Concluído', dueDate: '2024-06-30' },
  { id: 'PROJ-02', status: 'Em Execução', dueDate: '2024-08-15' },
  { id: 'PROJ-03', status: 'Em Execução', dueDate: '2024-09-01' },
  { id: 'PROJ-04', status: 'Planeado', dueDate: '2024-10-20' },
  { id: 'PROJ-05', status: 'Planeado', dueDate: '2024-11-05' },
  { id: 'PROJ-06', status: 'Concluído', dueDate: '2024-05-20' },
];


const CriarRelatorioPage: React.FC = () => {
  const navigate = useNavigate();
  const { reportId } = useParams<{ reportId: string }>();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!reportId;
  const existingReport = location.state?.report;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const monthMap: Record<string, string> = {
    'Janeiro': '1', 'Fevereiro': '2', 'Março': '3', 'Abril': '4', 'Maio': '5', 'Junho': '6',
    'Julho': '7', 'Agosto': '8', 'Setembro': '9', 'Outubro': '10', 'Novembro': '11', 'Dezembro': '12'
  };

  // Form state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState<string>(String(new Date().getMonth() + 1));
  const [year, setYear] = useState<string>(String(currentYear));
  const [summary, setSummary] = useState('');
  const [kpiMissions, setKpiMissions] = useState('');
  const [kpiInfractions, setKpiInfractions] = useState('');
  const [kpiProjects, setKpiProjects] = useState('');
  const [activitiesSummary, setActivitiesSummary] = useState('');
  const [challenges, setChallenges] = useState('');
  const [nextMonthPlan, setNextMonthPlan] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    if (isEditMode && existingReport) {
      const [reportMonthName, reportYear] = existingReport.month.split('/');
      setMonth(monthMap[reportMonthName] || '');
      setYear(reportYear || '');
      setSummary(existingReport.summary || '');
      setKpiMissions(existingReport.kpiMissions || '');
      setKpiInfractions(existingReport.kpiInfractions || '');
      setKpiProjects(existingReport.kpiProjects || '');
      setActivitiesSummary(existingReport.activitiesSummary || '');
      setChallenges(existingReport.challenges || '');
      setNextMonthPlan(existingReport.nextMonthPlan || '');
      // Note: attachments are not loaded in edit mode for this simulation
    }
  }, [isEditMode, existingReport]);

  const parseDate = (dateString: string): Date => {
    if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    }
    // Handles 'YYYY-MM-DD'
    const parts = dateString.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  };

  const handleLoadData = () => {
    if (!startDate || !endDate) {
        alert("Por favor, selecione as datas de início e fim do período.");
        return;
    }

    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    // --- Calculate KPIs from mock data ---
    
    // 1. Missions and Infractions
    const relevantActivities = mockActivitiesData.filter(act => {
        const actStart = parseDate(act.startDate);
        const actEnd = parseDate(act.endDate);
        return actStart <= end && actEnd >= start; // Check for overlap
    });

    const totalMissions = relevantActivities.length;
    const totalInfractions = relevantActivities.reduce((sum, act) => sum + (act.infractions || 0), 0);
    
    // 2. Completed Projects
    const completedProjects = mockProjectsData.filter(proj => {
        if (proj.status !== 'Concluído') return false;
        const projEnd = parseDate(proj.dueDate);
        return projEnd >= start && projEnd <= end;
    });
    
    const totalProjects = completedProjects.length;

    // Update state
    setKpiMissions(String(totalMissions));
    setKpiInfractions(String(totalInfractions));
    setKpiProjects(String(totalProjects));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveAttachment = (indexToRemove: number) => {
    setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving report with attachments:", attachments.map(f => f.name));
    if (isEditMode) {
      alert(`Relatório ${reportId} atualizado com sucesso! (Simulação)`);
    } else {
      alert('Relatório salvo com sucesso! (Simulação)');
    }
    navigate('/relatorios');
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{isEditMode ? 'Editar Relatório Mensal' : 'Criar Novo Relatório Mensal'}</h1>
          <p className="text-gray-600">{isEditMode ? `A editar o relatório ${existingReport.id} - ${existingReport.month}` : 'Preencha as secções abaixo para gerar o relatório.'}</p>
        </div>
        <button
          onClick={() => navigate('/relatorios')}
          className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg flex items-center transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Relatórios
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Período */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                Período do Relatório
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div>
                    <label htmlFor="startDate" className="block text-base font-medium text-gray-700">Data de Início</label>
                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-base font-medium text-gray-700">Data de Fim</label>
                    <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" />
                </div>
                <button
                    type="button"
                    onClick={handleLoadData}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Carregar Dados
                </button>
            </div>
        </div>

        {/* Identificação */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-3 text-gray-500" />
            Identificação do Relatório
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="month" className="block text-base font-medium text-gray-700">Mês</label>
              <select id="month" value={month} onChange={e => setMonth(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base">
                {months.map((monthName, index) => (
                  <option key={index} value={index + 1}>{monthName}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year" className="block text-base font-medium text-gray-700">Ano</label>
              <select id="year" value={year} onChange={e => setYear(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base">
                {years.map(yearValue => (
                  <option key={yearValue} value={yearValue}>{yearValue}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resumo Executivo */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Resumo Executivo</h3>
          <textarea
            rows={4}
            value={summary}
            onChange={e => setSummary(e.target.value)}
            placeholder="Forneça uma visão geral dos principais acontecimentos e resultados do mês..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
          />
        </div>
        
        {/* Indicadores Chave */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <BarChart2 className="h-5 w-5 mr-3 text-gray-500" />
            Indicadores Chave (KPIs)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="kpi-missions" className="block text-base font-medium text-gray-700">Nº de Missões Realizadas</label>
              <input type="number" id="kpi-missions" value={kpiMissions} onChange={e => setKpiMissions(e.target.value)} placeholder="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base bg-gray-50" />
            </div>
            <div>
              <label htmlFor="kpi-infractions" className="block text-base font-medium text-gray-700">Nº de Infrações Registadas</label>
              <input type="number" id="kpi-infractions" value={kpiInfractions} onChange={e => setKpiInfractions(e.target.value)} placeholder="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base bg-gray-50" />
            </div>
            <div>
              <label htmlFor="kpi-projects" className="block text-base font-medium text-gray-700">Nº de Projetos Concluídos</label>
              <input type="number" id="kpi-projects" value={kpiProjects} onChange={e => setKpiProjects(e.target.value)} placeholder="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base bg-gray-50" />
            </div>
          </div>
        </div>

        {/* Resumo das Atividades */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <ListChecks className="h-5 w-5 mr-3 text-gray-500" />
            Resumo das Atividades
          </h3>
          <textarea
            rows={5}
            value={activitiesSummary}
            onChange={e => setActivitiesSummary(e.target.value)}
            placeholder="Detalhe as principais atividades operacionais, administrativas e de fiscalização realizadas no período..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
          />
        </div>
        
        {/* Desafios e Impedimentos */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3 text-gray-500" />
            Desafios e Impedimentos
          </h3>
          <textarea
            rows={3}
            value={challenges}
            onChange={e => setChallenges(e.target.value)}
            placeholder="Descreva quaisquer desafios, problemas ou impedimentos encontrados durante o mês..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
          />
        </div>

        {/* Plano para o Próximo Mês */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-3 text-gray-500" />
            Plano para o Próximo Mês
          </h3>
          <textarea
            rows={4}
            value={nextMonthPlan}
            onChange={e => setNextMonthPlan(e.target.value)}
            placeholder="Delineie os principais objetivos, atividades e metas planeadas para o próximo mês..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
          />
        </div>
        
        {/* Anexos */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Paperclip className="h-5 w-5 mr-3 text-gray-500" />
            Anexos
          </h3>
          <div className="space-y-4">
            {attachments.length > 0 && (
              <ul className="space-y-3">
                {attachments.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
                    <div className="flex items-center overflow-hidden">
                      <FileText className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700 truncate" title={file.name}>{file.name}</span>
                      <span className="text-sm text-gray-500 ml-2 flex-shrink-0">({(file.size / 1024).toFixed(2)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="p-1.5 rounded-full text-red-500 hover:bg-red-100 flex-shrink-0"
                      title="Remover anexo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg flex items-center transition-colors text-sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Anexar Ficheiro(s)
              </button>
              {attachments.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">Nenhum ficheiro anexado.</p>
              )}
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end space-x-3 pt-4 border-t mt-8">
          <button
            type="button"
            onClick={() => navigate('/relatorios')}
            className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            {isEditMode ? 'Salvar Alterações' : 'Salvar Relatório'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CriarRelatorioPage;