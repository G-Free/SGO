import React, { useState, useMemo, lazy, Suspense, Fragment } from 'react';
import { PlusCircle, File, Search, Edit, Trash2, ClipboardCheck, Clock, CheckCircle, ListFilter, ChevronDown, ChevronRight, List } from 'lucide-react';
import { useNotification } from '../components/Notification';
import { useNavigate } from 'react-router-dom';

const NovoPlanoAcaoModal = lazy(() => import('../components/NovoPlanoAcaoModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));

declare global {
    interface Window { jspdf: any; }
}

const mockPlanosData = [
  { id: 'PA-01', title: 'Modernização Tecnológica das Fronteiras', responsible: 'António Freire', startDate: '2024-01-15', endDate: '2024-12-20', status: 'Em Execução', progress: 60 },
  { id: 'PA-02', title: 'Estratégia de Combate à Imigração Ilegal 2024', responsible: 'Manuel Santos', startDate: '2024-02-01', endDate: '2024-11-30', status: 'Em Execução', progress: 45 },
  { id: 'PA-03', title: 'Formação Contínua dos Agentes', responsible: 'Sofia Lima', startDate: '2024-03-01', endDate: '2024-09-15', status: 'Planeado', progress: 10 },
  { id: 'PA-04', title: 'Auditoria de Processos Internos 2023', responsible: 'Administrador GMA', startDate: '2023-09-01', endDate: '2023-12-15', status: 'Concluído', progress: 100 },
];

// Copied from Atividades.tsx for demonstration purposes
const mockActivities = [
  { id: 'ATV-001', title: 'Fiscalização Costa Norte', status: 'Em Andamento', planoAcaoId: 'PA-02' },
  { id: 'ATV-002', title: 'Atualização do Sistema Integrado de Gestão', status: 'Em Curso', planoAcaoId: 'PA-01' },
  { id: 'ATV-003', title: 'Formação de utilizadores para o novo módulo de relatórios', status: 'Planeada', planoAcaoId: 'PA-01' },
  { id: 'ATV-007', title: 'Inspeção a unidades de processamento de pescado', status: 'Planeada', planoAcaoId: 'PA-02' },
];


const statusColors: { [key: string]: string } = {
  'Concluído': 'bg-green-100 text-green-800',
  'Planeado': 'bg-yellow-100 text-yellow-800',
  'Em Execução': 'bg-blue-100 text-blue-800',
};

const PlanoDeAcaoPage: React.FC = () => {
    const [planos, setPlanos] = useState(mockPlanosData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [planoToDelete, setPlanoToDelete] = useState<any | null>(null);
    const [filters, setFilters] = useState({ searchTerm: '', status: 'Todos' });
    const { addNotification } = useNotification();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSave = (data: any) => {
        const newId = `PA-${String(planos.length + 1).padStart(2, '0')}`;
        setPlanos(current => [{ ...data, id: newId, progress: data.status === 'Planeado' ? 0 : 10 }, ...current]);
        addNotification(`Novo plano "${data.title}" criado.`, 'success', 'Plano de Ação');
    };

    const handleOpenDeleteModal = (plano: any) => setPlanoToDelete(plano);

    const handleConfirmDelete = () => {
        if (planoToDelete) {
            setPlanos(current => current.filter(p => p.id !== planoToDelete.id));
            addNotification(`Plano "${planoToDelete.title}" removido.`, 'success', 'Plano Removido');
            setPlanoToDelete(null);
        }
    };

    const filteredPlanos = useMemo(() => {
        return planos.filter(p =>
            p.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
            (filters.status === 'Todos' || p.status === filters.status)
        );
    }, [planos, filters]);

    const handleExport = (format: 'CSV' | 'PDF') => {
        if (!window.jspdf || !window.jspdf.jsPDF) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        (doc as any).autoTable({
            head: [['ID', 'Título', 'Responsável', 'Estado', 'Progresso']],
            body: filteredPlanos.map(p => [p.id, p.title, p.responsible, p.status, `${p.progress}%`]),
        });
        doc.save('planos_de_acao.pdf');
    };

    return (
        <>
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Plano de Ação e Estratégias</h1>
                        <p className="text-gray-600">Planeje, registe e acompanhe planos de ação coordenados.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <PlusCircle className="h-5 w-5 mr-2" /> Novo Plano
                    </button>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" placeholder="Pesquisar por título..." onChange={e => setFilters(f => ({...f, searchTerm: e.target.value}))} className="md:col-span-2 block w-full rounded-md border-gray-300"/>
                        <select onChange={e => setFilters(f => ({...f, status: e.target.value}))} className="block w-full rounded-md border-gray-300">
                            <option value="Todos">Todos os Estados</option>
                            <option>Planeado</option>
                            <option>Em Execução</option>
                            <option>Concluído</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-3 w-12"></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título do Plano</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">Progresso</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPlanos.map(plano => {
                                const associatedActivities = mockActivities.filter(act => act.planoAcaoId === plano.id);
                                return (
                                <Fragment key={plano.id}>
                                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedId(expandedId === plano.id ? null : plano.id)}>
                                        <td className="px-2 py-4 text-center">
                                            {expandedId === plano.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{plano.title}</div>
                                            <div className="text-sm text-gray-500">{plano.responsible}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{plano.startDate} - {plano.endDate}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[plano.status]}`}>{plano.status}</span></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-full bg-gray-200 rounded-full h-2 mr-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${plano.progress}%` }}></div></div>
                                                <span className="text-sm font-medium text-gray-600">{plano.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button onClick={(e) => e.stopPropagation()} className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-gray-100" title="Editar"><Edit size={16}/></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleOpenDeleteModal(plano); }} className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-gray-100" title="Apagar"><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedId === plano.id && (
                                        <tr className="bg-slate-50">
                                            <td colSpan={6} className="p-4">
                                                <h4 className="font-bold text-gray-700 mb-2 text-base flex items-center"><List className="h-4 w-4 mr-2" />Atividades Associadas ({associatedActivities.length})</h4>
                                                {associatedActivities.length > 0 ? (
                                                    <ul className="space-y-2 pl-6">
                                                        {associatedActivities.map(act => (
                                                            <li key={act.id} className="p-2 border-l-4 border-blue-200 bg-white rounded-r-md flex justify-between items-center">
                                                                <div>
                                                                    <p className="font-semibold text-sm text-gray-800">{act.title}</p>
                                                                    <p className="text-xs text-gray-500">{act.id} - <span className="font-medium">{act.status}</span></p>
                                                                </div>
                                                                <button onClick={() => navigate(`/atividades`)} className="text-blue-600 text-sm font-semibold">Ver Atividade</button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-sm text-gray-500 pl-6">Nenhuma atividade associada a este plano.</p>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
            <Suspense fallback={null}>
                <NovoPlanoAcaoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
                <ConfirmationModal isOpen={!!planoToDelete} onClose={() => setPlanoToDelete(null)} onConfirm={handleConfirmDelete} title="Confirmar Exclusão" message={`Deseja realmente remover o plano "${planoToDelete?.title}"?`} />
            </Suspense>
        </>
    );
};

export default PlanoDeAcaoPage;