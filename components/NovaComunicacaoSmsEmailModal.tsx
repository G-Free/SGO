import React, { useState } from 'react';
import { X, Send, User } from 'lucide-react';

const NovaComunicacaoSmsEmailModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void }> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ type: 'Email', recipient: '', subject: '', body: '' });

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
            <h2 className="text-xl font-bold text-gray-800">Nova Comunicação</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium">Tipo</label>
                <select name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300">
                  <option>Email</option>
                  <option>SMS</option>
                </select>
              </div>
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium">Destinatário(s)</label>
                 <input type="text" name="recipient" value={formData.recipient} onChange={handleChange} placeholder={formData.type === 'Email' ? 'email@exemplo.com' : '+2449...'} className="mt-1 w-full rounded-md border-gray-300" required />
              </div>
            </div>
            {formData.type === 'Email' && (
            <div>
              <label className="block text-sm font-medium">Assunto</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300" required />
            </div>
            )}
            <div>
              <label className="block text-sm font-medium">Mensagem</label>
              <textarea name="body" value={formData.body} onChange={handleChange} rows={6} className="mt-1 w-full rounded-md border-gray-300" required maxLength={formData.type === 'SMS' ? 160 : undefined} />
              {formData.type === 'SMS' && <p className="text-xs text-right text-gray-500 mt-1">{formData.body.length} / 160</p>}
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
            <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">Cancelar</button>
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
              <Send size={16} className="mr-2" /> Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default NovaComunicacaoSmsEmailModal;