
import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Shield, Users, Wrench, Clock, FileText, MapPin, 
  Target, Gavel, Layout, Truck, Briefcase, History, Zap, 
  BrainCircuit, Edit3, Save, CheckCircle, Hash, Building
} from 'lucide-react';
import { ServiceOrder } from '../types';

interface DetalheOrdemServicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ServiceOrder | null;
  onUpdate?: (updatedOrder: ServiceOrder) => void;
}

const statusColors: Record<string, string> = {
  'Concluída': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Pendente': 'bg-amber-100 text-amber-800 border-amber-200',
  'Em Curso': 'bg-blue-100 text-blue-800 border-blue-200',
  'Pausada': 'bg-slate-100 text-slate-600 border-slate-200',
};

const DetalheOrdemServicoModal: React.FC<DetalheOrdemServicoModalProps> = ({ isOpen, onClose, order, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ServiceOrder | null>(null);

  useEffect(() => {
    if (order) {
      setEditedData({ ...order });
    }
    setIsEditing(false);
  }, [order, isOpen]);

  if (!isOpen || !order || !editedData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = () => {
    if (editedData && onUpdate) {
      onUpdate(editedData);
      setIsEditing(false);
    }
  };

  const Section = ({ id, label, name, icon: Icon }: { id: string; label: string; name: keyof ServiceOrder; icon: React.ElementType }) => (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
        <Icon size={80} className="text-blue-900" />
      </div>
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
        <span className="w-5 h-5 bg-[#002B7F] text-white rounded flex items-center justify-center text-[9px] mr-2 font-bold">{id}</span>
        {label}
      </h4>
      
      {isEditing ? (
        <textarea
          name={name}
          value={editedData[name] as string || ''}
          onChange={handleChange}
          rows={6}
          className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:ring-4 focus:ring-blue-500/5 outline-none resize-none relative z-10 shadow-inner"
          placeholder={`Registar ${label.toLowerCase()}...`}
        />
      ) : (
        <p className="text-xs text-slate-700 leading-relaxed font-bold whitespace-pre-wrap relative z-10 px-1">
          {order[name] as string || "Informação não registada."}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[150] flex justify-center items-center p-4 md:p-8" onClick={onClose}>
      <div 
        className="bg-white rounded-[3rem] shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden border border-white/20 animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Official Banner */}
        <div className="px-10 py-8 border-b flex justify-between items-start bg-slate-50/30 sticky top-0 z-30">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-[2rem] bg-[#002B7F] flex items-center justify-center border-4 border-blue-100 text-white shadow-2xl transform -rotate-3">
              <Shield size={42} />
            </div>
            <div>
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <input
                    name="title"
                    value={editedData.title}
                    onChange={handleChange}
                    className="text-2xl font-black text-slate-900 uppercase tracking-tighter bg-white border-b-2 border-blue-600 outline-none px-2 py-1 shadow-sm"
                  />
                ) : (
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{order.title}</h2>
                )}
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${statusColors[order.status]}`}>{order.status}</span>
              </div>
              <div className="flex flex-wrap items-center gap-6 mt-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <span className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 flex items-center text-blue-900"><Hash size={12} className="mr-2" /> {order.reference}</span>
                <span className="flex items-center"><Calendar size={14} className="mr-2 text-blue-600" /> {order.operationPeriod || "Período Indefinido"}</span>
                <span className="flex items-center"><Building size={14} className="mr-2 text-slate-500" /> Unidade Técnica Central</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
              >
                <Edit3 size={16} /> Editar Documento
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-[#002B7F] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
              >
                <Save size={16} /> Guardar Alterações
              </button>
            )}
            <button onClick={onClose} className="p-3 rounded-full hover:bg-slate-100 transition-all text-slate-400">
              <X size={32} />
            </button>
          </div>
        </div>

        <div className="p-10 overflow-y-auto flex-grow space-y-16 bg-white relative">
          {/* Confidencial Watermark Background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center rotate-[-45deg] select-none">
            <span className="text-[14rem] font-black text-slate-900">CONFIDENCIAL</span>
          </div>

          {/* Secção A: Comando & Responsabilidade (EDITÁVEL) */}
          <div className="space-y-8 relative z-10">
              <h5 className="text-[10px] font-black text-blue-900 uppercase tracking-[0.4em] flex items-center border-l-4 border-blue-900 pl-4">
                <Users size={16} className="mr-3" /> Comando e Responsabilidade Hierárquica
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
                {[
                  { l: 'Coordenação Geral', v: 'coordGeral' },
                  { l: 'Responsabilidade Operacional', v: 'respOperacional' },
                  { l: 'Coord. Geral Adj. Técnica', v: 'coordGeralAdjTecnica' },
                  { l: 'Responsabilidade Técnico-Op.', v: 'respTecnicoOperacional' },
                  { l: 'Coordenação Técnico-Op.', v: 'coordTecnicoOperacional' },
                  { l: 'Resp. Técnico-Op. Adjunto', v: 'respTecnicoOperacionalAdj' },
                  { l: 'Coordenação Operacional', v: 'coordOperacional' },
                ].map((f, i) => (
                  <div key={i}>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{f.l}</p>
                    {isEditing ? (
                      <input
                        name={f.v}
                        value={(editedData as any)[f.v] || ''}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      />
                    ) : (
                      <p className="text-xs font-black text-slate-800 tracking-tight">{(order as any)[f.v] || "Não Atribuído"}</p>
                    )}
                  </div>
                ))}
              </div>
          </div>

          {/* Secção B: Apoio & Execução (EDITÁVEL) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-6">
              <h5 className="text-[10px] font-black text-blue-900 uppercase tracking-[0.4em] flex items-center border-l-4 border-blue-900 pl-4">
                <Truck size={16} className="mr-3" /> Apoio Logístico & Institucional
              </h5>
              <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner h-full">
                  {isEditing ? (
                    <textarea
                      name="apoioLogistica"
                      value={editedData.apoioLogistica}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-white border border-slate-200 rounded-2xl p-5 text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm resize-none"
                    />
                  ) : (
                    <p className="text-xs font-black text-slate-700 leading-relaxed italic">
                      {order.apoioLogistica || "Nenhuma informação logística registada."}
                    </p>
                  )}
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="text-[10px] font-black text-blue-900 uppercase tracking-[0.4em] flex items-center border-l-4 border-blue-900 pl-4">
                <Building size={16} className="mr-3" /> Órgãos Executores
              </h5>
              <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner h-full">
                  {isEditing ? (
                    <textarea
                      name="orgaosExecutores"
                      value={editedData.orgaosExecutores}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-white border border-slate-200 rounded-2xl p-5 text-xs font-black text-[#002B7F] outline-none focus:ring-2 focus:ring-blue-500 shadow-sm resize-none"
                    />
                  ) : (
                    <p className="text-xs font-black text-[#002B7F] uppercase tracking-widest">
                        {order.orgaosExecutores || "Órgãos de execução não detalhados."}
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Secção C: Plano de Operação (Numbered Sections 01-12) (EDITÁVEL) */}
          <div className="space-y-8 relative z-10">
            <h5 className="text-[10px] font-black text-blue-900 uppercase tracking-[0.4em] flex items-center border-b border-slate-100 pb-5">
              <Target size={16} className="mr-3" /> Plano Estratégico de Operação Nacional
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Section id="01" label="Antecedentes" name="antecedentes" icon={History} />
              <Section id="02" label="Objetivos da Operação" name="objetivos" icon={Target} />
              <Section id="03" label="Alvos da Operação" name="alvos" icon={Layout} />
              <Section id="04" label="Acções de Controlo" name="accoesControlo" icon={Gavel} />
              <Section id="05" label="Indicadores de Desempenho" name="indicadoresDesempenho" icon={Briefcase} />
              <Section id="06" label="Recursos Humanos" name="recursosHumanos" icon={Users} />
              <Section id="07" label="Área de Acções Operacionais" name="areaAccoes" icon={MapPin} />
              <Section id="08" label="Posto Comando (PC)" name="postoComando" icon={Zap} />
              <Section id="09" label="Estratégia de Actuação" name="estrategiaActuacao" icon={BrainCircuit} />
              <Section id="10" label="Constituição de Grupos" name="constituicaoGrupos" icon={Users} />
              <Section id="11" label="Logística & Mapa de Cabimentação" name="logisticaDetalhe" icon={Truck} />
              <Section id="12" label="Distribuição" name="distribuicao" icon={FileText} />
            </div>
          </div>

          {/* Signatures Representation */}
          <div className="pt-24 pb-12 border-t flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="text-center md:text-left space-y-6">
              <div className="w-64 h-px bg-slate-300"></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">O Secretário da UTC</p>
                <p className="text-sm font-black text-slate-900 mt-2">Braulio Fernandes</p>
              </div>
            </div>
            <div className="bg-slate-50/80 p-10 rounded-[3rem] border-2 border-slate-200 text-center min-w-[320px] shadow-sm">
              <p className="text-[10px] font-black text-blue-900 uppercase tracking-[0.5em] mb-6">Visto</p>
              <p className="text-[11px] font-black text-slate-400 uppercase mb-4 tracking-widest">Coordenador da UTC</p>
              <div className="w-40 h-px bg-slate-300 mx-auto my-8"></div>
              <p className="text-sm font-black text-slate-900 uppercase">José Leiria</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-2 tracking-widest">Presidente do Conselho de Administração</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-10 py-6 border-t bg-slate-50 flex justify-between items-center shrink-0 z-40">
          <div className="flex gap-4">
            <button className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-100 transition-all">Exportar Documento (PDF)</button>
            <button className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-100 transition-all">Imprimir Via Oficial</button>
          </div>
          {isEditing && (
             <div className="flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-widest animate-pulse">
                <CheckCircle size={18} /> Modo de Edição Ativo
             </div>
          )}
          <button onClick={onClose} className="bg-slate-900 text-white px-12 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95">
            {isEditing ? 'Cancelar Edição' : 'Fechar Documento'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalheOrdemServicoModal;
