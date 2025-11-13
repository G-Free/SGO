import React, { useState, useMemo, lazy, Suspense } from 'react';
import { Bug, AlertTriangle, CheckCircle, Clock, PlusCircle, Search, Eye, Trash2 } from 'lucide-react';

const NovoBugModal = lazy(() => import('../components/NovoBugModal'));
const DetalheBugModal = lazy(() => import('../components/DetalheBugModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));

const mockBugs = [
  { id: 'BUG-001', description: 'O campo de data não abre o calendário no Safari', module: 'Relatórios', reportedAt: '2024-07-28 11:30', status: 'Em Análise', severity: 'Média' },
  { id: 'BUG-002', description: 'Cálculo do total no balancete está incorreto', module: 'Contabilidade', reportedAt: '2024-07-27 16:00', status: 'Aberto', severity: 'Crítico' },
  { id: 'BUG-003', description: 'Botão de exportar PDF não funciona no módulo de Atividades', module: 'Atividades', reportedAt: '2024-07-26 09:45', status: 'Corrigido', severity: 'Alta' },
  { id: 'BUG-004', description: 'Erro ortográfico na página de login', module: 'Autenticação', reportedAt: '2024-07-25 14:00', status: 'Fechado', severity: 'Baixa' },
];

const severityColors: { [key: string]: string } = {
  'Crítico': 'bg-red-100 text-red-800',
  'Alta': 'bg-orange-100 text-orange-800',
  'Média': 'bg-yellow-100 text-yellow-800',
  'Baixa': 'bg-gray-100 text-gray-800',
};

const statusColors: { [key: string]: string } = {
    'Aberto': 'bg-red-100 text-red-800',
    'Em Análise': 'bg-purple-100 text-purple-800',
    'Corrigido': 'bg-blue-100 text-blue-800',
    'Fechado': 'bg-green-100 text-green-800',
};

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, color: string }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
            <p className="text-base font-medium text-gray-600">{title}</p>
            <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
);

const BugsPage: React.FC = () => {
    const [bugs, setBugs] = useState(mockBugs);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedBug, setSelectedBug] = useState<any | null>(null);
    const [bugToDelete, setBugToDelete] = useState<any | null>(null);

    const handleSave = (data: any) => {
        const newBug = {
            ...data,
            id: `BUG-${String(bugs.length + 1).padStart(3, '0')}`,
            reportedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
            status: 'Aberto'
        };
        setBugs(current => [newBug, ...current]);
    };

    const handleViewDetails = (bug: any) => {
        setSelectedBug(bug);
        setIsDetailsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (bugToDelete) {
            setBugs(current => current.filter(b => b.id !== bugToDelete.id));
            setBugToDelete(null);
        }
    };

    const filteredBugs = useMemo(() => {
        return bugs.filter(b =>
            b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.module.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [bugs, searchTerm]);

    const openBugsCount = bugs.filter(b => b.status === 'Aberto' || b.status === 'Em Análise').length;
    const criticalBugsCount = bugs.filter(b => b.severity === 'Crítico' && (b.status === 'Aberto' || b.status === 'Em Análise')).length;

    return (
        <>
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestão de Bugs</h1>
                        <p className="text-gray-600">Registe, priorize e acompanhe bugs e falhas do sistema.</p>
                    </div>
                     <button onClick={() => setIsCreateModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <PlusCircle className="h-5 w-5 mr-2" /> Reportar Novo Bug
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard icon={Bug} title="Bugs Abertos" value={String(openBugsCount)} color="text-red-500" />
                    <StatCard icon={AlertTriangle} title="Bugs Críticos" value={String(criticalBugsCount)} color="text-orange-500" />
                    <StatCard icon={CheckCircle} title="Corrigidos (Mês)" value="8" color="text-green-500" />
                    <StatCard icon={Clock} title="Pendentes de Validação" value="2" color="text-blue-500" />
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Lista de Bugs Reportados</h3>
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-base" />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Módulo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severidade</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBugs.map(bug => (
                                    <tr key={bug.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetails(bug)}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-700">{bug.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800 max-w-sm truncate">{bug.description}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{bug.module}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${severityColors[bug.severity]}`}>{bug.severity}</span></td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[bug.status]}`}>{bug.status}</span></td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button onClick={(e) => { e.stopPropagation(); handleViewDetails(bug); }} className="p-1.5 rounded-full hover:bg-gray-200" title="Ver Detalhes"><Eye size={16} className="text-gray-600"/></button>
                                                <button onClick={(e) => { e.stopPropagation(); setBugToDelete(bug); }} className="p-1.5 rounded-full hover:bg-red-100" title="Apagar"><Trash2 size={16} className="text-red-600"/></button>
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
                <NovoBugModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleSave} />
                <DetalheBugModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} bug={selectedBug} />
                <ConfirmationModal isOpen={!!bugToDelete} onClose={() => setBugToDelete(null)} onConfirm={handleConfirmDelete} title="Confirmar Exclusão" message={`Deseja realmente remover o bug "${bugToDelete?.id}"?`}/>
            </Suspense>
        </>
    );
};

export default BugsPage;