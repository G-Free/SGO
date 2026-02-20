
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Save, BrainCircuit, Loader2, Shield, Users, 
  Target, History, Layout, Gavel, 
  Briefcase, Building, CheckCircle, FileText, Globe, 
  Maximize2, Minimize2, Send, Plus, Trash2, UserPlus, ShieldCheck,
  Zap, Truck, DollarSign, List, Info,
  Activity, Crosshair, MapPin
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useNotification } from '../components/Notification';
import { useAuth } from '../hooks/useAuth';
import { ServiceOrder } from '../types';

const CriarOrdemServicoPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { addNotification } = useNotification();
  
  const isEditMode = !!orderId;
  const existingOrder = location.state?.order;

  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSection, setExpandedSection] = useState<{ id: string, name: keyof ServiceOrder, label: string } | null>(null);
  
  const [formData, setFormData] = useState<Partial<ServiceOrder>>({
    title: '',
    priority: 'Média',
    reference: '',
    operationPeriod: '',
    coordGeral: 'Dr. José Leiria (PCA da AGT)',
    responsabilidades: [{ cargo: 'Responsável Operacional', nome: '' }],
    suporteLogistico: '',
    orgaosExecutores: '',
    antecedentes: '',
    objetivos: '',
    alvos: '',
    accoesControlo: '',
    indicadoresDesempenho: '',
    equipaOperativa: [],
    areaAccoes: '',
    postoComando: '',
    estrategiaActuacao: '',
    constituicaoGrupos: '',
    mapaCabimentacao: '',
    logisticaDetalhe: '',
    distribuicao: '',
    status: 'Pendente',
    opStatus: 'Pendente'
  });

  const canEdit = hasRole('coordenador_central') || hasRole('administrador') || hasRole('coordenador_operacional_central');

  useEffect(() => {
    if (isEditMode && existingOrder) {
        setFormData(existingOrder);
    } else {
        const year = new Date().getFullYear();
        const randomSeq = Math.floor(1000 + Math.random() * 9000);
        const generatedRef = `OS/UTC/${year}/${randomSeq}`;
        setFormData(prev => ({ ...prev, reference: generatedRef }));
    }
  }, [isEditMode, existingOrder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRespChange = (index: number, field: 'cargo' | 'nome', value: string) => {
    const newResps = [...(formData.responsabilidades || [])];
    newResps[index] = { ...newResps[index], [field]: value };
    setFormData(prev => ({ ...prev, responsabilidades: newResps }));
  };

  const addResponsible = () => setFormData(prev => ({ ...prev, responsabilidades: [...(prev.responsabilidades || []), { cargo: '', nome: '' }] }));
  const removeResponsible = (index: number) => setFormData(prev => ({ ...prev, responsabilidades: (prev.responsabilidades || []).filter((_, i) => i !== index) }));

  const handleEquipaChange = (index: number, field: keyof ServiceOrder['equipaOperativa'][0], value: string) => {
    const newEquipa = [...(formData.equipaOperativa || [])];
    newEquipa[index] = { ...newEquipa[index], [field]: value };
    setFormData(prev => ({ ...prev, equipaOperativa: newEquipa }));
  };

  const addEquipaElement = () => setFormData(prev => ({ ...prev, equipaOperativa: [...(prev.equipaOperativa || []), { nome: '', cargo: '', unidade: '', acao: '' }] }));
  const removeEquipaElement = (index: number) => setFormData(prev => ({ ...prev, equipaOperativa: (prev.equipaOperativa || []).filter((_, i) => i !== index) }));

  const handleGenerateAI = async () => {
    if (!formData.title?.trim()) {
      addNotification("Defina o título para processamento de IA.", "info", "Atenção");
      return;
    }
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Como um Especialista em Operações de Fronteira do CGCF Angola, elabore um plano estratégico formal para a Ordem de Serviço: "${formData.title}". 
      Linguagem técnica militar/policial angolana. Foque em segurança e soberania. Preencha antecedentes, objetivos e estratégia.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const aiText = response.text || '';
      setFormData(prev => ({ ...prev, estrategiaActuacao: aiText }));
      addNotification("Estratégia operativa gerada via IA.", "success", "Inteligência");
    } catch (err) {
      addNotification("Falha na inteligência artificial.", "error", "Erro IA");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Obter ordens existentes no localStorage
    const savedOrdersStr = localStorage.getItem('sgo_ordens_persistidas');
    const savedOrders = savedOrdersStr ? JSON.parse(savedOrdersStr) : [];
    
    const newOrder = {
        ...formData,
        id: isEditMode ? formData.id : `OS-${Date.now()}`,
        createdDate: isEditMode ? formData.createdDate : new Date().toLocaleDateString('pt-AO'),
        status: formData.status || 'Pendente',
        opStatus: formData.opStatus || 'Pendente'
    };

    if (isEditMode) {
        const index = savedOrders.findIndex((o: any) => o.id === newOrder.id);
        if (index !== -1) savedOrders[index] = newOrder;
    } else {
        savedOrders.unshift(newOrder);
    }

    localStorage.setItem('sgo_ordens_persistidas', JSON.stringify(savedOrders));
    
    addNotification("Ordem Operativa registada e arquivada com sucesso no SGO.", 'success', 'Sucesso');
    navigate('/ordens-de-servico');
  };

  const SectionInput = ({ id, label, name, icon: Icon }: { id: string; label: string; name: keyof ServiceOrder; icon: any }) => (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group hover:border-blue-400 transition-all flex flex-col h-full">
      <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
          <span className="bg-blue-900 text-white w-6 h-6 rounded flex items-center justify-center mr-3 text-[10px] shadow-sm font-bold">{id}</span>
          {label}
        </label>
        <div className="flex items-center gap-2">
            <Icon size={14} className="text-slate-300 group-hover:text-blue-500" />
            <button type="button" onClick={() => setExpandedSection({ id, name, label })} className="p-1.5 rounded-lg text-slate-300 hover:text-blue-600 hover:bg-white transition-all">
                <Maximize2 size={14} />
            </button>
        </div>
      </div>
      <textarea 
        name={name} 
        value={(formData as any)[name] || ''} 
        onChange={handleChange} 
        disabled={!canEdit}
        rows={3} 
        className="w-full px-5 py-4 text-xs font-bold text-slate-700 outline-none resize-none bg-white flex-grow min-h-[100px] placeholder:text-slate-200 disabled:bg-slate-50 leading-relaxed" 
        placeholder="Redigir conteúdo oficial..."
      />
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto pb-48 animate-fadeIn px-4">
      
      {/* Header Institucional */}
      <div className="bg-white border-b-4 border-[#002B7F] rounded-t-[2.5rem] p-10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <Shield size={200} />
        </div>
        <div className="flex items-center gap-10 relative z-10">
          <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-2xl border-4 border-slate-100 transform -rotate-2">
            <Shield size={42} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
                Emissão de Ordem Operativa
            </h1>
            <div className="flex items-center gap-6">
                <div className="flex items-center text-blue-900 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                    <span className="text-xs font-black uppercase tracking-widest">{formData.reference}</span>
                </div>
                <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">
                    Unidade Técnica Central • CGCF
                </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 relative z-10">
          <button type="button" onClick={() => navigate('/ordens-de-servico')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-all px-4 py-2">
            <ArrowLeft size={16} /> Cancelar
          </button>
          <button type="button" onClick={handleGenerateAI} disabled={isGenerating} className="flex items-center gap-3 bg-blue-900 text-white hover:bg-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50">
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
                Inteligência Operacional
          </button>
        </div>
      </div>

      <div className="bg-slate-50/50 p-10 rounded-b-[2.5rem] border-x border-b border-slate-200 shadow-2xl">
        <form onSubmit={handleSubmission} className="space-y-16">
            
            {/* SECÇÃO A */}
            <div className="space-y-10">
               <div className="flex items-center gap-6">
                  <h2 className="text-xs font-black text-blue-900 uppercase tracking-[0.4em] flex items-center flex-shrink-0">
                     <Users size={18} className="mr-4" /> A. Identificação e Responsabilidades
                  </h2>
                  <div className="h-px bg-slate-200 flex-grow"></div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título da Operação</label>
                          <input type="text" name="title" value={formData.title} onChange={handleChange} disabled={!canEdit} className="w-full bg-white border-b-2 border-slate-200 focus:border-blue-900 px-5 py-4 text-lg font-black text-slate-800 outline-none transition-all placeholder:text-slate-200" placeholder="Título da Operação..." required />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Período Operativo</label>
                            <input type="text" name="operationPeriod" value={formData.operationPeriod} onChange={handleChange} disabled={!canEdit} className="w-full bg-white border-b-2 border-slate-200 focus:border-blue-900 px-4 py-3 text-sm font-bold text-slate-700 outline-none" placeholder="Ex: Agosto 2024" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nível de Prioridade</label>
                            <select title="Nível de Prioridade" name="priority" value={formData.priority} onChange={handleChange} disabled={!canEdit} className="w-full bg-white border-b-2 border-slate-200 focus:border-blue-900 px-4 py-3 text-sm font-black uppercase text-slate-700 outline-none">
                                <option>Baixa</option><option>Média</option><option>Alta</option><option>Urgente</option>
                            </select>
                         </div>
                      </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Matriz de Comando</h3>
                        <button type="button" onClick={addResponsible} className="p-1.5 bg-blue-50 text-blue-900 rounded-lg hover:bg-blue-900 hover:text-white transition-all"><Plus size={14}/></button>
                      </div>
                      <div className="space-y-4 max-h-[180px] overflow-y-auto pr-2">
                         <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[8px] font-black text-blue-900 uppercase mb-1">Visto Coord. Geral</p>
                            <p className="text-[11px] font-black text-slate-800">{formData.coordGeral}</p>
                         </div>
                         {formData.responsabilidades?.map((resp, idx) => (
                             <div key={idx} className="flex gap-2 group">
                                <div className="flex-grow space-y-1">
                                    <input value={resp.cargo} onChange={e => handleRespChange(idx, 'cargo', e.target.value)} placeholder="Cargo/Função" className="w-full text-[9px] font-black uppercase border-b outline-none focus:border-blue-900 bg-transparent" />
                                    <input value={resp.nome} onChange={e => handleRespChange(idx, 'nome', e.target.value)} placeholder="Nome do Oficial" className="w-full text-[10px] font-bold text-slate-700 outline-none bg-transparent" />
                                </div>
                                <button type="button" onClick={() => removeResponsible(idx)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button>
                             </div>
                         ))}
                      </div>
                  </div>
               </div>
            </div>

            {/* SECÇÃO B */}
            <div className="space-y-10">
               <div className="flex items-center gap-6">
                  <h2 className="text-xs font-black text-blue-900 uppercase tracking-[0.4em] flex items-center flex-shrink-0">
                     <Briefcase size={18} className="mr-4" /> B. Apoio e Intervenção de Órgãos
                  </h2>
                  <div className="h-px bg-slate-200 flex-grow"></div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm group hover:border-indigo-400 transition-all">
                      <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center">
                          <Truck size={16} className="mr-3" /> Suporte Logístico & Cooperação
                      </label>
                      <textarea name="suporteLogistico" value={formData.suporteLogistico} onChange={handleChange} rows={4} className="w-full text-xs font-bold text-slate-700 outline-none resize-none bg-transparent placeholder:text-slate-200" placeholder="Descreva os apoios necessários (GMA, Marinha, AGT...)" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm group hover:border-indigo-400 transition-all">
                      <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center">
                          <Building size={16} className="mr-3" /> Órgãos Executores e Forças
                      </label>
                      <textarea name="orgaosExecutores" value={formData.orgaosExecutores} onChange={handleChange} rows={4} className="w-full text-xs font-bold text-slate-700 outline-none resize-none bg-transparent placeholder:text-slate-200" placeholder="Liste os órgãos envolvidos na execução direta..." />
                  </div>
               </div>
            </div>

            {/* SECÇÃO C */}
            <div className="space-y-10">
               <div className="flex items-center gap-6">
                  <h2 className="text-xs font-black text-blue-900 uppercase tracking-[0.4em] flex items-center flex-shrink-0">
                     <Target size={18} className="mr-4" /> C. Plano Estratégico de Operação Nacional
                  </h2>
                  <div className="h-px bg-slate-200 flex-grow"></div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <SectionInput id="01" label="Antecedentes" name="antecedentes" icon={History} />
                  <SectionInput id="02" label="Objetivos Operacionais" name="objetivos" icon={Target} />
                  <SectionInput id="03" label="Alvos da Missão" name="alvos" icon={Crosshair} />
                  <SectionInput id="04" label="Ações de Controlo" name="accoesControlo" icon={Gavel} />
                  <SectionInput id="05" label="KPIs de Desempenho" name="indicadoresDesempenho" icon={Activity} />
                  
                  <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                      <div className="bg-slate-50/80 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                        <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest flex items-center">
                            <span className="bg-blue-900 text-white w-6 h-6 rounded flex items-center justify-center mr-3 text-[10px] shadow-sm font-bold">06</span>
                            Recursos Humanos e Meios Disponíveis
                        </label>
                        <button type="button" onClick={addEquipaElement} className="bg-blue-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all">
                            <UserPlus size={14} /> Adicionar Elemento
                        </button>
                      </div>
                      <div className="p-8">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-4 py-3">Nome Completo</th>
                                    <th className="px-4 py-3">Cargo / Patente</th>
                                    <th className="px-4 py-3">Unidade</th>
                                    <th className="px-4 py-3">Ação</th>
                                    <th className="px-4 py-3 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {formData.equipaOperativa?.map((el, i) => (
                                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="p-2"><input value={el.nome} onChange={e => handleEquipaChange(i, 'nome', e.target.value)} className="w-full px-2 py-2 text-xs font-bold text-slate-700 bg-transparent border-none focus:ring-0" placeholder="..." /></td>
                                        <td className="p-2"><input value={el.cargo} onChange={e => handleEquipaChange(i, 'cargo', e.target.value)} className="w-full px-2 py-2 text-xs font-bold text-slate-700 bg-transparent border-none focus:ring-0" placeholder="..." /></td>
                                        <td className="p-2"><input value={el.unidade} onChange={e => handleEquipaChange(i, 'unidade', e.target.value)} className="w-full px-2 py-2 text-xs font-bold text-slate-700 bg-transparent border-none focus:ring-0" placeholder="..." /></td>
                                        <td className="p-2"><input value={el.acao} onChange={e => handleEquipaChange(i, 'acao', e.target.value)} className="w-full px-2 py-2 text-xs font-bold text-slate-700 bg-transparent border-none focus:ring-0" placeholder="..." /></td>
                                        <td className="p-2 text-center"><button type="button" onClick={() => removeEquipaElement(i)} className="text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button></td>
                                    </tr>
                                ))}
                                {(!formData.equipaOperativa || formData.equipaOperativa.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-300 italic text-xs">Nenhum elemento adicionado à equipa operativa.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                      </div>
                  </div>

                  <SectionInput id="07" label="Área de Intervenção" name="areaAccoes" icon={MapPin} />
                  <SectionInput id="08" label="Posto de Comando (PC)" name="postoComando" icon={Layout} />
                  <SectionInput id="09" label="Estratégia de Atuação" name="estrategiaActuacao" icon={BrainCircuit} />
                  <SectionInput id="10" label="Grupos Operativos" name="constituicaoGrupos" icon={Users} />
                  <SectionInput id="11" label="Orçamento & Custos" name="mapaCabimentacao" icon={DollarSign} />
                  <SectionInput id="12" label="Canais de Distribuição" name="distribuicao" icon={Send} />
               </div>
            </div>
            
            {/* Footer de Ações */}
            <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 py-6 z-[60] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
                <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
                    <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                        Emissão de Documento Oficial SGO
                    </div>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => navigate('/ordens-de-servico')} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-600 transition-colors">Descartar</button>
                        <button type="submit" className="bg-[#002B7F] text-white px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center">
                            Registar e Arquivar Ordem <ShieldCheck className="ml-3" size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </form>
      </div>

      {/* Modal de Edição Expandida */}
      {expandedSection && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-fadeIn">
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => setExpandedSection(null)}></div>
              <div className="relative w-full max-w-5xl h-full bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white/20">
                  <div className="px-10 py-8 border-b flex justify-between items-center bg-slate-50/50">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-blue-900 text-white rounded-2xl flex items-center justify-center shadow-lg font-black">{expandedSection.id}</div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">{expandedSection.label}</h2>
                      </div>
                      <button onClick={() => setExpandedSection(null)} className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-800 transition-all shadow-sm">
                        <Minimize2 size={24} />
                      </button>
                  </div>
                  <div className="flex-grow p-10 md:p-16 overflow-y-auto">
                      <textarea 
                        name={expandedSection.name}
                        value={(formData as any)[expandedSection.name] || ''}
                        onChange={handleChange}
                        disabled={!canEdit}
                        className="w-full h-full text-xl font-bold text-slate-800 outline-none resize-none bg-transparent placeholder:text-slate-100 leading-relaxed italic"
                        placeholder={`Redija aqui o conteúdo detalhado da secção ${expandedSection.id}...`}
                        autoFocus
                      />
                  </div>
                  <div className="px-10 py-8 border-t bg-slate-50/50 flex justify-between items-center">
                      <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest"><CheckCircle size={16} className="text-blue-500" /> Sincronização automática ativa</div>
                      <button onClick={() => setExpandedSection(null)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-900 transition-all flex items-center gap-3">
                        <Save size={16} /> Concluir Seção
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CriarOrdemServicoPage;
