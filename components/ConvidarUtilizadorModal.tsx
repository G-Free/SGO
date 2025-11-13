import React, { useState, useEffect } from 'react';
import { X, Send, Mail, User, Shield } from 'lucide-react';
import { UserRole } from '../types';

interface ConvidarUtilizadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: any) => void;
  userToEdit?: any | null;
}

const roleMapping: Record<string, UserRole> = {
    'Administrador': 'administrador',
    'Gestor': 'gestor',
    'Técnico de Operação': 'tecnico_op',
    'Técnico de SI': 'tecnico_si',
    'Padrão': 'padrao',
    'Consultor': 'consultor'
};

const ConvidarUtilizadorModal: React.FC<ConvidarUtilizadorModalProps> = ({ isOpen, onClose, onSave, userToEdit }) => {
  const [formData, setFormData] = useState({ name: '', email: '', role: 'tecnico_op' as UserRole });
  const isEditMode = !!userToEdit;

  useEffect(() => {
    if (isEditMode && userToEdit) {
        // Map the display name (e.g., "Técnico de Operação") to the enum value (e.g., "tecnico_op")
        const roleValue = roleMapping[userToEdit.role as keyof typeof roleMapping] || 'padrao';
        setFormData({ name: userToEdit.name, email: userToEdit.email, role: roleValue });
    } else {
        setFormData({ name: '', email: '', role: 'tecnico_op' });
    }
  }, [userToEdit, isOpen, isEditMode]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value as any}));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Find the display name for the role to save
    const roleDisplayName = Object.keys(roleMapping).find(key => roleMapping[key] === formData.role) || 'Padrão';
    const userData = { ...formData, role: roleDisplayName };
    const finalUserData = isEditMode ? { ...userToEdit, ...userData } : userData;
    onSave(finalUserData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 border-b flex justify-between items-center bg-white rounded-t-lg">
                <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Editar Utilizador' : 'Convidar Novo Utilizador'}</h2>
                <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                    <X className="h-5 w-5 text-gray-600" />
                </button>
            </div>
            <div className="p-6 space-y-4">
                 <div>
                    <label htmlFor="name" className="block text-base font-medium text-gray-700">Nome Completo</label>
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm pl-10 sm:text-base" required />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-base font-medium text-gray-700">Email</label>
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm pl-10 sm:text-base" required />
                    </div>
                </div>
                <div>
                    <label htmlFor="role" className="block text-base font-medium text-gray-700">Perfil de Acesso</label>
                     <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Shield className="h-5 w-5 text-gray-400" />
                        </div>
                        <select name="role" id="role" value={formData.role} onChange={handleChange} className="block w-full appearance-none rounded-md border-gray-300 shadow-sm pl-10 pr-10 py-2 sm:text-base">
                            <option value="tecnico_op">Técnico de Operação</option>
                            <option value="tecnico_si">Técnico de SI</option>
                            <option value="gestor">Gestor</option>
                            <option value="padrao">Padrão</option>
                            <option value="consultor">Consultor</option>
                            <option value="administrador">Administrador</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">
                    Cancelar
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    {isEditMode ? 'Salvar Alterações' : 'Enviar Convite'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ConvidarUtilizadorModal;
