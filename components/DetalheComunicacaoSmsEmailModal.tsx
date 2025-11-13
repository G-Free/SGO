import React from 'react';
import { X, Mail, MessageSquare } from 'lucide-react';

const statusColors: { [key: string]: string } = {
    'Entregue': 'bg-green-100 text-green-800',
    'Enviado': 'bg-blue-100 text-blue-800',
    'Falhou': 'bg-red-100 text-red-800',
};

const DetalheComunicacaoSmsEmailModal: React.FC<{ isOpen: boolean, onClose: () => void, comm: any | null }> = ({ isOpen, onClose, comm }) => {
  if (!isOpen || !comm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">{comm.type === 'Email' ? <Mail className="mr-3" /> : <MessageSquare className="mr-3"/>} Detalhes da Comunicação</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-semibold">Destinatário:</span> {comm.recipient}</div>
            <div><span className="font-semibold">Data:</span> {comm.sentAt}</div>
            <div><span className="font-semibold">Estado:</span> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[comm.status]}`}>{comm.status}</span></div>
          </div>
          <div className="pt-4 border-t">
            <p className="font-semibold mb-2">Conteúdo da Mensagem:</p>
            <p className="p-3 bg-gray-50 rounded-md text-gray-800 whitespace-pre-wrap">{comm.body || comm.subject}</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end bg-gray-50 rounded-b-lg">
          <button onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">Fechar</button>
        </div>
      </div>
    </div>
  );
};
export default DetalheComunicacaoSmsEmailModal;