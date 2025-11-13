import React from 'react';
import { X, Save } from 'lucide-react';

interface NovaOrdemServicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const NovaOrdemServicoModal: React.FC<NovaOrdemServicoModalProps> = ({ isOpen, onClose, onSave }) => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
        title: formData.get('title'),
        department: formData.get('department'),
        priority: formData.get('priority'),
        description: formData.get('description'),
    };
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white rounded-t-lg">
            <h2 className="text-xl font-bold text-gray-800">Nova Ordem de Serviço</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X className="h-5 w-5 text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <div>
                    <label htmlFor="title" className="block text-base font-medium text-gray-700">Título / Resumo</label>
                    <input type="text" name="title" id="title" placeholder="Ex: Reparar ar condicionado" className="mt-1 block w-full rounded-md border-gray-300" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="department" className="block text-base font-medium text-gray-700">Departamento Responsável</label>
                        <select name="department" id="department" className="mt-1 block w-full rounded-md border-gray-300">
                            <option>Manutenção</option>
                            <option>Tecnologia</option>
                            <option>Transportes</option>
                            <option>Administrativo</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="priority" className="block text-base font-medium text-gray-700">Prioridade</label>
                        <select name="priority" id="priority" className="mt-1 block w-full rounded-md border-gray-300">
                           <option>Baixa</option>
                           <option>Média</option>
                           <option>Alta</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-base font-medium text-gray-700">Descrição Detalhada</label>
                    <textarea name="description" id="description" rows={4} className="mt-1 block w-full rounded-md border-gray-300"></textarea>
                </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">Cancelar</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <Save className="h-4 w-4 mr-2" /> Criar Ordem
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default NovaOrdemServicoModal;
