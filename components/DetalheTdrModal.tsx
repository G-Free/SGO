import React from 'react';
import { X, ClipboardList, DollarSign, Calendar, Target, FileText } from 'lucide-react';

interface DetalheTdrModalProps {
  isOpen: boolean;
  onClose: () => void;
  tdr: any | null;
}

const statusColors: { [key: string]: string } = {
  'Aprovado': 'bg-green-100 text-green-800',
  'Em Elaboração': 'bg-yellow-100 text-yellow-800',
  'Rejeitado': 'bg-red-100 text-red-800',
};

const currencyFormatter = new Intl.NumberFormat('pt-AO', {
  style: 'currency',
  currency: 'AOA',
});

const Section: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white p-5 rounded-lg border">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <Icon className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
            {title}
        </h3>
        <div className="text-base text-gray-700 whitespace-pre-wrap">
            {children || <span className="text-gray-400">Não preenchido.</span>}
        </div>
    </div>
);

const DetalheTdrModal: React.FC<DetalheTdrModalProps> = ({ isOpen, onClose, tdr }) => {
  if (!isOpen || !tdr) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-start bg-white sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{tdr.title}</h2>
            <p className="text-sm text-gray-500">ID: {tdr.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-6">
            <div className="bg-white p-5 rounded-lg border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <p className="text-sm font-medium text-gray-500">Estado</p>
                    <span className={`px-2 py-1 text-sm font-semibold rounded-full ${statusColors[tdr.status]}`}>{tdr.status}</span>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Proponente</p>
                    <p className="text-base font-semibold text-gray-800">{tdr.proponent}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Orçamento</p>
                    <p className="text-base font-semibold text-gray-800">{tdr.budget ? currencyFormatter.format(tdr.budget) : 'N/D'}</p>
                </div>
                 <div>
                    <p className="text-sm font-medium text-gray-500">Data de Criação</p>
                    <p className="text-base font-semibold text-gray-800">{tdr.createdAt}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Data de Expiração</p>
                    <p className={`text-base font-semibold ${new Date(tdr.expiryDate) < new Date() && tdr.status !== 'Aprovado' ? 'text-red-600' : 'text-gray-800'}`}>
                        {tdr.expiryDate}
                    </p>
                </div>
            </div>

            <Section icon={FileText} title="Descrição Detalhada">
                {tdr.description}
            </Section>

            <Section icon={Target} title="Objetivos">
                {tdr.objectives}
            </Section>
        </div>

        <div className="px-6 py-4 border-t flex justify-end bg-gray-50 sticky bottom-0 z-30">
          <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalheTdrModal;