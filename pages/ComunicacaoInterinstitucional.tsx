
import React, { useState, useMemo, lazy, Suspense } from 'react';
import { PlusCircle, Inbox, Send, Archive, ChevronLeft, ChevronRight, Search, Paperclip, Reply } from 'lucide-react';
import { useNotification } from '../components/Notification';

const NovaComunicacaoModal = lazy(() => import('../components/NovaComunicacaoModal'));

type Comunicacao = {
    id: string;
    subject: string;
    from: string;
    to: string;
    date: string;
    status: 'Enviado' | 'Recebido' | 'Lido' | 'Respondido';
    body: string;
    priority: 'Normal' | 'Urgente';
};

const mockComunicacoes: Comunicacao[] = [
  { id: 'COM-01', subject: 'Alerta de Embarcação Suspeita - Costa de Cabinda', from: 'Marinha de Guerra', to: 'SME, PGFA', date: '2024-07-28 10:30', status: 'Lido', priority: 'Urgente', body: 'Recebemos informações sobre uma embarcação não identificada a 20 milhas da costa de Cabinda. Coordenadas: 5.57° S, 12.19° E. Solicitamos verificação e possível interceção.' },
  { id: 'COM-02', subject: 'Pedido de Reforço de Pessoal - Posto do Luvo', from: 'PGFA', to: 'MININT', date: '2024-07-27 15:00', status: 'Respondido', priority: 'Normal', body: 'Devido ao aumento do fluxo de mercadorias, solicitamos um reforço de 5 agentes para o Posto Fronteiriço do Luvo (Zaire) durante o próximo mês.' },
  { id: 'COM-03', subject: 'Relatório de Apreensão de Mercadorias', from: 'AGT', to: 'CGCF-Direção', date: '2024-07-26 11:00', status: 'Recebido', priority: 'Normal', body: 'Em anexo, o relatório consolidado de mercadorias apreendidas na fronteira de Santa Clara (Cunene) para o mês de Junho/2024.' },
];

const ComunicacaoInterinstitucionalPage: React.FC = () => {
    const [comunicacoes, setComunicacoes] = useState(mockComunicacoes);
    const [selected, setSelected] = useState<Comunicacao | null>(mockComunicacoes[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addNotification } = useNotification();

    const handleSave = (data: Omit<Comunicacao, 'id' | 'status' | 'date' | 'from'>) => {
        const newComm: Comunicacao = {
            ...data,
            id: `COM-${String(comunicacoes.length + 1).padStart(2, '0')}`,
            from: 'CGCF-UTL',
            status: 'Enviado',
            date: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
        };
        setComunicacoes(current => [newComm, ...current]);
        addNotification('Comunicação enviada com sucesso.', 'success', 'Mensagem Enviada');
    };

    return (
        <>
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Comunicação Interinstitucional</h1>
                        <p className="text-gray-600">Centralize comunicações entre órgãos (migração, polícia, saúde, etc).</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <PlusCircle className="h-5 w-5 mr-2" /> Nova Comunicação
                    </button>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex h-[600px]">
                    {/* Sidebar */}
                    <div className="w-1/3 border-r border-gray-200 flex flex-col">
                        <div className="p-4 border-b">
                            <input type="text" placeholder="Pesquisar..." className="w-full rounded-md border-gray-300"/>
                        </div>
                        <div className="overflow-y-auto">
                            {comunicacoes.map(comm => (
                                <div key={comm.id} onClick={() => setSelected(comm)} className={`p-4 border-b cursor-pointer ${selected?.id === comm.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                    <div className="flex justify-between items-start">
                                        <p className={`font-bold ${selected?.id === comm.id ? 'text-blue-800' : 'text-gray-800'}`}>{comm.from}</p>
                                        <span className="text-xs text-gray-500">{comm.date.split(' ')[0]}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 truncate">{comm.subject}</p>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                                      <span className={`w-2 h-2 rounded-full mr-2 ${comm.priority === 'Urgente' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
                                      {comm.priority}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-2/3 flex flex-col">
                        {selected ? (
                            <>
                                <div className="p-4 border-b">
                                    <h2 className="text-lg font-bold text-gray-900">{selected.subject}</h2>
                                    <div className="text-sm text-gray-600 mt-1">
                                        <strong>De:</strong> {selected.from} <br/>
                                        <strong>Para:</strong> {selected.to}
                                    </div>
                                </div>
                                <div className="p-6 overflow-y-auto flex-grow">
                                    <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{selected.body}</p>
                                </div>
                                <div className="p-4 border-t bg-gray-50 flex justify-end space-x-2">
                                    <button className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg flex items-center text-sm"><Archive size={16} className="mr-2"/> Arquivar</button>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center text-sm"><Reply size={16} className="mr-2"/> Responder</button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">Selecione uma comunicação para visualizar.</div>
                        )}
                    </div>
                </div>
            </div>
            <Suspense fallback={null}>
                <NovaComunicacaoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
            </Suspense>
        </>
    );
};

export default ComunicacaoInterinstitucionalPage;
