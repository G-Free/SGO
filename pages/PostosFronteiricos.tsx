

import React, { useState, useMemo, lazy, Suspense } from 'react';
import { PlusCircle, File, Search, Edit, Trash2, TowerControl, Ship, Plane, Car } from 'lucide-react';
import { useNotification } from '../components/Notification';

const NovoPostoFronteiricoModal = lazy(() => import('../components/NovoPostoFronteiricoModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));

declare global {
    interface Window { jspdf: any; }
}

const mockPostosData = [
  { id: 'PF-01', name: 'Posto Fronteiriço do Luvo', province: 'Zaire', type: 'Terrestre', coordinates: '6.11°S 14.81°E', status: 'Operacional' },
  { id: 'PF-02', name: 'Aeroporto Internacional 4 de Fevereiro', province: 'Luanda', type: 'Aéreo', coordinates: '8.85°S 13.23°E', status: 'Operacional' },
  { id: 'PF-03', name: 'Porto de Luanda', province: 'Luanda', type: 'Marítimo', coordinates: '8.80°S 13.24°E', status: 'Operacional' },
  { id: 'PF-04', name: 'Posto Fronteiriço de Santa Clara', province: 'Cunene', type: 'Terrestre', coordinates: '17.38°S 15.89°E', status: 'Operacional' },
  { id: 'PF-05', name: 'Porto do Lobito', province: 'Benguela', type: 'Marítimo', coordinates: '12.35°S 13.54°E', status: 'Em Obras' },
  { id: 'PF-06', name: 'Posto Fronteiriço de Massabi', province: 'Cabinda', type: 'Terrestre', coordinates: '4.86°S 12.02°E', status: 'Operacional' },
];

const typeIcons = {
    Terrestre: <Car className="h-5 w-5 text-gray-600" />,
    Marítimo: <Ship className="h-5 w-5 text-blue-600" />,
    Aéreo: <Plane className="h-5 w-5 text-sky-600" />,
};

const statusColors: { [key: string]: string } = {
  'Operacional': 'bg-green-100 text-green-800',
  'Em Obras': 'bg-yellow-100 text-yellow-800',
  'Fechado': 'bg-red-100 text-red-800',
};

const PostosFronteiricosPage: React.FC = () => {
    const [postos, setPostos] = useState(mockPostosData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postoToDelete, setPostoToDelete] = useState<any | null>(null);
    const { addNotification } = useNotification();

    const handleSave = (data: any) => {
        const newId = `PF-${String(postos.length + 1).padStart(2, '0')}`;
        setPostos(current => [{ ...data, id: newId }, ...current]);
        addNotification(`Novo posto "${data.name}" adicionado.`, 'success', 'Posto Adicionado');
    };

    const handleConfirmDelete = () => {
        if (postoToDelete) {
            setPostos(current => current.filter(p => p.id !== postoToDelete.id));
            addNotification(`Posto "${postoToDelete.name}" removido.`, 'success', 'Posto Removido');
            setPostoToDelete(null);
        }
    };
    
    const stats = useMemo(() => ({
        total: postos.length,
        terrestre: postos.filter(p => p.type === 'Terrestre').length,
        maritimo: postos.filter(p => p.type === 'Marítimo').length,
        aereo: postos.filter(p => p.type === 'Aéreo').length,
    }), [postos]);

    return (
        <>
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestão de Postos Fronteiriços</h1>
                        <p className="text-gray-600">Gira dados dos postos e pontos fronteiriços (tipo, localização, status).</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <PlusCircle className="h-5 w-5 mr-2" /> Adicionar Posto
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* FIX: Corrected malformed JSX in stat cards by adding a closing angle bracket `>` to the inner `div` tags. */}
                    <div className="bg-white p-5 rounded-lg border flex items-center space-x-4"><TowerControl className="h-8 w-8 text-blue-500" /><div><p className="text-sm font-medium text-gray-600">Total</p><p className="text-2xl font-bold text-gray-800">{stats.total}</p></div></div>
                    <div className="bg-white p-5 rounded-lg border flex items-center space-x-4"><Car className="h-8 w-8 text-gray-600" /><div><p className="text-sm font-medium text-gray-600">Terrestres</p><p className="text-2xl font-bold text-gray-800">{stats.terrestre}</p></div></div>
                    <div className="bg-white p-5 rounded-lg border flex items-center space-x-4"><Ship className="h-8 w-8 text-blue-600" /><div><p className="text-sm font-medium text-gray-600">Marítimos</p><p className="text-2xl font-bold text-gray-800">{stats.maritimo}</p></div></div>
                    <div className="bg-white p-5 rounded-lg border flex items-center space-x-4"><Plane className="h-8 w-8 text-sky-600" /><div><p className="text-sm font-medium text-gray-600">Aéreos</p><p className="text-2xl font-bold text-gray-800">{stats.aereo}</p></div></div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Inventário de Postos</h3>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome do Posto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coordenadas</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {postos.map(posto => (
                                    <tr key={posto.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{posto.name}</div>
                                            <div className="text-sm text-gray-500">{posto.province}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-800">
                                                {typeIcons[posto.type as keyof typeof typeIcons]}
                                                <span className="ml-2">{posto.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-gray-600">{posto.coordinates}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[posto.status]}`}>{posto.status}</span></td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-gray-100" title="Editar"><Edit size={16}/></button>
                                                <button onClick={() => setPostoToDelete(posto)} className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-gray-100" title="Apagar"><Trash2 size={16}/></button>
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
                <NovoPostoFronteiricoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
                <ConfirmationModal isOpen={!!postoToDelete} onClose={() => setPostoToDelete(null)} onConfirm={handleConfirmDelete} title="Confirmar Exclusão" message={`Deseja realmente remover o posto "${postoToDelete?.name}"?`} />
            </Suspense>
        </>
    );
};

export default PostosFronteiricosPage;