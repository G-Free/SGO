import React, { useState } from 'react';
import { X, Save, Target } from 'lucide-react';

const NovaAmeacaModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void }> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ type: 'Phishing', target: '', severity: 'Média', description: '' });

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
            <h2 className="text-xl font-bold text-gray-800">Registar Nova Ameaça</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Tipo de Ameaça</label>
                <select name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300">
                  <option>Phishing</option>
                  <option>Malware</option>
                  <option>DDoS</option>
                  <option>Tentativa de Intrusão</option>
                  <option>Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Severidade</label>
                <select name="severity" value={formData.severity} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300">
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Alta</option>
                  <option>Crítica</option>
                </select>
              </div>
            </div>
             <div>
              <label className="block text-sm font-medium">Alvo</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Target className="h-5 w-5 text-gray-400" /></div>
                <input type="text" name="target" value={formData.target} onChange={handleChange} placeholder="Ex: Servidor WEB-01, email@sgo.gov.ao" className="pl-10 w-full rounded-md border-gray-300" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Descrição</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 w-full rounded-md border-gray-300" />
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
            <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">Cancelar</button>
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
              <Save size={16} className="mr-2" /> Registar Ameaça
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default NovaAmeacaModal;