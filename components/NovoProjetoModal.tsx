import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

interface NovoProjetoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProject: any) => void;
}

const NovoProjetoModal: React.FC<NovoProjetoModalProps> = ({ isOpen, onClose, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const newProject = {
        title: formData.get('title'),
        manager: formData.get('manager'),
        status: formData.get('status'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        dueDate: formData.get('dueDate'),
        notes: formData.get('notes'),
    };
    
    setTimeout(() => {
        onSave(newProject);
        setIsSaving(false);
        onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white rounded-t-lg">
            <h2 className="text-xl font-bold text-gray-800">Novo Projeto</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                <X className="h-5 w-5 text-gray-600" />
            </button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                 <div>
                    <label htmlFor="title" className="block text-base font-medium text-gray-700">Título do Projeto</label>
                    <input type="text" name="title" id="title" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="manager" className="block text-base font-medium text-gray-700">Gestor do Projeto</label>
                        <select name="manager" id="manager" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base">
                            <option>Gestor 1</option>
                            <option>Gestor 2</option>
                            <option>Técnico A</option>
                            <option>Administrador</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-base font-medium text-gray-700">Estado Inicial</label>
                        <select name="status" id="status" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base">
                            <option>Planeado</option>
                            <option>Em Execução</option>
                        </select>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="startDate" className="block text-base font-medium text-gray-700">Data de Início</label>
                        <input type="date" name="startDate" id="startDate" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-base font-medium text-gray-700">Data de Fim (Prev.)</label>
                        <input type="date" name="endDate" id="endDate" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required />
                    </div>
                    <div>
                        <label htmlFor="dueDate" className="block text-base font-medium text-gray-700">Prazo Final</label>
                        <input type="date" name="dueDate" id="dueDate" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required />
                    </div>
                </div>
                 <div>
                    <label htmlFor="notes" className="block text-base font-medium text-gray-700">Descrição/Notas Iniciais</label>
                    <textarea name="notes" id="notes" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base"></textarea>
                </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">
                    Cancelar
                </button>
                <button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> A Salvar...
                        </>
                    ) : (
                         <>
                            <Save className="h-4 w-4 mr-2" /> Criar Projeto
                         </>
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default NovoProjetoModal;