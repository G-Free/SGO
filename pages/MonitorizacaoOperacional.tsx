
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, 
  CartesianGrid, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Activity, Target, MapPin, Loader2, 
  ShieldCheck, RefreshCw, Timer, 
  Gavel, LayoutDashboard, Download, Filter,
  ShieldAlert, TrendingUp, Zap, MessageSquare, AlertCircle,
  Eye, BrainCircuit, Ship, Plane, Car, Users, ArrowUpRight, ArrowDownRight,
  ChevronRight, ClipboardCheck, Briefcase, BarChart3, FileCheck, PieChart as PieIcon,
  CalendarDays, HardDrive, Waves, Smartphone, Shield, Radio, Crosshair
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import html2canvas from "html2canvas";
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../components/Notification';

// Declaração do Leaflet para uso global
declare const L: any;

const COLORS = {
  blue: '#002B7F',
  lightBlue: '#3B82F6',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
  indigo: '#6366F1',
  slate: '#94a3b8',
  grid: '#F1F5F9',
};

const PROVINCE_COORDS: Record<string, [number, number]> = {
  'Todas': [-11.20, 17.87],
  'Luanda': [-8.83, 13.23],
  'Cabinda': [-5.55, 12.20],
  'Zaire': [-6.11, 14.81],
  'Cunene': [-17.06, 15.74],
  'Benguela': [-12.58, 13.41],
  'Namibe': [-15.19, 12.15],
};

// --- MOCK DATA ADICIONAL ---
const responseTimeData = [
  { hour: '00:00', time: 15 }, { hour: '04:00', time: 12 }, { hour: '08:00', time: 25 },
  { hour: '12:00', time: 30 }, { hour: '16:00', time: 22 }, { hour: '20:00', time: 18 },
  { hour: '23:59', time: 14 },
];

const readinessData = [
  { name: 'Marítimo', pronto: 85, manutencao: 10, indisponivel: 5 },
  { name: 'Terrestre', pronto: 70, manutencao: 20, indisponivel: 10 },
  { name: 'Aéreo', pronto: 95, manutencao: 5, indisponivel: 0 },
  { name: 'Telecom', pronto: 90, manutencao: 8, indisponivel: 2 },
];

const dailyTrendData = [
  { day: '01/07', ops: 45, alerts: 12, resolved: 10 },
  { day: '02/07', ops: 52, alerts: 8, resolved: 15 },
  { day: '03/07', ops: 48, alerts: 15, resolved: 12 },
  { day: '04/07', ops: 61, alerts: 22, resolved: 18 },
  { day: '05/07', ops: 55, alerts: 10, resolved: 14 },
  { day: '06/07', ops: 67, alerts: 14, resolved: 20 },
  { day: '07/07', ops: 70, alerts: 9, resolved: 22 },
];

const organPerformance = [
  { subject: 'AGT', compliance: 95, response: 80, participation: 90 },
  { subject: 'SME', compliance: 88, response: 92, participation: 85 },
  { subject: 'PGFA', compliance: 82, response: 85, participation: 95 },
  { subject: 'Marinha', compliance: 75, response: 70, participation: 80 },
  { subject: 'Saúde', compliance: 90, response: 85, participation: 60 },
];

const DashboardCard: React.FC<{ title: string; children: React.ReactNode; icon?: React.ElementType; action?: React.ReactNode; className?: string }> = ({ title, children, icon: Icon, action, className = "" }) => (
  <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 ${className}`}>
    <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
        {Icon && <Icon size={14} className="mr-2 text-blue-600" />}
        {title}
      </h3>
      {action}
    </div>
    <div className="p-6 flex-grow">{children}</div>
  </div>
);

const GaugeChart: React.FC<{ value: number; label: string; color: string; total?: number; trend?: string }> = ({ value, label, color, total = 100, trend }) => {
  const data = [
    { value: value, fill: color },
    { value: Math.max(0, total - value), fill: '#F1F5F9' }
  ];
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="-mt-8 text-center">
        <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
        {trend && (
           <span className={`text-[8px] font-black uppercase mt-1 inline-block ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
               {trend} vs. Ontem
           </span>
        )}
      </div>
    </div>
  );
};

const MonitorizacaoOperacionalPage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  // Estados de Filtro Expandidos
  const [selectedProvince, setSelectedProvince] = useState('Todas');
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [selectedNature, setSelectedNature] = useState('Todas');
  const [selectedSeverity, setSelectedSeverity] = useState('Todas');
  const [selectedUnit, setSelectedUnit] = useState('Todas');

  const [isLive, setIsLive] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({ ops: 18, done: 42, late: 5, alerts: 3 });
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const mapRef = useRef<any>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ops: Math.max(10, prev.ops + (Math.random() > 0.5 ? 1 : -1)),
        done: prev.done + (Math.random() > 0.8 ? 1 : 0),
        late: Math.max(0, prev.late + (Math.random() > 0.7 ? 1 : -1)),
        alerts: Math.max(1, prev.alerts + (Math.random() > 0.9 ? 1 : -1))
      }));
    }, 12000);
    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('ops-map', { zoomControl: false, scrollWheelZoom: false }).setView(PROVINCE_COORDS['Todas'], 5);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: 'SGO CGCF Intelligence'
      }).addTo(map);
    }

    if (mapRef.current) {
      const coords = PROVINCE_COORDS[selectedProvince] || PROVINCE_COORDS['Todas'];
      const zoom = selectedProvince === 'Todas' ? 5 : 9;
      mapRef.current.flyTo(coords, zoom, { duration: 1.5 });
    }
  }, [selectedProvince]);

  const generateAiInsight = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Como analista de inteligência sênior do SGO Angola, forneça um briefing tático baseado:
      - Geografia: ${selectedProvince} | Período: ${selectedPeriod}
      - Filtros Ativos: Severidade(${selectedSeverity}), Unidade(${selectedUnit})
      - Métricas Atuais: Ativas(${liveMetrics.ops}), Alertas(${liveMetrics.alerts}), Atrasos(${liveMetrics.late})
      Forneça recomendações de deslocamento de meios em 3 frases curtas e impactantes.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiInsight(response.text || "Sintetização tática indisponível.");
    } catch (err) {
      setAiInsight("Rede de inteligência saturada. Aguardando sincronização de satélites.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    generateAiInsight();
  }, [selectedProvince, selectedPeriod, selectedNature, selectedSeverity, selectedUnit]);

  const handleExportPDF = async () => {
    if (!window.jspdf) {
        addNotification("Motor de PDF não disponível.", "error", "Erro");
        return;
    }
    setIsExporting(true);
    addNotification("A gerar relatório de comando consolidado...", "info", "Exportação");

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const canvas = await html2canvas(dashboardRef.current!, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        doc.setFillColor(0, 43, 127);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.text("SGO - COMANDO SITUACIONAL TÁTICO", 15, 20);
        doc.setFontSize(10);
        doc.text(`Âmbito: ${selectedProvince} | Exportado por: ${user?.username}`, 15, 30);

        doc.addImage(imgData, 'PNG', 10, 50, imgWidth, imgHeight);
        doc.save(`SGO_Comando_Tatico_${selectedProvince}.pdf`);
        addNotification("Relatório de comando exportado.", "success", "Concluído");
    } catch (err) {
        addNotification("Erro na captura de dados.", "error", "Falha");
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <div className="w-full pb-10 space-y-6 animate-fadeIn" ref={dashboardRef}>
      
      {/* 1. BARRA DE FILTROS ESTRATÉGICOS (EXPANDIDA) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 no-export">
        <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center shadow-xl border border-blue-800">
                <Radio className="text-white animate-pulse" size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Comando Situacional</h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1 italic">Real-Time Intelligence Hub</p>
            </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-full lg:w-auto">
            {/* Província */}
            <div className="flex items-center px-3 border-r border-slate-100 h-9">
                <MapPin size={12} className="text-slate-400 mr-2" />
                <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} className="bg-transparent border-none text-[10px] font-black uppercase text-slate-700 focus:ring-0 cursor-pointer">
                    <option value="Todas">Nacional</option>
                    {Object.keys(PROVINCE_COORDS).filter(p => p !== 'Todas').map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            {/* Período */}
            <div className="flex items-center px-3 border-r border-slate-100 h-9">
                <CalendarDays size={12} className="text-slate-400 mr-2" />
                <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="bg-transparent border-none text-[10px] font-black uppercase text-slate-700 focus:ring-0 cursor-pointer">
                    <option value="24h">Últimas 24h</option>
                    <option value="7d">7 Dias</option>
                    <option value="30d">30 Dias</option>
                </select>
            </div>

            {/* Severidade - NOVO */}
            <div className="flex items-center px-3 border-r border-slate-100 h-9">
                <ShieldAlert size={12} className="text-slate-400 mr-2" />
                <select value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value)} className="bg-transparent border-none text-[10px] font-black uppercase text-slate-700 focus:ring-0 cursor-pointer">
                    <option value="Todas">Toda Severidade</option>
                    <option value="Crítica">Crítica</option>
                    <option value="Alta">Alta</option>
                    <option value="Normal">Normal</option>
                </select>
            </div>

            {/* Unidade - NOVO */}
            <div className="flex items-center px-3 border-r border-slate-100 h-9">
                <Shield size={12} className="text-slate-400 mr-2" />
                <select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)} className="bg-transparent border-none text-[10px] font-black uppercase text-slate-700 focus:ring-0 cursor-pointer">
                    <option value="Todas">Todos Órgãos</option>
                    <option value="AGT">AGT</option>
                    <option value="SME">SME</option>
                    <option value="PGFA">PGFA</option>
                    <option value="Marinha">Marinha</option>
                </select>
            </div>

            <button onClick={handleExportPDF} disabled={isExporting} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center shadow-md">
                {isExporting ? <Loader2 className="animate-spin mr-2" size={12}/> : <Download className="mr-2" size={12} />}
                Exportar Briefing
            </button>
        </div>
      </div>

      {/* 2. KPI ESTRATÉGICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Operações no Terreno" icon={Zap}>
              <GaugeChart value={liveMetrics.ops} label="Ativas agora" color={COLORS.blue} total={30} trend="+5%" />
          </DashboardCard>
          <DashboardCard title="Taxa de Prontidão" icon={ShieldCheck}>
              <GaugeChart value={89} label="Meios Disponíveis" color={COLORS.emerald} total={100} trend="+2%" />
          </DashboardCard>
          <DashboardCard title="Tempo Médio Resposta" icon={Timer}>
              <GaugeChart value={22} label="Minutos / Incidente" color={COLORS.indigo} total={60} trend="-14%" />
          </DashboardCard>
          <DashboardCard title="Incidentes Críticos" icon={ShieldAlert}>
              <GaugeChart value={liveMetrics.alerts} label="Pendentes" color={COLORS.rose} total={10} trend="+1" />
          </DashboardCard>
      </div>

      {/* 3. MAPA E INTELIGÊNCIA */}
      <