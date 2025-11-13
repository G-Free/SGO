import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookCopy, PlusCircle, Activity, FileSpreadsheet, Scale, Banknote, Landmark, FileText } from 'lucide-react';

// Lazy load modals
const NovoLancamentoContabilModal = lazy(() => import('../components/NovoLancamentoContabilModal'));
const PlanoDeContas = lazy(() => import('../components/PlanoDeContas'));

const mockLancamentosContabeis = [
  { 
    id: 'LC-001', date: '2024-07-25', description: 'Compra de material de escritório', 
    entries: [
      { account: '1.1.2.01', accountName: 'Material de Escritório', debit: 85000, credit: 0 },
      { account: '1.1.1.01', accountName: 'Caixa', debit: 0, credit: 85000 }
    ] 
  },
  { 
    id: 'LC-002', date: '2024-07-22', description: 'Receita de taxa portuária', 
    entries: [
      { account: '1.1.1.02', accountName: 'Banco', debit: 750000, credit: 0 },
      { account: '3.1.1.01', accountName: 'Receitas Operacionais', debit: 0, credit: 750000 }
    ] 
  },
  { 
    id: 'LC-003', date: '2024-07-25', description: 'Pagamento de consultoria', 
    entries: [
      { account: '4.1.2.03', accountName: 'Serviços de Terceiros', debit: 1500000, credit: 0 },
      { account: '1.1.1.02', accountName: 'Banco', debit: 0, credit: 1500000 }
    ] 
  },
];


const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, color: string }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
            <p className="text-base font-medium text-gray-600">{title}</p>
            <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
);

const currencyFormatter = new Intl.NumberFormat('pt-AO', {
  style: 'currency',
  currency: 'AOA',
});

const ContabilidadePage: React.FC = () => {
    const [lancamentos, setLancamentos] = useState(mockLancamentosContabeis);
    const [isLancamentoModalOpen, setIsLancamentoModalOpen] = useState(false);
    const navigate = useNavigate();

    const { totalAtivos, totalPassivos, patrimonioLiquido, resultadoPeriodo } = useMemo(() => {
      // This is a simplified calculation. Real accounting would be much more complex.
      let ativos = 0;
      let passivos = 0;
      let receitas = 0;
      let despesas = 0;
      
      lancamentos.forEach(lancamento => {
          lancamento.entries.forEach(entry => {
              if (entry.account.startsWith('1')) { // Ativos
                  ativos += entry.debit - entry.credit;
              }
              if (entry.account.startsWith('2')) { // Passivos
                  passivos += entry.credit - entry.debit;
              }
              if (entry.account.startsWith('3')) { // Receitas
                  receitas += entry.credit - entry.debit;
              }
              if (entry.account.startsWith('4')) { // Despesas
                  despesas += entry.debit - entry.credit;
              }
          });
      });
      const resultado = receitas - despesas;
      // PL = Passivos + Resultado (simplified)
      const pl = passivos + resultado;

      return {
          totalAtivos: ativos,
          totalPassivos: passivos,
          patrimonioLiquido: pl,
          resultadoPeriodo: resultado,
      };
    }, [lancamentos]);
    
    const handleSaveLancamento = (novoLancamento: any) => {
      setLancamentos(prev => [
        {
          id: `LC-${String(prev.length + 1).padStart(3, '0')}`,
          ...novoLancamento
        },
        ...prev
      ]);
    };

    return (
        <>
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Módulo de Contabilidade</h1>
                        <p className="text-gray-600">Plano de contas, lançamentos e relatórios contabilísticos.</p>
                    </div>
                     <div className="flex items-center space-x-2">
                        <button onClick={() => navigate('/contabilidade/balancete')} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center">
                            <FileSpreadsheet className="h-5 w-5 mr-2" /> Balancete
                        </button>
                         <button onClick={() => navigate('/contabilidade/dre')} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center">
                            <Activity className="h-5 w-5 mr-2" /> DRE
                        </button>
                        <button onClick={() => setIsLancamentoModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                            <PlusCircle className="h-5 w-5 mr-2" /> Novo Lançamento
                        </button>
                    </div>
                </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={Landmark} title="Total de Ativos" value={currencyFormatter.format(totalAtivos)} color="text-blue-500" />
                    <StatCard icon={Banknote} title="Total de Passivos" value={currencyFormatter.format(totalPassivos)} color="text-orange-500" />
                    <StatCard icon={Scale} title="Património Líquido" value={currencyFormatter.format(patrimonioLiquido)} color="text-purple-500" />
                    <StatCard icon={Activity} title="Resultado do Período" value={currencyFormatter.format(resultadoPeriodo)} color={resultadoPeriodo >= 0 ? 'text-green-500' : 'text-red-500'} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Suspense fallback={<div>A carregar Plano de Contas...</div>}>
                            <PlanoDeContas />
                        </Suspense>
                    </div>
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
                         <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <FileText className="h-5 w-5 mr-3 text-gray-500" />
                            Diário de Lançamentos
                        </h3>
                         <div className="w-full overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {lancamentos.map(lancamento => (
                                        <tr key={lancamento.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{lancamento.date}</td>
                                            <td className="px-4 py-3 text-sm text-gray-800">{lancamento.description}</td>
                                            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{currencyFormatter.format(lancamento.entries[0].debit || lancamento.entries[0].credit)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
             <Suspense fallback={null}>
                <NovoLancamentoContabilModal 
                    isOpen={isLancamentoModalOpen}
                    onClose={() => setIsLancamentoModalOpen(false)}
                    onSave={handleSaveLancamento}
                />
            </Suspense>
        </>
    );
};

export default ContabilidadePage;