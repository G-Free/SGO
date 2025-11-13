import React from 'react';
import { X, User, Mail, Building, Shield, Phone, MapPin, Globe } from 'lucide-react';

interface DetalheOrgaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgao: any | null;
}

const statusColors: { [key: string]: string } = {
  'Ativo': 'bg-green-100 text-green-800',
  'Inativo': 'bg-gray-100 text-gray-800',
};

const DetalheOrgaoModal: React.FC<DetalheOrgaoModalProps> = ({ isOpen, onClose, orgao }) => {
  if (!isOpen || !orgao) {
    return null;
  }
  
  const handleWebsiteClick = () => {
    if (orgao.website) {
        let url = orgao.website;
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-start bg-white sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{orgao.name} ({orgao.acronym})</h2>
            <p className="text-sm text-gray-500">ID: {orgao.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          <div className="bg-white p-4 rounded-lg border grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-gray-700">Tipo:</span>
                <span>{orgao.type}</span>
            </div>
            <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-gray-700">Estado:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[orgao.status]}`}>{orgao.status}</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Detalhes de Contacto e Localização</h3>
            <div className="space-y-4">
                <div className="flex items-start">
                    <User size={16} className="text-gray-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-500">Responsável</p>
                        <p className="font-semibold text-gray-800">{orgao.responsible || 'Não definido'}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <Phone size={16} className="text-gray-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-500">Telefone do Responsável</p>
                        <p className="font-semibold text-gray-800">{orgao.responsibleContact || 'Não definido'}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <Mail size={16} className="text-gray-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-500">Email Geral</p>
                        <a href={`mailto:${orgao.contactEmail}`} className="font-semibold text-blue-600 hover:underline">{orgao.contactEmail || 'Não definido'}</a>
                    </div>
                </div>
                <div className="flex items-start">
                    <MapPin size={16} className="text-gray-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-500">Endereço</p>
                        <p className="font-semibold text-gray-800">{orgao.address || 'Não definido'}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <Globe size={16} className="text-gray-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <button onClick={handleWebsiteClick} className="font-semibold text-blue-600 hover:underline text-left" disabled={!orgao.website}>
                            {orgao.website || 'Não definido'}
                        </button>
                    </div>
                </div>
            </div>
          </div>
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

export default DetalheOrgaoModal;