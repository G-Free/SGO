import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign } from 'lucide-react';

interface NovoTransacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  lancamentoToEdit?: any | null;
}

const NovoTransacaoModal: React.FC<NovoTransacaoModalProps> = ({ isOpen, onClose, onSave, lancamentoToEdit }) => {
  const [formData, setFormData] = useState({
    description: '',
    value: '',
    type: 'Despesa',
    category: 'Despesas Operacionais',
    date: new Date().toISOString().split('T')[0],
    status: 'Pendente'
  });

  const isEditMode = !!lancamentoToEdit;

  useEffect(() => {
    if (isOpen) {
        if (isEditMode) {
            setFormData({
                description: lancamentoToEdit.description || '',
                value: lancamentoToEdit.value || '',
                type: lancamentoToEdit.type || 'Despesa',
                category: lancamentoToEdit.category || '',
                date: lancamentoToEdit.date || new Date().toISOString().split('T')[0],
                status: lancamentoToEdit.status || 'Pendente',
            });
        } else {
            setFormData({
                description: '',
                value: '',
                type: 'Despesa',
                category: 'Despesas Operacionais',
                date: new Date().toISOString().split('T')[0],
                status: 'Pendente'
            });
        }
    }
  }, [lancamentoToEdit, isOpen, isEditMode]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSave = {
        ...formData,
        value: parseFloat(formData.value) || 0,
    };
    if (isEditMode) {
        onSave({ ...lancamentoToEdit, ...dataToSave });
    } else {
        onSave(dataToSave);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white rounded-t-lg">
            <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Editar Lançamento' : 'Novo Lançamento Financeiro'}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X className="h-5 w-5 text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <div>
                    <label htmlFor="description" className="block text-base font-medium text-gray-700">Descrição</label>
                    <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="value" className="block text-base font-medium text-gray-700">Valor (AOA)</label>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><DollarSign className="h-5 w-5 text-gray-400" /></div>
                            <input type="number" name="value" id="value" value={formData.value} onChange={handleChange} className="pl-10 block w-full rounded-md border-gray-300" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-base font-medium text-gray-700">Data</label>
                        <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="type" className="block text-base font-medium text-gray-700">Tipo</label>
                        <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300">
                            <option>Despesa</option>
                            <option>Receita</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="category" className="block text-base font-medium text-gray-700">Categoria</label>
                        <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300">
                            <option>Despesas Operacionais</option>
                            <option>Taxas Operacionais</option>
                            <option>Serviços de Terceiros</option>
                            <option>Material de Consumo</option>
                            <option>Recursos Humanos</option>
                            <option>Fornecedores</option>
                            <option>Receitas Diversas</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="status" className="block text-base font-medium text-gray-700">Estado</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300">
                        <option>Pendente</option>
                        <option>Concluído</option>
                    </select>
                </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">Cancelar</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <Save className="h-4 w-4 mr-2" /> {isEditMode ? 'Salvar Alterações' : 'Salvar Lançamento'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default NovoTransacaoModal;
