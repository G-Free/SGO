import React, { useState, useMemo, lazy, Suspense } from 'react';
import { ShieldAlert, Bug, GanttChartSquare, WifiOff, PlusCircle, Search, Eye, Trash2 } from 'lucide-react';

const NovaAmeacaModal = lazy(() => import('../components/NovaAmeacaModal'));
const DetalheAmeacaModal = lazy(() => import('../components/DetalheAmeacaModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));

const mockThreats = [
  { id: 'THR-001', type: 'Phishing', target: 'colaboradores@sgo.gov.ao', detectedAt: '2024-07-28 10:15', status: 'Mitigado', severity: 'Média' },
  { id: 'THR-002', type: 'Malware', target: 'Servidor WEB-01', detectedAt: '2024-07-27 22:00', status: 'Em Análise', severity: 'Alta' },
  { id: 'THR-003', type: 'Tentativa de Intrusão', target: 'Firewall Externo', detectedAt: '2024-07-28 14:30', status: 'Bloqueado', severity: 'Alta' },
  { id: 'THR-004', type: 'DDoS', target: 'Portal Público', detectedAt: '2024-07-26 09:00', status: 'Mitigado', severity: 'Crítica' },
];

const severityColors: { [key: string]: string } = {
  'Crítica': 'bg-red-100 text-red-800',
  'Alta': 'bg-orange-100 text-orange-800',
  'Média': 'bg-yellow-100 text-yellow-800',
};

const statusColors: { [key: string]: string } = {
    'Mitigado': 'bg-green-100 text-green-800',
    'Bloqueado': 'bg-blue-100 text-blue-800',
    'Em Análise': 'bg-purple-100 text-purple-800',
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

const AmeacasCiberneticasPage: React.FC = () => {
    const [threats, setThreats] = useState(mockThreats);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedThreat, setSelectedThreat] = useState<any | null>(null);
    const [threatToDelete, setThreatToDelete] = useState<any | null>(null);
    
    const handleSave = (data: any) => {
        const newThreat = {
            ...data,
            id: `THR-${String(threats.length + 1).padStart(3, '0')}`,
            detectedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
            status: 'Em Análise'
        };
        setThreats(current => [newThreat, ...current]);
    };

    const handleViewDetails = (threat: any) => {
        setSelectedThreat(threat);
        setIsDetailsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (threatToDelete) {
            setThreats(current => current.filter(t => t.id !== threatToDelete.id));
            setThreatToDelete(null);
        }
    };

    const filteredThreats = useMemo(() => {
        return threats.filter(t =>
            t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.target.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [threats, searchTerm]);

    return (
        <>
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestão de Ameaças Cibernéticas</h1>
                        <p className="text-gray-600">Monitore, analise e responda a ameaças à segurança da informação.</p>
                    </div>
                     <button onClick={() => setIsCreateModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <PlusCircle className="h-5 w-5 mr-2" /> Registar Ameaça
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard icon={Bug} title="Ameaças em Análise" value={String(threats.filter(t => t.status === 'Em Análise').length)} color="text-purple-500" />
                    <StatCard icon={ShieldAlert} title="Ameaças Altas/Críticas" value={String(threats.filter(t => t.severity === 'Alta' || t.severity === 'Crítica').length)} color="text-red-500" />
                    <StatCard icon={GanttChartSquare} title="Ameaças Mitigadas (7d)" value="12" color="text-green-500" />
                    <StatCard icon={WifiOff} title="Tentativas Bloqueadas (24h)" value="157" color="text-blue-500" />
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Log de Ameaças Recentes</h3>
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-base" />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora da Deteção</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Ameaça</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alvo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severidade</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                {filteredThreats.map(threat => (
                                    <tr key={threat.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetails(threat)}>
                                        <td className="px-6 py-4 text-sm text-gray-600">{threat.detectedAt}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800">{threat.type}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{threat.target}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${severityColors[threat.severity]}`}>{threat.severity}</span></td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[threat.status]}`}>{threat.status}</span></td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button onClick={(e) => { e.stopPropagation(); handleViewDetails(threat); }} className="p-1.5 rounded-full hover:bg-gray-200" title="Ver Detalhes"><Eye size={16} className="text-gray-600"/></button>
                                                <button onClick={(e) => { e.stopPropagation(); setThreatToDelete(threat); }} className="p-1.5 rounded-full hover:bg-red-100" title="Apagar"><Trash2 size={16} className="text-red-600"/></button>
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
                <NovaAmeacaModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleSave} />
                <DetalheAmeacaModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} threat={selectedThreat} />
                <ConfirmationModal isOpen={!!threatToDelete} onClose={() => setThreatToDelete(null)} onConfirm={handleConfirmDelete} title="Confirmar Exclusão" message={`Deseja realmente remover a ameaça "${threatToDelete?.id}"?`}/>
            </Suspense>
        </>
    );
};

export default AmeacasCiberneticasPage;