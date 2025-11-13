import React, { useMemo } from 'react';
import { X, FileSpreadsheet, Printer } from 'lucide-react';

const planoDeContasData = {
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

const currencyFormatter = new Intl.NumberFormat('pt-AO', {
  style: 'currency',
  currency: 'AOA',
});

// Helper to flatten the chart of accounts
const flattenAccounts = (nodes: any[]) => {
    let flat: any[] = [];
    nodes.forEach(node => {
        if (!node.children || node.children.length === 0) {
            flat.push({ id: node.id, name: node.name });
        } else {
            flat = [...flat, ...flattenAccounts(node.children)];
        }
    });
    return flat;
};
const allAccounts = flattenAccounts(planoDeContasData.children);

const BalanceteModal: React.FC<{ isOpen: boolean, onClose: () => void, lancamentos: any[] }> = ({ isOpen, onClose, lancamentos }) => {
    
    const balanceteData = useMemo(() => {
        const accountTotals: { [key: string]: { debit: number, credit: number } } = {};

        allAccounts.forEach(acc => {
            accountTotals[acc.id] = { debit: 0, credit: 0 };
        });

        lancamentos.forEach(lancamento => {
            lancamento.entries.forEach((entry: any) => {
                if (accountTotals[entry.account]) {
                    accountTotals[entry.account].debit += entry.debit;
                    accountTotals[entry.account].credit += entry.credit;
                }
            });
        });
        
        const totals = Object.values(accountTotals).reduce((acc, val) => ({
            debit: acc.debit + val.debit,
            credit: acc.credit + val.credit
        }), { debit: 0, credit: 0 });

        return { accountTotals, totals };
    }, [lancamentos]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center"><FileSpreadsheet className="mr-3"/> Balancete de Verificação</h2>
                    <div className="flex items-center space-x-2">
                        <button className="text-sm flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-lg"><Printer size={16} className="mr-2"/> Imprimir</button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={20}/></button>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Conta</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Descrição</th>
                                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Débito</th>
                                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Crédito</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {allAccounts.map(acc => {
                                const totals = balanceteData.accountTotals[acc.id];
                                if (!totals || (totals.debit === 0 && totals.credit === 0)) return null;
                                return (
                                    <tr key={acc.id}>
                                        <td className="px-4 py-2 font-mono text-sm">{acc.id}</td>
                                        <td className="px-4 py-2 text-sm">{acc.name}</td>
                                        <td className="px-4 py-2 text-right text-sm font-mono">{totals.debit > 0 ? currencyFormatter.format(totals.debit) : '-'}</td>
                                        <td className="px-4 py-2 text-right text-sm font-mono">{totals.credit > 0 ? currencyFormatter.format(totals.credit) : '-'}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                             <tr>
                                <th colSpan={2} className="px-4 py-3 text-right text-sm font-bold text-gray-800">TOTAIS</th>
                                <th className="px-4 py-3 text-right text-sm font-bold text-gray-800 font-mono">{currencyFormatter.format(balanceteData.totals.debit)}</th>
                                <th className="px-4 py-3 text-right text-sm font-bold text-gray-800 font-mono">{currencyFormatter.format(balanceteData.totals.credit)}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BalanceteModal;