
import React, { useState } from 'react';
import { 
  X, Shield, Clock, FileText, Stamp, Printer, FileCheck, Download, Loader2
} from 'lucide-react';
import { ServiceOrder } from '../types';
import { useNotification } from '../components/Notification';

const flowStatusColors: Record<string, string> = {
  'Pendente': 'bg-slate-100 text-slate-600 border-slate-200',
  'Aguardando Aprovação': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Aguardando Visto Físico': 'bg-amber-100 text-amber-900 border-amber-200',
  'Protocolado': 'bg-rose-100 text-rose-800 border-rose-200',
};

const opStatusColors: Record<string, string> = {
  'Pendente': 'bg-slate-50 text-slate-400 border-slate-100',
  'Em Curso': 'bg-blue-100 text-blue-800 border-blue-200',
  'Concluída': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Pausada': 'bg-amber-50 text-amber-700 border-amber-100',
};

const cgcfLogoImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABACAYAAAB9Id3VAAAACXBIWXMAAAsTAAALEwEAmpwYAAADJ0lEQVR4nO2aS0hUURzGv3PuzIyjM5YWRmS9SIsSIsKghS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGvXvwA8fS4qRPhXNAAAAAElFTkSuQmCC";

const DetalheOrdemServicoModal: React.FC<{ isOpen: boolean; onClose: () => void; order: ServiceOrder | null }> = ({ isOpen, onClose, order }) => {
  const { addNotification } = useNotification();
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !order) return null;

  const handleExportPDF = async () => {
    if (!window.jspdf) {
        addNotification("Motor de PDF indisponível.", "error", "Falha");
        return;
    }

    setIsGenerating(true);
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        const col1 = margin + 2;
        const col2 = 105;

        // --- PÁGINA 1 ---
        try { doc.addImage(cgcfLogoImg, 'PNG', (pageWidth/2) - 45, 10, 90, 20); } catch(e) {}
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("COMITÉ DE GESTÃO COORDENADA DE FRONTEIRAS", pageWidth/2, 34, { align: 'center' });
        doc.setFontSize(11);
        doc.text("UNIDADE TÉCNICA CENTRAL", pageWidth/2, 40, { align: 'center' });

        // Quadro de Visto
        doc.setDrawColor(0);
        doc.setLineWidth(0.2);
        doc.rect(145, 10, 55, 32);
        doc.setFontSize(8);
        doc.text("Visto", 172.5, 15, { align: 'center' });
        doc.text("Coordenador da UTC", 172.5, 19, { align: 'center' });
        doc.text("____________________", 172.5, 27, { align: 'center' });
        doc.setFontSize(9);
        doc.text(order.coordGeral || "Dr. José Leiria", 172.5, 33, { align: 'center' });
        doc.setFontSize(7);
        doc.text("PCA da AGT", 172.5, 37, { align: 'center' });

        // --- CARIMBO DO COORDENADOR (Página 1) ---
        if (order.status === 'Protocolado') {
            const timeStr = new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });
            doc.setDrawColor(200, 0, 0);
            doc.setLineWidth(0.6);
            doc.rect(147, 12, 51, 28);
            doc.setTextColor(200, 0, 0);
            doc.setFontSize(9);
            doc.text("APROVADO / VALIDADO", 172.5, 19, { align: 'center' });
            doc.setFontSize(5);
            doc.text(`SGO - SISTEMA DE GESTÃO DE OPERAÇÃO`, 172.5, 22, { align: 'center' });
            doc.setFontSize(6);
            doc.text(`DATA: ${order.createdDate}`, 150, 28);
            doc.text(`HORA: ${timeStr}`, 180, 28);
            doc.text(`PROC: ${order.reference}`, 150, 32);
            doc.text(`VALIDADOR: DR. JOSÉ LEIRIA`, 150, 36);
            doc.setTextColor(0);
        }

        // Grelha
        doc.setLineWidth(0.3);
        doc.setDrawColor(0);
        doc.line(margin, 46, pageWidth - margin, 46);
        doc.line(margin, 46, margin, 110);
        doc.line(pageWidth - margin, 46, pageWidth - margin, 110);
        doc.line(103, 46, 103, 85);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Referência: ${order.reference}`, col1, 52);
        doc.text(`Período da Operação: ${order.operationPeriod}`, col2, 52);
        doc.text(`Coord. Geral: ${order.coordGeral}`, col1, 60);
        doc.text(`Resp. Operacional: ${order.responsabilidades?.[0]?.nome || ''}`, col2, 60);
        doc.line(margin, 85, pageWidth - margin, 85);
        doc.setFont("helvetica", "bold");
        doc.text("Apoio:", col1, 90);
        doc.setFont("helvetica", "normal");
        doc.text(`Logística: ${order.suporteLogistico}`, col1, 95);
        doc.setFont("helvetica", "bold");
        doc.text("Órgãos Executores:", col2, 90);
        doc.setFont("helvetica", "normal");
        const execLines = doc.splitTextToSize(order.orgaosExecutores || '', 85);
        doc.text(execLines, col2, 95);
        doc.line(margin, 110, pageWidth - margin, 110);

        let y = 120;
        const sections = [
            { id: '01', label: 'Antecedentes', text: order.antecedentes },
            { id: '02', label: 'Objetivos da Operação', text: order.objetivos },
            { id: '03', label: 'Alvos da Operação', text: order.alvos },
            { id: '04', label: 'Acções de Controlo', text: order.accoesControlo },
            { id: '05', label: 'Indicadores de Desempenho', text: order.indicadoresDesempenho },
            { id: '06', label: 'Recursos Humanos', text: order.recursosHumanos },
            { id: '07', label: 'Área de Acções Operacionais', text: order.areaAccoes },
            { id: '08', label: 'Posto Comando (PC)', text: order.postoComando },
            { id: '09', label: 'Estratégia de Actuação', text: order.estrategiaActuacao },
            { id: '10', label: 'Constituição dos Grupos Operacionais', text: order.constituicaoGrupos },
            { id: '11', label: 'Logística', text: order.logisticaDetalhe }
        ];

        sections.forEach(sec => {
            if (y > 265) { doc.addPage(); y = 20; }
            doc.setFont("helvetica", "bold");
            doc.text(`${sec.id}. ${sec.label}:`, margin, y);
            y += 5;
            doc.setFont("helvetica", "normal");
            const lines = doc.splitTextToSize(sec.text || 'Sem registo.', pageWidth - 25);
            doc.text(lines, margin + 5, y);
            y += (lines.length * 5) + 6;
        });

        // Marca d'água e numeração
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.saveGraphicsState();
            doc.setGState(new doc.GState({ opacity: 0.05 }));
            doc.setFontSize(60);
            doc.setTextColor(150);
            doc.text("CONFIDENCIAL", pageWidth/2, pageHeight/2, { align: 'center', angle: 45 });
            doc.restoreGraphicsState();
            doc.setFontSize(8);
            doc.text(`Página ${i} de ${totalPages}`, pageWidth/2, pageHeight - 10, { align: 'center' });
        }

        // --- PÁGINA 2 / FINAL ---
        doc.addPage();
        try { doc.addImage(cgcfLogoImg, 'PNG', (pageWidth/2) - 45, 10, 90, 20); } catch(e) {}
        y = 45;
        doc.setFont("helvetica", "bold");
        doc.text("12. Distribuição:", margin, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        const distLines = doc.splitTextToSize(order.distribuicao || '', pageWidth - 25);
        doc.text(distLines, margin + 5, y);
        
        y += 40;
        doc.text(`Secretariado da Unidade Técnica Central do CGCF, em Luanda, aos ${order.createdDate}`, margin, y);
        y += 20;
        doc.setFont("helvetica", "bold");
        doc.text("Secretário da UTC", pageWidth/2, y, { align: 'center' });
        y += 10;
        doc.text("Braulio Fernandes", pageWidth/2, y, { align: 'center' });

        // --- CARIMBO DO SECRETÁRIO (Página 2) ---
        if (order.status === 'Protocolado') {
            const timeStr = new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });
            y += 15;
            doc.setDrawColor(200, 0, 0);
            doc.setLineWidth(0.8);
            doc.rect((pageWidth/2) - 45, y, 90, 42);
            doc.setTextColor(200, 0, 0);
            doc.setFontSize(13);
            doc.text("APROVADO / PROTOCOLADO", pageWidth/2, y + 8, { align: 'center' });
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.text(`SGO - SISTEMA DE GESTÃO DE OPERAÇÃO`, pageWidth/2, y + 14, { align: 'center' });
            doc.line((pageWidth/2) - 35, y + 17, (pageWidth/2) + 35, y + 17);
            
            doc.text(`DATA: ${order.createdDate}`, (pageWidth/2) - 35, y + 24);
            doc.text(`HORA: ${timeStr}`, (pageWidth/2) + 10, y + 24);
            doc.text(`Nº PROCESSO: ${order.reference}`, (pageWidth/2) - 35, y + 30);
            doc.setFont("helvetica", "bold");
            doc.text(`VALIDADOR: BRAULIO FERNANDES`, (pageWidth/2) - 35, y + 37);
        }

        doc.save(`Ordem_Operativa_${order.reference.replace(/\//g, '_')}.pdf`);
        addNotification("Via oficial gerada com carimbos de protocolo.", "success", "Concluído");
    } catch (err) {
        addNotification("Erro ao processar PDF.", "error", "Falha");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[150] flex justify-center items-center p-4">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden animate-scaleIn border border-white/20">
        <div className="px-10 py-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/30">
          <div className="flex items-center gap-8">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-4 text-white shadow-2xl transform -rotate-3 transition-all ${order.status === 'Protocolado' ? 'bg-emerald-600 border-emerald-100' : 'bg-[#002B7F] border-blue-100'}`}>
              {order.status === 'Protocolado' ? <FileCheck size={38} /> : <FileText size={38} />}
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{order.title}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="text-[10px] font-black text-blue-900 bg-white px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest">{order.reference}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase">Prioridade: <span className="text-slate-900">{order.priority}</span></span>
                    <span className="text-slate-300">|</span>
                    <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${opStatusColors[order.opStatus]}`}>Estado: {order.opStatus}</div>
                    <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${flowStatusColors[order.status]}`}>Fluxo: {order.status}</div>
                </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={handleExportPDF} disabled={isGenerating} className="bg-blue-900 hover:bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all">
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />} Imprimir Via Oficial
             </button>
             <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={32} /></button>
          </div>
        </div>
        <div className="p-10 overflow-y-auto flex-grow space-y-12 bg-white relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                <div className="md:col-span-2 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">01. Antecedentes</h5>
                            <p className="text-xs font-bold text-slate-600 leading-relaxed">{order.antecedentes}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">02. Objetivos da Missão</h5>
                            <p className="text-xs font-bold text-slate-600 leading-relaxed">{order.objetivos}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                        <Stamp className="absolute -right-4 -bottom-4 opacity-10" size={120} />
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-300 mb-2">Responsável Geral</p>
                        <p className="text-lg font-black">{order.coordGeral}</p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Órgãos Envolvidos</h4>
                        <p className="text-xs font-black text-slate-800 leading-relaxed uppercase">{order.orgaosExecutores}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="px-10 py-6 border-t bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Clock size={14} /> Histórico de Emissão: {order.createdDate}
            </div>
            <button onClick={onClose} className="px-10 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                Fechar Dossier
            </button>
        </div>
      </div>
    </div>
  );
};

export default DetalheOrdemServicoModal;
