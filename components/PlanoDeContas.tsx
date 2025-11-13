import React, { useState } from 'react';
import { Folder, FolderOpen, File, ChevronRight, ChevronDown } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  children?: Account[];
}

const planoDeContasData: { id: string, name: string, children: Account[] } = {
  id: 'root', name: 'Plano de Contas', children: [
    { id: '1', name: 'Ativo', children: [
      { id: '1.1', name: 'Ativo Circulante', children: [
        { id: '1.1.1', name: 'Caixa e Equivalentes', children: [
          { id: '1.1.1.01', name: 'Caixa' },
          { id: '1.1.1.02', name: 'Banco' },
        ]},
        { id: '1.1.2', name: 'Estoques', children: [
          { id: '1.1.2.01', name: 'Material de Escritório' },
        ]},
      ]},
    ]},
    { id: '2', name: 'Passivo', children: [
      { id: '2.1', name: 'Passivo Circulante', children: [
        { id: '2.1.1', name: 'Fornecedores' },
      ]},
    ]},
    { id: '3', name: 'Capital Próprio e Receitas', children: [
      { id: '3.1', name: 'Receitas', children: [
        { id: '3.1.1', name: 'Receitas Operacionais', children: [
            { id: '3.1.1.01', name: 'Receitas Operacionais' },
        ]},
      ]},
    ]},
    { id: '4', name: 'Custos e Despesas', children: [
      { id: '4.1', name: 'Despesas Operacionais', children: [
        { id: '4.1.1', name: 'Despesas com Pessoal' },
        { id: '4.1.2', name: 'Fornecimentos e Serviços Externos', children: [
          { id: '4.1.2.01', name: 'Combustíveis' },
          { id: '4.1.2.02', name: 'Rendas e Alugueres' },
          { id: '4.1.2.03', name: 'Serviços de Terceiros' },
        ]},
      ]},
    ]},
  ]
};

interface AccountNodeProps {
    node: Account;
    level?: number;
}
// FIX: Using React.FC correctly types the component to accept React's special `key` prop, resolving the TypeScript error during mapping.
const AccountNode: React.FC<AccountNodeProps> = ({ node, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(level < 2);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div style={{ paddingLeft: `${level * 16}px` }}>
            <div 
                className={`flex items-center p-1.5 rounded-md cursor-pointer ${hasChildren ? '' : 'text-gray-700'}`}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
            >
                {hasChildren ? (
                    isOpen ? <ChevronDown size={14} className="mr-2 text-gray-500" /> : <ChevronRight size={14} className="mr-2 text-gray-500" />
                ) : (
                    <div className="w-[14px] mr-2"></div> // Placeholder for alignment
                )}
                {hasChildren ? (
                    isOpen ? <FolderOpen size={16} className="mr-2 text-blue-600" /> : <Folder size={16} className="mr-2 text-blue-600" />
                ) : (
                    <File size={16} className="mr-2 text-gray-500" />
                )}
                <span className={`text-sm ${hasChildren ? 'font-semibold text-gray-800' : 'font-normal'}`}>{node.id} - {node.name}</span>
            </div>
             {isOpen && hasChildren && (
                <div className="mt-1">
                    {node.children.map((child) => (
                        <AccountNode key={child.id} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

const PlanoDeContas = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{planoDeContasData.name}</h3>
        <div>
            {planoDeContasData.children.map(node => (
                <AccountNode key={node.id} node={node} />
            ))}
        </div>
    </div>
  );
};

export default PlanoDeContas;