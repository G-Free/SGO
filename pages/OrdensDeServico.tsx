import React, {
  useState,
  useMemo,
  lazy,
  Suspense,
  useRef,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Edit,
  Eye,
  Clock,
  Loader2,
  FileText,
  Printer,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  FileCheck,
  Stamp,
  X,
  Download,
  Zap,
  MapPin,
  CornerUpLeft,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { useNotification } from "../components/Notification";
import { useAuth } from "../hooks/useAuth";
import { ServiceOrder } from "../types";

const DetalheOrdemServicoModal = lazy(
  () => import("../components/DetalheOrdemServicoModal"),
);
const PdfViewerModal = lazy(() => import("../components/PdfViewerModal"));

const cgcfLogoImg =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABACAYAAAB9Id3VAAAACXBIWXMAAAsTAAALEwEAmpwYAAADJ0lEQVR4nO2aS0hUURzGv3PuzIyjM5YWRmS9SIsSIsKghS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGqhS0KatGvXvwA8fS4qRPhXNAAAAAElFTkSuQmCC";

const flowStatusConfig: Record<
  string,
  { color: string; bg: string; icon: any }
> = {
  "Aguardando Aprovação": {
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-100",
    icon: ShieldCheck,
  },
  "Aguardando Visto Físico": {
    color: "text-amber-900",
    bg: "bg-amber-50 border-amber-200",
    icon: Stamp,
  },
  Protocolado: {
    color: "text-rose-700",
    bg: "bg-rose-50 border-rose-100",
    icon: FileCheck,
  },
  Pendente: {
    color: "text-slate-400",
    bg: "bg-slate-50 border-slate-200",
    icon: Clock,
  },
};

const opStatusConfig: Record<string, { color: string; bg: string; icon: any }> =
  {
    Concluída: {
      color: "text-emerald-700",
      bg: "bg-emerald-100",
      icon: CheckCircle2,
    },
    Pendente: { color: "text-slate-500", bg: "bg-slate-100", icon: Clock },
    "Em Curso": { color: "text-blue-700", bg: "bg-blue-100", icon: Zap },
    Pausada: { color: "text-amber-700", bg: "bg-amber-100", icon: XCircle },
  };

const priorityConfig: Record<string, { color: string; bg: string }> = {
  Baixa: { color: "text-slate-600", bg: "bg-slate-100" },
  Média: { color: "text-blue-600", bg: "bg-blue-50" },
  Alta: { color: "text-orange-600", bg: "bg-orange-50" },
  Urgente: { color: "text-rose-600", bg: "bg-rose-100" },
};

const ImportSignedModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  order: ServiceOrder | null;
  onConfirm: (file: File) => void;
}> = ({ isOpen, onClose, order, onConfirm }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[200] flex justify-center items-center p-4">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden border border-white/20 animate-scaleIn">
        <div className="p-8 border-b flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#002B7F] text-white rounded-2xl shadow-lg">
              <Stamp size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">
                Protocolar Visto Físico
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                Ref: {order.reference}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-10 space-y-8">
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
            <p className="text-amber-900 text-xs font-bold leading-relaxed uppercase tracking-wider flex items-start gap-3">
              <AlertTriangle size={18} className="flex-shrink-0" />O
              carregamento da digitalização assinada altera o fluxo para
              "Protocolado" e aplica os carimbos digitais de validação.
            </p>
          </div>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center cursor-pointer transition-all ${file ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/20"}`}
          >
            <input
              type="file"
              title="Upload"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <>
                <FileCheck size={56} className="text-emerald-500 mb-4" />
                <p className="text-sm font-black text-emerald-900 uppercase tracking-widest">
                  {file.name}
                </p>
              </>
            ) : (
              <>
                <Upload size={56} className="text-slate-300 mb-4" />
                <p className="text-base font-black text-slate-400 uppercase tracking-widest text-center leading-relaxed">
                  Carregar Visto Digitalizado
                  <br />
                  <span className="text-[10px] font-bold text-blue-600">
                    Clique para selecionar o ficheiro
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
        <div className="p-8 bg-slate-50 border-t flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (file) {
                setIsProcessing(true);
                setTimeout(() => {
                  onConfirm(file);
                  setIsProcessing(false);
                  onClose();
                }, 1500);
              }
            }}
            disabled={!file || isProcessing}
            className="flex-[2] bg-[#002B7F] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={18} /> Protocolar Documento
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const OrdensDeServicoPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { addNotification } = useNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfViewerState, setPdfViewerState] = useState({
    isOpen: false,
    url: "",
    title: "",
  });

  const mockWorkOrders: ServiceOrder[] = [
    {
      id: "1001",
      title: "Operação Costa Norte 2024",
      province: "Zaire",
      status: "Protocolado",
      opStatus: "Concluída",
      priority: "Alta",
      createdDate: "28/01/2026",
      reference: "REF/UTC/CN/05/2024",
      operationPeriod: "Julho - Agosto 2024",
      coordGeral: "Dr. José Leiria (PCA da AGT)",
      orgaosExecutores: "UTC Central, UTL Cabinda",
      antecedentes: "Aumento do fluxo de embarcações suspeitas.",
      objetivos: "Inspecionar 100% das embarcações.",
      alvos: "Portos informais.",
      accoesControlo: "Patrulhamento auditado.",
      indicadoresDesempenho: "Nº de inspeções.",
      areaAccoes: "Águas de Cabinda.",
      postoComando: "Unidade Marítima.",
      estrategiaActuacao: "Vigilância 24h.",
      constituicaoGrupos: "Grupo de Assalto.",
      mapaCabimentacao: "Pendente",
      logisticaDetalhe: "3 Embarcações.",
      distribuicao: "Arquivo Central.",
      suporteLogistico: "GMA Cabinda",
      responsabilidades: [
        { cargo: "Coord. Regional", nome: "Braulio Fernandes" },
      ],
      equipaOperativa: [],
    },
    {
      id: "1002",
      title: "Operação Sentinela Sul",
      province: "Zaire",
      status: "Aguardando Aprovação",
      opStatus: "Em Curso",
      priority: "Urgente",
      createdDate: "02/02/2026",
      reference: "REF/UTC/SS/08/2026",
      operationPeriod: "Fevereiro 2026",
      coordGeral: "Dr. José Leiria (PCA da AGT)",
      orgaosExecutores: "UTL Cunene, UTL Namibe",
      antecedentes: "Fluxo migratório irregular detectado via satélite.",
      objetivos: "Reforço de vigilância terrestre e contenção.",
      alvos: "Fronteira Santa Clara.",
      accoesControlo: "Bloqueio de trilhas clandestinas.",
      indicadoresDesempenho: "Rácio de intercepção.",
      areaAccoes: "Província do Cunene.",
      postoComando: "Posto Fronteiriço de Santa Clara.",
      estrategiaActuacao: "Mobilização de drones e patrulha motorizada.",
      constituicaoGrupos: "Equipas de Resposta Rápida.",
      mapaCabimentacao: "Pendente",
      logisticaDetalhe: "10 Viaturas 4x4, 2 Drones.",
      distribuicao: "Comando Nacional, PCA AGT.",
      suporteLogistico: "Logística Regional Sul",
      responsabilidades: [
        { cargo: "Coord. Operacional", nome: "Cmdt. Paulo Bunga" },
      ],
      equipaOperativa: [],
    },
    {
      id: "1003",
      title: "Auditoria Posto Luvo",
      province: "Cabinda",
      status: "Pendente",
      opStatus: "Pendente",
      priority: "Alta",
      createdDate: "05/02/2026",
      reference: "REF/UTC/AL/12/2026",
      operationPeriod: "Março 2026",
      coordGeral: "Dr. José Leiria (PCA da AGT)",
      orgaosExecutores: "UTC / Direcção de Auditoria",
      antecedentes: "Denúncias de irregularidades no desalfandegamento.",
      objetivos: "Auditar processos fiscais do último trimestre.",
      alvos: "Posto Aduaneiro do Luvo.",
      accoesControlo: "Revisão documental e física.",
      indicadoresDesempenho: "Nº de processos auditados.",
      areaAccoes: "Zaire.",
      postoComando: "Sede UTL Zaire.",
      estrategiaActuacao: "Auditagem surpresa assistida.",
      constituicaoGrupos: "Equipa Técnica de Auditoria.",
      mapaCabimentacao: "Pendente",
      logisticaDetalhe: "Apoio local UTL.",
      distribuicao: "Arquivo, Direcção de Ética.",
      suporteLogistico: "Equipa IT Central",
      responsabilidades: [
        { cargo: "Responsável Técnico", nome: "Eng. António Silva" },
      ],
      equipaOperativa: [],
    },
    {
      id: "1004",
      title: "Vigilância Integrada Massabi",
      province: "Luanda",
      status: "Aguardando Visto Físico",
      opStatus: "Concluída",
      priority: "Média",
      createdDate: "25/01/2026",
      reference: "REF/UTC/VM/02/2026",
      operationPeriod: "Janeiro 2026",
      coordGeral: "Dr. José Leiria (PCA da AGT)",
      orgaosExecutores: "UTC, GMA",
      antecedentes: "Necessidade de mapeamento de pontos cegos.",
      objetivos: "Instalação de câmeras térmicas.",
      alvos: "Zona Norte de Massabi.",
      accoesControlo: "Verificação de conectividade.",
      indicadoresDesempenho: "Uptime do sistema.",
      areaAccoes: "Massabi.",
      postoComando: "Central de Monitorização.",
      estrategiaActuacao: "Trabalho de campo e instalação técnica.",
      constituicaoGrupos: "Técnicos de SI.",
      mapaCabimentacao: "Pendente",
      logisticaDetalhe: "Kits de Vigilância.",
      distribuicao: "Direcção de TI, GMO.",
      suporteLogistico: "GMA Central",
      responsabilidades: [{ cargo: "Gestor Projecto", nome: "Técnico Carlos" }],
      equipaOperativa: [],
    },
  ];

  const [workOrders, setWorkOrders] = useState<ServiceOrder[]>([]);

  useEffect(() => {
    // Carregar ordens do localStorage e combinar com as mocks
    const savedOrdersStr = localStorage.getItem("sgo_ordens_persistidas");
    const savedOrders = savedOrdersStr ? JSON.parse(savedOrdersStr) : [];
    const list = savedOrdersStr ? JSON.parse(savedOrdersStr) : [];
    setWorkOrders([...list, ...savedOrders, ...mockWorkOrders]);
  }, []);

  const handleExportOfficialPdf = async (order: ServiceOrder) => {
    if (!window.jspdf) {
      addNotification("Motor de PDF indisponível.", "error", "Falha");
      return;
    }
    setIsGeneratingPdf(true);
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const col1 = margin + 2;
      const col2 = 105;

      // --- PÁGINA 1 ---
      try {
        doc.addImage(cgcfLogoImg, "PNG", pageWidth / 2 - 45, 10, 90, 20);
      } catch (e) {}
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("COMITÉ DE GESTÃO COORDENADA DE FRONTEIRAS", pageWidth / 2, 34, {
        align: "center",
      });
      doc.setFontSize(11);
      doc.text("UNIDADE TÉCNICA CENTRAL", pageWidth / 2, 40, {
        align: "center",
      });

      // Quadro de Visto (Topo Direito)
      doc.setDrawColor(0);
      doc.setLineWidth(0.2);
      doc.rect(145, 10, 55, 32);
      doc.setFontSize(8);
      doc.text("Visto", 172.5, 15, { align: "center" });
      doc.text("Coordenador da UTC", 172.5, 19, { align: "center" });
      doc.text("____________________", 172.5, 27, { align: "center" });
      doc.setFontSize(9);
      doc.text(order.coordGeral || "Dr. José Leiria", 172.5, 33, {
        align: "center",
      });
      doc.setFontSize(7);
      doc.text("PCA da AGT", 172.5, 37, { align: "center" });

      // --- CARIMBO DO COORDENADOR (Página 1) ---
      if (order.status === "Protocolado") {
        const timeStr = new Date().toLocaleTimeString("pt-AO", {
          hour: "2-digit",
          minute: "2-digit",
        });
        doc.setDrawColor(200, 0, 0);
        doc.setLineWidth(0.6);
        doc.rect(147, 12, 51, 28);
        doc.setTextColor(200, 0, 0);
        doc.setFontSize(9);
        doc.text("APROVADO / VALIDADO", 172.5, 19, { align: "center" });
        doc.setFontSize(5);
        doc.text(`SGO - SISTEMA DE GESTÃO DE OPERAÇÃO`, 172.5, 22, {
          align: "center",
        });
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
      doc.text(
        `Resp. Operacional: ${order.responsabilidades?.[0]?.nome || ""}`,
        col2,
        60,
      );
      doc.line(margin, 85, pageWidth - margin, 85);
      doc.setFont("helvetica", "bold");
      doc.text("Apoio:", col1, 90);
      doc.setFont("helvetica", "normal");
      doc.text(`Logística: ${order.suporteLogistico}`, col1, 95);
      doc.setFont("helvetica", "bold");
      doc.text("Órgãos Executores:", col2, 90);
      doc.setFont("helvetica", "normal");
      doc.text(doc.splitTextToSize(order.orgaosExecutores || "", 85), col2, 95);
      doc.line(margin, 110, pageWidth - margin, 110);

      let y = 120;
      const sections = [
        { id: "01", label: "Antecedentes", text: order.antecedentes },
        { id: "02", label: "Objetivos da Operação", text: order.objetivos },
        { id: "03", label: "Alvos da Operação", text: order.alvos },
        { id: "04", label: "Acções de Controlo", text: order.accoesControlo },
        {
          id: "05",
          label: "Indicadores de Desempenho",
          text: order.indicadoresDesempenho,
        },
        {
          id: "07",
          label: "Área de Acções Operacionais",
          text: order.areaAccoes,
        },
        { id: "08", label: "Posto Comando (PC)", text: order.postoComando },
        {
          id: "09",
          label: "Estratégia de Actuação",
          text: order.estrategiaActuacao,
        },
        {
          id: "10",
          label: "Constituição dos Grupos Operacionais",
          text: order.constituicaoGrupos,
        },
        { id: "11", label: "Logística", text: order.logisticaDetalhe },
      ];

      sections.forEach((sec) => {
        if (y > 265) {
          doc.addPage();
          y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.text(`${sec.id}. ${sec.label}:`, margin, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(
          sec.text || "Sem registo.",
          pageWidth - 25,
        );
        doc.text(lines, margin + 5, y);
        y += lines.length * 5 + 6;
      });

      // Marca d'água
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.05 }));
        doc.setFontSize(60);
        doc.setTextColor(150);
        doc.text("CONFIDENCIAL", pageWidth / 2, pageHeight / 2, {
          align: "center",
          angle: 45,
        });
        doc.restoreGraphicsState();
        doc.setFontSize(8);
        doc.text(
          `Página ${i} de ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" },
        );
      }

      // --- PÁGINA 2 ---
      doc.addPage();
      try {
        doc.addImage(cgcfLogoImg, "PNG", pageWidth / 2 - 45, 10, 90, 20);
      } catch (e) {}
      y = 45;
      doc.setFont("helvetica", "bold");
      doc.text("12. Distribuição:", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.text(
        doc.splitTextToSize(order.distribuicao || "", pageWidth - 25),
        margin + 5,
        y,
      );

      y += 40;
      doc.text(
        `Secretariado da Unidade Técnica Central do CGCF, em Luanda, aos ${order.createdDate}`,
        margin,
        y,
      );
      y += 20;
      doc.setFont("helvetica", "bold");
      doc.text("Secretário da UTC", pageWidth / 2, y, { align: "center" });
      y += 10;
      doc.text("Braulio Fernandes", pageWidth / 2, y, { align: "center" });

      // --- CARIMBO DO SECRETÁRIO (Página 2) ---
      if (order.status === "Protocolado") {
        const timeStr = new Date().toLocaleTimeString("pt-AO", {
          hour: "2-digit",
          minute: "2-digit",
        });
        y += 15;
        doc.setDrawColor(200, 0, 0);
        doc.setLineWidth(0.8);
        doc.rect(pageWidth / 2 - 45, y, 90, 42);
        doc.setTextColor(200, 0, 0);
        doc.setFontSize(13);
        doc.text("APROVADO / PROTOCOLADO", pageWidth / 2, y + 8, {
          align: "center",
        });
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text(`SGO - SISTEMA DE GESTÃO DE OPERAÇÃO`, pageWidth / 2, y + 14, {
          align: "center",
        });
        doc.line(pageWidth / 2 - 35, y + 17, pageWidth / 2 + 35, y + 17);

        doc.text(`DATA: ${order.createdDate}`, pageWidth / 2 - 35, y + 24);
        doc.text(`HORA: ${timeStr}`, pageWidth / 2 + 10, y + 24);
        doc.text(`Nº PROCESSO: ${order.reference}`, pageWidth / 2 - 35, y + 30);
        doc.setFont("helvetica", "bold");
        doc.text(`VALIDADOR: BRAULIO FERNANDES`, pageWidth / 2 - 35, y + 37);
      }

      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      setPdfViewerState({
        isOpen: true,
        url,
        title: `Ordem Operativa: ${order.reference}`,
      });
    } catch (err) {
      addNotification("Erro ao processar documento oficial.", "error", "Falha");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!workOrders) return [];

    let items = workOrders;

    // Filtro Provincial para Secretariado Regional
    if (user?.province) {
      items = items.filter((o) => o.province === user.province || !o.province);
    }

    const term = searchTerm?.toLowerCase() || "";

    return items.filter(
      (o) =>
        o.title?.toLowerCase().includes(term) ||
        o.reference?.toLowerCase().includes(term),
    );
  }, [workOrders, searchTerm, user]);

  const isSecretario =
    hasRole("secretario_central") || hasRole("gestor_operacao_provincial") || hasRole("coordenador_central");
  const canEmit =
    hasRole("administrador") ||
    hasRole("coordenador_operacional_central") ||
    hasRole("secretario_central") ||
    hasRole("coordenador_utl_regional");

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">
            Ordens Operativas {user?.province && `- ${user.province}`}
          </h1>
          <p className="text-slate-500 font-bold text-sm flex items-center mt-3 uppercase tracking-widest italic">
            {user?.province
              ? `Foco tático na jurisdição de ${user.province}`
              : "Emissão e Protocolo de Diretrizes Oficiais"}
          </p>
        </div>
        {canEmit && (
          <button
            onClick={() => navigate("/ordens-de-servico/nova")}
            className="bg-[#002B7F] text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-95 flex items-center"
          >
            <PlusCircle size={16} className="mr-2" /> Nova Ordem
          </button>
        )}
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center shadow-sm">
        <Search className="text-slate-300 ml-2" size={18} />
        <input
          type="text"
          placeholder="Pesquisar por referência ou título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-1.5 text-sm font-bold text-slate-700 outline-none"
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Dossier / Ref.
              </th>
              <th className="px-4 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Província
              </th>
              <th className="px-4 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Prioridade
              </th>
              <th className="px-4 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Estado Op.
              </th>
              <th className="px-4 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Fluxo de Aprovação
              </th>
              <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredOrders.map((o) => (
              <tr
                key={o.id}
                className="hover:bg-slate-50/50 transition-all group"
              >
                <td
                  className="px-8 py-8 cursor-pointer"
                  onClick={() => {
                    setSelectedOrder(o);
                    setIsDetailsModalOpen(true);
                  }}
                >
                  <div className="font-black text-slate-800 text-base group-hover:text-blue-900">
                    {o.title}
                  </div>
                  <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-tighter">
                    <span className="font-mono bg-blue-50 px-2 py-0.5 rounded mr-3 border border-blue-100 text-blue-800">
                      REF: {o.reference}
                    </span>
                    <Clock size={11} className="mr-1.5" /> {o.createdDate}
                  </div>
                </td>
                <td className="px-4 py-8 text-center">
                  <span className="text-[10px] font-black uppercase text-slate-400">
                    {o.province || "Nacional"}
                  </span>
                </td>
                <td className="px-4 py-8 text-center">
                  <span
                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${priorityConfig[o.priority]?.bg} ${priorityConfig[o.priority]?.color}`}
                  >
                    {o.priority}
                  </span>
                </td>
                <td className="px-4 py-8 text-center">
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${opStatusConfig[o.opStatus]?.bg} ${opStatusConfig[o.opStatus]?.color}`}
                  >
                    <span className="mr-2">
                      {React.createElement(opStatusConfig[o.opStatus]?.icon, {
                        size: 14,
                      })}
                    </span>{" "}
                    {o.opStatus}
                  </div>
                </td>
                <td className="px-4 py-8 text-center">
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${flowStatusConfig[o.status]?.bg} ${flowStatusConfig[o.status]?.color}`}
                  >
                    <span className="mr-2">
                      {React.createElement(flowStatusConfig[o.status]?.icon, {
                        size: 14,
                      })}
                    </span>{" "}
                    {o.status}
                  </div>
                </td>
                <td className="px-8 py-8 text-center">
                  <div className="flex justify-center gap-2 items-center">
                    <button
                      onClick={() => {
                        setSelectedOrder(o);
                        setIsDetailsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                      title="Visualizar"
                    >
                      <Eye size={20} />
                    </button>

                    {/* Botão Editar: Visível apenas se não estiver em Visto Físico ou Protocolado */}
                    {o.status !== "Aguardando Visto Físico" &&
                      o.status !== "Protocolado" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/ordens-de-servico/editar/${o.id}`, {
                              state: { order: o },
                            });
                          }}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl"
                          title="Editar"
                        >
                          <Edit size={20} />
                        </button>
                      )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportOfficialPdf(o);
                      }}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl"
                      title="Imprimir Via Oficial"
                    >
                      {isGeneratingPdf ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Printer size={20} />
                      )}
                    </button>

                    {isSecretario && o.status === "Aguardando Aprovação" && (
                      <>
                        <button
                          onClick={() =>
                            setWorkOrders((prev) =>
                              prev.map((item) =>
                                item.id === o.id
                                  ? {
                                      ...item,
                                      status: "Aguardando Visto Físico",
                                    }
                                  : item,
                              ),
                            )
                          }
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl"
                          title="Validar"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                        <button
                          onClick={() =>
                            setWorkOrders((prev) =>
                              prev.map((item) =>
                                item.id === o.id
                                  ? { ...item, status: "Pendente" }
                                  : item,
                              ),
                            )
                          }
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                          title="Devolver"
                        >
                          <CornerUpLeft size={20} />
                        </button>
                      </>
                    )}

                    {isSecretario && o.status === "Aguardando Visto Físico" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(o);
                          setIsImportModalOpen(true);
                        }}
                        className="p-2 text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200"
                        title="Protocolar Visto"
                      >
                        <Upload size={20} />
                      </button>
                    )}

                    {o.status === "Protocolado" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportOfficialPdf(o);
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                        title="Baixar Via Protocolada"
                      >
                        <Download size={20} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Suspense fallback={null}>
        <DetalheOrdemServicoModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          order={selectedOrder}
        />
        <ImportSignedModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          order={selectedOrder}
          onConfirm={(f) =>
            setWorkOrders((prev) =>
              prev.map((item) =>
                item.id === selectedOrder?.id
                  ? { ...item, status: "Protocolado" }
                  : item,
              ),
            )
          }
        />
        {pdfViewerState.isOpen && (
          <PdfViewerModal
            isOpen={pdfViewerState.isOpen}
            onClose={() =>
              setPdfViewerState({ ...pdfViewerState, isOpen: false })
            }
            pdfUrl={pdfViewerState.url}
            title={pdfViewerState.title}
          />
        )}
      </Suspense>
    </div>
  );
};

export default OrdensDeServicoPage;
