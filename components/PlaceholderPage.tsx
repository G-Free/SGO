import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
        <div className="mb-8">
             <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
             <p className="text-gray-600">Este módulo está em desenvolvimento.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-center text-gray-500">O conteúdo e as funcionalidades para {title.toLowerCase()} estarão disponíveis aqui em breve.</p>
        </div>
    </div>
  );
};

export default PlaceholderPage;