import React, { useState } from 'react';
import { X, Save, Paperclip } from 'lucide-react';

const NovoBugModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void }> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ description: '', module: 'Relatórios', severity: 'Média' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Reportar Novo Bug</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Descrição do Bug</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 w-full rounded-md border-gray-300" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Módulo Afetado</label>
                <select name="module" value={formData.module} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300">
                  <option>Relatórios</option>
                  <option>Contabilidade</option>
                  <option>Atividades</option>
                  <option>Autenticação</option>
                  <option>Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Severidade</label>
                <select name="severity" value={formData.severity} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300">
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Alta</option>
                  <option>Crítico</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Anexar Captura de Ecrã</label>
              <div className="mt-1 flex items-center">
                <label htmlFor="file-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                  <Paperclip size={16} className="mr-2" /> Anexar
                </label>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
            <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">Cancelar</button>
            <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
              <Save size={16} className="mr-2" /> Reportar Bug
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default NovoBugModal;