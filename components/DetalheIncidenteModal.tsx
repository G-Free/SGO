import React from 'react';
import { X, Flame, Shield, Clock, Plus } from 'lucide-react';

interface DetalheIncidenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: any | null;
}

const severityColors: { [key: string]: { bg: string, text: string, icon: React.ElementType } } = {
  'Crítico': { bg: 'bg-red-100', text: 'text-red-800', icon: Flame },
  'Alto': { bg: 'bg-orange-100', text: 'text-orange-800', icon: Shield },
};

const DetalheIncidenteModal: React.FC<DetalheIncidenteModalProps> = ({ isOpen, onClose, incident }) => {
  if (!isOpen || !incident) return null;

  const severity = severityColors[incident.severity] || { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Shield };
  const SeverityIcon = severity.icon;

  const handleAddLog = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      alert('Nova entrada de log adicionada! (Simulação)');
      e.currentTarget.reset();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white rounded-t-lg">
            <div>
                <h2 className="text-xl font-bold text-gray-800">{incident.title}</h2>
                <p className="text-sm text-gray-500">{incident.id}</p>
            </div>
            <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full ${severity.bg} ${severity.text}`}>
                    <SeverityIcon className="h-4 w-4 mr-1.5" />
                    {incident.severity}
                </span>
                 <span className={`px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full bg-blue-100 text-blue-800`}>
                    {incident.status}
                </span>
                <button title="Fechar" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                    <X className="h-5 w-5 text-gray-600" />
                </button>
            </div>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Linha do Tempo do Incidente</h3>
            <div className="space-y-4">
                {incident.log.map((entry: any, index: number) => (
                    <div key={index} className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                            <div className="w-px h-full bg-gray-300"></div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500">{entry.timestamp}</p>
                            <p className="text-base text-gray-800">{entry.entry}</p>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAddLog} className="mt-6 pt-4 border-t">
                 <label htmlFor="new-log-entry" className="block text-base font-medium text-gray-700 mb-2">Adicionar Nova Entrada</label>
                 <div className="flex items-center space-x-2">
                    <textarea name="new-log-entry" id="new-log-entry" rows={2} className="flex-grow block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required />
                    <button title="Adicionar Entrada de Log" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg flex items-center justify-center self-stretch">
                        <Plus className="h-5 w-5"/>
                    </button>
                 </div>
            </form>
        </div>

        <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
          <button type="button" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg">
            Alterar Estado
          </button>
           <button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Resolver Incidente
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalheIncidenteModal;
