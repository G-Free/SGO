import React from 'react';
import { X, Calendar, User, Tag, Shield, Building, MessageSquare } from 'lucide-react';

interface DetalheOrdemServicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null;
}

const statusColors: { [key: string]: string } = {
  'Concluída': 'bg-green-100 text-green-800',
  'Pendente': 'bg-yellow-100 text-yellow-800',
  'Em Andamento': 'bg-blue-100 text-blue-800',
};

const priorityColors: { [key: string]: string } = {
    'Alta': 'bg-red-100 text-red-800',
    'Média': 'bg-orange-100 text-orange-800',
    'Baixa': 'bg-gray-100 text-gray-800',
};

const DetalheOrdemServicoModal: React.FC<DetalheOrdemServicoModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-start bg-white rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{order.title}</h2>
            <p className="text-sm text-gray-500">Ordem de Serviço: {order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-4">
          <div className="bg-white p-4 rounded-lg border grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-semibold text-gray-700">Solicitante:</span>
              <span>{order.requester}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-semibold text-gray-700">Atribuído a:</span>
              <span>{order.assignedTo}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-semibold text-gray-700">Data de Criação:</span>
              <span>{order.createdDate}</span>
            </div>
             <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-gray-700">Estado:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>{order.status}</span>
            </div>
            <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-gray-700">Prioridade:</span>
                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[order.priority]}`}>{order.priority}</span>
            </div>
            <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-gray-700">Departamento:</span>
                 <span>{order.department}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                Descrição
            </h3>
            <p className="text-gray-700 text-base whitespace-pre-wrap">{order.description || 'Nenhuma descrição fornecida.'}</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
          <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm">
            Fechar
          </button>
           <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm"
          >
            Atualizar Ordem
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalheOrdemServicoModal;
