

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface NovoOrgaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  orgaoToEdit?: any | null;
}

const NovoOrgaoModal: React.FC<NovoOrgaoModalProps> = ({ isOpen, onClose, onSave, orgaoToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    acronym: '',
    type: 'Serviço Executivo',
    responsible: '',
    contactEmail: '',
    responsibleContact: '',
    address: '',
    website: '',
    status: 'Ativo'
  });

  const isEditMode = !!orgaoToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && orgaoToEdit) {
        setFormData({
            name: orgaoToEdit.name || '',
            acronym: orgaoToEdit.acronym || '',
            type: orgaoToEdit.type || 'Serviço Executivo',
            responsible: orgaoToEdit.responsible || '',
            contactEmail: orgaoToEdit.contactEmail || '',
            responsibleContact: orgaoToEdit.responsibleContact || '',
            address: orgaoToEdit.address || '',
            website: orgaoToEdit.website || '',
            status: orgaoToEdit.status || 'Ativo',
        });
      } else {
        setFormData({
            name: '', acronym: '', type: 'Serviço Executivo', responsible: '', 
            contactEmail: '', responsibleContact: '', address: '', website: '', status: 'Ativo'
        });
      }
    }
  }, [orgaoToEdit, isOpen, isEditMode]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(isEditMode ? { ...orgaoToEdit, ...formData } : formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Editar Órgão' : 'Adicionar Novo Órgão'}</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Nome do Órgão</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Sigla</label>
                <input type="text" name="acronym" value={formData.acronym} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Tipo</label>
              <select name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300">
                <option>Ministério</option>
                <option>Serviço Executivo</option>
                <option>Polícia</option>
                <option>Outro</option>
              </select>
            </div>
            <div className="pt-4 border-t">
                 <h3 className="text-base font-semibold text-gray-600 mb-2">Informações de Contacto</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Responsável</label>
                        <input type="text" name="responsible" value={formData.responsible} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Telefone do Responsável</label>
                        <input type="tel" name="responsibleContact" value={formData.responsibleContact} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Email de Contacto Geral</label>
                        <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300" />
                    </div>
                </div>
            </div>
             <div className="pt-4 border-t">
                 <h3 className="text-base font-semibold text-gray-600 mb-2">Localização e Outros</h3>
                  <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Endereço</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Website</label>
                        <input type="url" name="website" value={formData.website} placeholder="https://www.exemplo.gov.ao" onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Estado</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300">
                            <option>Ativo</option>
                            <option>Inativo</option>
                        </select>
                    </div>
                </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
            <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">Cancelar</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
              <Save size={16} className="mr-2" /> {isEditMode ? 'Salvar Alterações' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoOrgaoModal;