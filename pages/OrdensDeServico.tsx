
import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, Search, Edit, Eye, Clock, 
  CheckCircle, Loader2, PlayCircle, PauseCircle,
  FileText, Printer, FileSpreadsheet, Filter, Download
} from 'lucide-react';
import { useNotification } from '../components/Notification';
import { ServiceOrder } from '../types';

const DetalheOrdemServicoModal = lazy(() => import('../components/DetalheOrdemServicoModal'));

// Logo Institucional (CGCF)
const cgcfLogoImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAABDCAYAAAC2+lYkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAd8SURBVHhe7Z1/bBxlHMc/s8zKsh/BhmEDExiMMWEi16W5NEmTNC0tDVLbFGqjth80bf2x/bFJk6Zp2rRNWv2xTVWb6oc2DZImaVq6lK7JTSmJuW5iAgMMGOwgK8uyLPv8I3e5d3Zmdnd2d9d9fz8vB3be2Z3f/X7e5/l5dhcQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCATrgmEYx+vr678MDAx8tbS09PHAwMC35+fn/6FQKPzMzMy3UqlUHxsb+0ZFRfWv0tLS7x4eHj6VSqU+Pj4+vrCw8J+Tk5NPzs7OfqRSqV+o1f9/hUIhMpnMPzo6+tX4+Pgvj46O/k6lUj+YnZ39ZHt7+60xMTGfjI2Nfb5arT4xOTn5xezs7C/FYvEbvb29b6VS6Z+1tbX/0Nra+kQ8Hv98PB7/x/F4/N3xePyT8Xj89+Px+Cfj8fiPx+Px347H4x+Nx+N/HI/H/zgej/+beDz+R/F4/I/i8fgfx+PxP4rH438aj8f/MB6P/2E8Hv+DeDz+X4jH498lHo/fJR6P3ycej98lHo/fJh6P3yIej18jHo9fJR6PXyMej18lHo9fIh6PXyAej18gHo9fIB6PXyAej18gHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fIB6PXyAej18gHo9fIB6PXyIej18hHo9fIR6PXyEej18hHo9fIR6PXyEej18hHo9fIR6PXyMeb7+vX78KHo9fIR6PXykejy8SjycSjycSj6cRj6cSj6cRjyYQj0YSj6cRj5cQj5cQj6cSj1cRj1cRj1cRj1cQjxcRj5eIxyuIx2uIxmuIxyuIxyuIx4uIx+OIxyOIxyOIx1OIxxOIxxOIx4OIx4OIxwOIxwOIx4OIx9OIx9OIxxOIxyOJxxKJxyKJxxKJxyOJxxKIx5KIRxKIxxKIR1KIhxKIRyKIRyKIR4SIR1KIRySIRzKIR3KIRzKIRyKIRwKIR4KEIxHEIyHEIx6EIx6EIRwKIhwSIRwSIRwKIhwKEQ4FIRwKEQ4FEA96EI92kI92kI92kI9kEA8kEA8kEI9kEA8kEI8EkA8lkI/EkA/FkA/HkA/GEI/GEY/FEY/FEY/EEA/HEI/HEI/FEo/FEY/FEQ/Hkg/Hkg/FkA/FkA/Hkg/HkQ/HkQ/FkQ/GkY/GEY/GkY/GEY9GkI/GkY9GEI+GEA/6EY/4EY/2EA/3EI93kI92kI/0kI8EEg/2kI9kEI+mkA8nkI9nkI9nkI8mkA8nkI9kkI/FEI+FEI9FEo9EEo9GEo9GEg+6EY+6EQ+7EI+7EI+5kI84kI84kI84kI84kI84EI8YkI8IkA8IEA8IkA8IkI+okA+okI+skA9kkI9EkA9mkA/mkA+WkA9UkA9UkA9kkI+mkI+kkI/nkI+nkI/nkI+GkA8lkA8mEI8mEI9GEg+mEA9GkI+GEA8GEQ8GEg+GEg8EkI8AkA8CEg4GEA8GEA4GkA4EkA8CkAwHkAyHkA4GkA4EkAoGEAwGEAwEkAkFkAyEEAkFkAyEkAmEkAmEkAmGkAmEkAmEEAmEkAmEEAmEkAmEkAmEkAmEkAmEkAmEEAmEkAmGEAmGEAmEkAmEkAmEkAl6kAl6kAkGkAkEEAmEEAmGEAmGEAmEkAmEkAmEkAmEkAmEkAmGEAmEEAmEEAmEEAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmGEAkGEAkGEAkEkAkEEAmEEAmEEAmGEAkGEAmEEAl1kAqFQKBSCQiFQKAKFQKBSCQSCQCAQCIRCIRAIBAKBYD3gfwD88c+E9jG3SwAAAABJRU5kJggg==";

const mockWorkOrders: ServiceOrder[] = [
  { 
    id: '1001', 
    title: 'Operação Costa Norte 2024', 
    status: 'Em Curso', 
    priority: 'Alta', 
    createdDate: '28 de Janeiro de 2026',
    reference: 'REF/UTC/CN/05/2024',
    operationPeriod: 'Julho - Agosto 2024',
    coordGeral: 'Almirante Santos',
    respOperacional: 'Cmdt. Manuel Miguel',
    coordGeralAdjTecnica: 'Eng. Luísa Costa',
    respTecnicoOperacional: 'Cap. António Freire',
    coordTecnicoOperacional: 'Fisc. Pedro Kiala',
    respTecnicoOperacionalAdj: 'Sgt. Maria José',
    coordOperacional: 'Insp. Chefe Luvo',
    apoioLogistica: 'GMA Cabinda / Marinha de Guerra',
    apoioCooperacaoInstitucional: 'SME, AGT, Policia de Fronteira',
    orgaosExecutores: 'UTC Central, UTL Cabinda',
    antecedentes: 'Aumento do fluxo de embarcações não identificadas na região de Massabi.',
    objetivos: 'Inspecionar 100% das embarcações de pequeno porte em trânsito.',
    alvos: 'Zonas de pesca artesanal e portos informais.',
    accoesControlo: 'Patrulhamento preventivo e auditoria física de carga.',
    indicadoresDesempenho: 'Nº de inspeções / Hora, Rácio de apreensões.',
    recursosHumanos: 'Equipa Alfa (12 agentes), Equipa Mar (08 especialistas).',
    areaAccoes: 'Águas territoriais adjacentes à Província de Cabinda.',
    postoComando: 'Unidade Marítima de Cabinda.',
    estrategiaActuacao: 'Vigilância 24h via Radar com intercepção imediata por lanchas rápidas.',
    constituicaoGrupos: 'Grupo de Assalto, Grupo de Inspeção Documental.',
    mapaCabimentacao: 'Valores aprovados via Orçamento Operacional Central.',
    logisticaDetalhe: '3 Embarcações, 2 Viaturas de Apoio, Combustível para 30 dias.',
    distribuicao: 'Arquivo Central, Comando Regional, PCA da AGT.'
  }
];

const priorityConfig: Record<string, { color: string, bg: string }> = {
    'Urgente': { color: 'text-rose-700', bg: 'bg-rose-100' },
    'Alta': { color: 'text-orange-700', bg: 'bg-orange-100' },
    'Média': { color: 'text-blue-700', bg: 'bg-blue-100' },
    'Baixa': { color: 'text-slate-700', bg: 'bg-slate-100' },
};

const statusConfig: Record<string, { color: string, bg: string }> = {
    'Concluída': { color: 'text-emerald-700', bg: 'bg-emerald-100' },
    'Pendente': { color: 'text-amber-700', bg: 'bg-amber-100' },
    'Em Curso': { color: 'text-blue-700', bg: 'bg-blue-100' },
    'Pausada': { color: 'text-slate-700', bg: 'bg-slate-100' },
};

const OrdensDeServicoPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [workOrders] = useState<ServiceOrder[]>(mockWorkOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return workOrders.filter(o => 
      o.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.reference.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [workOrders, searchTerm]);

  // --- FUNÇÃO DE GERAÇÃO DE PDF (REPLICAÇÃO FIEL DO MODELO UTC) ---
  const handleExportSinglePDF = async (order: ServiceOrder) => {
    if (!window.jspdf || !(window.jspdf as any).jsPDF) {
      addNotification("Serviço de PDF não carregado.", "error", "Falha");
      return;
    }

    setIsGeneratingPDF(order.id);
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);

        // Funções Auxiliares
        const addWatermark = (pdfDoc: any) => {
            pdfDoc.saveGraphicsState();
            pdfDoc.setGState(new pdfDoc.GState({ opacity: 0.04 }));
            pdfDoc.setFont("helvetica", "bold");
            pdfDoc.setFontSize(70);
            pdfDoc.setTextColor(150);
            pdfDoc.text("CONFIDENCIAL", pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });
            pdfDoc.restoreGraphicsState();
        };

        const addOfficialFooter = (pdfDoc: any, pageNum: number, totalPages: number) => {
            pdfDoc.setFontSize(7);
            pdfDoc.setTextColor(120);
            pdfDoc.text(`Página ${pageNum} de ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
            
            pdfDoc.setFont("helvetica", "bold");
            pdfDoc.text("CENTRO LOGÍSTICO ADUANEIRO", margin, pageHeight - 15);
            pdfDoc.setFont("helvetica", "normal");
            pdfDoc.text("KM 33 – ICOLO E BENGO / TELEFONE: 923537111", margin, pageHeight - 11);
            pdfDoc.text("EMAIL: secretariado.central.cgcf@minfin.gov.ao", margin, pageHeight - 7);
            
            pdfDoc.setFontSize(8);
            pdfDoc.setFont("helvetica", "bold");
            pdfDoc.text("GOVERNO DE ANGOLA", pageWidth - margin, pageHeight - 11, { align: 'right' });
            pdfDoc.setFont("helvetica", "normal");
            pdfDoc.text("Ministério das Finanças", pageWidth - margin, pageHeight - 7, { align: 'right' });
        };

        // --- PÁGINA 1 ---
        addWatermark(doc);

        // 1. Cabeçalho Centralizado
        try {
            doc.addImage(cgcfLogoImg, 'PNG', (pageWidth/2) - 35, 10, 70, 18);
        } catch (e) {}
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("COMITÉ DE GESTÃO COORDENADA DE FRONTEIRAS", pageWidth/2, 32, { align: 'center' });
        doc.setFontSize(11);
        doc.text("UNIDADE TÉCNICA CENTRAL", pageWidth/2, 39, { align: 'center' });

        // 2. Quadro de "Visto" (Lado Direito)
        const vistoX = pageWidth - 65;
        const vistoY = 10;
        doc.setDrawColor(0);
        doc.setLineWidth(0.2);
        doc.rect(vistoX, vistoY, 50, 28);
        doc.setFontSize(9);
        doc.text("Visto", vistoX + 25, vistoY + 6, { align: 'center' });
        doc.text("Coordenador da UTC", vistoX + 25, vistoY + 11, { align: 'center' });
        doc.line(vistoX + 8, vistoY + 19, vistoX + 42, vistoY + 19);
        doc.setFontSize(9);
        doc.text("José Leiria", vistoX + 25, vistoY + 23, { align: 'center' });
        doc.setFontSize(8);
        doc.text("PCA da AGT", vistoX + 25, vistoY + 27, { align: 'center' });

        // 3. Tabela Técnica de Metadados (Grelha Principal)
        (doc as any).autoTable({
            startY: 45,
            margin: { left: margin, right: margin },
            theme: 'grid',
            styles: { 
                fontSize: 8.5, 
                cellPadding: 2, 
                lineColor: [0, 0, 0], 
                lineWidth: 0.1, 
                textColor: 0,
                valign: 'top'
            },
            headStyles: { fillColor: false, textColor: 0, fontStyle: 'bold' },
            body: [
                [
                  { content: `Referência: ${order.reference}`, styles: { fontStyle: 'bold' } }, 
                  { content: `Período da Operação: ${order.operationPeriod}`, styles: { fontStyle: 'bold' } }
                ],
                [`Coord. Geral: ${order.coordGeral}`, `Resp. Operacional: ${order.respOperacional}`],
                [`Coord. Geral Adj Técnica: ${order.coordGeralAdjTecnica}`, `Resp. Técnico-Operacional: ${order.respTecnicoOperacional}`],
                [`Coord. Técnico-Operacional: ${order.coordTecnicoOperacional}`, `Resp. Técnico-Operacional Adj: ${order.respTecnicoOperacionalAdj}`],
                [`Coord. Operacional: ${order.coordOperacional}`, ''],
                [
                    { content: `Apoio:\nLogística: ${order.apoioLogistica}\nCooperação Institucional: ${order.apoioCooperacaoInstitucional}`, styles: { fontStyle: 'bold' } },
                    { content: `Órgãos Executores:\n${order.orgaosExecutores}`, styles: { fontStyle: 'bold' } }
                ]
            ],
            columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 'auto' } }
        });

        // 4. Seções Numeradas de 01 a 11
        let currentY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        
        const sections = [
            { n: "01", t: "Antecedentes", v: order.antecedentes },
            { n: "02", t: "Objetivos da Operação", v: order.objetivos },
            { n: "03", t: "Alvos da Operação", v: order.alvos },
            { n: "04", t: "Acções de Controlo", v: order.accoesControlo },
            { n: "05", t: "Indicadores de Desempenho", v: order.indicadoresDesempenho },
            { n: "06", t: "Recursos Humanos", v: order.recursosHumanos },
            { n: "07", t: "Área de Acções Operacionais", v: order.areaAccoes },
            { n: "08", t: "Posto Comando (PC)", v: order.postoComando },
            { n: "09", t: "Estratégia de Actuação", v: order.estrategiaActuacao },
            { n: "10", t: "Constituição dos Grupos Operacionais", v: order.constituicaoGrupos },
            { n: "11", t: "Mapa ilustrativo da cabimentação dos valores por Provincias – Alimentação (2 Refeições Diárias)", v: order.mapaCabimentacao },
            { n: "11", t: "Logística", v: order.logisticaDetalhe }
        ];

        sections.forEach(s => {
            if (currentY > pageHeight - 35) {
                addOfficialFooter(doc, 1, 2);
                doc.addPage();
                addWatermark(doc);
                currentY = 20;
            }
            doc.setFont("helvetica", "bold");
            const header = `${s.n}. ${s.t}:`;
            doc.text(header, margin, currentY);
            
            // Sublinhado sob o título da seção como na imagem
            doc.setLineWidth(0.1);
            doc.line(margin, currentY + 0.8, margin + doc.getTextWidth(header), currentY + 0.8);
            
            currentY += 6;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            const lines = doc.splitTextToSize(s.v || "N/A", contentWidth - 5);
            doc.text(lines, margin + 2, currentY);
            currentY += (lines.length * 5) + 6;
        });

        addOfficialFooter(doc, 1, 2);

        // --- PÁGINA 2 ---
        doc.addPage();
        addWatermark(doc);
        currentY = 20;

        // 5. Seção 12: Distribuição
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("12. Distribuição:", margin, currentY);
        doc.setLineWidth(0.1);
        doc.line(margin, currentY + 0.8, margin + 30, currentY + 0.8);
        
        currentY += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.rect(margin, currentY, contentWidth, 20);
        doc.text(doc.splitTextToSize(order.distribuicao || "Arquivo Central.", contentWidth - 5), margin + 2, currentY + 7);

        currentY += 40;
        // 6. Texto de Protocolo e Assinaturas
        const protocolDate = order.createdDate || new Date().toLocaleDateString('pt-AO', { day: 'numeric', month: 'long', year: 'numeric' });
        doc.setFont("helvetica", "bold");
        doc.text(`Secretariado da Unidade Técnica Central do CGCF, em Luanda, aos ${protocolDate}`, margin, currentY);

        currentY += 25;
        doc.text("Secretário da UTC", pageWidth / 2, currentY, { align: 'center' });
        
        currentY += 20;
        doc.line(pageWidth/2 - 35, currentY - 5, pageWidth/2 + 35, currentY - 5);
        doc.text("Braulio Fernades", pageWidth / 2, currentY, { align: 'center' });

        addOfficialFooter(doc, 2, 2);

        // Salvar Arquivo
        const fileName = `Ordem_Operativa_${order.reference.replace(/\//g, '_')}.pdf`;
        doc.save(fileName);
        addNotification("Documento oficial gerado com sucesso.", "success", "Concluído");
    } catch (err) {
        console.error("PDF generation failed:", err);
        addNotification("Erro ao processar síntese de PDF.", "error", "Falha");
    } finally {
        setIsGeneratingPDF(null);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Header Corporativo */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Ordens Operativas</h1>
          <p className="text-slate-500 font-bold text-sm flex items-center mt-3">
             <FileText className="h-4 w-4 mr-2 text-blue-600" /> Gestão de Ordens de Intervenção e Missões (UTC)
          </p>
        </div>
        <div className="flex items-center gap-3">
            <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center hover:bg-slate-50 transition-all">
                <FileSpreadsheet size={16} className="mr-2" /> Exportar Planilha
            </button>
            <button 
                onClick={() => navigate('/ordens-de-servico/nova')}
                className="bg-blue-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg flex items-center hover:bg-black transition-all active:scale-95"
            >
                <PlusCircle size={16} className="mr-2" /> Emitir Ordem
            </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center shadow-sm">
            <Search className="text-slate-400 ml-2" size={18} />
            <input 
                type="text" 
                placeholder="Pesquisar por Título ou Referência (ex: OS/UTC/2026/1001)..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-grow px-4 py-1.5 text-sm font-bold text-slate-700 outline-none"
            />
            <div className="flex items-center px-4 border-l border-slate-100 ml-2">
                <Filter size={16} className="text-slate-400 mr-2" />
                <span className="text-[10px] font-black text-slate-400 uppercase">Filtros</span>
            </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
            <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Ordem / Referência</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Coordenador</th>
                        <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Prioridade</th>
                        <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                        <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredOrders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => { setSelectedOrder(o); setIsDetailsModalOpen(true); }}>
                            <td className="px-6 py-5">
                                <div className="font-black text-slate-800 text-sm group-hover:text-blue-900 transition-colors">{o.title}</div>
                                <div className="flex items-center text-[9px] text-blue-600 font-black uppercase mt-1 tracking-tighter">
                                    <span className="font-mono bg-blue-50 px-1.5 rounded mr-2">ID: {o.id}</span>
                                    {o.reference && <><FileText size={10} className="mr-1" /> {o.reference}</>}
                                </div>
                            </td>
                            <td className="px-6 py-5 text-xs font-bold text-slate-600 uppercase">
                                {o.coordGeral}
                            </td>
                            <td className="px-6 py-5 text-center">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${priorityConfig[o.priority]?.bg} ${priorityConfig[o.priority]?.color}`}>
                                    {o.priority}
                                </span>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusConfig[o.status]?.bg} ${statusConfig[o.status]?.color}`}>
                                    {o.status}
                                </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <div className="flex justify-center gap-1.5">
                                    {/* Botão Imprimir (Modelo Oficial UTC) */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleExportSinglePDF(o); }}
                                        className={`p-2 rounded-lg transition-all border ${isGeneratingPDF === o.id ? 'bg-slate-100 text-slate-300' : 'bg-white text-emerald-600 border-slate-100 hover:bg-emerald-50 hover:border-emerald-200'}`}
                                        title="Imprimir Modelo Oficial (PDF)"
                                        disabled={isGeneratingPDF === o.id}
                                    >
                                        {isGeneratingPDF === o.id ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
                                    </button>

                                    {/* Botão Editar */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); navigate(`/ordens-de-servico/editar/${o.id}`, { state: { order: o } }); }}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 border border-slate-100 bg-white rounded-lg transition-all shadow-sm" 
                                        title="Editar Dossier"
                                    >
                                        <Edit size={16} />
                                    </button>

                                    {/* Botão Visualizar */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); setIsDetailsModalOpen(true); }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 border border-slate-100 bg-white rounded-lg transition-all shadow-sm" 
                                        title="Visualizar Detalhes"
                                    >
                                        <Eye size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <Suspense fallback={null}>
        <DetalheOrdemServicoModal 
            isOpen={isDetailsModalOpen} 
            onClose={() => setIsDetailsModalOpen(false)} 
            order={selectedOrder} 
        />
      </Suspense>
    </div>
  );
};

export default OrdensDeServicoPage;
