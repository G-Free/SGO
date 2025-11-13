import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, File, Search, Edit, Trash2, Eye, Wrench, Clock, CheckCircle, ListFilter, Loader2, PlayCircle } from 'lucide-react';
import { useNotification } from '../components/Notification';

const NovaOrdemServicoModal = lazy(() => import('../components/NovaOrdemServicoModal'));
const DetalheOrdemServicoModal = lazy(() => import('../components/DetalheOrdemServicoModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));


declare global {
    interface Window { jspdf: any; }
}

const mockWorkOrdersData = [
  { id: 'OS-001', title: 'Reparar ar condicionado do escritório 3', requester: 'Gestor 1', department: 'Administrativo', assignedTo: 'Técnico de Manutenção', status: 'Pendente', priority: 'Média', createdDate: '2024-07-28' },
  { id: 'OS-002', title: 'Verificar falha na rede do 1º andar', requester: 'Técnico A', department: 'Tecnologia', assignedTo: 'Equipa de Redes', status: 'Em Andamento', priority: 'Alta', createdDate: '2024-07-27' },
  { id: 'OS-003', title: 'Instalação de novo software de segurança', requester: 'Administrador', department: 'Tecnologia', assignedTo: 'Técnico B', status: 'Concluída', priority: 'Alta', createdDate: '2024-07-25' },
  { id: 'OS-004', title: 'Manutenção preventiva da viatura LD-25-88-GG', requester: 'Chefe de Frota', department: 'Transportes', assignedTo: 'Equipa de Manutenção', status: 'Pendente', priority: 'Baixa', createdDate: '2024-07-29' },
];

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, color: string }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
            <p className="text-base font-medium text-gray-600">{title}</p>
            <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
);

const statusColors: { [key: string]: string } = {
  'Concluída': 'bg-green-100 text-green-800',
  'Pendente': 'bg-yellow-100 text-yellow-800',
  'Em Andamento': 'bg-blue-100 text-blue-800',
};

const priorityColors: { [key: string]: string } = {
    'Alta': 'text-red-600',
    'Média': 'text-orange-500',
    'Baixa': 'text-gray-500',
};

const OrdensDeServicoPage: React.FC = () => {
  const [workOrders, setWorkOrders] = useState(mockWorkOrdersData);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<any | null>(null);
  const [filters, setFilters] = useState({ searchTerm: '', status: 'Todos', priority: 'Todos' });
  const [isExporting, setIsExporting] = useState(false);
  const { addNotification } = useNotification();

  const handleStatusChange = (orderId: string, newStatus: 'Em Andamento' | 'Concluída') => {
      setWorkOrders(currentOrders =>
          currentOrders.map(order =>
              order.id === orderId ? { ...order, status: newStatus } : order
          )
      );
      addNotification(
          `A Ordem de Serviço ${orderId} foi atualizada para "${newStatus}".`,
          'success',
          'Status Atualizado'
      );
  };

  const handleSave = (data: any) => {
      const newId = `OS-${String(workOrders.length + 1).padStart(3, '0')}`;
      const newOrder = { 
          ...data, 
          id: newId, 
          requester: 'Utilizador',
          status: 'Pendente',
          createdDate: new Date().toISOString().split('T')[0]
      };
      setWorkOrders(current => [newOrder, ...current]);
      addNotification(`Nova Ordem de Serviço "${newOrder.title}" criada com sucesso.`, 'success', 'Ordem Criada');
  };

  const handleOpenDeleteModal = (order: any) => setOrderToDelete(order);
  const handleViewDetails = (order: any) => { setSelectedOrder(order); setIsDetailsModalOpen(true); };
  
  const handleConfirmDelete = () => {
    if (orderToDelete) {
        setWorkOrders(current => current.filter(o => o.id !== orderToDelete.id));
        addNotification(`Ordem de Serviço ${orderToDelete.id} foi apagada.`, 'success', 'Ordem Apagada');
        setOrderToDelete(null);
    }
  };
  
  const filteredOrders = useMemo(() => {
    return workOrders.filter(o => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      const matchesSearch = o.title.toLowerCase().includes(searchTermLower) || o.department.toLowerCase().includes(searchTermLower);
      const matchesStatus = filters.status === 'Todos' || o.status === filters.status;
      const matchesPriority = filters.priority === 'Todos' || o.priority === filters.priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [workOrders, filters]);

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Monitoramento de Ordens de Serviço</h1>
            <p className="text-gray-600">Crie e acompanhe o progresso de todas as ordens de serviço.</p>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
            <PlusCircle className="h-5 w-5 mr-2" /> Nova Ordem de Serviço
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard icon={Clock} title="Pendentes" value={String(workOrders.filter(o => o.status === 'Pendente').length)} color="text-yellow-500" />
          <StatCard icon={Wrench} title="Em Andamento" value={String(workOrders.filter(o => o.status === 'Em Andamento').length)} color="text-blue-500" />
          <StatCard icon={CheckCircle} title="Concluídas" value={String(workOrders.filter(o => o.status === 'Concluída').length)} color="text-green-500" />
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Pesquisar por título ou departamento..." onChange={e => setFilters(f => ({...f, searchTerm: e.target.value}))} className="md:col-span-1 block w-full rounded-md border-gray-300"/>
            <select onChange={e => setFilters(f => ({...f, status: e.target.value}))} className="block w-full rounded-md border-gray-300"><option value="Todos">Todos os Estados</option><option>Pendente</option><option>Em Andamento</option><option>Concluída</option></select>
            <select onChange={e => setFilters(f => ({...f, priority: e.target.value}))} className="block w-full rounded-md border-gray-300"><option value="Todos">Todas as Prioridades</option><option>Baixa</option><option>Média</option><option>Alta</option></select>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Título', 'Departamento', 'Prioridade', 'Estado', 'Data Criação', 'Ações'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{o.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate">{o.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{o.department}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${priorityColors[o.priority]}`}>{o.priority}</td>
                  <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[o.status]}`}>{o.status}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{o.createdDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-1">
                        <button onClick={() => handleViewDetails(o)} className="text-gray-500 hover:text-blue-700 p-1.5 rounded-full hover:bg-gray-100" title="Ver Detalhes"><Eye size={16}/></button>
                        
                        {o.status === 'Pendente' && (
                            <button onClick={() => handleStatusChange(o.id, 'Em Andamento')} className="text-gray-500 hover:text-green-700 p-1.5 rounded-full hover:bg-gray-100" title="Iniciar Serviço">
                                <PlayCircle size={16} />
                            </button>
                        )}
                        {o.status === 'Em Andamento' && (
                            <button onClick={() => handleStatusChange(o.id, 'Concluída')} className="text-gray-500 hover:text-green-700 p-1.5 rounded-full hover:bg-gray-100" title="Concluir Serviço">
                                <CheckCircle size={16} />
                            </button>
                        )}

                        <button className="text-gray-500 hover:text-indigo-700 p-1.5 rounded-full hover:bg-gray-100" title="Editar"><Edit size={16}/></button>
                        <button onClick={() => handleOpenDeleteModal(o)} className="text-gray-500 hover:text-red-700 p-1.5 rounded-full hover:bg-gray-100" title="Apagar"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && <p className="text-center text-gray-500 py-8">Nenhuma ordem de serviço encontrada.</p>}
        </div>
      </div>
      <Suspense fallback={null}>
        <NovaOrdemServicoModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleSave} />
        <DetalheOrdemServicoModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} order={selectedOrder} />
        <ConfirmationModal isOpen={!!orderToDelete} onClose={() => setOrderToDelete(null)} onConfirm={handleConfirmDelete} title="Confirmar Exclusão" message={`Deseja realmente apagar a ordem de serviço "${orderToDelete?.title}"?`}/>
      </Suspense>
    </>
  );
};

export default OrdensDeServicoPage;