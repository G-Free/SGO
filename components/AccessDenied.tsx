import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

const AccessDeniedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white p-12 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Acesso Negado</h1>
        <p className="text-gray-600 mb-8 max-w-md">Lamentamos, mas não tem as permissões necessárias para visualizar esta página. Se acredita que isto é um erro, por favor, contacte o administrador do sistema.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2.5 transition-colors duration-200 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </button>
    </div>
  );
};

export default AccessDeniedPage;