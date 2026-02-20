import React, { useState, lazy, Suspense, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
// Fixed missing imports for Users, ShieldAlert, and ClipboardCheck icons
import { 
  Plus, Trash2, MapPin, Save, Send, RefreshCw, Eye, X, Gavel, Package,
  MessageSquare, Clock, Target, Truck, DollarSign, List, ArrowLeft, 
  Paperclip, ChevronDown, Edit, FilePlus, AlertTriangle, CheckCircle2,
  Users, ShieldAlert, ClipboardCheck
} from 'lucide-react';
import { useNotification } from '../components/Notification';
import { useAuth } from '../hooks/useAuth';
import { samplePdfDataUri } from '../data/sample-report';
const PdfViewerModal = lazy(() => import('../components/PdfViewerModal'));

// --- COMPONENTE DE CARTÃO DE SECÇÃO (ESTILO IMAGEM) ---
const SectionCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm mb-6 ${className}`}>
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

// --- COMPONENTE DE TABELA COMPACTA (IGUAL AO LAYOUT DA IMAGEM) ---
const CompactTable: React.FC<{
    columns: { key: string; label: string; width?: string; type?: string; options?: string[] }[];
    data: any[];
    onChange: (newData: any[]) => void;
    emptyMessage: string;
    hasEvidence?: boolean;
    readOnly?: boolean;
}> = ({ columns, data, onChange, emptyMessage, hasEvidence = false, readOnly = false }) => {
    const [newItem, setNewItem] = useState<any>({});

    const handleAddItem = () => {
        const isValid = columns.every(col => newItem[col.key] && newItem[col.key].toString().trim() !== '');
        if (!isValid) return; 
        onChange([...data, { ...newItem, id: Date.now() }]);
        setNewItem({});
    };

    return (
        <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
            <table className="w-full text-left text-[10px]">
                <thead className="bg-gray-50 border-b border-gray-200 text-slate-500">
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className="px-3 py-2.5 font-black uppercase tracking-tighter" style={{ width: col.width }}>
                                {col.label}
                            </th>
                        ))}
                        {hasEvidence && <th className="px-3 py-2.5 w-24 font-black uppercase tracking-tighter">PROVA / ANEXO</th>}
                        {!readOnly && <th className="px-3 py-2.5 w-10 text-center font-black">...</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (hasEvidence ? 2 : 1)} className="px-3 py-6 text-center text-slate-400 italic">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-slate-50 transition-colors">
                                {columns.map(col => (
                                    <td key={col.key} className="px-3 py-2.5 text-slate-700 font-bold">
                                        {item[col.key]}
                                    </td>
                                ))}
                                {hasEvidence && (
                                    <td className="px-3 py-2.5">
                                        <button className="flex items-center gap-1.5 px-2 py-1 border border-gray-200 rounded bg-gray-50 text-[9px] font-black text-slate-500 hover:bg-white shadow-sm transition-all">
                                            <Paperclip size={10} /> Anexar
                                        </button>
                                    </td>
                                )}
                                {!readOnly && (
                                    <td className="px-3 py-2.5 text-center">
                                        <button type="button" onClick={() => onChange(data.filter((_, i) => i !== index))} className="text-rose-400 hover:text-rose-600 p-1">
                                            <Trash2 size={12}/>
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                    {!readOnly && (
                        <tr className="bg-blue-50/10 border-t border-gray-100">
                            {columns.map(col => (
                                <td key={col.key} className="px-2 py-2">
                                    {col.type === 'select' ? (
                                        <select title={`Selecionar ${col.label}`}
                                            value={newItem[col.key] || ''}
                                            onChange={(e) => setNewItem({ ...newItem, [col.key]: e.target.value })}
                                            className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-[10px] outline-none font-bold text-slate-600 shadow-inner"
                                        >
                                            <option value="">Selecione...</option>
                                            {col.options?.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    ) : (
                                        <input
                                            type={col.type || 'text'}
                                            value={newItem[col.key] || ''}
                                            onChange={(e) => setNewItem({ ...newItem, [col.key]: e.target.value })}
                                            className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-[10px] outline-none font-bold text-slate-600 shadow-inner"
                                            placeholder={col.type === 'date' ? 'dd/mm/aaaa' : '...'}
                                        />
                                    )}
                                </td>
                            ))}
                            {hasEvidence && (
                                <td className="px-2 py-2">
                                    <button type="button" className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 border border-gray-200 rounded bg-white text-[9px] font-bold text-slate-400 opacity-50 cursor-not-allowed">
                                        <Paperclip size={10} /> Prova
                                    </button>
                                </td>
                            )}
                            <td className="px-2 py-2 text-center">
                                <button type="button" onClick={handleAddItem} className="text-blue-500 hover:text-blue-700 transition-all p-1">
                                    <FilePlus size={16}/>
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const CriarRelatorioAtividadePage: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotification();
  const { user } = useAuth();
  
  // Pegar dados passados pela navegação (Cockpit)
  const isCorrection = location.state?.isCorrection || false;
  const feedback = location.state?.feedback || null;
  const sourceData = location.state?.activity || null;

  // Estados Dinâmicos (Preenchidos via sourceData se disponível)
  const [activityName, setActivityName] = useState(sourceData?.title || 'Fiscalização Integrada');
  const [startDate, setStartDate] = useState(sourceData?.startDate || '');
  const [endDate, setEndDate] = useState(sourceData?.endDate || '');
  const [reportType, setReportType] = useState('Atividade Operacional');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  // FIX: Changed sourceActivity to sourceData to fix "Cannot find name 'sourceActivity'" error.
  const [preambulo, setPreambulo] = useState(sourceData ? `Relatório referente à atividade operacional "${sourceData.title}".\n\nDETALHES DA MISSÃO:\nTipo de Operação: ${sourceData?.type || 'Marítima'}` : '');
  
  // Tabelas Dinâmicas
  const [encontros, setEncontros] = useState<any[]>([]);
  const [alvos, setAlvos] = useState<any[]>([]);
  const [accoes, setAccoes] = useState<any[]>(sourceData ? [{ data: sourceData.startDate, descricao: sourceData.title, estado: 'Em Andamento' }] : []);
  const [infracoes, setInfracoes] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [objectivos, setObjectivos] = useState<any[]>([]);
  
  // Secção 8: Resultados Gerais
  const [detencoes, setDetencoes] = useState<any[]>([]);
  const [apreensoes, setApreensoes] = useState<any[]>([]);
  const [transportadores, setTransportadores] = useState<any[]>([]);
  const [tributarios, setTributarios] = useState<any[]>([]);

  // Outras Informações
  const [valoresApurados, setValoresApurados] = useState('0 Kz');
  const [estadoMoral, setEstadoMoral] = useState('Alto - Disciplina mantida.');
  const [forcasMeios, setForcasMeios] = useState(sourceData ? `EQUIPA DE FISCALIZAÇÃO:\nJoão Santos, Maria Silva, Pedro Costa` : '');
  const [consideracoes, setConsideracoes] = useState('');

  const [pdfViewerState, setPdfViewerState] = useState({ isOpen: false, url: '', title: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
      if (isCorrection) {
          addNotification("Modo de Rectificação: Por favor, ajuste o relatório conforme as observações do Coordenador.", "info", "Atenção Tática");
      }
  }, [isCorrection, addNotification]);

  const handleAction = (isDraft: boolean) => {
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        if (isDraft) {
            addNotification('Rascunho guardado com sucesso.', 'info', 'Operacional');
            navigate('/atividades', { state: { activeTab: 'relatorios' } });
        } else {
            addNotification('Relatório submetido para validação estratégica.', 'success', 'Submetido');
            setPdfViewerState({
                isOpen: true,
                url: samplePdfDataUri,
                title: `DOCUMENTO OFICIAL: ${activityName}`
            });
        }
    }, 1500);
  };

  const handleBack = () => {
    navigate('/atividades', { state: { activeTab: 'relatorios' } });
  };

  return (
    <div className="w-full pb-32 animate-fadeIn bg-slate-50/30 min-h-screen">
      
      {/* 1. HEADER (TOPO DA IMAGEM) */}
      <div className="container mx-auto px-8 py-8 flex justify-between items-center border-b bg-white border-gray-100 mb-8 shadow-sm sticky top-0 z-40">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{isCorrection ? 'Rectificar Relatório' : 'Novo Relatório'}</h1>
            <span className={`px-3 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shadow-sm border ${isCorrection ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                {isCorrection ? 'Revisão' : 'Rascunho'}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1 font-bold">Gerando relatório para a atividade: {sourceData?.id || activityId || 'ATV-001'}</p>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={handleBack} className="bg-white border border-gray-300 text-slate-600 px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm flex items-center hover:bg-gray-50 transition-all">
                <ArrowLeft size={16} className="mr-2" /> Voltar
            </button>
            <button 
                onClick={() => setPdfViewerState({ isOpen: true, url: samplePdfDataUri, title: `PRÉ-VISUALIZAÇÃO: ${activityName}` })}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg flex items-center hover:bg-black transition-all active:scale-95"
            >
                <Eye size={16} className="mr-2" /> Pré-visualizar PDF
            </button>
        </div>
      </div>

      <div className="container mx-auto px-8 space-y-8">
          
          {/* BANNER DE FEEDBACK (SE FOR RECTIFICAÇÃO) */}
          {isCorrection && feedback && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 flex gap-6 items-start shadow-sm animate-pulse-slow">
                  <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                      <MessageSquare size={24} />
                  </div>
                  <div>
                      <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-1">Parecer do Coordenador</h4>
                      <p className="text-amber-800 font-medium italic text-sm leading-relaxed">"{feedback}"</p>
                  </div>
              </div>
          )}

          {/* 2. DADOS DA CAPA (CARD 1) */}
          <SectionCard title="Dados da Capa">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-4">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome da Atividade / Plano</label>
                      <input title="Nome da Atividade ou Plano" type="text" value={activityName} onChange={e => setActivityName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm" />
                  </div>
                  <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data Início</label>
                      <input title="Data de Início da Atividade" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm" />
                  </div>
                  <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data Fim</label>
                      <input title="Data de Fim da Atividade" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm" />
                  </div>
                  <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo de Relatório</label>
                      <div className="relative">
                        <select title="Tipo de Relatório" value={reportType} onChange={e => setReportType(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm">
                            <option>Mensal</option>
                            <option>Anual</option>
                            <option>Especial</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                  </div>
                  <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ano</label>
                      <input title="Ano do Relatório" type="number" value={year} onChange={e => setYear(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
                  </div>
              </div>
          </SectionCard>

          {/* 3. CORPO DO RELATÓRIO (CARD 2) */}
          <SectionCard title="Corpo do Relatório">
              <div className="space-y-10">
                  {/* 1. Preambulo */}
                  <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest">1. Preâmbulo <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                             <button className="text-slate-300 hover:text-blue-600"><List size={16}/></button>
                             <button className="text-slate-300 hover:text-blue-600 border border-slate-200 p-1 rounded"><Edit size={14}/></button>
                        </div>
                      </div>
                      <textarea title="Preâmbulo do Relatório"
                        value={preambulo} 
                        onChange={e => setPreambulo(e.target.value)} 
                        rows={4} 
                        className="w-full p-4 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-900/80 leading-relaxed outline-none focus:ring-1 focus:ring-blue-500/20 shadow-inner"
                      />
                  </div>

                  {/* 2. Encontros de Trabalho */}
                  <div>
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Users size={14} className="text-blue-600" /> 2. Encontros de Trabalhos com as Autoridades Locais
                      </h4>
                      <CompactTable 
                        columns={[
                            { key: 'data', label: 'DATA', width: '15%', type: 'text' },
                            { key: 'entidade', label: 'ENTIDADE / AUTORIDADE', width: '35%' },
                            { key: 'assunto', label: 'ASSUNTO / RESUMO', width: '50%' }
                        ]}
                        data={encontros}
                        onChange={setEncontros}
                        emptyMessage="Nenhum encontro registado."
                      />
                  </div>

                  {/* 3. Alvos */}
                  <div>
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Target size={14} className="text-blue-600" /> 3. Alvos da Operação
                      </h4>
                      <CompactTable 
                        columns={[
                            { key: 'alvo', label: 'ALVO', width: '30%' },
                            { key: 'localizacao', label: 'LOCALIZAÇÃO', width: '30%' },
                            { key: 'resultado', label: 'RESULTADO OBTIDO', width: '40%' }
                        ]}
                        data={alvos}
                        onChange={setAlvos}
                        emptyMessage="Nenhum alvo registado."
                      />
                  </div>

                  {/* 4. Acções Desenvolvidas */}
                  <div>
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Truck size={14} className="text-blue-600" /> 4. Acções Desenvolvidas
                      </h4>
                      <CompactTable 
                        columns={[
                            { key: 'data', label: 'DATA', width: '15%', type: 'text' },
                            { key: 'descricao', label: 'DESCRIÇÃO DA ACÇÃO', width: '60%' },
                            { key: 'estado', label: 'ESTADO', width: '25%', type: 'select', options: ['Concluída', 'Em Andamento', 'Planeada'] }
                        ]}
                        data={accoes}
                        onChange={setAccoes}
                        emptyMessage="Nenhuma acção registada."
                      />
                  </div>

                  {/* 5 e 6 Lado a Lado (Grid) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div>
                        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <ShieldAlert size={14} className="text-blue-600" /> 5. Constatações Gerais (Inclui Infrações)
                        </h4>
                        <div className="space-y-2 mb-4">
                            {infracoes.length > 0 ? infracoes.map((inf, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2.5 border border-gray-100 rounded-lg bg-white shadow-sm group">
                                    <div className="flex gap-4 items-center flex-grow">
                                        <span className="text-[10px] font-bold text-slate-700 w-1/2">{inf.descricao}</span>
                                        <span className="text-[10px] font-black text-slate-900">{inf.valor}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[8px] font-black uppercase">{inf.status}</span>
                                        <button onClick={() => setInfracoes(infracoes.filter((_, i) => i !== idx))} className="text-rose-400 hover:text-rose-600 p-1">
                                            <Trash2 size={12}/>
                                        </button>
                                    </div>
                                </div>
                            )) : <p className="text-[10px] text-slate-400 italic py-2 text-center border rounded-lg bg-gray-50 border-gray-100">Nenhuma infração registada.</p>}
                        </div>
                        <div className="grid grid-cols-12 gap-2 mt-4 items-center bg-blue-50/20 p-2 rounded-lg border border-dashed border-blue-200">
                             <input title="Descrição da Infração" type="text" id="inf-desc" placeholder="Descrição da Infração" className="col-span-5 bg-white border border-gray-200 rounded px-2 py-1.5 text-[10px] font-bold outline-none" />
                             <input title="Valor da Coima (Kz)" type="text" id="inf-val" placeholder="Valor da coima (Kz)" className="col-span-3 bg-white border border-gray-200 rounded px-2 py-1.5 text-[10px] font-bold outline-none" />
                             <select title="Estado da Infração" id="inf-stat" className="col-span-2 bg-white border border-gray-200 rounded px-1 py-1.5 text-[10px] font-bold outline-none">
                                <option>Pendente</option>
                                <option>Paga</option>
                             </select>
                             <button 
                                onClick={() => {
                                    const d = document.getElementById('inf-desc') as HTMLInputElement;
                                    const v = document.getElementById('inf-val') as HTMLInputElement;
                                    const s = document.getElementById('inf-stat') as HTMLSelectElement;
                                    if(d.value) {
                                        setInfracoes([...infracoes, { descricao: d.value, valor: v.value, status: s.value }]);
                                        d.value = ''; v.value = '';
                                    }
                                }}
                                className="col-span-2 bg-blue-100 text-blue-700 font-black text-[9px] uppercase py-1.5 rounded hover:bg-blue-600 hover:text-white transition-colors"
                             >
                                + Add
                             </button>
                        </div>
                         <div className="relative mt-4">
                            <textarea placeholder="Observações adicionais ou gerais sobre as constatações..." className="w-full bg-white border border-slate-100 rounded-lg p-3 text-[10px] outline-none h-16 shadow-inner italic font-medium text-slate-400" />
                            <Edit size={14} className="absolute right-3 bottom-3 text-slate-300" />
                         </div>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <MapPin size={14} className="text-blue-600" /> 6. Constatações Específicas por Municípios
                        </h4>
                        <CompactTable 
                            columns={[
                                { key: 'municipio', label: 'MUNICÍPIO', width: '30%' },
                                { key: 'constatacao', label: 'CONSTATAÇÃO', width: '70%' }
                            ]}
                            data={municipios}
                            onChange={setMunicipios}
                            emptyMessage="Sem registos municipais."
                        />
                      </div>
                  </div>

                  {/* 7. Objetivos */}
                  <div>
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <ClipboardCheck size={14} className="text-blue-600" /> 7. Actividades desenvolvidas (Objectivos)
                      </h4>
                      <CompactTable 
                        columns={[
                            { key: 'objetivo', label: 'OBJETIVO DEFINIDO', width: '40%' },
                            { key: 'atividade', label: 'ATIVIDADE REFERENTE', width: '40%' },
                            { key: 'resultado', label: 'RESULTADO/STATUS', width: '20%', type: 'select', options: ['Alcançado', 'Parcial', 'Não Iniciado'] }
                        ]}
                        data={objectivos}
                        onChange={setObjectivos}
                        emptyMessage="Nenhum objetivo específico registado."
                      />
                  </div>
              </div>
          </SectionCard>

          {/* 4. RESULTADOS GERAIS (CARD 3 - GRID 2x2) */}
          <SectionCard title="8. Resultados Gerais">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                  {/* 1.1 Detenções */}
                  <div>
                      <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2 italic">
                        <Gavel size={14} /> 1.1. Detenções
                      </h4>
                      <CompactTable 
                        columns={[
                            { key: 'nome', label: 'NOME/NACIONALIDADE', width: '40%' },
                            { key: 'motivo', label: 'MOTIVO', width: '30%' },
                            { key: 'local', label: 'LOCAL', width: '30%' }
                        ]}
                        data={detencoes}
                        onChange={setDetencoes}
                        emptyMessage="Sem detenções registadas."
                        hasEvidence
                      />
                  </div>
                  {/* 1.2 Apreensões */}
                  <div>
                      <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2 italic">
                        <Package size={14} /> 1.2. Apreensões
                      </h4>
                      <CompactTable 
                        columns={[
                            { key: 'bem', label: 'ITEM/BEM', width: '35%' },
                            { key: 'qtd', label: 'QTD.', width: '15%' },
                            { key: 'valor', label: 'VALOR EST.', width: '50%' }
                        ]}
                        data={apreensoes}
                        onChange={setApreensoes}
                        emptyMessage="Sem apreensões registadas."
                        hasEvidence
                      />
                  </div>
                  {/* 1.3 Transportadores */}
                  <div>
                      <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2 italic">
                        <Truck size={14} /> 1.3. Incumprimentos (Transportadores)
                      </h4>
                      <CompactTable 
                        columns={[
                            { key: 'transportador', label: 'TRANSPORTADOR', width: '40%' },
                            { key: 'irregularidade', label: 'IRREGULARIDADE', width: '60%' }
                        ]}
                        data={transportadores}
                        onChange={setTransportadores}
                        emptyMessage="Sem registos."
                        hasEvidence
                      />
                  </div>
                  {/* 1.4 Tributários */}
                  <div>
                      <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2 italic">
                        <DollarSign size={14} /> 1.4. Incumprimentos Tributários
                      </h4>
                      <CompactTable 
                        columns={[
                            { key: 'descricao', label: 'DESCRIÇÃO', width: '60%' },
                            { key: 'valor', label: 'VALOR EM FALTA', width: '40%' }
                        ]}
                        data={tributarios}
                        onChange={setTributarios}
                        emptyMessage="Sem registos."
                        hasEvidence
                      />
                  </div>
              </div>
          </SectionCard>

          {/* 5. OUTRAS INFORMAÇÕES (CARD 4) */}
          <SectionCard title="Outras Informações">
              <div className="space-y-10">
                  <div className="flex flex-col border-b border-gray-100 pb-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">9. Valores dos incumprimentos apurados</label>
                      <p className="text-xl font-black text-slate-800">{valoresApurados}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                      <div className="relative group">
                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 block">10. Estado Moral e Disciplinar</label>
                        <textarea title="Estado Moral e Disciplinar da Equipa durante a Operação"
                            value={estadoMoral} 
                            onChange={e => setEstadoMoral(e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-4 text-xs font-bold text-slate-700 outline-none shadow-sm focus:ring-1 focus:ring-blue-500/20"
                            rows={3}
                        />
                        <button className="absolute right-4 bottom-4 text-slate-300 hover:text-blue-600 transition-colors"><Edit size={18} /></button>
                      </div>
                      <div className="relative group">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest block">11. Forças e Meios</label>
                            <button className="text-slate-300 hover:text-blue-600 transition-colors"><ChevronDown size={18} /></button>
                        </div>
                        <textarea title="Forças e Meios Envolvidos na Operação"
                            value={forcasMeios} 
                            onChange={e => setForcasMeios(e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-4 text-xs font-bold text-slate-700 outline-none shadow-sm focus:ring-1 focus:ring-blue-500/20"
                            rows={3}
                        />
                        <button className="absolute right-4 bottom-4 text-slate-300 hover:text-blue-600 transition-colors"><Edit size={18} /></button>
                      </div>
                  </div>

                  <div className="relative group pt-4 border-t border-gray-100">
                      <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 block">12. Considerações Gerais</label>
                      <textarea 
                        value={consideracoes} 
                        onChange={e => setConsideracoes(e.target.value)} 
                        placeholder="..."
                        className="w-full bg-white border border-slate-200 rounded-lg p-4 text-xs font-bold text-slate-700 outline-none shadow-sm h-24 focus:ring-1 focus:ring-blue-500/20"
                      />
                      <button className="absolute right-4 bottom-4 text-slate-300 hover:text-blue-600 transition-colors"><Edit size={18} /></button>
                  </div>
              </div>
          </SectionCard>
      </div>

      {/* 6. RODAPÉ DE AÇÕES (BARRA FIXA) */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.08)] border-t border-gray-200 p-5 z-50">
          <div className="container mx-auto px-8 flex justify-between items-center">
              <button 
                onClick={handleBack} 
                className="bg-white border border-gray-300 text-slate-700 px-10 py-3 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
              >
                  Cancelar / Sair
              </button>
              <div className="flex gap-4">
                  <button 
                    onClick={() => handleAction(true)} 
                    disabled={isSubmitting}
                    className="bg-gray-50 border border-gray-200 text-slate-600 px-10 py-3 rounded-lg text-sm font-bold flex items-center hover:bg-gray-100 shadow-sm disabled:opacity-50"
                  >
                      <Save size={18} className="mr-2 opacity-70" /> {isSubmitting ? 'A Guardar...' : 'Rascunho'}
                  </button>
                  <button 
                    onClick={() => handleAction(false)} 
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-12 py-3 rounded-lg text-sm font-black uppercase tracking-widest flex items-center shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                  >
                      {isSubmitting ? <RefreshCw className="animate-spin mr-2" size={18} /> : <Send size={18} className="mr-2" />}
                      {isCorrection ? 'Re-Submeter Correcção' : 'Submeter Relatório'}
                  </button>
              </div>
          </div>
      </div>

      <Suspense fallback={null}>
        <PdfViewerModal
            isOpen={pdfViewerState.isOpen}
            onClose={() => {
                const isFinal = pdfViewerState.title.includes('DOCUMENTO OFICIAL');
                setPdfViewerState({ ...pdfViewerState, isOpen: false });
                if (isFinal) navigate('/atividades', { state: { activeTab: 'relatorios' } });
            }}
            pdfUrl={pdfViewerState.url}
            title={pdfViewerState.title}
        />
      </Suspense>
    </div>
  );
};

export default CriarRelatorioAtividadePage;