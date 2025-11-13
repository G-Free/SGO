import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent mt-8">
      <div className="container mx-auto px-6 py-4 text-center">
        <p className="text-sm text-gray-500">
          &copy; 2025 Comité de Gestão Coordenada de Fronteiras.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Elaborado pela Equipa Técnica da Interoperabilidade dos Sistemas
        </p>
      </div>
    </footer>
  );
};

export default Footer;