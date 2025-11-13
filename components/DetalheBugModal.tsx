import React from 'react';
import { X, Bug, Tag, Shield } from 'lucide-react';

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

const DetalheBugModal: React.FC<{ isOpen: boolean, onClose: () => void, bug: any | null }> = ({ isOpen, onClose, bug }) => {
  if (!isOpen || !bug) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center"><Bug className="mr-3" /> Detalhes do Bug: {bug.id}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-800 text-base">{bug.description}</p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="font-semibold">Módulo:</span>
              <span>{bug.module}</span>
            </div>
            <div className="flex items-center space-x-2">
                <span className="font-semibold">Estado:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[bug.status]}`}>{bug.status}</span>
            </div>
             <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">Severidade:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${severityColors[bug.severity]}`}>{bug.severity}</span>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end bg-gray-50 rounded-b-lg">
          <button onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">Fechar</button>
        </div>
      </div>
    </div>
  );
};
export default DetalheBugModal;