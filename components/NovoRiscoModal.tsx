
import React, { useState, useMemo, useEffect } from 'react';
import { X, Save } from 'lucide-react';

type RiscoProbability = 'Baixa' | 'Média' | 'Alta';
type RiscoImpact = 'Baixo' | 'Médio' | 'Alto';

const riskMatrix: { [key in RiscoProbability]: { [key in RiscoImpact]: { level: string; color: string } } } = {
  Baixa: { Baixo: { level: 'Baixo', color: 'bg-green-200 text-green-800' }, Médio: { level: 'Baixo', color: 'bg-green-200 text-green-800' }, Alto: { level: 'Médio', color: 'bg-yellow-200 text-yellow-800' } },
  Média: { Baixo: { level: 'Baixo', color: 'bg-green-200 text-green-800' }, Médio: { level: 'Médio', color: 'bg-yellow-200 text-yellow-800' }, Alto: { level: 'Alto', color: 'bg-orange-200 text-orange-800' } },
  Alta:  { Baixo: { level: 'Médio', color: 'bg-yellow-200 text-yellow-800' }, Médio: { level: 'Alto', color: 'bg-orange-200 text-orange-800' }, Alto: { level: 'Crítico', color: 'bg-red-200 text-red-800' } },
};

const NovoRiscoModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void }> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
      description: '',
      category: 'Operacional',
      probability: 'Baixa' as RiscoProbability,
      impact: 'Baixo' as RiscoImpact,
      mitigation: '',
  });

  useEffect(() => {
    if (isOpen) {
        // Reset form state when modal opens for a new entry
        setFormData({
            description: '',
            category: 'Operacional',
            probability: 'Baixa',
            impact: 'Baixo',
            mitigation: '',
        });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value as any }));
  };
  
  const riskLevel = useMemo(() => {
      return riskMatrix[formData.probability][formData.impact];
  }, [formData.probability, formData.impact]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
        ...formData,
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
            <h2 className="text-xl font-bold text-gray-800">Registar Novo Risco</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Descrição do Risco</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 w-full rounded-md border-gray-300" required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium">Categoria</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300">
                    <option>Operacional</option>
                    <option>Financeiro</option>
                    <option>Reputacional</option>
                    <option>Segurança</option>
                  </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium">Probabilidade</label>
                <select name="probability" value={formData.probability} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300">
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Alta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Impacto</label>
                <select name="impact" value={formData.impact} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300">
                  <option>Baixo</option>
                  <option>Médio</option>
                  <option>Alto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-center">Nível de Risco</label>
                <div className={`mt-1 text-center font-bold rounded-md py-2 ${riskLevel.color}`}>
                    {riskLevel.level}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Medida de Mitigação Proposta</label>
              <textarea name="mitigation" value={formData.mitigation} onChange={handleChange} rows={3} className="mt-1 w-full rounded-md border-gray-300" />
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
            <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">Cancelar</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
              <Save size={16} className="mr-2" /> Registar Risco
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoRiscoModal;
