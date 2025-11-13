
import React, { useState, useMemo, lazy, Suspense } from 'react';
import { PlusCircle, File, Search, Edit, Trash2, Handshake, Building, Globe } from 'lucide-react';
import { useNotification } from '../components/Notification';

const NovoParceiroModal = lazy(() => import('../components/NovoParceiroModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));

declare global {
    interface Window { jspdf: any; }
}

const mockParceirosData = [
  { id: 'PAR-01', name: 'INTERPOL', type: 'Organização Internacional', country: 'Global', contactName: 'John Doe', contactEmail: 'contact@interpol.int', status: 'Ativo' },
  { id: 'PAR-02', name: 'Organização Marítima Internacional', type: 'Organização Internacional', country: 'Global', contactName: 'Jane Smith', contactEmail: 'info@imo.org', status: 'Ativo' },
  { id: 'PAR-03', name: 'TechSolutions Lda', type: 'Fornecedor de Tecnologia', country: 'Angola', contactName: 'Pedro Mbala', contactEmail: 'pedro.mbala@techsolutions.co.ao', status: 'Ativo' },
  { id: 'PAR-04', name: 'Frontex', type: 'Agência Europeia', country: 'União Europeia', contactName: 'Maria Garcia', contactEmail: 'info@frontex.europa.eu', status: 'Observador' },
];

const ObservadoresEParceirosPage: React.FC = () => {
    const [parceiros, setParceiros] = useState(mockParceirosData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [parceiroToDelete, setParceiroToDelete] = useState<any | null>(null);
    const { addNotification } = useNotification();

    const handleSave = (data: any) => {
        const newId = `PAR-${String(parceiros.length + 1).padStart(2, '0')}`;
        setParceiros(current => [{ ...data, id: newId }, ...current]);
        addNotification(`Novo parceiro "${data.name}" registado.`, 'success', 'Registo de Parceiro');
    };

    const handleConfirmDelete = () => {
        if (parceiroToDelete) {
            setParceiros(current => current.filter(p => p.id !== parceiroToDelete.id));
            addNotification(`Parceiro "${parceiroToDelete.name}" removido.`, 'success', 'Remoção');
            setParceiroToDelete(null);
        }
    };

    return (
        <>
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Observadores e Parceiros</h1>
                        <p className="text-gray-600">Registe entidades externas com acesso supervisionado ao sistema.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <PlusCircle className="h-5 w-5 mr-2" /> Adicionar Parceiro
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Lista de Entidades</h3>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome da Entidade</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto Principal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {parceiros.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{p.name}</div>
                                            <div className="text-sm text-gray-500">{p.country}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{p.type}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{p.contactName}</div>
                                            <div className="text-sm text-gray-500">{p.contactEmail}</div>
                                        </td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span></td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-gray-100" title="Editar"><Edit size={16}/></button>
                                                <button onClick={() => setParceiroToDelete(p)} className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-gray-100" title="Apagar"><Trash2 size={16}/></button>
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
                <NovoParceiroModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
                <ConfirmationModal isOpen={!!parceiroToDelete} onClose={() => setParceiroToDelete(null)} onConfirm={handleConfirmDelete} title="Confirmar Exclusão" message={`Deseja realmente remover a entidade "${parceiroToDelete?.name}"?`} />
            </Suspense>
        </>
    );
};

export default ObservadoresEParceirosPage;
