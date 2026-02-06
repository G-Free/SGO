import React, { useState, useRef, useMemo } from "react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

import {
  Activity,
  Target,
  AlertOctagon,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  MapPin,
  Loader2,
  Clock,
  RefreshCw,  
  ShieldCheck,
  Briefcase,
  BarChart3,
  Gavel,
  Users,
  FileText
} from "lucide-react";
import html2canvas from "html2canvas";
// FIX: Import useAuth to access the user object
import { useAuth } from '../hooks/useAuth';

declare global {
  interface Window {
    jspdf: any;
  }
}

// Logo oficial para o PDF
const safeLogo = "./conteudo/imagem/logo_sistema_5.png";

const COLORS = {
  blue: "#002B7F",
  emerald: "#10B981",
  rose: "#F43F5E",
  violet: "#8B5CF6",
  amber: "#F59E0B",
  gray: "#E2E8F0",
  slate: "#64748B"
};

// Dados de exemplo
const provinceLoadDataRaw = [
  { name: "Luanda", carga: 85, prev: 80 },
  { name: "Benguela", carga: 72, prev: 75 },
  { name: "Huíla", carga: 68, prev: 60 },
  { name: "Cabinda", carga: 79, prev: 82 },
  { name: "Zaire", carga: 65, prev: 70 },
  { name: "Namibe", carga: 71, prev: 65 },
  { name: "Cunene", carga: 58, prev: 55 },
  { name: "Huambo", carga: 75, prev: 70 },
  { name: "Bié", carga: 62, prev: 65 },
  { name: "Moxico", carga: 55, prev: 50 },
];

const institutionalSymmetryData = [
  { subject: 'AGT', conformidade: 120, resposta: 110, participacao: 150 },
  { subject: 'SME', conformidade: 110, resposta: 130, participacao: 120 },
  { subject: 'PGFA', conformidade: 150, resposta: 120, participacao: 130 },
  { subject: 'SIC', conformidade: 100, resposta: 90, participacao: 110 },
  { subject: 'Marinha', conformidade: 90, resposta: 140, participacao: 95 },
];

const infractionCategoryData = [
  { name: 'Pesca Ilegal', value: 450, color: COLORS.blue },
  { name: 'Documentação', value: 380, color: COLORS.emerald },
  { name: 'Contrabando', value: 290, color: COLORS.amber },
  { name: 'Ambiental', value: 120, color: COLORS.rose },
  { name: 'Imigração', value: 310, color: COLORS.violet },
];

const plansProgressData = [
  { name: "Modernização Tecnológica", progress: 65, color: "bg-blue-600" },
  { name: "Combate à Imigração Ilegal", progress: 42, color: "bg-emerald-600" },
  { name: "Formação de Agentes", progress: 88, color: "bg-indigo-600" },
];

const criticalAlerts = [
  { id: 1, title: "Tentativa de Intrusão", location: "Santa Clara", severity: "Alta", time: "Há 12 min" },
  { id: 2, title: "Divergência de Stock", location: "Luanda", severity: "Média", time: "Há 45 min" },
  { id: 3, title: "Falha de Radar", location: "Cabinda", severity: "Alta", time: "Há 1h" },
];

const activitiesStatusData = [
    { name: "Concluídas", value: 65, color: COLORS.emerald },
    { name: "Em Curso", value: 25, color: COLORS.blue },
    { name: "Pendentes", value: 10, color: COLORS.violet },
];

const kpiData = {
    executionRate: { label: "Taxa de Execução", value: 87.5, trend: "+5.2%", isPositive: true },
    activeActivities: { label: "Atividades Ativas", value: "143", trend: "+12", isPositive: true },
    totalInfractions: { label: "Infrações Detectadas", value: "2,847", trend: "-8.3%", isPositive: true },
    efficiency: { label: "Índice de Eficiência", value: "94.2", trend: "+3.1%", isPositive: true },
};

// --- COMPONENTES AUXILIARES ---

interface KpiCardProps {
  title: string;
  value: string | number;
  trend: string;
  isPositive: boolean;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, trend, isPositive, icon: Icon, colorClass, bgClass }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 ${bgClass} rounded-xl`}>
        <Icon className={`h-6 w-6 ${colorClass}`} />
      </div>
      <span className={`text-[10px] font-black ${isPositive ? "text-emerald-600" : "text-rose-600"} uppercase tracking-tighter`}>
        {trend}
      </span>
    </div>
    <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {title}
        </p>
        <p className={`text-2xl font-black ${colorClass}`}>{value}</p>
    </div>
  </div>
);

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ElementType;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, icon: Icon }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
    <div className="flex items-center gap-3 mb-6">
      {Icon && <Icon className="h-5 w-5 text-blue-600" />}
      <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
        {title}
      </h3>
    </div>
    <div className="flex-grow">
      {children}
    </div>
  </div>
);

// --- PÁGINA PRINCIPAL ---

const MonitorizacaoOperacionalPage: React.FC = () => {
  // FIX: Destructure user from useAuth hook to fix "Cannot find name 'user'"
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("Todas");
  
  // Refs para Captura de Secções Inteiras
  const kpiSectionRef = useRef<HTMLDivElement>(null);
  const operationalRowRef = useRef<HTMLDivElement>(null);
  const analyticRowRef = useRef<HTMLDivElement>(null);
  const managementRowRef = useRef<HTMLDivElement>(null);

  const availableYears = ["2022", "2023", "2024"];
  const selectedYear = "2024";

  const filteredProvinceData = useMemo(() => {
    if (selectedProvince === "Todas") return provinceLoadDataRaw;
    return provinceLoadDataRaw.filter((p) => p.name === selectedProvince);
  }, [selectedProvince]);

  // --- LÓGICA DE EXPORTAÇÃO A4 ---
  const handleExportPDF = async () => {
    if (!window.jspdf || !(window.jspdf as any).jsPDF) {
      alert("Erro: Biblioteca de PDF não carregada.");
      return;
    }

    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      const corporateBlue = [0, 43, 127];
      const darkGrey = [60, 60, 60];

      // Helper para capturar e ajustar imagem ao A4
      const addSectionToPdf = async (ref: React.RefObject<HTMLDivElement>, title: string, yPos: number): Promise<number> => {
        if (!ref.current) return yPos;
        
        // Captura com alta escala para nitidez
        const canvas = await html2canvas(ref.current, { scale: 3, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL("image/png");
        
        // Calcular altura proporcional à largura da folha
        const imgProps = doc.getImageProperties(imgData);
        const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

        // Se a seção não couber na página, cria nova
        if (yPos + imgHeight + 10 > pageHeight - margin) {
            doc.addPage();
            yPos = margin + 10;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...corporateBlue);
        doc.text(title.toUpperCase(), margin, yPos - 5);
        
        doc.addImage(imgData, "PNG", margin, yPos, contentWidth, imgHeight);
        return yPos + imgHeight + 20;
      };

      // --- 1. CAPA ---
      doc.setFillColor(...corporateBlue);
      doc.rect(0, 0, 20, pageHeight, "F");
      try { doc.addImage(safeLogo, "PNG", 40, 30, 90, 20); } catch (e) {}
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(180);
      doc.text("DOCUMENTO OFICIAL | CLASSIFICAÇÃO: RESERVADO", pageWidth - margin, 15, { align: "right" });
      doc.setFontSize(14);
      doc.setTextColor(...darkGrey);
      doc.text("COMITÉ DE GESTÃO COORDENADA DE FRONTEIRAS", 40, 60);
      doc.setDrawColor(...corporateBlue);
      doc.setLineWidth(0.8);
      doc.line(40, 85, pageWidth - margin, 85);
      doc.setFontSize(26);
      doc.setTextColor(0, 0, 0);
      doc.text("RELATÓRIO DE", 40, 105);
      doc.setTextColor(...corporateBlue);
      doc.text("MONITORIZAÇÃO OPERACIONAL", 40, 118);
      doc.line(40, 130, pageWidth - margin, 130);
      doc.setFontSize(12);
      doc.setTextColor(...darkGrey);
      doc.text(`Âmbito: ${selectedProvince}`, 40, 150);
      doc.text(`Ano Fiscal: ${selectedYear}`, 40, 158);
      doc.text(`Data de Geração: ${new Date().toLocaleString("pt-AO")}`, 40, 166);
      // FIX: user is now available via useAuth()
      doc.text(`Responsável: ${user?.username || 'SGO Central'}`, 40, 174);

      // --- 2. ÍNDICE ---
      doc.addPage();
      doc.setFontSize(18);
      doc.setTextColor(...corporateBlue);
      doc.text("ÍNDICE DO RELATÓRIO", margin, 35);
      doc.setLineWidth(0.5);
      doc.line(margin, 40, pageWidth - margin, 40);
      doc.setFontSize(12);
      doc.setTextColor(0);
      const items = [
          { t: "1. Indicadores de Desempenho (KPIs)", p: 3 },
          { t: "2. Análise Geográfica de Carga Operacional", p: 4 },
          { t: "3. Status das Atividades de Fiscalização", p: 4 },
          { t: "4. Sinergia Institucional (Órgãos Integrados)", p: 5 },
          { t: "5. Tipologia de Infrações Detectadas", p: 5 },
          { t: "6. Gestão de Planos Estratégicos", p: 6 },
          { t: "7. Alertas e Riscos Críticos Registados", p: 6 }
      ];
      let idxY = 55;
      items.forEach(item => {
          doc.text(item.t, margin + 5, idxY);
          doc.text(item.p.toString(), pageWidth - margin, idxY, { align: "right" });
          doc.setDrawColor(230);
          doc.line(margin + 5, idxY + 2, pageWidth - margin, idxY + 2);
          idxY += 12;
      });

      // --- 3. CONTEÚDO (CAPTURAS AJUSTADAS) ---
      let currentY = 30;
      
      // Página 3: KPIs
      doc.addPage();
      currentY = await addSectionToPdf(kpiSectionRef, "1. Resumo Executivo (Indicadores Chave)", currentY);

      // Página 4: Operacional
      doc.addPage();
      currentY = 30;
      currentY = await addSectionToPdf(operationalRowRef, "2. Análise de Carga e Estado de Atividades", currentY);

      // Página 5: Analítica
      doc.addPage();
      currentY = 30;
      currentY = await addSectionToPdf(analyticRowRef, "3. Inteligência e Tipologia de Infrações", currentY);

      // Página 6: Gestão
      doc.addPage();
      currentY = 30;
      currentY = await addSectionToPdf(managementRowRef, "4. Gestão Estratégica e Alertas de Risco", currentY);

      // Rodapés e Numeração
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 2; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Página ${i} de ${totalPages} | Sistema de Gestão de Operação - CGCF`, pageWidth / 2, pageHeight - 10, { align: "center" });
      }

      doc.save(`SGO_Monitorizacao_${selectedProvince}_${selectedYear}.pdf`);
    } catch (error) {
      console.error("Erro na geração do documento:", error);
      alert("Falha ao sintetizar o relatório PDF. Verifique os dados.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full pb-12 animate-fadeIn">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard Operacional
          </h1>
          <p className="text-slate-500 mt-1 flex items-center text-sm">
            <Activity className="h-4 w-4 mr-2 text-blue-600" />
            Consola central de telemetria e análise tática institucional.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-full sm:w-auto">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Província</label>
            <select title="Filtrar por Província"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 py-2 px-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todas">Território Nacional</option>
              {provinceLoadDataRaw.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center space-x-2 px-5 py-2 text-sm font-black uppercase tracking-widest text-white bg-blue-900 hover:bg-black rounded-lg shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed ml-2"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* SECÇÃO 1: KPIs (Referenciada para PDF) */}
        <div ref={kpiSectionRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/50 p-2 rounded-2xl">
          <KpiCard
            title={kpiData.executionRate.label}
            value={`${kpiData.executionRate.value}%`}
            trend={kpiData.executionRate.trend}
            isPositive={kpiData.executionRate.isPositive}
            icon={Target}
            colorClass="text-blue-700"
            bgClass="bg-blue-50"
          />
          <KpiCard
            title={kpiData.activeActivities.label}
            value={kpiData.activeActivities.value}
            trend={kpiData.activeActivities.trend}
            isPositive={kpiData.activeActivities.isPositive}
            icon={Activity}
            colorClass="text-emerald-700"
            bgClass="bg-emerald-50"
          />
          <KpiCard
            title={kpiData.totalInfractions.label}
            value={kpiData.totalInfractions.value}
            trend={kpiData.totalInfractions.trend}
            isPositive={kpiData.totalInfractions.isPositive}
            icon={AlertOctagon}
            colorClass="text-rose-700"
            bgClass="bg-rose-50"
          />
          <KpiCard
            title={kpiData.efficiency.label}
            value={kpiData.efficiency.value}
            trend={kpiData.efficiency.trend}
            isPositive={kpiData.efficiency.isPositive}
            icon={TrendingUp}
            colorClass="text-violet-700"
            bgClass="bg-violet-50"
          />
        </div>

        {/* SECÇÃO 2: GRÁFICOS PRIMÁRIOS (Referenciada para PDF) */}
        <div ref={operationalRowRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-2 rounded-2xl">
          <div className="lg:col-span-8">
            <ChartCard title="Carga Operacional por Região" icon={MapPin}>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredProvinceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 700}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{stroke: COLORS.blue, strokeWidth: 1}} />
                    <Area type="monotone" dataKey="carga" stroke={COLORS.blue} strokeWidth={3} fill={COLORS.blue} fillOpacity={0.08} />
                    <Area type="monotone" dataKey="prev" stroke={COLORS.slate} strokeDasharray="4 4" strokeWidth={2} fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div className="lg:col-span-4">
            <ChartCard title="Estado das Atividades" icon={Activity}>
              <div className="h-[350px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={activitiesStatusData} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value">
                      {activitiesStatusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                  <span className="text-4xl font-black text-slate-800 tracking-tighter">143</span>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Total Ativo</span>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* SECÇÃO 3: GRÁFICOS ANALÍTICOS (Referenciada para PDF) */}
        <div ref={analyticRowRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-2 rounded-2xl">
            <div className="lg:col-span-5">
                <ChartCard title="Sinergia Institucional" icon={Users}>
                    <div className="h-[380px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={institutionalSymmetryData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{fill: '#64748B', fontSize: 10, fontWeight: 800}} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} hide />
                                <Radar name="Conformidade" dataKey="conformidade" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.6} />
                                <Radar name="Resposta" dataKey="resposta" stroke={COLORS.emerald} fill={COLORS.emerald} fillOpacity={0.4} />
                                <Legend wrapperStyle={{fontSize: '10px', fontWeight: 'bold', paddingTop: '20px'}} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            <div className="lg:col-span-7">
                <ChartCard title="Tipologia de Infrações Registadas" icon={Gavel}>
                    <div className="h-[380px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={infractionCategoryData} layout="vertical" margin={{ left: 30, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} width={120} />
                                <Tooltip cursor={{fill: '#f8fafc'}} />
                                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
                                    {infractionCategoryData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>
        </div>

        {/* SECÇÃO 4: LISTAS E RISCOS (Referenciada para PDF) */}
        <div ref={managementRowRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/30 p-2 rounded-2xl">
          <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <Briefcase className="h-5 w-5 text-blue-600" />
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Execução de Planos Estratégicos</h3>
            </div>
            <div className="space-y-8">
              {plansProgressData.map((plan, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-700">{plan.name}</span>
                    <span className="text-xs font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded">{plan.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                    <div className={`h-full ${plan.color} transition-all duration-1000`} style={{ width: `${plan.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-rose-50/40">
              <h3 className="text-sm font-black text-rose-900 uppercase tracking-widest flex items-center">
                <ShieldAlert className="h-5 w-5 mr-3 text-rose-600" />
                Alertas e Riscos Críticos
              </h3>
              <span className="text-[9px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">Tempo Real</span>
            </div>
            <div className="flex-grow overflow-y-auto max-h-[350px]">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className="p-5 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group">
                  <div className="flex items-start gap-5">
                    <div className={`mt-1.5 h-2.5 w-2.5 rounded-full shadow-sm ${alert.severity === "Alta" ? "bg-rose-500 animate-pulse" : "bg-amber-400"}`}></div>
                    <div>
                      <p className="text-sm font-black text-slate-800 group-hover:text-blue-900">{alert.title}</p>
                      <div className="flex items-center gap-4 mt-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        <span className="flex items-center gap-1"><MapPin size={10} /> {alert.location}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {alert.time}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${alert.severity === "Alta" ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorizacaoOperacionalPage;