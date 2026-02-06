import React, { useState, useEffect } from 'react';
import { X, Save, BrainCircuit, Loader2, FileText, Shield, Users, MapPin, Zap, Hash } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ServiceOrder } from '../types';

interface NovaOrdemServicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ServiceOrder>) => void;
}

const NovaOrdemServicoModal: React.FC<NovaOrdemServicoModalProps> = ({ isOpen, onClose, onSave }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<Partial<ServiceOrder>>({
    title: '',
    priority: 'Média',
    reference: '', // Será gerado automaticamente
    operationPeriod: '',
    coordGeral: '',
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

  // Geração automática da referência ao abrir
  useEffect(() => {
    if (isOpen) {
      const year = new Date().getFullYear();
      const randomSeq = Math.floor(1000 + Math.random() * 9000);
      const generatedRef = `OS/UTC/${year}/${randomSeq}`;
      setFormData(prev => ({ ...prev, reference: generatedRef }));
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateAI = async () => {
    if (!formData.title?.trim()) {
      alert("Defina o título da missão para que a IA possa elaborar o plano.");
      return;
    }
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Como um Especialista em Operações de Fronteira do CGCF Angola, elabore um plano estratégico formal para: "${formData.title}". 
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
    } catch (err) {
      console.error("AI Error", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex justify-center items-center p-4">
      <div 
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden border border-slate-200 animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Estilo Documento Oficial */}
        <div className="px-10 py-6 border-b flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#002B7F] text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-blue-100">
              <Shield size={32} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Emissão de Ordem Operativa</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-[10px] font-black text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest flex items-center">
                    <Hash size={12} className="mr-1" /> {formData.reference}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Modelo: UTC/Nacional/v2</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <X size={28} className="text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="p-10 overflow-y-auto space-y-12 flex-grow">
            
            {/* Secção A: Comando & Hierarquia */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black">A</span>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Comando e Responsabilidade</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner">
                {[
                  { name: 'title', label: 'Título da Operação', full: true },
                  { name: 'operationPeriod', label: 'Período da Operação' },
                  { name: 'priority', label: 'Nível de Prioridade', type: 'select', options: ['Baixa', 'Média', 'Alta', 'Urgente'] },
                  { name: 'coordGeral', label: 'Coordenação Geral' },
                  { name: 'respOperacional', label: 'Resp. Operacional' },
                  { name: 'coordGeralAdjTecnica', label: 'Coord. Geral Adj. Técnica' },
                  { name: 'respTecnicoOperacional', label: 'Resp. Técnico-Op.' },
                  { name: 'coordTecnicoOperacional', label: 'Coord. Técnico-Op.' },
                  { name: 'coordOperacional', label: 'Coord. Operacional' },
                ].map(field => (
                  <div key={field.name} className={field.full ? 'md:col-span-2' : ''}>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{field.label}</label>
                    {field.type === 'select' ? (
                      <select name={field.name} value={(formData as any)[field.name]} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20">
                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input type="text" name={field.name} value={(formData as any)[field.name]} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="..." />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Secção B: Órgãos e Apoio */}
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black">B</span>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Apoio e Órgãos Executores</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Logística & Cooperação Institucional</label>
                  <textarea name="apoioLogistica" value={formData.apoioLogistica} onChange={handleChange} rows={3} className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm" placeholder="Ex: Apoio GMA, Marinha e Policia Nacional..." />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Órgãos Executores</label>
                  <textarea name="orgaosExecutores" value={formData.orgaosExecutores} onChange={handleChange} rows={3} className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm" placeholder="Ex: UTC, UTL Zaire, Unidade Aduaneira..." />
                </div>
              </div>
            </div>

            {/* Secção C: Detalhe Operativo 01-12 */}
            <div className="space-y-8">
              <div className="flex justify-between items-end border-b pb-4">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black">C</span>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Plano de Operação Nacional</h3>
                </div>
                <button 
                  type="button" 
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="flex items-center gap-2 text-[10px] font-black uppercase text-white bg-blue-900 px-6 py-2.5 rounded-xl hover:bg-black transition-all shadow-md disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <BrainCircuit size={16} />}
                  Elaborar Estratégia via IA
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  { id: '01', name: 'antecedentes', label: 'Antecedentes' },
                  { id: '02', name: 'objetivos', label: 'Objetivos da Operação' },
                  { id: '03', name: 'alvos', label: 'Alvos da Operação' },
                  { id: '04', name: 'accoesControlo', label: 'Acções de Controlo' },
                  { id: '05', name: 'indicadoresDesempenho', label: 'Indicadores de Desempenho' },
                  { id: '06', name: 'recursosHumanos', label: 'Recursos Humanos' },
                  { id: '07', name: 'areaAccoes', label: 'Área de Acções Operacionais' },
                  { id: '08', name: 'postoComando', label: 'Posto Comando (PC)' },
                  { id: '09', name: 'estrategiaActuacao', label: 'Estratégia de Actuação' },
                  { id: '10', name: 'constituicaoGrupos', label: 'Constituição dos Grupos Operacionais' },
                  { id: '11', name: 'logisticaDetalhe', label: 'Logística & Finanças' },
                  { id: '12', name: 'distribuicao', label: 'Distribuição' }
                ].map(section => (
                  <div key={section.name}>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                      <span className="w-6 h-6 bg-blue-900 text-white rounded-md flex items-center justify-center text-[10px] mr-3 font-bold">{section.id}</span>
                      {section.label}
                    </label>
                    <textarea 
                      name={section.name} 
                      value={(formData as any)[section.name]} 
                      onChange={handleChange} 
                      rows={4} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner resize-none" 
                      placeholder="Preencher conforme ordem superior..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-10 py-6 border-t bg-slate-50 flex justify-between items-center shrink-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest max-w-md">Ao clicar em emitir, este documento será registado no arquivo central da Unidade Técnica Central (UTC).</p>
            <div className="flex gap-4">
                <button 
                type="button" 
                onClick={onClose} 
                className="px-8 py-3.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors"
                >
                Cancelar
                </button>
                <button 
                type="submit" 
                className="bg-[#002B7F] text-white px-12 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-black transition-all active:scale-95 flex items-center"
                >
                <Save className="h-4 w-4 mr-3" /> Emitir Ordem Operativa
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovaOrdemServicoModal;