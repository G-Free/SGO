
import React from 'react';
import { X, Save } from 'lucide-react';

const mockEmployeesForSelect = [
  { id: 1, name: 'Administrador GMA' },
  { id: 2, name: 'Manuel Santos' },
  { id: 3, name: 'Sofia Lima' },
  { id: 4, name: 'António Freire' },
  { id: 5, name: 'Carlos Mendes' },
  { id: 6, name: 'Gestor 1' },
  { id: 7, name: 'Técnico A' },
];

const NovoPlanoAcaoModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void }> = ({ isOpen, onClose, onSave }) => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
        title: formData.get('title'),
        responsible: formData.get('responsible'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        status: formData.get('status'),
    };
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 grid place-items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Novo Plano de Ação</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Título do Plano</label>
              <input type="text" name="title" className="mt-1 w-full rounded-md border-gray-300" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Responsável</label>
                <select name="responsible" className="mt-1 w-full rounded-md border-gray-300">
                  {mockEmployeesForSelect.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Estado Inicial</label>
                <select name="status" className="mt-1 w-full rounded-md border-gray-300">
                  <option>Planeado</option>
                  <option>Em Execução</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Data de Início</label>
                <input type="date" name="startDate" className="mt-1 w-full rounded-md border-gray-300" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Data de Fim Previsto</label>
                <input type="date" name="endDate" className="mt-1 w-full rounded-md border-gray-300" required />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
            <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">Cancelar</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
              <Save size={16} className="mr-2" /> Criar Plano
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoPlanoAcaoModal;