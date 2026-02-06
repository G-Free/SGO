import React, { useState } from 'react';
import { X, Save, Clock, TerminalSquare, Type } from 'lucide-react';

interface NovoScriptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const NovoScriptModal: React.FC<NovoScriptModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    schedule: '',
    command: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.schedule || !formData.command || !formData.description) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white rounded-t-lg">
            <h2 className="text-xl font-bold text-gray-800">Nova Tarefa Agendada</h2>
            <button title="Fechar" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                <X className="h-5 w-5 text-gray-600" />
            </button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <div>
                    <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">Agendamento (formato CRON)</label>
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" name="schedule" id="schedule" value={formData.schedule} onChange={handleChange} placeholder="* * * * *" className="block w-full rounded-md border-gray-300 shadow-sm pl-10 sm:text-sm font-mono" required />
                    </div>
                </div>
                <div>
                    <label htmlFor="command" className="block text-sm font-medium text-gray-700">Comando / Script</label>
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <TerminalSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" name="command" id="command" value={formData.command} onChange={handleChange} placeholder="meu_script.sh" className="block w-full rounded-md border-gray-300 shadow-sm pl-10 sm:text-sm font-mono" required />
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                    <div className="relative mt-1">
                         <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                    </div>
                </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">
                    Cancelar
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Tarefa
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default NovoScriptModal;
