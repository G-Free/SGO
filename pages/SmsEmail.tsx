import React, { useState, useMemo, lazy, Suspense } from 'react';
import { Mail, MessageSquare, Send, XCircle, CreditCard, PlusCircle, Search, Eye, Trash2 } from 'lucide-react';

const NovaComunicacaoSmsEmailModal = lazy(() => import('../components/NovaComunicacaoSmsEmailModal'));
const DetalheComunicacaoSmsEmailModal = lazy(() => import('../components/DetalheComunicacaoSmsEmailModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));


const mockComms = [
  { id: 'COM-001', type: 'Email', recipient: 'gestores@sgo.gov.ao', subject: 'Atualização do Sistema', sentAt: '2024-07-28 09:00', status: 'Entregue', body: 'Caros Gestores,\n\nInformamos que o sistema SGO será atualizado hoje à noite, entre as 23h e as 00h. Durante este período, o sistema poderá apresentar instabilidade.\n\nAtenciosamente,\nA Equipa de TI' },
  { id: 'COM-002', type: 'SMS', recipient: '+2449XXXXXXXX', subject: 'Alerta: Manutenção programada para as 23h.', sentAt: '2024-07-27 18:30', status: 'Entregue', body: 'Alerta SGO: Manutenção programada para hoje, 27/07, entre as 23:00 e as 00:00. Sistema poderá ficar indisponível.' },
  { id: 'COM-003', type: 'Email', recipient: 'tecnico.invalido@sgo.gov.ao', subject: 'Relatório Semanal', sentAt: '2024-07-26 17:00', status: 'Falhou', body: 'Segue em anexo o relatório semanal de atividades.' },
];


const statusColors: { [key: string]: string } = {
    'Entregue': 'bg-green-100 text-green-800',
    'Enviado': 'bg-blue-100 text-blue-800',
    'Falhou': 'bg-red-100 text-red-800',
};

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, color: string }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
            <p className="text-base font-medium text-gray-600">{title}</p>
            <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
);

const SmsEmailPage: React.FC = () => {
    const [comms, setComms] = useState(mockComms);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedComm, setSelectedComm] = useState<any | null>(null);
    const [commToDelete, setCommToDelete] = useState<any | null>(null);

    const handleSave = (data: any) => {
        const newComm = {
            ...data,
            id: `COM-${String(comms.length + 1).padStart(3, '0')}`,
            sentAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
            status: 'Enviado'
        };
        setComms(current => [newComm, ...current]);
    };

    const handleViewDetails = (comm: any) => {
        setSelectedComm(comm);
        setIsDetailsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (commToDelete) {
            setComms(current => current.filter(c => c.id !== commToDelete.id));
            setCommToDelete(null);
        }
    };

    const filteredComms = useMemo(() => {
        return comms.filter(c =>
            c.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.subject.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [comms, searchTerm]);

    return (
        <>
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Comunicações SMS & Email</h1>
                        <p className="text-gray-600">Envie e monitorize comunicações por SMS e Email.</p>
                    </div>
                     <button onClick={() => setIsCreateModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <PlusCircle className="h-5 w-5 mr-2" /> Nova Comunicação
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard icon={MessageSquare} title="SMS Enviados (hoje)" value="125" color="text-cyan-500" />
                    <StatCard icon={Mail} title="Emails Enviados (hoje)" value="42" color="text-blue-500" />
                    <StatCard icon={XCircle} title="Falhas na Entrega (24h)" value="1" color="text-red-500" />
                    <StatCard icon={CreditCard} title="Saldo de Créditos (SMS)" value="4,875" color="text-green-500" />
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Histórico de Comunicações</h3>
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-base" />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destinatário</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assunto/Mensagem</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                {filteredComms.map(comm => (
                                    <tr key={comm.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetails(comm)}>
                                        <td className="px-6 py-4 text-sm text-gray-600">{comm.sentAt}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800">{comm.type}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{comm.recipient}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800 max-w-md truncate">{comm.subject}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[comm.status]}`}>{comm.status}</span></td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button onClick={(e) => { e.stopPropagation(); handleViewDetails(comm); }} className="p-1.5 rounded-full hover:bg-gray-200" title="Ver Detalhes"><Eye size={16} className="text-gray-600"/></button>
                                                <button onClick={(e) => { e.stopPropagation(); setCommToDelete(comm); }} className="p-1.5 rounded-full hover:bg-red-100" title="Apagar"><Trash2 size={16} className="text-red-600"/></button>
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
                <NovaComunicacaoSmsEmailModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleSave} />
                <DetalheComunicacaoSmsEmailModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} comm={selectedComm} />
                <ConfirmationModal isOpen={!!commToDelete} onClose={() => setCommToDelete(null)} onConfirm={handleConfirmDelete} title="Confirmar Exclusão" message={`Deseja realmente apagar esta comunicação?`}/>
            </Suspense>
        </>
    );
};

export default SmsEmailPage;