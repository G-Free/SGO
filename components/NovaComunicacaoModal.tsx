
import React from 'react';
import { X, Send } from 'lucide-react';

const NovaComunicacaoModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void }> = ({ isOpen, onClose, onSave }) => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
        to: formData.get('to'),
        subject: formData.get('subject'),
        priority: formData.get('priority'),
        body: formData.get('body'),
    };
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Nova Comunicação</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Destinatário(s)</label>
              <input type="text" name="to" placeholder="Ex: SME, PGFA" className="mt-1 w-full rounded-md border-gray-300" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Assunto</label>
              <input type="text" name="subject" className="mt-1 w-full rounded-md border-gray-300" required />
            </div>
             <div>
                <label className="block text-sm font-medium">Prioridade</label>
                <select name="priority" className="mt-1 w-full rounded-md border-gray-300">
                  <option>Normal</option>
                  <option>Urgente</option>
                </select>
              </div>
            <div>
              <label className="block text-sm font-medium">Mensagem</label>
              <textarea name="body" rows={8} className="mt-1 w-full rounded-md border-gray-300" required />
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
            <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">Cancelar</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
              <Send size={16} className="mr-2" /> Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovaComunicacaoModal;
