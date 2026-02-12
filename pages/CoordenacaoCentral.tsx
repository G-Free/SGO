
import React, { useState, useMemo, useRef } from 'react';
import { 
    LayoutDashboard, 
    TrendingUp, 
    MapPin, 
    BarChart3, 
    Zap, 
    Clock, 
    Filter, 
    Users, 
    PieChart as PieIcon, 
    Download, 
    ShieldCheck,
    Calendar,
    AlertTriangle,
    Target,
    Loader2,
    Building
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../components/Notification';
import html2canvas from 'html2canvas';

const COLORS = {
    blue: '#002B7F',
    emerald: '#10B981',
    amber: '#F59E0B',
    rose: '#F43F5E',
    indigo: '#6366F1',
    slate: '#94a3b8',
    grid: '#f1f5f9'
};

// Mock Data
const monthlyData = [
  { name: 'Jan', real: 15, planeado: 20 },
  { name: 'Fev', real: 22, planeado: 25 },
  { name: 'Mar', real: 28, planeado: 30 },
  { name: 'Abr', real: 24, planeado: 22 },
  { name: 'Mai', real: 30, planeado: 35 },
  { name: 'Jun', real: 38, planeado: 40 },
];

const statusData = [
  { name: 'Concluída', value: 42, color: COLORS.emerald },
  { name: 'Em Curso', value: 28, color: '#3B82F6' },
  { name: 'Pendente', value: 15, color: COLORS.amber },
  { name: 'Pausada', value: 8, color: COLORS.slate },
];

const priorityData = [
  { name: 'Baixa', total: 12, color: COLORS.slate },
  { name: 'Média', total: 35, color: '#3B82F6' },
  { name: 'Alta', total: 24, color: COLORS.amber },
  { name: 'Urgente', total: 10, color: COLORS.rose },
];

const regionalData = [
  { name: 'Luanda', valor: 92 },
  { name: 'Cabinda', valor: 78 },
  { name: 'Zaire', valor: 65 },
  { name: 'Cunene', valor: 82 },
  { name: 'Benguela', valor: 70 },
];

const workloadData = [
  { name: 'Almirante Santos', qty: 14 },
  { name: 'Coord. Miguel', qty: 18 },
  { name: 'Insp. Luvo', qty: 9 },
  { name: 'Sgt. Maria', qty: 12 },
];

const CoordenacaoCentralPage: React.FC = () => {
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const [isExporting, setIsExporting] = useState(false);
    
    // Refs para exportação individual de blocos
    const kpiRef = useRef<HTMLDivElement>(null);
    const row1Ref = useRef<HTMLDivElement>(null);
    const row2Ref = useRef<HTMLDivElement>(null);
    const workloadRef = useRef<HTMLDivElement>(null);

    const [filters, setFilters] = useState({
        provincia: 'Todas',
        ano: '2024',
        mes: 'Todos',
        prioridade: 'Todas',
        estado: 'Todos'
    });

    const handleExportPDF = async () => {
        if (!window.jspdf || !(window.jspdf as any).jsPDF) {
            addNotification("Motor de PDF não carregado.", "error", "Falha");
            return;
        }

        setIsExporting(true);
        addNotification("A gerar relatório consolidado com todos os gráficos...", "info", "Exportação");

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 15;
            const contentWidth = pageWidth - (margin * 2);

            // 1. CAPA E HEADER
            doc.setFillColor(0, 43, 127);
            doc.rect(0, 0, pageWidth, 40, 'F');
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18);
            doc.text("DASHBOARD ESTRATÉGICO NACIONAL - SGO", margin, 20);
            doc.setFontSize(10);
            doc.text(`Âmbito: ${filters.provincia} | Ano: ${filters.ano} | Mês: ${filters.mes}`, margin, 30);
            doc.text(`Data: ${new Date().toLocaleString()}`, pageWidth - margin, 30, { align: 'right' });

            let currentY = 50;

            const captureAndAdd = async (ref: React.RefObject<HTMLDivElement>, title: string) => {
                if (!ref.current) return;
                const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: "#ffffff" });
                const imgData = canvas.toDataURL('image/png');
                const imgProps = doc.getImageProperties(imgData);
                const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

                if (currentY + imgHeight + 10 > 280) {
                    doc.addPage();
                    currentY = 20;
                }

                doc.setFontSize(11);
                doc.setTextColor(0, 43, 127);
                doc.text(title.toUpperCase(), margin, currentY);
                currentY += 5;
                doc.addImage(imgData, 'PNG', margin, currentY, contentWidth, imgHeight);
                currentY += imgHeight + 15;
            };

            // Capturar blocos
            await captureAndAdd(kpiRef, "1. Indicadores de Desempenho (KPIs)");
            await captureAndAdd(row1Ref, "2. Tendência de Execução e Balanço de Estados");
            await captureAndAdd(row2Ref, "3. Severidade de Missões e Performance Regional");
            await captureAndAdd(workloadRef, "4. Distribuição de Carga por Coordenação");

            doc.save(`SGO_Dashboard_Estrategico_${filters.provincia}.pdf`);
            addNotification("Documento gerado com todos os gráficos incluídos.", "success", "Sucesso");
        } catch (err) {
            addNotification("Erro ao processar captura visual dos gráficos.", "error", "Falha");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="w-full space-y-8 animate-fadeIn pb-20">
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Dashboard</h1>
                    <p className="text-slate-500 font-bold text-sm flex items-center mt-1">
                        <LayoutDashboard className="h-4 w-4 mr-2 text-blue-600" /> Inteligência Operacional e Supervisão Nacional
                    </p>
                </div>
                <button 
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="bg-blue-900 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                >
                    {isExporting ? <Loader2 size={16} className="animate-spin mr-2" /> : <Download size={16} className="mr-2" />}
                    Exportar PDF
                </button>
            </div>

            {/* FILTROS COMPLETOS */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Província</label>
                    <select title="Filtrar por Província" value={filters.provincia} onChange={e => setFilters({...filters, provincia: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Todas</option><option>Luanda</option><option>Cabinda</option><option>Zaire</option><option>Cunene</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Ano</label>
                    <select title="Filtrar por Ano" value={filters.ano} onChange={e => setFilters({...filters, ano: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                        <option>2024</option><option>2023</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mês</label>
                    <select title="Filtrar por Mês" value={filters.mes} onChange={e => setFilters({...filters, mes: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Todos</option><option>Janeiro</option><option>Fevereiro</option><option>Março</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Prioridade</label>
                    <select title="Filtrar por Prioridade" value={filters.prioridade} onChange={e => setFilters({...filters, prioridade: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Todas</option><option>Urgente</option><option>Alta</option><option>Média</option><option>Baixa</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Estado OS</label>
                    <select title="Filtrar por Estado da OS" value={filters.estado} onChange={e => setFilters({...filters, estado: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Todos</option><option>Concluída</option><option>Em Curso</option><option>Pendente</option>
                    </select>
                </div>
            </div>

            {/* BLOCO DE KPIS (Ref: kpiRef) */}
            <div ref={kpiRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Eficiência Operativa', val: '92%', color: 'text-emerald-600', icon: Target },
                    { label: 'Ordens em Curso', val: '75', color: 'text-blue-900', icon: Zap },
                    { label: 'Atrasos Registados', val: '04', color: 'text-rose-600', icon: Clock },
                    { label: 'Órgãos Integrados', val: '12', color: 'text-indigo-600', icon: Building },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="p-3 bg-slate-50 rounded-2xl text-blue-900"><kpi.icon size={24} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                            <p className={`text-2xl font-black ${kpi.color}`}>{kpi.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* LINHA 1 DE GRÁFICOS (Ref: row1Ref) */}
            <div ref={row1Ref} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center mb-8">
                        <TrendingUp className="mr-2 text-blue-600" size={18} /> Tendência de Execução Mensal
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: COLORS.slate, fontSize: 10, fontWeight: 700}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: COLORS.slate, fontSize: 10}} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', shadow: 'sm' }} />
                                <Area type="monotone" name="Real" dataKey="real" stroke={COLORS.blue} strokeWidth={4} fill={COLORS.blue} fillOpacity={0.05} />
                                <Area type="monotone" name="Planeado" dataKey="planeado" stroke={COLORS.slate} strokeWidth={2} strokeDasharray="5 5" fill="none" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center mb-8">
                        <PieIcon className="mr-2 text-emerald-600" size={18} /> Balanço de Estados
                    </h3>
                    <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} innerRadius={65} outerRadius={90} paddingAngle={8} dataKey="value">
                                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
                            <span className="text-3xl font-black text-slate-800">93</span>
                            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        {statusData.map(item => (
                            <div key={item.name} className="flex justify-between items-center text-[10px] font-bold uppercase">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-slate-600">{item.name}</span>
                                </div>
                                <span className="text-slate-900">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* LINHA 2 DE GRÁFICOS (Ref: row2Ref) */}
            <div ref={row2Ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center mb-8">
                        <AlertTriangle className="mr-2 text-rose-600" size={18} /> Severidade das Missões Nacionais
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: COLORS.slate, fontSize: 10, fontWeight: 700}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: COLORS.slate, fontSize: 10}} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={40}>
                                    {priorityData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center mb-8">
                        <MapPin className="mr-2 text-indigo-600" size={18} /> Performance Regional
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={regionalData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.grid} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: COLORS.slate, fontSize: 10, fontWeight: 700}} width={70} />
                                <Tooltip cursor={{fill: COLORS.grid}} />
                                <Bar dataKey="valor" fill={COLORS.blue} radius={[0, 4, 4, 0]} barSize={15} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* CARGA POR COORDENAÇÃO (Ref: workloadRef) */}
            <div ref={workloadRef} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <Users size={120} className="text-indigo-600" />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center mb-10">
                    <Users className="mr-2 text-indigo-600" size={18} /> Carga Operativa por Coordenação
                </h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={workloadData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.grid} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} width={120} />
                            <Tooltip cursor={{fill: '#f8fafc'}} />
                            <Bar dataKey="qty" fill={COLORS.blue} radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default CoordenacaoCentralPage;
