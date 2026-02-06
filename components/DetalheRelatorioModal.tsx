
import React, { useState, lazy, Suspense, useEffect } from 'react';
// Added useNavigate import for navigation support when showEdit is active
import { useNavigate } from 'react-router-dom';
import { 
  X, FileText, User, Calendar, Target, Users, ShieldAlert, MapPin, Zap, 
  BarChart3, Edit, Download, MessageSquare, CheckCircle2, CornerUpLeft, Eye,
  Gavel, Package, Truck, Receipt, Info, Lightbulb, List, RefreshCw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../components/Notification';

const PdfViewerModal = lazy(() => import('./PdfViewerModal'));

// Logo PNG do CGCF para o PDF
const cgcfLogoImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAABDCAYAAAC2+lYkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAd8SURBVHhe7Z1/bBxlHMc/s8zKsh/BhmEDExiMMWEi16W5NEmTNC0tDVLbFGqjth80bf2x/bFJk6Zp2rRNWv2xTVWb6oc2DZImaVq6lK7JTSmJuW5iAgMMGOwgK8uyLPv8I3e5d3Zmdnd2d9d9fz8vB3be2Z3f/X7e5/l5dhcQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCATrgmEYx+vr678MDAx8tbS09PHAwMC35+fn/6FQKPzMzMy3UqlUHxsb+0ZFRfWv0tLS7x4eHj6VSqU+Pj4+vrCw8J+Tk5NPzs7OfqRSqV+o1f9/hUIhMpnMPzo6+tX4+Pgvj46O/k6lUj+YnZ39ZHt7+60xMTGfjI2Nfb5arT4xOTn5xezs7C/FYvEbvb29b6VS6Z+1tbX/0Nra+kQ8Hv98PB7/x/F4/N3xePyT8Xj89+Px+Cfj8fiPx+Px347H4x+Nx+N/HI/H/zgej/+beDz+R/F4/I/i8fgfx+PxP4rH438aj8f/MB6P/2E8Hv+DeDz+X4jH498lHo/fJR6P3ycej98lHo/fJh6P3yIej18jHo9fJR6PXyMej18lHo9fIh6PXyAej18gHo9fIB6PXyAej18gHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fIB6PXyAej18gHo9fIB6PXyIej18hHo9fIR6PXyEej18hHo9fIR6PXyEej18hHo9fIR6PXyMeb7+vX78KHo9fIR6PXykejy8SjycSjycSj6cRj6cSj6cRjyYQj0YSj6cRj5cQj5cQj6cSj1cRj1cRj1cQj1cQjxcRj5eIxyuIx2uIxmuIxyuIxyuIx4uIx+OIxyOIxyOIx1OIxxOIxxOIx4OIx4OIxwOIxwOIx4OIx9OIx9OIxxOIxyOJxxKJxyKJxxKJxyOJxxKIx5KIRxKIxxKIR1KIhxKIRyKIRyKIR4SIR1KIRySIRzKIR3KIRzKIRyKIRwKIR4KEIxHEIyHEIx6EIx6EIRwKIhwSIRwSIRwKIhwKEQ4FIRwKEQ4FEA96EI92kI92kI92kI92kI9kEA8kEA8kEI9kEA8kEI8EkA8lkI/EkA/FkA/HkA/GEI/GEY/FEY/FEY/EEA/HEI/HEI/FEo/FEY/FEQ/Hkg/Hkg/FkA/FkA/Hkg/HkQ/HkQ/FkQ/GkY/GEY/GkY/GEY9GkI/GkY9GEI+GEA/6EY/4EY/2EA/3EI93kI92kI/0kI8EEg/2kI9kEI+mkA8nkI9nkI9nkI8mkA8nkI9kkI/FEI+FEI9FEo9EEo9GEo9GEg+6EY+6EQ+7EI+7EI+5kI84kI84kI84kI84kI84EI8YkI8IkA8IEA8IkA8IkI+okA+okI+skA9kkI9EkA9mkA/mkA+WkA9UkA9UkA8kkI+mkI+kkI/nkI+nkI/nkI+GkA8lkA8mEI8mEI9GEg+mEA9GkI+GEA8GEQ8GEg+GEg8EkI8AkA8CEg4GEA8GEA4GkA4EkA8CkAwHkAyHkA4GkA4EkAoGEAwGEAwEkAkFkAyEEAkFkAyEkAmEkAmEkAmGkAmEkAmEEAmEkAmEEAmEkAmEkAmEkAmEkAmEkAmEEAmEkAmGEAmGEAmEkAmEkAmEkAl6kAl6kAkGkAkEEAmEEAmGEAmGEAmEkAmEkAmEkAmEkAmEkAmGEAmEEAmEEAmEEAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmGEAkGEAkGEAkEkAkEEAmEEAmEEAmGEAkGEAmEEAl1kAqFQKBSCQiFQKAKFQKBSCQSCQCAQCIRCIRAIBAKBYD3gfwD88c+E9jG3SwAAAABJRU5kJggg==";

// Added statusColors definition to fix 'Cannot find name statusColors' error
const statusColors: { [key: string]: string } = {
  'Validado': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Rascunho': 'bg-gray-100 text-gray-800 border-gray-200',
  'Em Edição': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Submetido': 'bg-blue-100 text-blue-800 border-blue-200',
  'Encaminhado': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Pendente': 'bg-slate-100 text-slate-600 border-slate-200',
};

// Added showEdit optional prop to interface to fix TypeScript error in GestaoGmoCentral.tsx
interface DetalheRelatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any | null;
  showEdit?: boolean;
}

const Section: React.FC<{ 
  number: string, 
  title: string, 
  icon?: React.ElementType, 
  children: React.ReactNode,
  className?: string
}> = ({ number, title, icon: Icon, children, className = "bg-white border-slate-200" }) => (
    <div className={`p-6 rounded-2xl border shadow-sm ${className}`}>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
            {Icon && <Icon className="h-4 w-4 mr-2 text-blue-600" />}
            {number}. {title}
        </h3>
        <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
            {children || <span className="text-slate-300 italic">Sem registo para esta secção.</span>}
        </div>
    </div>
);

// Destructured showEdit from props in component definition
const DetalheRelatorioModal: React.FC<DetalheRelatorioModalProps> = ({ isOpen, onClose, report, showEdit }) => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  // Initialize navigate for handleEdit function
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Limpeza de URLs para evitar vazamento de memória
  useEffect(() => {
    return () => {
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
    };
  }, [pdfUrl]);

  if (!isOpen || !report) return null;

  const isCoordinator = user?.profile.role === 'coordenador_operacional_central' || user?.profile.role === 'administrador';
  const isPendingValidation = report.status === 'Submetido' || report.status === 'Pendente';

  // Implementation of handleEdit for the optional edit button
  const handleEdit = () => {
    onClose();
    navigate(`/relatorios/editar/${report.id}`, { state: { report } });
  };

  // --- GERAÇÃO DO PDF FIEL AO MODELO ---
  const handleGeneratePdf = async () => {
    if (!window.jspdf || !(window.jspdf as any).jsPDF) {
        addNotification("Serviço de PDF indisponível.", "error", "Erro");
        return;
    }

    setIsGenerating(true);
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const leftMargin = 20;
        const contentWidth = pageWidth - (leftMargin * 2);

        // --- PÁGINA 1: CAPA OFICIAL ---
        doc.setFillColor(0, 43, 127); 
        doc.rect(10, 10, 5, 277, 'F'); // Barra lateral azul

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("CONFIDENCIAL", pageWidth - 20, 15, { align: 'right' });

        try {
            doc.addImage(cgcfLogoImg, 'PNG', (pageWidth/2)-45, 40, 90, 22);
        } catch(e) {
            doc.setFontSize(30);
            doc.setTextColor(255,0,0);
            doc.text("CGCF", pageWidth/2, 50, { align: 'center' });
            doc.setTextColor(0);
        }

        doc.setFontSize(14);
        doc.text("GRUPO OPERACIONAL MULTISSECTORIAL", pageWidth/2, 75, { align: 'center' });

        doc.setDrawColor(0, 43, 127);
        doc.setLineWidth(0.8);
        doc.rect(30, 95, 150, 45); 
        
        doc.setFontSize(16);
        doc.text("RELATÓRIO DA OPERAÇÃO NO ÂMBITO DO", pageWidth/2, 112, { align: 'center' });
        doc.setFontSize(14);
        const titleLine = doc.splitTextToSize(report.title?.toUpperCase() || "RELATÓRIO OPERACIONAL", 130);
        doc.text(titleLine, pageWidth/2, 124, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`PROVÍNCIA: ${report.province?.toUpperCase() || report.origin?.toUpperCase() || "CABINDA"}`, pageWidth/2, 160, { align: 'center' });

        doc.setFontSize(14);
        doc.text(`*${report.month || report.date || "Janeiro de 2026"}*`, pageWidth/2, 230, { align: 'center' });

        // --- PÁGINA 2: ÍNDICE ---
        doc.addPage();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("ÍNDICE", pageWidth/2, 35, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.line(pageWidth/2 - 20, 40, pageWidth/2 + 20, 40);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const sections = [
            "1. Preâmbulo", 
            "2. Encontros de Trabalhos com as Autoridades Locais", 
            "3. Alvos da Operação",
            "4. Acções Desenvolvidas", 
            "5. Constatações Gerais (Inclui Infrações)", 
            "6. Constatações Específicas por Municípios",
            "7. Actividades desenvolvidas (Objectivos)", 
            "8. Resultados Gerais", 
            "9. Valores dos incumprimentos apurados",
            "10. Estado Moral e Disciplinar do Pessoal", 
            "11. Forças e Meios", 
            "12. Considerações Gerais",
            "a) Propostas de Medidas", 
            "Anexos Visuais"
        ];
        let idxY = 60;
        sections.forEach(s => { 
            doc.text(s, 30, idxY); 
            doc.setDrawColor(240);
            doc.line(30, idxY + 2, pageWidth - 30, idxY + 2);
            idxY += 12; 
        });

        // --- PÁGINA 3: CONTEÚDO ---
        doc.addPage();
        let y = 30;
        
        const renderSection = (num: string, title: string, content: string) => {
            const lines = doc.splitTextToSize(content || "Sem registo oficial para este período.", contentWidth - 10);
            const height = (lines.length * 6) + 15;

            if (y + height > 270) { doc.addPage(); y = 30; }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(0, 43, 127);
            doc.text(`${num}. ${title}`, leftMargin, y);
            y += 8;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(50);
            doc.text(lines, leftMargin + 5, y);
            y += (lines.length * 6) + 10;
        };

        renderSection("1", "Preâmbulo", report.summary || report.preambulo);
        renderSection("2", "Encontros de Trabalhos", report.encontros);
        renderSection("3", "Alvos da Operação", report.alvos);
        renderSection("4", "Acções Desenvolvidas", report.accoes);
        renderSection("5", "Constatações Gerais", report.constatacoes);
        renderSection("11", "Forças e Meios", report.forcasMeios);
        renderSection("12", "Considerações Gerais e Propostas", report.propostas);

        // Saída para Blob
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
    } catch (e) {
        console.error("PDF Fail:", e);
        addNotification("Erro na síntese do documento.", "error", "Falha");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleAction = (type: 'approve' | 'return') => {
    if (!comment.trim()) {
        addNotification('É obrigatório preencher o parecer técnico.', 'error', 'Validação');
        return;
    }
    addNotification(`Processo ${report.id} ${type === 'approve' ? 'validado' : 'devolvido'}.`, 'success', 'Fluxo');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 grid place-items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b flex justify-between items-center bg-white sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-[#002B7F] text-white shadow-lg">
                <FileText size={24} />
            </div>
            <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">
                    {report.title || `Submissão: ${report.id}`}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className={`px-2 py-0.5 rounded-full border ${statusColors[report.status] || 'bg-gray-100'}`}>
                        {report.status}
                    </span>
                    <span>•</span>
                    <span>{report.origin || 'Coordenação Central'}</span>
                </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Conditional Edit Button implemented based on showEdit prop */}
            {showEdit && (
                <button 
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                >
                    <Edit size={16} /> 
                    Editar Relatório
                </button>
            )}
            <button 
                onClick={handleGeneratePdf}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-[#002B7F] hover:bg-black text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
                {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <Eye size={16} />} 
                Pré-visualização Oficial
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
                <X size={28} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 overflow-y-auto flex-grow space-y-8 bg-white/50">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
                    <MapPin className="text-rose-500" size={20} />
                    <div><p className="text-[8px] font-black text-slate-400 uppercase">Província</p><p className="text-xs font-bold text-slate-700">{report.province || 'Cabinda'}</p></div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
                    <User className="text-blue-500" size={20} />
                    <div><p className="text-[8px] font-black text-slate-400 uppercase">Responsável</p><p className="text-xs font-bold text-slate-700">{report.submittedBy || 'Coord. Operacional'}</p></div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
                    <Calendar className="text-amber-500" size={20} />
                    <div><p className="text-[8px] font-black text-slate-400 uppercase">Data Envio</p><p className="text-xs font-bold text-slate-700">{report.createdAt || 'Pendente'}</p></div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
                    <Zap className="text-purple-500" size={20} />
                    <div><p className="text-[8px] font-black text-slate-400 uppercase">Natureza</p><p className="text-xs font-bold text-slate-700">Operacional</p></div>
                </div>
            </div>

            <div className="space-y-6">
                <Section number="1" title="Preâmbulo" icon={FileText}>
                    {report.summary || report.preambulo}
                </Section>

                <Section number="4" title="Acções Desenvolvidas" icon={Zap}>
                    {report.accoes || "Patrulhamento preventivo e inspeção física em rotas prioritárias conforme plano anual."}
                </Section>

                <Section number="5" title="Constatações Gerais" icon={ShieldAlert} className="bg-amber-50 border-amber-100 text-amber-900">
                    {report.constatacoes || "Relatório de incidentes e anomalias técnicas detectadas em campo."}
                </Section>
                
                <Section number="11" title="Forças e Meios" icon={Truck}>
                    {report.forcasMeios || "Mobilização de meios conforme escala nacional."}
                </Section>
            </div>

            {/* Decision Zone for Coordinator */}
            {isCoordinator && isPendingValidation && (
                <div className="mt-12 p-10 bg-blue-900/5 border-2 border-[#002B7F] border-dashed rounded-[2.5rem] space-y-6 shadow-inner">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="text-[#002B7F]" size={24} />
                        <h4 className="text-base font-black text-[#002B7F] uppercase tracking-[0.2em]">Parecer Técnico da Coordenação</h4>
                    </div>
                    <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Insira as observações críticas, recomendações estratégicas ou justificativas para a decisão técnica de validação..."
                        className="w-full p-6 bg-white border border-blue-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none min-h-[160px] shadow-sm transition-all"
                    />
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <button 
                            onClick={() => handleAction('approve')}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center shadow-lg active:scale-95 transition-all"
                        >
                            <CheckCircle2 className="mr-2" size={18} /> Validar Relatório
                        </button>
                        <button 
                            onClick={() => handleAction('return')}
                            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center shadow-lg active:scale-95 transition-all"
                        >
                            <CornerUpLeft className="mr-2" size={18} /> Devolver para Ajustes
                        </button>
                    </div>
                </div>
            )}
        </div>

        <div className="px-8 py-5 border-t bg-slate-50 flex justify-end gap-3 rounded-b-[2.5rem]">
          <button onClick={onClose} className="px-8 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors">
            Fechar Detalhes
          </button>
        </div>
      </div>

      <Suspense fallback={null}>
        {pdfUrl && (
            <PdfViewerModal 
                isOpen={!!pdfUrl} 
                onClose={() => setPdfUrl(null)} 
                pdfUrl={pdfUrl} 
                title={`Relatório Oficial: ${report.id}`} 
            />
        )}
      </Suspense>
    </div>
  );
};

export default DetalheRelatorioModal;
