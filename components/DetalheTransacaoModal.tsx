import React from 'react';
import { X, Calendar, DollarSign, List, CheckSquare, Clock, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface DetalheTransacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lancamento: any | null;
}

const currencyFormatter = new Intl.NumberFormat('pt-AO', {
  style: 'currency',
  currency: 'AOA',
});

const statusInfo: { [key: string]: { text: string; icon: React.ElementType; color: string } } = {
  'Concluído': { text: 'Concluído', icon: CheckSquare, color: 'text-green-600' },
  'Pendente': { text: 'Pendente', icon: Clock, color: 'text-yellow-600' },
};

const typeInfo: { [key: string]: { text: string; icon: React.ElementType; color: string } } = {
  'Receita': { text: 'Receita', icon: ArrowUpCircle, color: 'text-green-600' },
  'Despesa': { text: 'Despesa', icon: ArrowDownCircle, color: 'text-red-600' },
};

const InfoItem: React.FC<{ icon: React.ElementType, label: string, value: React.ReactNode, valueColor?: string }> = ({ icon: Icon, label, value, valueColor }) => (
    <div className="flex items-start">
        <Icon className="h-5 w-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-base font-semibold text-gray-800 ${valueColor}`}>{value}</p>
        </div>
    </div>
);

const DetalheTransacaoModal: React.FC<DetalheTransacaoModalProps> = ({ isOpen, onClose, lancamento }) => {
  if (!isOpen || !lancamento) {
    return null;
  }

  const currentStatus = statusInfo[lancamento.status] || statusInfo['Pendente'];
  const currentType = typeInfo[lancamento.type] || typeInfo['Despesa'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-start bg-white rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold text-gray-800 truncate max-w-md" title={lancamento.description}>{lancamento.description}</h2>
            <p className="text-sm text-gray-500">ID da Transação: {lancamento.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
            <div className="bg-white p-6 rounded-lg border grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <InfoItem
                    icon={currentType.icon}
                    label="Tipo de Transação"
                    value={currentType.text}
                    valueColor={currentType.color}
                />
                 <InfoItem
                    icon={DollarSign}
                    label="Valor"
                    value={currencyFormatter.format(lancamento.value)}
                    valueColor={currentType.color}
                />
                 <InfoItem
                    icon={Calendar}
                    label="Data"
                    value={lancamento.date}
                />
                 <InfoItem
                    icon={currentStatus.icon}
                    label="Estado"
                    value={currentStatus.text}
                    valueColor={currentStatus.color}
                />
                <InfoItem
                    icon={List}
                    label="Categoria"
                    value={lancamento.category}
                />
                 <InfoItem
                    icon={X}
                    label="Responsável"
                    value={lancamento.responsible}
                />
            </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end bg-gray-50 rounded-b-lg">
          <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalheTransacaoModal;
