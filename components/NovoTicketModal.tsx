import React from 'react';
import { X, Save, FilePlus } from 'lucide-react';

interface NovoTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTicket: any) => void;
}

const NovoTicketModal: React.FC<NovoTicketModalProps> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTicket = {
        subject: formData.get('subject'),
        description: formData.get('description'),
        priority: formData.get('priority'),
    };
    onSave(newTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white rounded-t-lg">
            <h2 className="text-xl font-bold text-gray-800">Criar Novo Ticket de Suporte</h2>
            <button title="Fechar" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                <X className="h-5 w-5 text-gray-600" />
            </button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                 <div>
                    <label htmlFor="subject" className="block text-base font-medium text-gray-700">Assunto</label>
                    <input type="text" name="subject" id="subject" placeholder="Ex: Problema de acesso ao sistema" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required />
                </div>
                 <div>
                    <label htmlFor="description" className="block text-base font-medium text-gray-700">Descrição Detalhada do Problema</label>
                    <textarea name="description" id="description" rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required></textarea>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="priority" className="block text-base font-medium text-gray-700">Prioridade</label>
                        <select name="priority" id="priority" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base">
                            <option>Baixa</option>
                            <option>Média</option>
                            <option>Alta</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="attachment" className="block text-base font-medium text-gray-700">Anexo (Opcional)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <FilePlus className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                        <span>Carregar um ficheiro</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">ou arraste e solte</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF até 5MB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">
                    Cancelar
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Criar Ticket
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default NovoTicketModal;
