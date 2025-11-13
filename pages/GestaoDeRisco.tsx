
import React, { useState, useMemo, lazy, Suspense } from 'react';
import { PlusCircle, File, Search, Edit, Trash2, ShieldQuestion, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useNotification } from '../components/Notification';

const NovoRiscoModal = lazy(() => import('../components/NovoRiscoModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));

declare global {
    interface Window { jspdf: any; }
}

type Risco = {
    id: string;
    description: string;
    category: 'Operacional' | 'Financeiro' | 'Reputacional' | 'Segurança';
    probability: 'Baixa' | 'Média' | 'Alta';
    impact: 'Baixo' | 'Médio' | 'Alto';
    mitigation: string;
    status: 'Ativo' | 'Mitigado' | 'Fechado';
};

const mockRiscosData: Risco[] = [
  { id: 'RSK-01', description: 'Falha nos sistemas de comunicação em alto mar', category: 'Operacional', probability: 'Média', impact: 'Alto', mitigation: 'Manutenção preventiva e sistemas de backup via satélite.', status: 'Ativo' },
  { id: 'RSK-02', description: 'Corrupção em postos fronteiriços terrestres', category: 'Reputacional', probability: 'Baixa', impact: 'Alto', mitigation: 'Rotação de pessoal, auditorias surpresa e canais de denúncia anónima.', status: 'Ativo' },
  { id: 'RSK-03', description: 'Ataque cibernético à base de dados central', category: 'Segurança', probability: 'Baixa', impact: 'Alto', mitigation: 'Firewall, IDS/IPS, e políticas de acesso restrito.', status: 'Mitigado' },
  { id: 'RSK-04', description: 'Atraso na entrega de combustível para embarcações', category: 'Operacional', probability: 'Média', impact: 'Médio', mitigation: 'Contratos com múltiplos fornecedores e stock de emergência.', status: 'Ativo' },
];

const riskMatrix: { [key in Risco['probability']]: { [key in Risco['impact']]: { level: string; color: string } } } = {
  Baixa: { Baixo: { level: 'Baixo', color: 'bg-green-200 text-green-800' }, Médio: { level: 'Baixo', color: 'bg-green-200 text-green-800' }, Alto: { level: 'Médio', color: 'bg-yellow-200 text-yellow-800' } },
  Média: { Baixo: { level: 'Baixo', color: 'bg-green-200 text-green-800' }, Médio: { level: 'Médio', color: 'bg-yellow-200 text-yellow-800' }, Alto: { level: 'Alto', color: 'bg-orange-200 text-orange-800' } },
  Alta:  { Baixo: { level: 'Médio', color: 'bg-yellow-200 text-yellow-800' }, Médio: { level: 'Alto', color: 'bg-orange-200 text-orange-800' }, Alto: { level: 'Crítico', color: 'bg-red-200 text-red-800' } },
};

const GestaoDeRiscoPage: React.FC = () => {
    const [riscos, setRiscos] = useState(mockRiscosData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [riscoToDelete, setRiscoToDelete] = useState<Risco | null>(null);
    const { addNotification } = useNotification();

    const handleSave = (data: Omit<Risco, 'id'>) => {
        const newId = `RSK-${String(riscos.length + 1).padStart(2, '0')}`;
        setRiscos(current => [{ ...data, id: newId }, ...current]);
        addNotification('Novo risco registado com sucesso.', 'success', 'Gestão de Risco');
    };

    const handleConfirmDelete = () => {
        if (riscoToDelete) {
            setRiscos(current => current.filter(r => r.id !== riscoToDelete.id));
            addNotification(`Risco "${riscoToDelete.id}" removido.`, 'success', 'Risco Removido');
            setRiscoToDelete(null);
        }
    };

    const getRiskLevel = (prob: Risco['probability'], imp: Risco['impact']) => riskMatrix[prob][imp];

    return (
        <>
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestão de Risco e Fiscalização</h1>
                        <p className="text-gray-600">Monitore operações conjuntas, riscos e medidas aplicadas.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <PlusCircle className="h-5 w-5 mr-2" /> Registar Risco
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Matriz de Riscos Ativos</h3>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição do Risco</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Probabilidade</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Impacto</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Nível de Risco</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mitigação</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {riscos.map(risco => {
                                    const { level, color } = getRiskLevel(risco.probability, risco.impact);
                                    return (
                                        <tr key={risco.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900">{risco.description}</div>
                                                <div className="text-sm text-gray-500">{risco.category}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center">{risco.probability}</td>
                                            <td className="px-4 py-3 text-sm text-center">{risco.impact}</td>
                                            <td className="px-4 py-3 text-center"><span className={`px-2 py-1 text-xs font-bold rounded-full ${color}`}>{level}</span></td>
                                            <td className="px-4 py-3 text-sm text-gray-600 max-w-sm truncate" title={risco.mitigation}>{risco.mitigation}</td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center items-center space-x-2">
                                                    <button className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-gray-100" title="Editar"><Edit size={16}/></button>
                                                    <button onClick={() => setRiscoToDelete(risco)} className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-gray-100" title="Apagar"><Trash2 size={16}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Suspense fallback={null}>
                <NovoRiscoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
                <ConfirmationModal isOpen={!!riscoToDelete} onClose={() => setRiscoToDelete(null)} onConfirm={handleConfirmDelete} title="Confirmar Exclusão" message={`Deseja realmente remover o risco "${riscoToDelete?.description}"?`} />
            </Suspense>
        </>
    );
};

export default GestaoDeRiscoPage;
