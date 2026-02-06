
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Save, BrainCircuit, Loader2, Shield, Users, 
  MapPin, Zap, Hash, Truck, Target, History, Layout, Gavel, 
  Briefcase, Building, CheckCircle, FileText, Globe, Scale,
  BarChart3, Maximize2, Minimize2, X, Plus, Trash2, UserPlus, 
  ChevronRight, ClipboardCheck, UserCheck, Stamp, ShieldCheck,
  AlertCircle, Download, Printer, Send, ClipboardList, Clock
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useNotification } from '../components/Notification';
import { useAuth } from '../hooks/useAuth';
import { ServiceOrder } from '../types';

interface TeamMember {
  id: string;
  nome: string;
  cargo: string;
  unidade: string;
}

const CriarOrdemServicoPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const isEditMode = !!orderId;
  const existingOrder = location.state?.order;

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'dossier' | 'aprovacao'>('dossier');
  const [expandedSection, setExpandedSection] = useState<{ id: string, name: keyof ServiceOrder, label: string } | null>(null);
  
  // Estado para a Equipa (Tabela Dinâmica)
  const [team, setTeam] = useState<TeamMember[]>([
    { id: '1', nome: '', cargo: '', unidade: '' }
  ]);

  const [formData, setFormData] = useState<Partial<ServiceOrder>>({
    title: '',
    priority: 'Média',
    reference: '',
    operationPeriod: '',
    coordGeral: 'Dr. José Leiria (PCA)',
    respOperacional: '',
    coordGeralAdjTecnica: '',
    respTecnicoOperacional: '',
    coordTecnicoOperacional: '',
    respTecnicoOperacionalAdj: '',
    coordOperacional: '',
    apoioLogistica: '',
    apoioCooperacaoInstitucional: '',
    orgaosExecutores: '',
    antecedentes: '',
    objetivos: '',
    alvos: '',
    accoesControlo: '',
    indicadoresDesempenho: '',
    recursosHumanos: '',
    areaAccoes: '',
    postoComando: '',
    estrategiaActuacao: '',
    constituicaoGrupos: '',
    mapaCabimentacao: '',
    logisticaDetalhe: '',
    distribuicao: ''
  });

  const autoExpand = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  };

  useEffect(() => {
    if (isEditMode && existingOrder) {
        setFormData(existingOrder);
        // Simulação de preenchimento de equipe se houver no mock
        if (existingOrder.recursosHumanos) {
            // Lógica simples para transformar string em linhas de tabela se necessário
        }
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
    if (e.target instanceof HTMLTextAreaElement) {
        autoExpand(e.target);
    }
  };

  const handleTeamChange = (id: string, field: keyof TeamMember, value: string) => {
    setTeam(team.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleGenerateAI = async () => {
    if (!formData.title?.trim()) {
      addNotification("Defina o título da missão para processamento de inteligência.", "info", "Atenção");
      return;
    }
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Como um Especialista em Operações de Fronteira do CGCF Angola, elabore um plano estratégico formal para a Ordem de Serviço: "${formData.title}". 
      Preencha tecnicamente as seções: "Objetivos da Operação", "Estratégia de Actuação" e "Ações de Controlo". 
      Linguagem militar/policial angolana, foco em segurança e soberania nacional.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const aiText = response.text || '';
      setFormData(prev => ({ 
        ...prev, 
        estrategiaActuacao: aiText,
        objetivos: "Assegurar a integridade territorial e o controlo efetivo dos fluxos fronteiriços conforme diretrizes superiores."
      }));
      addNotification("Estratégia operativa gerada via IA estratégica.", "success", "Inteligência");
    } catch (err) {
      addNotification("Falha na conexão com a rede de inteligência.", "error", "Erro IA");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = isEditMode ? `Edição da Ordem ${formData.reference} concluída.` : `Ordem Operativa ${formData.reference} enviada para o Ciclo de Aprovação.`;
    addNotification(msg, 'success', 'Sistema');
    setActiveTab('aprovacao');
  };

  const SectionInput = ({ id, label, name, icon: Icon }: { id: string; label: string; name: keyof ServiceOrder; icon: React.ElementType }) => (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group hover:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-500 transition-all flex flex-col h-full">
      <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
          <span className="bg-slate-900 text-white w-6 h-6 rounded flex items-center justify-center mr-3 text-[10px] shadow-sm">{id}</span>
          {label}
        </label>
        <div className="flex items-center gap-2">
            <button type="button" onClick={() => setExpandedSection({ id, name, label })} className="p-1.5 rounded-lg text-slate-300 hover:text-blue-600 hover:bg-white transition-all shadow-none hover:shadow-sm" title="Expandir visualização">
                <Maximize2 size={14} />
            </button>
            <Icon size={14} className="text-slate-300 group-focus-within:text-blue-600 transition-colors" />
        </div>
      </div>
      <textarea 
        name={name} 
        value={(formData as any)[name]} 
        onChange={handleChange} 
        onInput={(e) => autoExpand(e.currentTarget)}
        rows={3} 
        className="w-full px-5 py-4 text-sm font-bold text-slate-700 outline-none resize-none bg-white flex-grow min-h-[120px] placeholder:text-slate-200" 
        placeholder="Redigir conteúdo oficial..."
      />
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto pb-48 animate-fadeIn px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER CORPORATIVO */}
      <div className="bg-white border-b-4 border-[#002B7F] rounded-t-[2.5rem] p-10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <Shield size={200} />
        </div>
        <div className="flex items-center gap-10 relative z-10">
          <div className="w-24 h-24 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-2xl border-4 border-slate-100 transform -rotate-2 transition-transform hover:rotate-0 duration-500">
            <Shield size={48} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">
                {isEditMode ? 'Edição de Ordem Operativa' : 'Emissão de Ordem Operativa Nacional'}
            </h1>
            <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center text-blue-900 bg-blue-50 px-4 py-1.5 rounded-lg border border-blue-100">
                    <Hash size={16} className="mr-2 opacity-70" />
                    <span className="text-sm font-black uppercase tracking-widest">{formData.reference}</span>
                </div>
                <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <Globe size={16} className="mr-2" /> Unidade Técnica Central (UTC)
                </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 relative z-10">
          <button type="button" onClick={() => navigate('/ordens-de-servico')} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-all px-6 py-4">
            <ArrowLeft size={18} /> Voltar
          </button>
          <button type="button" onClick={handleGenerateAI} disabled={isGenerating} className="flex items-center gap-3 bg-blue-900 text-white hover:bg-black px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20 active:scale-95 disabled:opacity-50">
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <BrainCircuit size={18} />}
            Assistente IA
          </button>
        </div>
      </div>

      {/* 2. TABS DE NAVEGAÇÃO DE FLUXO */}
      <div className="bg-slate-100/80 p-2 flex gap-2 border-x border-slate-200">
          <button 
            onClick={() => setActiveTab('dossier')}
            className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center transition-all ${activeTab === 'dossier' ? 'bg-white text-blue-900 shadow-md' : 'text-slate-400 hover:bg-white/50'}`}
          >
              <ClipboardList size={18} className="mr-3" /> 1. Dossier Operativo
          </button>
          <button 
            onClick={() => setActiveTab('aprovacao')}
            className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center transition-all ${activeTab === 'aprovacao' ? 'bg-white text-blue-900 shadow-md' : 'text-slate-400 hover:bg-white/50'}`}
          >
              <ShieldCheck size={18} className="mr-3" /> 2. Ciclo de Aprovação & Vistos
          </button>
      </div>

      {/* 3. CONTEÚDO DINÂMICO */}
      <div className="bg-slate-50/50 p-10 rounded-b-[2.5rem] border-x border-b border-slate-200 shadow-2xl relative min-h-[600px]">
        
        {activeTab === 'dossier' ? (
          <form onSubmit={handleSubmit} className="space-y-16 animate-fadeIn">
            {/* Bloco A: Hierarquia */}
            <div className="space-y-10">
               <div className="flex items-center gap-6">
                  <h2 className="text-xs font-black text-blue-900 uppercase tracking-[0.4em] flex items-center flex-shrink-0">
                     <Users size={18} className="mr-4" /> A. Comando e Responsabilidade Hierárquica
                  </h2>
                  <div className="h-px bg-slate-200 flex-grow"></div>
               </div>
               
               <div className="bg-white border border-slate-200 rounded-3xl p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 shadow-sm">
                    <div className="md:col-span-2 space-y-3">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designação da Missão</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50/50 border-b-2 border-slate-200 focus:border-blue-900 px-5 py-4 text-lg font-black text-slate-800 outline-none transition-all placeholder:text-slate-200" placeholder="Título oficial da operação..." required />
                    </div>
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Período Operativo</label>
                        <input type="text" name="operationPeriod" value={formData.operationPeriod} onChange={handleChange} className="w-full bg-slate-50/50 border-b-2 border-slate-200 focus:border-blue-900 px-5 py-4 text-base font-bold text-slate-700 outline-none transition-all" placeholder="Ex: Julho 2025" />
                    </div>
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prioridade Estratégica</label>
                        <div className="relative">
                            <select title="Prioridade Estratégica" name="priority" value={formData.priority} onChange={handleChange} className="w-full bg-slate-50/50 border-b-2 border-slate-200 focus:border-blue-900 px-5 py-4 text-base font-black text-slate-800 outline-none cursor-pointer appearance-none transition-all">
                                <option>Baixa</option>
                                <option>Média</option>
                                <option>Alta</option>
                                <option>Urgente</option>
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" size={16} />
                        </div>
                    </div>
                    
                    {[
                      { name: 'coordGeral', label: 'Coordenação Geral' },
                      { name: 'respOperacional', label: 'Resp. Operacional' },
                      { name: 'coordGeralAdjTecnica', label: 'Coord. Adj. Técnica' },
                      { name: 'respTecnicoOperacional', label: 'Resp. Técnico-Op.' },
                      { name: 'coordTecnicoOperacional', label: 'Coord. Técnico-Op.' },
                      { name: 'respTecnicoOperacionalAdj', label: 'Adjunto Técnico-Op.' },
                      { name: 'coordOperacional', label: 'Coord. Operacional' },
                      { name: 'referenciaExterna', label: 'Ref. Externa (MINT/PN)', placeholder: 'Referência...' },
                    ].map(field => (
                      <div key={field.name} className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                        <input type="text" name={field.name} value={(formData as any)[field.name]} onChange={handleChange} className="w-full bg-slate-50/50 border-b-2 border-slate-100 focus:border-blue-900 px-5 py-3 text-sm font-bold text-slate-700 outline-none transition-all" placeholder={field.placeholder || "Nome e Patente..."} />
                      </div>
                    ))}
               </div>
            </div>

            {/* Bloco B: Logística */}
            <div className="space-y-10">
               <div className="flex items-center gap-6">
                  <h2 className="text-xs font-black text-blue-900 uppercase tracking-[0.4em] flex items-center flex-shrink-0">
                     <Truck size={18} className="mr-4" /> B. Apoio e Intervenção de Órgãos
                  </h2>
                  <div className="h-px bg-slate-200 flex-grow"></div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all group">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Suporte Logístico & Cooperação</label>
                        <Building size={16} className="text-slate-300" />
                      </div>
                      <textarea name="apoioLogistica" value={formData.apoioLogistica} onChange={handleChange} onInput={(e) => autoExpand(e.currentTarget)} rows={4} className="w-full text-sm font-bold text-slate-700 bg-transparent outline-none resize-none min-h-[120px] placeholder:text-slate-300" placeholder="Detalhar suporte de infraestrutura e parcerias institucionais..." />
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all group">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <label className="text-[11px] font-black text-[#002B7F] uppercase tracking-widest">Órgãos Executores e Forças</label>
                        <Scale size={16} className="text-slate-300" />
                      </div>
                      <textarea name="orgaosExecutores" value={formData.orgaosExecutores} onChange={handleChange} onInput={(e) => autoExpand(e.currentTarget)} rows={4} className="w-full text-sm font-black text-[#002B7F] bg-transparent outline-none resize-none uppercase min-h-[120px] placeholder:text-blue-100" placeholder="Unidades operativas (ex: UTC, PF, SME)..." />
                    </div>
               </div>
            </div>

            {/* Bloco C: Plano Estratégico */}
            <div className="space-y-12 pb-20">
               <div className="flex items-center gap-6">
                  <h2 className="text-xs font-black text-blue-900 uppercase tracking-[0.4em] flex items-center flex-shrink-0">
                     <Target size={18} className="mr-4" /> C. Plano Estratégico de Operação Nacional
                  </h2>
                  <div className="h-px bg-slate-200 flex-grow"></div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <SectionInput id="01" label="Antecedentes" name="antecedentes" icon={History} />
                  <SectionInput id="02" label="Objetivos Operacionais" name="objetivos" icon={Target} />
                  <SectionInput id="03" label="Alvos da Missão" name="alvos" icon={Layout} />
                  <SectionInput id="04" label="Ações de Controlo" name="accoesControlo" icon={Gavel} />
                  <SectionInput id="05" label="KPIs de Desempenho" name="indicadoresDesempenho" icon={BarChart3} />
                  
                  {/* Secção 06 Especial: Tabela de RH */}
                  <div className="md:col-span-2 lg:col-span-3 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-slate-900 px-8 py-4 border-b border-slate-800 flex justify-between items-center">
                        <label className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center">
                            <span className="bg-white text-slate-900 w-6 h-6 rounded flex items-center justify-center mr-4 text-[10px] font-bold">06</span>
                            Recursos Humanos e Meios Disponíveis
                        </label>
                        <button type="button" onClick={() => setTeam([...team, { id: Date.now().toString(), nome: '', cargo: '', unidade: '' }])} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg">
                            <UserPlus size={14} /> Adicionar Elemento
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-4">Nome Completo</th>
                                    <th className="px-8 py-4">Cargo / Patente</th>
                                    <th className="px-8 py-4">Unidade</th>
                                    <th className="px-8 py-4 text-center w-24">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {team.map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4"><input type="text" value={member.nome} onChange={(e) => handleTeamChange(member.id, 'nome', e.target.value)} className="w-full bg-transparent border-none outline-none text-sm font-bold text-slate-800" placeholder="Nome..." /></td>
                                        <td className="px-8 py-4"><input type="text" value={member.cargo} onChange={(e) => handleTeamChange(member.id, 'cargo', e.target.value)} className="w-full bg-transparent border-none outline-none text-sm font-bold text-slate-600" placeholder="Patente..." /></td>
                                        <td className="px-8 py-4"><input type="text" value={member.unidade} onChange={(e) => handleTeamChange(member.id, 'unidade', e.target.value)} className="w-full bg-transparent border-none outline-none text-sm font-bold text-blue-900" placeholder="Órgão..." /></td>
                                        <td className="px-8 py-4 text-center">
                                            <button type="button" onClick={() => team.length > 1 && setTeam(team.filter(m => m.id !== member.id))} className="text-slate-300 hover:text-rose-600 p-2 transition-colors disabled:opacity-30"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  </div>

                  <SectionInput id="07" label="Área de Intervenção" name="areaAccoes" icon={MapPin} />
                  <SectionInput id="08" label="Posto de Comando (PC)" name="postoComando" icon={Zap} />
                  <SectionInput id="09" label="Estratégia de Atuação" name="estrategiaActuacao" icon={BrainCircuit} />
                  <SectionInput id="10" label="Grupos Operativos" name="constituicaoGrupos" icon={Users} />
                  <SectionInput id="11" label="Orçamento & Custos" name="logisticaDetalhe" icon={Briefcase} />
                  <SectionInput id="12" label="Canais de Distribuição" name="distribuicao" icon={FileText} />
               </div>
            </div>
            
            {/* RODAPÉ FIXO DOSSIER */}
            <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 py-6 z-[60] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
                <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
                    <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                        {isEditMode ? 'Edição de Dossier Técnico Ativa' : 'Edição de Dossier Técnico - Em Draft'}
                    </div>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => navigate('/ordens-de-servico')} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors">Anular</button>
                        <button type="submit" className="bg-[#002B7F] text-white px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-900/40 hover:bg-black transition-all flex items-center">
                            {isEditMode ? 'Guardar Edição' : 'Prosseguir para Aprovação'} <ChevronRight className="ml-3" size={18} />
                        </button>
                    </div>
                </div>
            </div>
          </form>
        ) : (
          /* TAB DE APROVAÇÃO E ASSINATURAS */
          <div className="space-y-12 animate-fadeIn py-10">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-50 text-blue-900 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-blue-100">
                      <Stamp size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Circuito de Validação do Documento</h2>
                  <p className="text-slate-500 text-sm font-medium">Esta Ordem de Serviço requer assinaturas hierárquicas para ativação em campo.</p>
              </div>

              {/* FLUXO DE CHECKPOINT */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {[
                      { role: 'Elaborador', user: user?.username, status: 'Concluído', icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                      { role: 'Coordenador Operacional', user: 'Pendente de Atribuição', status: 'Aguardando', icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
                      { role: 'Visto Final (PCA)', user: 'Pendente de Atribuição', status: 'Aguardando', icon: ShieldCheck, color: 'text-slate-300', bg: 'bg-slate-50' },
                  ].map((step, i) => (
                      <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-all">
                          <div className={`w-12 h-12 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                              <step.icon size={24} />
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{step.role}</p>
                          <p className="text-sm font-black text-slate-800 mb-4">{step.user}</p>
                          <div className="flex items-center gap-2">
                              {step.status === 'Concluído' ? <CheckCircle size={14} className="text-emerald-500" /> : <Clock size={14} className="text-slate-300" />}
                              <span className={`text-[10px] font-black uppercase ${step.status === 'Concluído' ? 'text-emerald-600' : 'text-slate-300'}`}>{step.status}</span>
                          </div>
                      </div>
                  ))}
              </div>

              {/* BLOCO DE ASSINATURAS (VISUAL OFICIAL) */}
              <div className="mt-20 p-16 bg-white border-2 border-slate-100 rounded-[3rem] shadow-sm max-w-6xl mx-auto relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-8 py-2 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Autenticação Institucional</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                      {/* Assinatura 1 */}
                      <div className="text-center space-y-6">
                          <div className="h-24 flex items-center justify-center italic text-blue-900/40 font-serif text-lg select-none">
                              Assinado Digitalmente por {user?.username}
                          </div>
                          <div className="w-full h-px bg-slate-200"></div>
                          <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">O Elaborador (Técnico UTC)</p>
                              <p className="text-xs font-black text-slate-900 mt-2">{user?.username}</p>
                          </div>
                      </div>

                      {/* Assinatura 2 */}
                      <div className="text-center space-y-6">
                          <div className="h-24 flex flex-col items-center justify-center opacity-30 group">
                              <Stamp size={40} className="text-slate-200 mb-2" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Espaço para Carimbo</span>
                          </div>
                          <div className="w-full h-px bg-slate-200"></div>
                          <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coordenador Operacional Central</p>
                              <p className="text-xs font-bold text-slate-300 mt-2 italic">Aguardando Validação...</p>
                          </div>
                      </div>

                      {/* Assinatura 3 */}
                      <div className="text-center space-y-6 lg:border-l lg:pl-16 lg:border-slate-50">
                          <div className="h-24 flex items-center justify-center">
                               <div className="w-20 h-20 border-4 border-slate-50 rounded-full flex items-center justify-center text-slate-100">
                                   <ShieldCheck size={40} />
                               </div>
                          </div>
                          <div className="w-full h-px bg-slate-200"></div>
                          <div>
                              <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Visto Final (Direção Geral)</p>
                              <p className="text-xs font-black text-slate-900 mt-2">Dr. José Leiria</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Presidente do Conselho de Administração</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* AVISO DE RESPONSABILIDADE */}
              <div className="max-w-3xl mx-auto flex items-start gap-5 p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
                  <AlertCircle size={24} className="text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">
                      Este documento, após submetido, possui validade jurídica interna e as assinaturas digitais serão vinculadas aos perfis de acesso dos utilizadores. Qualquer alteração após o visto final anulará automaticamente a autenticidade do Dossier.
                  </p>
              </div>

              {/* RODAPÉ FIXO APROVAÇÃO */}
              <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 py-6 z-[60] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
                <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/ordens-de-servico')} className="px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">
                            <Download size={14} className="mr-2 inline" /> Exportar Rascunho
                        </button>
                        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">
                            <Printer size={14} className="mr-2 inline" /> Imprimir Via
                        </button>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setActiveTab('dossier')} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-900 transition-colors">Voltar à Edição</button>
                        <button 
                            onClick={() => {
                                addNotification(`Ordem ${formData.reference} publicada e arquivada com sucesso.`, 'success', 'Missão Ativa');
                                navigate('/ordens-de-servico');
                            }}
                            className="bg-[#002B7F] text-white px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-900/40 hover:bg-black transition-all flex items-center active:scale-95"
                        >
                            <Send className="mr-3" size={18} /> Protocolar e Publicar Missão
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* OVERLAY DE REDAÇÃO EXPANDIDA */}
      {expandedSection && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-fadeIn">
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => setExpandedSection(null)}></div>
              <div className="relative w-full max-w-5xl h-full bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white/20 animate-scaleIn">
                  <div className="px-10 py-8 border-b flex justify-between items-center bg-slate-50/50">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-blue-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><Target size={24} /></div>
                        <div>
                            <p className="text-[10px] font-black text-blue-900 uppercase tracking-[0.3em] mb-1">Modo de Redação Estratégica</p>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">
                                <span className="mr-3 opacity-30">Secção {expandedSection.id} —</span> {expandedSection.label}
                            </h2>
                        </div>
                      </div>
                      <button onClick={() => setExpandedSection(null)} className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-800 transition-all shadow-sm hover:shadow-md flex items-center gap-2 group">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Fechar</span>
                        <Minimize2 size={24} />
                      </button>
                  </div>
                  <div className="flex-grow p-10 md:p-16 overflow-y-auto">
                      <textarea 
                        name={expandedSection.name}
                        value={(formData as any)[expandedSection.name]}
                        onChange={handleChange}
                        className="w-full h-full text-xl md:text-2xl font-bold text-slate-800 outline-none resize-none bg-transparent placeholder:text-slate-100 leading-relaxed italic"
                        placeholder={`Redija aqui o conteúdo detalhado...`}
                        autoFocus
                      />
                  </div>
                  <div className="px-10 py-8 border-t bg-slate-50/50 flex justify-between items-center">
                      <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest"><CheckCircle size={16} className="text-blue-500" /> Sincronização em tempo real ativa</div>
                      <button onClick={() => setExpandedSection(null)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-900 transition-all flex items-center gap-3">
                        <Save size={16} /> Concluir Redação
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CriarOrdemServicoPage;
