import React, { useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Trash2, File, AlertOctagon, FileText, MapPin, Calendar, Ship, User, Users, ListChecks, ClipboardCheck } from 'lucide-react';
import { useNotification } from '../components/Notification';
import { samplePdfDataUri } from '../data/sample-report';

const PdfViewerModal = lazy(() => import('../components/PdfViewerModal'));

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
        { nome: 'João Santos', cargo: 'Fiscal Chefe' },
        { nome: 'Maria Silva', cargo: 'Fiscal Sénior' },
        { nome: 'Pedro Costa', cargo: 'Fiscal Júnior' },
    ],
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
    planoAcaoId: 'PA-02',
  },
];

const CriarRelatorioAtividadePage: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  
  const [summary, setSummary] = useState('');
  const [infractions, setInfractions] = useState([{ description: '', fine: '', status: 'Pendente' }]);
  const [evidence, setEvidence] = useState([{ name: '', type: 'Foto', file: null }]);
  const [pdfViewerState, setPdfViewerState] = useState({ isOpen: false, url: '', title: '' });

  const activity = mockActivities.find(a => a.id === activityId);
  const planoDeAcao = activity?.planoAcaoId ? mockPlanosData.find(p => p.id === activity.planoAcaoId) : null;

  if (!activity) {
    return (
        <div className="flex flex-col items-center justify-center h-64">
            <AlertOctagon className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Atividade não encontrada</h2>
            <p className="text-gray-600 mt-2">A atividade que está a tentar aceder não existe.</p>
            <button
                onClick={() => navigate('/atividades')}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
                Voltar para Atividades
            </button>
        </div>
    );
  }

  const handleAddInfraction = () => {
    setInfractions([...infractions, { description: '', fine: '', status: 'Pendente' }]);
  };

  const handleRemoveInfraction = (index: number) => {
    const newInfractions = infractions.filter((_, i) => i !== index);
    setInfractions(newInfractions);
  };
  
  const handleAddEvidence = () => {
    setEvidence([...evidence, { name: '', type: 'Foto', file: null }]);
  }

  const handleRemoveEvidence = (index: number) => {
    const newEvidence = evidence.filter((_, i) => i !== index);
    setEvidence(newEvidence);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      activityId,
      summary,
      infractions,
      evidence,
    });
    addNotification('Relatório salvo e gerado com sucesso!', 'success', 'Relatório Gerado');
    setPdfViewerState({
        isOpen: true,
        url: samplePdfDataUri,
        title: `Relatório da Missão: ${activity.title}`
    });
  };
  
  const handleClosePdfViewer = () => {
      setPdfViewerState({ isOpen: false, url: '', title: '' });
      navigate('/atividades');
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Relatório da Missão: {activity.title}</h1>
          <p className="text-gray-600">Preencha os detalhes da missão para finalizar o relatório.</p>
        </div>
        <button
          onClick={() => navigate('/atividades')}
          className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg flex items-center transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Atividades
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Informações da Missão</h3>
            <div className="space-y-3 text-base">
                <div className="flex items-center"><MapPin className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0"/><span className="font-semibold text-gray-700 mr-2">Província:</span> {activity.province}</div>
                <div className="flex items-center"><Calendar className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0"/><span className="font-semibold text-gray-700 mr-2">Período:</span> {activity.startDate} a {activity.endDate}</div>
                <div className="flex items-center"><Ship className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0"/><span className="font-semibold text-gray-700 mr-2">Tipo de meio:</span> {activity.vessel}</div>
                <div className="flex items-center"><User className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0"/><span className="font-semibold text-gray-700 mr-2">Responsável:</span> {activity.responsible}</div>
                {planoDeAcao && (
                  <div className="flex items-center">
                    <ClipboardCheck className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0"/>
                    <span className="font-semibold text-gray-700 mr-2">Plano de Ação:</span> {planoDeAcao.title}
                  </div>
                )}
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Equipa Envolvida</h3>
            <div className="space-y-3">
            {activity.equipa?.length > 0 ? (
                activity.equipa.map((membro, index) => (
                <div key={index} className="flex items-center bg-gray-50 p-2 rounded-md border">
                    <Users className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0"/>
                    <div>
                    <p className="text-base font-semibold text-gray-800">{membro.nome}</p>
                    <p className="text-sm text-gray-600">{membro.cargo}</p>
                    </div>
                </div>
                ))
            ) : (
                <p className="text-base text-gray-500">Nenhuma equipa registada para esta missão.</p>
            )}
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <ListChecks className="h-5 w-5 mr-3 text-gray-500"/>
            Objetivos da Missão
          </h3>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700 pl-2">
            {activity.objectives?.length > 0 ? (
              activity.objectives.map((obj, index) => (
                <li key={index}>{obj}</li>
              ))
            ) : (
              <li className="list-none text-gray-500">Nenhum objetivo definido para esta missão.</li>
            )}
          </ul>
      </div>


      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Resumo da Missão */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Resumo e Conclusões</h3>
            <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={5}
                placeholder="Descreva o resumo dos acontecimentos, desafios encontrados e as conclusões da missão..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
            />
        </div>
        
        {/* Infrações */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Infrações Registadas</h3>
                <button type="button" onClick={handleAddInfraction} className="flex items-center bg-blue-100 text-blue-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-blue-200">
                    <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Infração
                </button>
            </div>
            <div className="space-y-4">
                {infractions.map((inf, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center p-3 border rounded-md">
                        <input type="text" placeholder="Descrição da infração" className="md:col-span-4 block w-full rounded-md border-gray-300 sm:text-base" />
                        <input type="text" placeholder="Valor da coima (Kz)" className="md:col-span-2 block w-full rounded-md border-gray-300 sm:text-base" />
                        <select className="md:col-span-1 block w-full rounded-md border-gray-300 sm:text-base">
                            <option>Pendente</option>
                            <option>Paga</option>
                            <option>Em disputa</option>
                        </select>
                        <button type="button" onClick={() => handleRemoveInfraction(index)} className="md:col-span-1 text-red-500 hover:text-red-700 justify-self-end">
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Evidências */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Evidências Coletadas</h3>
                <button type="button" onClick={handleAddEvidence} className="flex items-center bg-blue-100 text-blue-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-blue-200">
                    <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Evidência
                </button>
            </div>
            <div className="space-y-4">
                 {evidence.map((ev, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center p-3 border rounded-md">
                        <div className="md:col-span-3 flex items-center">
                            <select className="rounded-l-md border-gray-300 sm:text-base">
                                <option>Foto</option>
                                <option>Documento</option>
                                <option>Vídeo</option>
                            </select>
                            <input type="text" placeholder="Nome da evidência" className="block w-full rounded-r-md border-gray-300 sm:text-base" />
                        </div>
                        <div className="md:col-span-4">
                            <label htmlFor={`file-upload-${index}`} className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-base py-2 px-3 border border-gray-300 rounded-lg cursor-pointer">
                                <File className="h-4 w-4" />
                                <span>Carregar ficheiro...</span>
                            </label>
                            <input id={`file-upload-${index}`} name={`file-upload-${index}`} type="file" className="sr-only" />
                        </div>
                        <button type="button" onClick={() => handleRemoveEvidence(index)} className="md:col-span-1 text-red-500 hover:text-red-700 justify-self-end">
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => navigate('/atividades')} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Salvar Relatório
            </button>
          </div>
      </form>
      <Suspense fallback={null}>
        <PdfViewerModal
            isOpen={pdfViewerState.isOpen}
            onClose={handleClosePdfViewer}
            pdfUrl={pdfViewerState.url}
            title={pdfViewerState.title}
        />
      </Suspense>
    </div>
  );
};

export default CriarRelatorioAtividadePage;