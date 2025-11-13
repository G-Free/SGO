import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface NovoAtivoMeioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newAtivo: any) => void;
  ativoToEdit?: any | null;
}

const NovoAtivoMeioModal: React.FC<NovoAtivoMeioModalProps> = ({ isOpen, onClose, onSave, ativoToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Viatura',
    identifier: '',
    location: '',
    acquisitionDate: '',
    status: 'Operacional',
  });

  const isEditMode = !!ativoToEdit;

  useEffect(() => {
    if (isOpen) {
        if (isEditMode && ativoToEdit) {
            setFormData({
                name: ativoToEdit.name || '',
                category: ativoToEdit.category || 'Viatura',
                identifier: ativoToEdit.identifier || '',
                location: ativoToEdit.location || '',
                acquisitionDate: ativoToEdit.acquisitionDate || '',
                status: ativoToEdit.status || 'Operacional',
            });
        } else {
            setFormData({
                name: '',
                category: 'Viatura',
                identifier: '',
                location: '',
                acquisitionDate: new Date().toISOString().split('T')[0],
                status: 'Operacional',
            });
        }
    }
  }, [ativoToEdit, isOpen, isEditMode]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ativoData = isEditMode 
        ? { ...ativoToEdit, ...formData }
        : { id: `PAT-${Math.floor(Math.random() * 900) + 100}`, ...formData };
    
    onSave(ativoData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white rounded-t-lg">
            <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Editar Ativo / Meio Técnico' : 'Adicionar Novo Ativo / Meio Técnico'}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                <X className="h-5 w-5 text-gray-600" />
            </button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-base font-medium text-gray-700">Nome do Ativo</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} placeholder="Ex: Viatura Toyota Hilux" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-base font-medium text-gray-700">Categoria</label>
                        <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base">
                            <option>Viatura</option>
                            <option>Embarcação</option>
                            <option>Drone</option>
                            <option>Equipamento IT</option>
                            <option>Equipamento Operacional</option>
                            <option>Mobiliário</option>
                            <option>Outro</option>
                        </select>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="identifier" className="block text-base font-medium text-gray-700">Matrícula / Nº de Série</label>
                        <input type="text" name="identifier" id="identifier" value={formData.identifier} onChange={handleChange} placeholder="Ex: LD-25-88-GG" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" />
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-base font-medium text-gray-700">Estado</label>
                        <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base">
                            <option>Operacional</option>
                            <option>Em Manutenção</option>
                            <option>Em Stock</option>
                            <option>Inativo</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="location" className="block text-base font-medium text-gray-700">Localização</label>
                      <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} placeholder="Ex: Garagem Central" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required />
                  </div>
                  <div>
                      <label htmlFor="acquisitionDate" className="block text-base font-medium text-gray-700">Data de Aquisição</label>
                      <input type="date" name="acquisitionDate" id="acquisitionDate" value={formData.acquisitionDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required />
                  </div>
                </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">
                    Cancelar
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    {isEditMode ? 'Salvar Alterações' : 'Adicionar Ativo'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default NovoAtivoMeioModal;