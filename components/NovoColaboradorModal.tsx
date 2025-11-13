import React, { useState, useEffect } from 'react';
import { X, Save, User, Briefcase, Building } from 'lucide-react';

interface NovoColaboradorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: any) => void;
  employeeToEdit?: any | null;
}

const NovoColaboradorModal: React.FC<NovoColaboradorModalProps> = ({ isOpen, onClose, onSave, employeeToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: 'Operações',
    origin: 'Marinha de Guerra',
    contact: ''
  });

  const isEditMode = !!employeeToEdit;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: employeeToEdit.name,
        position: employeeToEdit.position,
        department: employeeToEdit.department,
        origin: employeeToEdit.origin,
        contact: employeeToEdit.contact,
      });
    } else {
      // Reset form for new collaborator
      setFormData({
        name: '',
        position: '',
        department: 'Operações',
        origin: 'Marinha de Guerra',
        contact: ''
      });
    }
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const employeeData = isEditMode ? { ...employeeToEdit, ...formData } : formData;
    onSave(employeeData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white rounded-t-lg">
            <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Editar Colaborador' : 'Adicionar Novo Colaborador'}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                <X className="h-5 w-5 text-gray-600" />
            </button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-base font-medium text-gray-700">Nome Completo</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required />
                    </div>
                     <div>
                        <label htmlFor="position" className="block text-base font-medium text-gray-700">Cargo</label>
                        <input type="text" name="position" id="position" value={formData.position} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="department" className="block text-base font-medium text-gray-700">Departamento (na GMA)</label>
                        <select name="department" id="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base">
                            <option>Operações</option>
                            <option>Fiscalização</option>
                            <option>Tecnologia</option>
                            <option>Direção</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="origin" className="block text-base font-medium text-gray-700">Orgão de Origem</label>
                         <select name="origin" id="origin" value={formData.origin} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base">
                            <option>Marinha de Guerra</option>
                            <option>Polícia Fiscal</option>
                            <option>SME</option>
                            <option>Capitania</option>
                            <option>MINT</option>
                            <option>Outro</option>
                        </select>
                    </div>
                </div>
                 <div>
                    <label htmlFor="contact" className="block text-base font-medium text-gray-700">Email de Contacto</label>
                    <input type="email" name="contact" id="contact" value={formData.contact} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" required />
                </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">
                    Cancelar
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    {isEditMode ? 'Salvar Alterações' : 'Adicionar Colaborador'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default NovoColaboradorModal;