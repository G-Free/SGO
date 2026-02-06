import React, { useState, useEffect } from 'react';
// Fix: Corrected import source from 'lucide-center' to 'lucide-react'
import { X, Send, Mail, User, Shield, MapPin } from 'lucide-react';
import { UserRole } from '../types';

interface ConvidarUtilizadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: any) => void;
  userToEdit?: any | null;
}

const roleMapping: Record<string, UserRole> = {
    'Administrador': 'administrador',
    'Coordenador Central': 'coordenador_central',
    'Coordenador da UTL Regional': 'coordenador_utl_regional',
    'Gestor de Operação Provincial': 'gestor_operacao_provincial',
    'Técnico de Operação Regional': 'tecnico_operacao_provincial',
    'Técnico de SI': 'tecnico_si'
};

const ConvidarUtilizadorModal: React.FC<ConvidarUtilizadorModalProps> = ({ isOpen, onClose, onSave, userToEdit }) => {
  const [formData, setFormData] = useState({ name: '', email: '', role: 'tecnico_operacao_provincial' as UserRole, province: '' });
  const isEditMode = !!userToEdit;

  useEffect(() => {
    if (isEditMode && userToEdit) {
        const roleValue = roleMapping[userToEdit.role] || 'tecnico_operacao_provincial';
        setFormData({ name: userToEdit.name, email: userToEdit.email, role: roleValue, province: userToEdit.province || '' });
    } else {
        setFormData({ name: '', email: '', role: 'tecnico_operacao_provincial', province: '' });
    }
  }, [userToEdit, isOpen, isEditMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roleDisplayName = Object.keys(roleMapping).find(key => roleMapping[key] === formData.role) || 'Técnico';
    const userData = { ...formData, role: roleDisplayName };
    onSave(isEditMode ? { ...userToEdit, ...userData } : userData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50 rounded-t-2xl">
                <h2 className="text-xl font-black text-gray-800">{isEditMode ? 'Editar Utilizador' : 'Convidar para Unidade'}</h2>
                <button title="Fechar" type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-5">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nome Completo</label>
                    <input title="Nome completo do utilizador" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 focus:ring-2 focus:ring-blue-500 py-3 text-sm font-bold" required />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Institucional</label>
                    <input title="Email institucional do utilizador" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 focus:ring-2 focus:ring-blue-500 py-3 text-sm font-bold" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Perfil de Função</label>
                        <select title="Perfil de função do utilizador" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})} className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold">
                            <option value="coordenador_central">Coord. Central</option>
                            <option value="coordenador_utl_regional">Coord. Regional</option>
                            <option value="gestor_operacao_provincial">Gestor Provincial</option>
                            <option value="tecnico_operacao_provincial">Técnico Operação</option>
                            <option value="administrador">Administrador</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Província (Regional)</label>
                        <select title="Província (Regional)" value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold">
                            <option value="">Nenhuma (Nacional)</option>
                            <option value="Luanda">Luanda</option>
                            <option value="Cabinda">Cabinda</option>
                            <option value="Zaire">Zaire</option>
                            <option value="Cunene">Cunene</option>
                            <option value="Namibe">Namibe</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="px-8 py-6 border-t bg-slate-50 flex gap-3 rounded-b-2xl">
                <button type="button" onClick={onClose} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-slate-500">Cancelar</button>
                <button type="submit" className="flex-1 bg-blue-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center">
                    <Send className="h-4 w-4 mr-2" /> Enviar Convite
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ConvidarUtilizadorModal;