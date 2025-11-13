import React, { useState, useMemo } from 'react';
import { X, Save, Plus, Trash2, AlertCircle } from 'lucide-react';

// Simplified flat list for dropdown
const flatAccounts = [
  { id: '1.1.1.01', name: 'Caixa' }, { id: '1.1.1.02', name: 'Banco' },
  { id: '1.1.2.01', name: 'Material de Escritório' }, { id: '2.1.1', name: 'Fornecedores' },
  { id: '3.1.1.01', name: 'Receitas Operacionais' }, { id: '4.1.1', name: 'Despesas com Pessoal' },
  { id: '4.1.2.03', name: 'Serviços de Terceiros' },
];

const currencyFormatter = new Intl.NumberFormat('pt-AO', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const NovoLancamentoContabilModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (data: any) => void }> = ({ isOpen, onClose, onSave }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [entries, setEntries] = useState([
        { account: '', debit: '', credit: '' },
        { account: '', debit: '', credit: '' },
    ]);

    const handleEntryChange = (index: number, field: 'account' | 'debit' | 'credit', value: string) => {
        const newEntries = [...entries];
        const entry = { ...newEntries[index] };
        
        entry[field] = value;
        if (field === 'debit' && value !== '') entry.credit = '';
        if (field === 'credit' && value !== '') entry.debit = '';

        newEntries[index] = entry;
        setEntries(newEntries);
    };

    const addEntry = () => {
        setEntries([...entries, { account: '', debit: '', credit: '' }]);
    };
    
    const removeEntry = (index: number) => {
        if (entries.length > 2) {
            setEntries(entries.filter((_, i) => i !== index));
        }
    };
    
    const { totalDebit, totalCredit, isBalanced } = useMemo(() => {
        const totals = entries.reduce((acc, entry) => ({
            debit: acc.debit + (parseFloat(entry.debit) || 0),
            credit: acc.credit + (parseFloat(entry.credit) || 0),
        }), { debit: 0, credit: 0 });

        return {
            totalDebit: totals.debit,
            totalCredit: totals.credit,
            isBalanced: totals.debit > 0 && totals.debit === totals.credit,
        };
    }, [entries]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isBalanced) return;

        const lancamento = {
            date,
            description,
            entries: entries
                .filter(e => e.account && (e.debit || e.credit))
                .map(e => ({
                    account: e.account,
                    accountName: flatAccounts.find(a => a.id === e.account)?.name || 'N/A',
                    debit: parseFloat(e.debit) || 0,
                    credit: parseFloat(e.credit) || 0,
                }))
        };
        onSave(lancamento);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-slate-50 rounded-lg shadow-xl w-full max-w-3xl" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-4 border-b flex justify-between items-center bg-white rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800">Novo Lançamento Contabilístico</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium">Descrição</label>
                                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 w-full rounded-md border-gray-300" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Data</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full rounded-md border-gray-300" required />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                           <div className="grid grid-cols-10 gap-2 text-xs font-medium text-gray-500">
                               <div className="col-span-4">Conta</div>
                               <div className="col-span-2 text-right">Débito</div>
                               <div className="col-span-2 text-right">Crédito</div>
                               <div className="col-span-2"></div>
                           </div>
                            {entries.map((entry, index) => (
                                <div key={index} className="grid grid-cols-10 gap-2 items-center">
                                    <select value={entry.account} onChange={e => handleEntryChange(index, 'account', e.target.value)} className="col-span-4 rounded-md border-gray-300 text-sm" required>
                                        <option value="">Selecione uma conta</option>
                                        {flatAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.id} - {acc.name}</option>)}
                                    </select>
                                    <input type="number" step="0.01" placeholder="0,00" value={entry.debit} onChange={e => handleEntryChange(index, 'debit', e.target.value)} className="col-span-2 rounded-md border-gray-300 text-sm text-right"/>
                                    <input type="number" step="0.01" placeholder="0,00" value={entry.credit} onChange={e => handleEntryChange(index, 'credit', e.target.value)} className="col-span-2 rounded-md border-gray-300 text-sm text-right"/>
                                    <div className="col-span-2 flex justify-end items-center">
                                         {entries.length > 2 && <button type="button" onClick={() => removeEntry(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16}/></button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                         <button type="button" onClick={addEntry} className="text-sm text-blue-600 font-semibold flex items-center"><Plus size={16} className="mr-1"/> Adicionar linha</button>

                         <div className="flex justify-end pt-4 border-t">
                             <div className="grid grid-cols-2 gap-4 w-1/2 text-right">
                                 <span className="font-semibold">Total Débito:</span> <span className="font-mono">{currencyFormatter.format(totalDebit)}</span>
                                 <span className="font-semibold">Total Crédito:</span> <span className="font-mono">{currencyFormatter.format(totalCredit)}</span>
                             </div>
                         </div>
                         {!isBalanced && totalDebit + totalCredit > 0 && (
                            <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-md text-sm">
                                <AlertCircle size={16} className="mr-2"/> O total de débitos deve ser igual ao total de créditos.
                            </div>
                         )}
                    </div>
                    <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                        <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg">Cancelar</button>
                        <button type="submit" disabled={!isBalanced} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            <Save size={16} className="mr-2"/> Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default NovoLancamentoContabilModal;