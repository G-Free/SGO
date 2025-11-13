
import React from 'react';
import { X, Save } from 'lucide-react';

const NovoParceiroModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void }> = ({ isOpen, onClose, onSave }) => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
        name: formData.get('name'),
        type: formData.get('type'),
        country: formData.get('country'),
        contactName: formData.get('contactName'),
        contactEmail: formData.get('contactEmail'),
        status: 'Ativo',
    };
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Adicionar Novo Parceiro/Observador</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Nome da Entidade</label>
                <input type="text" name="name" className="mt-1 w-full rounded-md border-gray-300" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Tipo</label>
                <select name="type" className="mt-1 w-full rounded-md border-gray-300">
                  <option>Organização Internacional</option>
                  <option>Agência Governamental</option>
                  <option>Fornecedor de Tecnologia</option>
                  <option>Observador</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">País de Origem</label>
              <input type="text" name="country" className="mt-1 w-full rounded-md border-gray-300" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Nome do Contacto Principal</label>
                    <input type="text" name="contactName" className="mt-1 w-full rounded-md border-gray-300" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Email do Contacto</label>
                    <input type="email" name="contactEmail" className="mt-1 w-full rounded-md border-gray-300" />
                </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
            <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">Cancelar</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
              <Save size={16} className="mr-2" /> Adicionar Entidade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoParceiroModal;
