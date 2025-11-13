import React from 'react';
import { X, Save, ShieldAlert } from 'lucide-react';

interface NovoIncidenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: { id: string, title: string }[];
}

const NovoIncidenteModal: React.FC<NovoIncidenteModalProps> = ({ isOpen, onClose, plans }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Novo incidente ativado com sucesso! (Simulação)');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white rounded-t-lg">
            <h2 className="text-xl font-bold text-red-600 flex items-center"><ShieldAlert className="h-6 w-6 mr-3"/> Ativar Novo Incidente</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                <X className="h-5 w-5 text-gray-600" />
            </button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                 <div>
                    <label htmlFor="title" className="block text-base font-medium text-gray-700">Título do Incidente</label>
                    <input type="text" name="title" id="title" placeholder="Ex: Mancha de Óleo Detectada" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="severity" className="block text-base font-medium text-gray-700">Nível de Severidade</label>
                        <select name="severity" id="severity" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base">
                            <option>Crítico</option>
                            <option>Alto</option>
                            <option>Moderado</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="plan" className="block text-base font-medium text-gray-700">Plano de Contingência a Ativar</label>
                        <select name="plan" id="plan" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base">
                            <option>Nenhum</option>
                            {plans.map(plan => <option key={plan.id} value={plan.id}>{plan.title}</option>)}
                        </select>
                    </div>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-base font-medium text-gray-700">Descrição Inicial</label>
                    <textarea name="description" id="description" rows={4} placeholder="Descreva a situação inicial, localização e impacto estimado..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required></textarea>
                </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">
                    Cancelar
                </button>
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Ativar Incidente
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default NovoIncidenteModal;
