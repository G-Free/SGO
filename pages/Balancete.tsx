import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, File, Printer, Scale, FileSpreadsheet } from 'lucide-react';

declare global {
    interface Window { jspdf: any; }
}

// Mock data - In a real app, this would be fetched or passed as props
const mockLancamentosContabeis = [
  { id: 'LC-001', date: '2024-07-25', description: 'Compra de material de escritório', entries: [{ account: '1.1.2.01', debit: 85000, credit: 0 }, { account: '1.1.1.01', debit: 0, credit: 85000 }] },
  { id: 'LC-002', date: '2024-07-22', description: 'Receita de taxa portuária', entries: [{ account: '1.1.1.02', debit: 750000, credit: 0 }, { account: '3.1.1.01', debit: 0, credit: 750000 }] },
  { id: 'LC-003', date: '2024-07-25', description: 'Pagamento de consultoria', entries: [{ account: '4.1.2.03', debit: 1500000, credit: 0 }, { account: '1.1.1.02', debit: 0, credit: 1500000 }] },
];

const planoDeContasData = { id: 'root', name: 'Plano de Contas', children: [ { id: '1', name: 'Ativo', children: [ { id: '1.1', name: 'Ativo Circulante', children: [ { id: '1.1.1', name: 'Caixa e Equivalentes', children: [ { id: '1.1.1.01', name: 'Caixa' }, { id: '1.1.1.02', name: 'Banco' }, ]}, { id: '1.1.2', name: 'Estoques', children: [ { id: '1.1.2.01', name: 'Material de Escritório' }, ]}, ]}, ]}, { id: '2', name: 'Passivo', children: [ { id: '2.1', name: 'Passivo Circulante', children: [ { id: '2.1.1', name: 'Fornecedores' }, ]}, ]}, { id: '3', name: 'Capital Próprio e Receitas', children: [ { id: '3.1', name: 'Receitas', children: [ { id: '3.1.1', name: 'Receitas Operacionais', children: [ { id: '3.1.1.01', name: 'Receitas Operacionais' }, ]}, ]}, ]}, { id: '4', name: 'Custos e Despesas', children: [ { id: '4.1', name: 'Despesas Operacionais', children: [ { id: '4.1.1', name: 'Despesas com Pessoal' }, { id: '4.1.2', name: 'Fornecimentos e Serviços Externos', children: [ { id: '4.1.2.01', name: 'Combustíveis' }, { id: '4.1.2.02', name: 'Rendas e Alugueres' }, { id: '4.1.2.03', name: 'Serviços de Terceiros' }, ]}, ]}, ]}, ]};

const currencyFormatter = new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' });

const flattenAccounts = (nodes: any[]): { id: string; name: string }[] => {
    let flat: { id: string; name: string }[] = [];
    nodes.forEach(node => {
        if (!node.children || node.children.length === 0) {
            flat.push({ id: node.id, name: node.name });
        } else {
            flat.push({ id: node.id, name: node.name }); // Include parent accounts
            flat = [...flat, ...flattenAccounts(node.children)];
        }
    });
    return flat;
};
const allAccounts = flattenAccounts(planoDeContasData.children);

const BalancetePage: React.FC = () => {
    const navigate = useNavigate();
    const [lancamentos] = useState(mockLancamentosContabeis);
    const [filters, setFilters] = useState({ startDate: '2024-01-01', endDate: '2024-12-31' });

    const balanceteData = useMemo(() => {
        const accountTotals: { [key: string]: { debit: number, credit: number } } = {};
        allAccounts.forEach(acc => { accountTotals[acc.id] = { debit: 0, credit: 0 }; });

        const filteredLancamentos = lancamentos.filter(l => l.date >= filters.startDate && l.date <= filters.endDate);

        filteredLancamentos.forEach(lancamento => {
            lancamento.entries.forEach((entry: any) => {
                if (accountTotals[entry.account]) {
                    accountTotals[entry.account].debit += entry.debit;
                    accountTotals[entry.account].credit += entry.credit;
                }
            });
        });
        
        const totals = Object.values(accountTotals).reduce((acc, val) => ({
            debit: acc.debit + val.debit, credit: acc.credit + val.credit
        }), { debit: 0, credit: 0 });

        return { accountTotals, totals, isBalanced: totals.debit === totals.credit };
    }, [lancamentos, filters]);
    
    const handleExportPDF = () => {
        if (!window.jspdf || !window.jspdf.jsPDF) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text("Balancete de Verificação", 15, 20);
        doc.setFontSize(10);
        doc.text(`Período de: ${filters.startDate} a ${filters.endDate}`, 15, 28);

        (doc as any).autoTable({
            startY: 35,
            head: [['Conta', 'Descrição', 'Débito', 'Crédito']],
            body: allAccounts
                .filter(acc => balanceteData.accountTotals[acc.id]?.debit > 0 || balanceteData.accountTotals[acc.id]?.credit > 0)
                .map(acc => [
                    acc.id,
                    acc.name,
                    currencyFormatter.format(balanceteData.accountTotals[acc.id].debit),
                    currencyFormatter.format(balanceteData.accountTotals[acc.id].credit)
                ]),
            foot: [[
                'TOTAIS', '', 
                currencyFormatter.format(balanceteData.totals.debit), 
                currencyFormatter.format(balanceteData.totals.credit)
            ]],
            footStyles: { fontStyle: 'bold', fillColor: [240, 240, 240] },
            headStyles: { fillColor: [0, 43, 127] },
        });

        doc.save('balancete.pdf');
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center"><FileSpreadsheet className="mr-3"/>Balancete de Verificação</h1>
                    <p className="text-gray-600">Verifique a igualdade entre os débitos e créditos totais.</p>
                </div>
                <button onClick={() => navigate(-1)} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg flex items-center"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</button>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="text-sm font-medium">Data de Início</label>
                        <input type="date" value={filters.startDate} onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))} className="mt-1 w-full rounded-md border-gray-300" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Data de Fim</label>
                        <input type="date" value={filters.endDate} onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))} className="mt-1 w-full rounded-md border-gray-300" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleExportPDF} className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center"><File className="h-5 w-5 mr-2" /> PDF</button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Conta</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Descrição</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Débito</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Crédito</th>
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
                 <div className={`mt-4 p-3 rounded-md flex items-center text-sm font-semibold ${balanceteData.isBalanced ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <Scale className="h-5 w-5 mr-3"/>
                    {balanceteData.isBalanced ? "Verificado: O total de débitos é igual ao total de créditos." : "Atenção: Os totais de débito e crédito não são iguais!"}
                </div>
            </div>
        </div>
    );
};

export default BalancetePage;