

import React, { useState, useMemo, lazy, Suspense } from 'react';
import { PlusCircle, File, Search, Edit, Trash2, Library, Users, Phone } from 'lucide-react';
import { useNotification } from '../components/Notification';

const NovoOrgaoModal = lazy(() => import('../components/NovoOrgaoModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));
const DetalheOrgaoModal = lazy(() => import('../components/DetalheOrgaoModal'));

declare global {
    interface Window { jspdf: any; }
}

const mockOrgaosData = [
  { id: 'ORG-01', name: 'Ministério do Interior', acronym: 'MININT', type: 'Ministério', responsible: 'Manuel Homem', contactEmail: 'geral@minint.gov.ao', responsibleContact: '+244 222 123 456', address: 'Av. 4 de Fevereiro, Luanda', website: 'https://www.minint.gov.ao', status: 'Ativo' },
  { id: 'ORG-02', name: 'Serviço de Migração e Estrangeiros', acronym: 'SME', type: 'Serviço Executivo', responsible: 'João da Silva', contactEmail: 'geral@sme.gov.ao', responsibleContact: '+244 222 234 567', address: 'Rua 17 de Setembro, Luanda', website: 'https://www.sme.gov.ao', status: 'Ativo' },
  { id: 'ORG-03', name: 'Polícia de Guarda Fronteiras de Angola', acronym: 'PGFA', type: 'Polícia', responsible: 'Pedro Kiala', contactEmail: 'comando@pgfa.gov.ao', responsibleContact: '+244 222 345 678', address: 'Comando Geral da Polícia, Luanda', website: 'https://www.policianacional.gov.ao', status: 'Ativo' },
  { id: 'ORG-04', name: 'Administração Geral Tributária', acronym: 'AGT', type: 'Serviço Executivo', responsible: 'Maria Fernandes', contactEmail: 'info@agt.minfin.gov.ao', responsibleContact: '+244 222 456 789', address: 'Largo da Mutamba, Luanda', website: 'https://www.agt.minfin.gov.ao', status: 'Ativo' },
  { id: 'ORG-05', name: 'Serviço de Investigação Criminal', acronym: 'SIC', type: 'Serviço Executivo', responsible: 'Carlos Almeida', contactEmail: 'direcao@sic.gov.ao', responsibleContact: '+244 222 567 890', address: 'Av. Ho Chi Minh, Luanda', website: 'https://www.sic.gov.ao', status: 'Inativo' },
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

const OrgaosEComposicaoPage: React.FC = () => {
    const [orgaos, setOrgaos] = useState(mockOrgaosData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orgaoToEdit, setOrgaoToEdit] = useState<any | null>(null);
    const [orgaoToDelete, setOrgaoToDelete] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { addNotification } = useNotification();
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedOrgao, setSelectedOrgao] = useState<any | null>(null);

    const handleSave = (data: any) => {
        if (data.id) {
            setOrgaos(current => current.map(o => o.id === data.id ? data : o));
            addNotification(`Órgão "${data.name}" atualizado com sucesso.`, 'success', 'Atualização');
        } else {
            const newId = `ORG-${String(orgaos.length + 1).padStart(2, '0')}`;
            setOrgaos(current => [{ ...data, id: newId }, ...current]);
            addNotification(`Órgão "${data.name}" adicionado com sucesso.`, 'success', 'Novo Órgão');
        }
    };

    const handleOpenCreateModal = () => { setOrgaoToEdit(null); setIsModalOpen(true); };
    const handleOpenEditModal = (orgao: any) => { setOrgaoToEdit(orgao); setIsModalOpen(true); };
    const handleOpenDeleteModal = (orgao: any) => setOrgaoToDelete(orgao);

    const handleConfirmDelete = () => {
        if (orgaoToDelete) {
            setOrgaos(current => current.filter(o => o.id !== orgaoToDelete.id));
            addNotification(`Órgão "${orgaoToDelete.name}" removido.`, 'success', 'Remoção');
            setOrgaoToDelete(null);
        }
    };
    
    const handleViewDetails = (orgao: any) => {
        setSelectedOrgao(orgao);
        setIsDetailsModalOpen(true);
    };

    const filteredOrgaos = useMemo(() => {
        return orgaos.filter(o =>
            o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orgaos, searchTerm]);
    
    const escapeCSV = (value: any): string => {
      const strValue = String(value ?? '');
      if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    };

    const handleExport = (format: 'CSV' | 'PDF') => {
        if (filteredOrgaos.length === 0) {
            addNotification('Não há dados para exportar com os filtros atuais.', 'info', 'Exportação');
            return;
        }

        if (format === 'CSV') {
            const headers = ["ID", "Nome", "Sigla", "Tipo", "Responsável", "Email", "Telefone", "Endereço", "Website", "Estado"];
            const csvContent = [
                headers.join(','),
                ...filteredOrgaos.map(o => [
                    escapeCSV(o.id), escapeCSV(o.name), escapeCSV(o.acronym), escapeCSV(o.type), 
                    escapeCSV(o.responsible), escapeCSV(o.contactEmail), escapeCSV(o.responsibleContact), 
                    escapeCSV(o.address), escapeCSV(o.website), escapeCSV(o.status)
                ].join(','))
            ].join('\n');
            
            const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'orgaos_cgcf.csv';
            link.click();
            URL.revokeObjectURL(link.href);

        } else {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            (doc as any).autoTable({
                head: [['Nome', 'Sigla', 'Tipo', 'Responsável', 'Contacto']],
                body: filteredOrgaos.map(o => [o.name, o.acronym, o.type, o.responsible, `${o.contactEmail}\n${o.responsibleContact || ''}`]),
            });
            doc.save('orgaos_cgcf.pdf');
        }
    };

    return (
        <>
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Órgãos e Composição</h1>
                        <p className="text-gray-600">Gestão das entidades que compõem o CGCF.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => handleExport('PDF')} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg flex items-center"><File className="h-4 w-4 mr-2" /> PDF</button>
                        <button onClick={() => handleExport('CSV')} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg flex items-center"><File className="h-4 w-4 mr-2" /> CSV</button>
                        <button onClick={handleOpenCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                            <PlusCircle className="h-5 w-5 mr-2" /> Adicionar Órgão
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <StatCard icon={Library} title="Total de Órgãos" value={String(orgaos.length)} color="text-blue-500" />
                    <StatCard icon={Users} title="Serviços Executivos" value={String(orgaos.filter(o => o.type === 'Serviço Executivo').length)} color="text-purple-500" />
                    <StatCard icon={Phone} title="Órgãos Ativos" value={String(orgaos.filter(o => o.status === 'Ativo').length)} color="text-green-500" />
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Pesquisar por nome, sigla..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-base" />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome do Órgão</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsável</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrgaos.map(orgao => (
                                    <tr key={orgao.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetails(orgao)}>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{orgao.name}</div>
                                            <div className="text-sm text-gray-500">{orgao.acronym}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{orgao.type}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{orgao.responsible}</div>
                                            <div className="text-sm text-gray-500">{orgao.contactEmail}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${orgao.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{orgao.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button onClick={(e) => { e.stopPropagation(); handleOpenEditModal(orgao); }} className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-gray-100" title="Editar"><Edit size={16}/></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleOpenDeleteModal(orgao); }} className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-gray-100" title="Apagar"><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Suspense fallback={null}>
                <NovoOrgaoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} orgaoToEdit={orgaoToEdit} />
                <ConfirmationModal isOpen={!!orgaoToDelete} onClose={() => setOrgaoToDelete(null)} onConfirm={handleConfirmDelete} title="Confirmar Exclusão" message={`Deseja realmente remover o órgão "${orgaoToDelete?.name}"?`} />
                 <DetalheOrgaoModal 
                    isOpen={isDetailsModalOpen} 
                    onClose={() => setIsDetailsModalOpen(false)} 
                    orgao={selectedOrgao} 
                />
            </Suspense>
        </>
    );
};

export default OrgaosEComposicaoPage;