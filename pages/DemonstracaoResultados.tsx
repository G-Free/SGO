import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, File, Printer, Activity, TrendingUp, TrendingDown, Scale } from 'lucide-react';

declare global {
    interface Window { jspdf: any; }
}

const mockLancamentosContabeis = [
  { id: 'LC-001', date: '2024-07-25', description: 'Compra de material de escritório', entries: [{ account: '1.1.2.01', debit: 85000, credit: 0 }, { account: '1.1.1.01', debit: 0, credit: 85000 }] },
  { id: 'LC-002', date: '2024-07-22', description: 'Receita de taxa portuária', entries: [{ account: '1.1.1.02', debit: 750000, credit: 0 }, { account: '3.1.1.01', debit: 0, credit: 750000 }] },
  { id: 'LC-003', date: '2024-07-25', description: 'Pagamento de consultoria', entries: [{ account: '4.1.2.03', debit: 1500000, credit: 0 }, { account: '1.1.1.02', debit: 0, credit: 1500000 }] },
];

const currencyFormatter = new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' });

const DemonstracaoResultadosPage: React.FC = () => {
    const navigate = useNavigate();
    const [lancamentos] = useState(mockLancamentosContabeis);
    const [filters, setFilters] = useState({ startDate: '2024-01-01', endDate: '2024-12-31' });

    const dreData = useMemo(() => {
        const receitas: { name: string, value: number }[] = [];
        const despesas: { name: string, value: number }[] = [];
        let totalReceitas = 0;
        let totalDespesas = 0;

        const filteredLancamentos = lancamentos.filter(l => l.date >= filters.startDate && l.date <= filters.endDate);

        filteredLancamentos.forEach(lancamento => {
            lancamento.entries.forEach(entry => {
                const valorReceita = entry.credit - entry.debit;
                const valorDespesa = entry.debit - entry.credit;

                if (entry.account.startsWith('3') && valorReceita > 0) {
                    receitas.push({ name: lancamento.description, value: valorReceita });
                    totalReceitas += valorReceita;
                }
                if (entry.account.startsWith('4') && valorDespesa > 0) {
                    despesas.push({ name: lancamento.description, value: valorDespesa });
                    totalDespesas += valorDespesa;
                }
            });
        });

        return {
            receitas, totalReceitas,
            despesas, totalDespesas,
            resultadoLiquido: totalReceitas - totalDespesas
        };
    }, [lancamentos, filters]);

    const handleExportPDF = () => {
        if (!window.jspdf || !window.jspdf.jsPDF) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text("Demonstração de Resultados do Exercício", 15, 20);
        doc.setFontSize(10);
        doc.text(`Período de: ${filters.startDate} a ${filters.endDate}`, 15, 28);
        let y = 40;

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text("Receitas", 15, y);
        y += 7;
        (doc as any).autoTable({
            startY: y,
            head: [['Descrição', 'Valor']],
            body: dreData.receitas.map(r => [r.name, currencyFormatter.format(r.value)]),
            foot: [['Total Receitas', currencyFormatter.format(dreData.totalReceitas)]],
            footStyles: { fontStyle: 'bold' }
        });
        y = (doc as any).lastAutoTable.finalY + 10;
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text("Despesas", 15, y);
        y += 7;
        (doc as any).autoTable({
            startY: y,
            head: [['Descrição', 'Valor']],
            body: dreData.despesas.map(d => [d.name, currencyFormatter.format(d.value)]),
            foot: [['Total Despesas', currencyFormatter.format(dreData.totalDespesas)]],
            footStyles: { fontStyle: 'bold' }
        });
        y = (doc as any).lastAutoTable.finalY + 15;
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Resultado Líquido: ${currencyFormatter.format(dreData.resultadoLiquido)}`, 15, y);

        doc.save('demonstracao_resultados.pdf');
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center"><Activity className="mr-3"/>Demonstração de Resultados</h1>
                    <p className="text-gray-600">Analise o desempenho financeiro da unidade num determinado período.</p>
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

            <div className="bg-white p-8 rounded-lg border border-gray-200 max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-center mb-2">Demonstração de Resultados</h2>
                <p className="text-center text-gray-500 mb-8">{`Período de ${filters.startDate} a ${filters.endDate}`}</p>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold flex items-center text-green-700 mb-2"><TrendingUp className="mr-2"/>Receitas</h3>
                        <div className="border-t border-b divide-y">
                            {dreData.receitas.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 px-2">
                                    <span className="text-gray-700">{item.name}</span>
                                    <span className="font-mono text-gray-800">{currencyFormatter.format(item.value)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center py-2 px-2 bg-gray-50 rounded-b-md">
                            <span className="font-bold text-gray-800">Total de Receitas</span>
                            <span className="font-bold font-mono text-green-700">{currencyFormatter.format(dreData.totalReceitas)}</span>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold flex items-center text-red-700 mb-2"><TrendingDown className="mr-2"/>Despesas</h3>
                        <div className="border-t border-b divide-y">
                            {dreData.despesas.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 px-2">
                                    <span className="text-gray-700">{item.name}</span>
                                    <span className="font-mono text-gray-800">({currencyFormatter.format(item.value)})</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center py-2 px-2 bg-gray-50 rounded-b-md">
                            <span className="font-bold text-gray-800">Total de Despesas</span>
                            <span className="font-bold font-mono text-red-700">({currencyFormatter.format(dreData.totalDespesas)})</span>
                        </div>
                    </div>
                    
                    <div className="pt-6 border-t-2 border-gray-300">
                        <div className="flex justify-between items-center p-3 rounded-md bg-slate-100">
                            <h3 className="text-lg font-bold flex items-center text-gray-900"><Scale className="mr-2"/>Resultado Líquido do Período</h3>
                            <span className={`text-xl font-bold font-mono ${dreData.resultadoLiquido >= 0 ? 'text-green-700' : 'text-red-700'}`}>{currencyFormatter.format(dreData.resultadoLiquido)}</span>
                        </div>
                         <p className="text-center text-sm text-gray-500 mt-2">
                            {dreData.resultadoLiquido >= 0 ? 'Lucro' : 'Prejuízo'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemonstracaoResultadosPage;