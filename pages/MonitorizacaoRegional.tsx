import React, { useState, useRef, useMemo, useEffect } from "react";
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
} from "recharts";
import {
  Activity,
  Target,
  AlertOctagon,
  TrendingUp,
  Download,
  ShieldAlert,
  MapPin,
  Loader2,
  Clock,
  Briefcase,
  Gavel,
  Zap,
  ShieldCheck,
  Timer,
  Key,
 // Fix: Added missing ArrowUpRight import
  ArrowUpRight
} from "lucide-react";
import html2canvas from "html2canvas";
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../components/Notification';

declare global {
  interface Window {
    jspdf: any;
  }
}

const safeLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAABDCAYAAAC2+lYkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAd8SURBVHhe7Z1/bBxlHMc/s8zKsh/BhmEDExiMMWEi16W5NEmTNC0tDVLbFGqjth80bf2x/bFJk6Zp2rRNWv2xTVWb6oc2DZImaVq6lK7JTSmJuW5iAgMMGOwgK8uyLPv8I3e5d3Zmdnd2d9d9fz8vB3be2Z3f/X7e5/l5dhcQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCATrgmEYx+vr678MDAx8tbS09PHAwMC35+fn/6FQKPzMzMy3UqlUHxsb+0ZFRfWv0tLS7x4eHj6VSqU+Pj4+vrCw8J+Tk5NPzs7OfqRSqV+o1f9/hUIhMpnMPzo6+tX4+Pgvj46O/k6lUj+YnZ39ZHt7+60xMTGfjI2Nfb5arT4xOTn5xezs7C/FYvEbvb29b6VS6Z+1tbX/0Nra+kQ8Hv98PB7/x/F4/N3xePyT8Xj89+Px+Cfj8fiPx+Px347H4x+Nx+N/HI/H/zgej/+beDz+R/F4/I/i8fgfx+PxP4rH438aj8f/MB6P/2E8Hv+DeDz+X4jH498lHo/fJR6P3ycej98lHo/fJh6P3yIej18jHo9fJR6PXyMej18lHo9fIh6PXyAej18gHo9fIB6PXyAej18gHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fIB6PXyAej18gHo9fIB6PXyIej18hHo9fIR6PXyEej18hHo9fIR6PXyEej18hHo9fIR6PXyMeb7+vX78KHo9fIR6PXykejy8SjycSjycSj6cRj6cSj6cRjyYQj0YSj6cRj5cQj5cQj6cSj1cRj1cRj1cRj1cQjxcRj5eIxyuIx2uIxmuIxyuIxyuIx4uIx+OIxyOIxyOIx1OIxxOIxxOIx4OIx4OIxwOIxwOIx4OIx9OIx9OIxxOIxyOJxxKJxyKJxxKJxyOJxxKIx5KIRxKIxxKIR1KIhxKIRyKIRyKIR4SIR1KIRySIRzKIR3KIRzKIRyKIRwKIR4KEIxHEIyHEIx6EIx6EIRwKIhwSIRwSIRwKIhwKEQ4FIRwKEQ4FEA96EI92kI92kI92kI92kI9kEA8kEA8kEI9kEA8kEI8EkA8lkI/EkA/FkA/HkA/GEI/GEY/FEY/FEY/EEA/HEI/HEI/FEo/FEY/FEQ/Hkg/Hkg/FkA/FkA/Hkg/HkQ/HkQ/FkQ/GkY/GEY/GkY/GEY9GkI/GkY9GEI+GEA/6EY/4EY/2EA/3EI93kI92kI/0kI8EEg/2kI9kEI+mkA8nkI9nkI9nkI8mkA8nkI9kkI/FEI+FEI9FEo9EEo9GEo9GEg+6EY+6EQ+7EI+7EI+5kI84kI84kI84kI84kI84EI8YkI8IkA8IEA8IkA8IkI+okA+okI+skA9kkI9EkA9mkA/mkA+WkA9UkA9UkA8kkI+mkI+kkI/nkI+nkI/nkI+GkA8lkA8mEI8mEI9GEg+mEA9GkI+GEA8GEQ8GEg+GEg8EkI8AkA8CEg4GEA8GEA4GkA4EkA8CkAwHkAyHkA4GkA4EkAoGEAwGEAwEkAkFkAyEEAkFkAyEkAmEkAmEkAmGkAmEkAmEEAmEkAmEEAmEkAmEkAmEkAmEkAmEkAmEEAmEkAmGEAmGEAmEkAmEkAmEkAl6kAl6kAkGkAkEEAmEEAmGEAmGEAmEkAmEkAmEkAmEkAmEkAmGEAmEEAmEEAmEEAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmGEAkGEAkGEAkEkAkEEAmEEAmEEAmGEAkGEAmEEAl1kAqFQKBSCQiFQKAKFQKBSCQSCQCAQCIRCIRAIBAKBYD3gfwD88c+E9jG3SwAAAABJRU5kJggg==";

const COLORS = {
  blue: "#002B7F",
  emerald: "#10B981",
  rose: "#F43F5E",
  amber: "#F59E0B",
  indigo: "#6366F1",
  slate: "#64748B",
  grid: "#f1f5f9"
};

// --- DADOS EXEMPLARES POR PROVÍNCIA ---
const regionalDataMocks: Record<string, any> = {
  'Zaire': {
    kpis: [
      { label: "Execução Tática", value: "91.4%", trend: "+2.4%", icon: Target, color: "text-blue-700", bg: "bg-blue-50" },
      { label: "Missões Ativas", value: "24", trend: "+3", icon: Activity, color: "text-emerald-700", bg: "bg-emerald-50" },
      { label: "Infrações (Mês)", value: "182", trend: "-5.1%", icon: AlertOctagon, color: "text-rose-700", bg: "bg-rose-50" },
      { label: "Disponibilidade Meios", value: "88%", trend: "Estável", icon: ShieldCheck, color: "text-indigo-700", bg: "bg-indigo-50" },
    ],
    loadHistory: [
      { name: 'Seg', carga: 65 }, { name: 'Ter', carga: 72 }, { name: 'Qua', carga: 85 },
      { name: 'Qui', carga: 78 }, { name: 'Sex', carga: 92 }, { name: 'Sáb', carga: 55 }, { name: 'Dom', carga: 42 }
    ],
    missionTypes: [
      { name: 'Fronteira Terrestre', value: 55, color: COLORS.blue },
      { name: 'Fiscalização IT', value: 25, color: COLORS.emerald },
      { name: 'Controlo Migratório', value: 20, color: COLORS.amber },
    ],
    alerts: [
      { id: 101, title: "Movimentação Suspeita - Posto Luvo", severity: "Alta", time: "Há 15 min", icon: Zap },
      { id: 102, title: "Falha de Sincronização Biométrica", severity: "Média", time: "Há 1h", icon: ShieldAlert },
      { id: 103, title: "Comboio de Mercadorias não declarado", severity: "Alta", time: "Há 3h", icon: Gavel },
    ]
  },
  'Todas': {
      kpis: [
        { label: "Execução Nacional", value: "84.2%", trend: "+1.1%", icon: Target, color: "text-blue-700", bg: "bg-blue-50" },
        { label: "Total Atividades", value: "157", trend: "+12", icon: Activity, color: "text-emerald-700", bg: "bg-emerald-50" },
        { label: "Alertas Críticos", value: "08", trend: "+2", icon: AlertOctagon, color: "text-rose-700", bg: "bg-rose-50" },
        { label: "Eficiência Média", value: "92%", trend: "+0.5%", icon: TrendingUp, color: "text-indigo-700", bg: "bg-indigo-50" },
      ],
      loadHistory: [
        { name: 'Seg', carga: 450 }, { name: 'Ter', carga: 520 }, { name: 'Qua', carga: 610 },
        { name: 'Qui', carga: 580 }, { name: 'Sex', carga: 700 }, { name: 'Sáb', carga: 400 }, { name: 'Dom', carga: 320 }
      ],
      missionTypes: [
        { name: 'Marítima', value: 40, color: COLORS.blue },
        { name: 'Terrestre', value: 35, color: COLORS.emerald },
        { name: 'Técnica/IT', value: 25, color: COLORS.indigo },
      ],
      alerts: [
        { id: 1, title: "Tentativa de Intrusão em Santa Clara", severity: "Alta", time: "Há 12 min", icon: Zap },
        { id: 2, title: "Divergência de Stock em Luanda", severity: "Média", time: "Há 45 min", icon: ShieldAlert },
        { id: 3, title: "Falha de Radar em Cabinda", severity: "Alta", time: "Há 1h", icon: Gavel },
      ]
  }
};

// Componentes Utilitários
const KpiCard = ({ kpi }: { kpi: any }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 ${kpi.bg} rounded-2xl`}>
        <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
      </div>
      <span className={`text-[10px] font-black uppercase tracking-tighter ${kpi.trend.startsWith('+') ? 'text-emerald-600' : kpi.trend.startsWith('-') ? 'text-rose-600' : 'text-slate-400'}`}>
        {kpi.trend}
      </span>
    </div>
    <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
        <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full">
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
        {Icon && <Icon size={14} className="mr-2 text-blue-600" />}
        {title}
      </h3>
    </div>
    <div className="flex-grow min-h-[250px]">
      {children}
    </div>
  </div>
);

const MonitorizacaoOperacionalRegionalPage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  const userProvince = user?.province || null;
  const isAdmin = user?.profile?.role === "administrador" || user?.profile?.role === "coordenador_central";
  
  const [selectedProvince, setSelectedProvince] = useState<string>(
    userProvince ? userProvince : "Todas"
  );
  
  const canChangeProvince = isAdmin || !userProvince;

  // Selecionar dados baseados na província (se não houver mock específico, usa o de Zaire para ilustrar ou o Nacional)
  const currentMock = regionalDataMocks[selectedProvince] || regionalDataMocks['Zaire'];

  const handleExportPDF = async () => {
    if (!window.jspdf) {
        addNotification("Biblioteca de PDF não disponível.", "error", "Falha");
        return;
    }
    setIsExporting(true);
    addNotification("A sintetizar relatório regional...", "info", "Exportação");
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const canvas = await html2canvas(dashboardRef.current!, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        doc.setFillColor(0, 43, 127);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255);
        doc.setFontSize(16);
        doc.text(`RELATÓRIO DE MONITORIZAÇÃO: ${selectedProvince.toUpperCase()}`, 15, 18);
        doc.setFontSize(8);
        doc.text(`GERADO POR SGO EM ${new Date().toLocaleString()}`, 15, 25);
        
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(imgData, 'PNG', 10, 40, imgWidth, imgHeight);
        
        doc.save(`SGO_Monitorizacao_${selectedProvince}.pdf`);
        addNotification("Relatório PDF gerado com sucesso.", "success", "Concluído");
    } catch (err) {
        addNotification("Erro na captura visual do dashboard.", "error", "Falha");
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <div className="w-full pb-12 animate-fadeIn" ref={dashboardRef}>
      {/* 1. BARRA DE COMANDO E FILTRO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 no-export">
        <div className="flex items-center space-x-6">
            <div className="w-14 h-14 bg-blue-900 rounded-[1.25rem] flex items-center justify-center shadow-xl border border-blue-800">
                <Activity className="text-white animate-pulse" size={28} />
            </div>
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">
                    Monitorização Regional {userProvince && `- ${userProvince}`}
                </h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center">
                    <MapPin size={12} className="mr-1.5 text-blue-600" /> 
                    {selectedProvince === "Todas" ? "Supervisão de todas as províncias ativas" : `Consola tática operativa de ${selectedProvince}`}
                </p>
            </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
          <div className="flex items-center px-4 border-r border-slate-100 h-10">
            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest mr-4">Abrangência</label>
            <select title="Seleção de Província para Monitorização"
              value={selectedProvince}
              onChange={(e) => canChangeProvince && setSelectedProvince(e.target.value)}
              disabled={!canChangeProvince}
              className={`bg-transparent border-none text-xs font-black uppercase text-slate-700 focus:ring-0 cursor-pointer ${!canChangeProvince && 'opacity-50 cursor-not-allowed'}`}
            >
              {isAdmin && <option value="Todas">Território Nacional</option>}
              <option value="Luanda">Luanda</option>
              <option value="Cabinda">Cabinda</option>
              <option value="Zaire">Zaire</option>
              <option value="Cunene">Cunene</option>
              <option value="Benguela">Benguela</option>
              <option value="Namibe">Namibe</option>
            </select>
          </div>
          
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all flex items-center disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="animate-spin mr-2" size={14}/> : <Download className="mr-2" size={14} />}
            Exportar Painel
          </button>
        </div>
      </div>

      {/* 2. KPIS REGIONAIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {currentMock.kpis.map((kpi: any, idx: number) => (
              <KpiCard key={idx} kpi={kpi} />
          ))}
      </div>

      {/* 3. GRÁFICOS OPERACIONAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8">
              <ChartCard title="Evolução da Carga Operacional (7 Dias)" icon={TrendingUp}>
                  <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={currentMock.loadHistory}>
                        <defs>
                          <linearGradient id="colorCarga" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.1}/>
                            <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: COLORS.slate, fontSize: 10, fontWeight: 800}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: COLORS.slate, fontSize: 10}} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                        <Area type="monotone" dataKey="carga" stroke={COLORS.blue} strokeWidth={4} fillOpacity={1} fill="url(#colorCarga)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
              </ChartCard>
          </div>

          <div className="lg:col-span-4">
              <ChartCard title="Distribuição por Natureza" icon={Briefcase}>
                  <div className="h-[250px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentMock.missionTypes}
                          cx="50%" cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {currentMock.missionTypes.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
                        <span className="text-3xl font-black text-slate-800">
                            {currentMock.missionTypes.reduce((acc: number, cur: any) => acc + cur.value, 0)}
                        </span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Regional</span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                      {currentMock.missionTypes.map((item: any) => (
                          <div key={item.name} className="flex justify-between items-center text-[10px] font-bold uppercase">
                              <div className="flex items-center gap-3">
                                  <div title={item.name} className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                  <span className="text-slate-500">{item.name}</span>
                              </div>
                              <span className="text-slate-900">{item.value}%</span>
                          </div>
                      ))}
                  </div>
              </ChartCard>
          </div>
      </div>

      {/* 4. ALERTAS E RISCOS LOCAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b flex justify-between items-center bg-rose-50/30 border-rose-100">
                  <h3 className="text-sm font-black text-rose-900 uppercase tracking-widest flex items-center">
                    <ShieldAlert className="h-5 w-5 mr-3 text-rose-600" />
                    Alertas Críticos na Província
                  </h3>
                  <span className="text-[9px] font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full uppercase tracking-tighter animate-pulse">Monitorização Ativa</span>
              </div>
              <div className="flex-grow overflow-y-auto max-h-[400px]">
                {currentMock.alerts.map((alert: any) => (
                  <div key={alert.id} className="p-6 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group">
                    <div className="flex items-start gap-6">
                      <div className={`p-3 rounded-2xl ${alert.severity === "Alta" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"}`}>
                        <alert.icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 group-hover:text-blue-900 transition-colors">{alert.title}</p>
                        <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          <span className="flex items-center gap-1.5"><Clock size={12} /> {alert.time}</span>
                          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-slate-500">ID: {alert.id}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        alert.severity === "Alta" 
                        ? "bg-rose-50 text-rose-700 border-rose-200 group-hover:bg-rose-600 group-hover:text-white" 
                        : "bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-600 group-hover:text-white"
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-900 transition-colors">Ver todo o histórico de incidentes</button>
              </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#002B7F] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 p-10 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform duration-700">
                      <Zap size={200} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-300 mb-8 flex items-center">
                    <Timer size={16} className="mr-2" /> Tempo Médio de Resposta
                  </h3>
                  <div className="flex items-end gap-4 mb-8">
                      <span className="text-6xl font-black tracking-tighter">18</span>
                      <div className="mb-2">
                        <p className="text-sm font-black uppercase tracking-widest text-blue-200">Minutos</p>
                        <p className="text-[10px] font-bold text-emerald-400 flex items-center">
                            <ArrowUpRight size={12} className="mr-1" /> 12% mais rápido
                        </p>
                      </div>
                  </div>
                  <div className="h-px bg-white/10 w-full mb-8"></div>
                  <p className="text-xs text-blue-100/70 font-medium leading-relaxed italic">
                    "A eficiência na resposta regional de {selectedProvince} mantém-se acima da média nacional de 22 minutos."
                  </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Prontidão dos Órgãos Locais</h3>
                  <div className="space-y-6">
                      {[
                          { label: 'Fiscalização SME', val: 95 },
                          { label: 'Polícia de Fronteira', val: 82 },
                          { label: 'Aduanas (AGT)', val: 70 },
                      ].map((item) => (
                          <div key={item.label}>
                              <div className="flex justify-between items-center mb-2">
                                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">{item.label}</span>
                                  <span className="text-[10px] font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded">{item.val}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div title={`${item.label}: ${item.val}%`}  className="bg-blue-900 h-full transition-all duration-1000" style={{ width: `${item.val}%` }}></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default MonitorizacaoOperacionalRegionalPage;