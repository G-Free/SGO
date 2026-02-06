
import React, { useState } from 'react';
import { 
  FileText, 
  MessageSquare, 
  ArrowRight, 
  MapPin, 
  Zap, 
  ClipboardList,
  User,
  AlertCircle,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Target,
  History,
  ShieldCheck,
  Search,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Mock de Atividades Atribuídas com mais metadados para o formulário
const myActivities = [
  { id: 'ATV-001', title: 'Fiscalização Costa Norte', province: 'Cabinda', priority: 'Alta', status: 'Em Curso', deadline: '2024-07-30', type: 'Marítima', startDate: '2024-07-01' },
  { id: 'ATV-105', title: 'Patrulha Urbana Marítima', province: 'Luanda', priority: 'Média', status: 'Planeada', deadline: '2024-08-05', type: 'Marítima', startDate: '2024-08-01' },
];

const mySubmissions = [
    { 
        id: 'REL-254', 
        activityId: 'ATV-001', 
        title: 'Fiscalização Massabi', 
        date: '28/07/2024', 
        status: 'Devolvido', 
        icon: AlertCircle, 
        color: 'text-rose-600', 
        bg: 'bg-rose-50', 
        feedback: 'Divergência técnica no registo de apreensões marítimas. Por favor, detalhe as quantidades.', 
        province: 'Cabinda',
        activity: { id: 'ATV-001', title: 'Fiscalização Massabi', province: 'Cabinda', type: 'Marítima', startDate: '2024-07-20' }
    },
    { id: 'REL-259', activityId: 'ATV-105', title: 'Patrulha Baía Luanda', date: '27/07/2024', status: 'Submetido', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', province: 'Luanda' },
];

const TecnicoOperacaoCentralPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleGenerateReport = (activity: any) => {
    navigate(`/atividades/${activity.id}/relatorio`, { 
        state: { 
            activity,
            isCorrection: false
        } 
    });
  };

  const handleCorrectReport = (sub: any) => {
    navigate(`/atividades/${sub.activityId}/relatorio`, { 
        state: { 
            activity: sub.activity,
            isCorrection: true,
            feedback: sub.feedback
        } 
    });
  };

  return (
    <div className="w-full pb-12 animate-fadeIn">
      {/* HEADER DE COMANDO INSTITUCIONAL */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Zap size={160} className="text-[#002B7F]" />
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10">
          <div className="flex items-center space-x-8">
            <div className="w-24 h-24 rounded-[2.5rem] bg-[#002B7F] flex items-center justify-center shadow-2xl border-4 border-blue-800/30 transform -rotate-3 transition-transform hover:rotate-0 duration-500">
              <ClipboardList className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  Cockpit Operativo
              </h1>
              <p className="text-slate-400 mt-4 font-bold flex items-center text-xs uppercase tracking-[0.3em]">
                <User size={14} className="mr-2 text-blue-600" /> {user?.username} • {user?.profile.name}
              </p>
            </div>
          </div>
          <div className="flex gap-6 border-l-0 lg:border-l lg:pl-10 border-slate-100">
             <div className="bg-blue-50 px-10 py-6 rounded-[2rem] border border-blue-100 text-center shadow-inner group cursor-default">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Missões Ativas</p>
                <p className="text-4xl font-black text-blue-900 leading-none group-hover:scale-110 transition-transform">{myActivities.length}</p>
             </div>
             <div className="bg-rose-50 px-10 py-6 rounded-[2rem] border border-rose-100 text-center shadow-inner group cursor-default">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Devolvidos</p>
                <p className="text-4xl font-black text-rose-600 leading-none group-hover:scale-110 transition-transform">{mySubmissions.filter(s => s.status === 'Devolvido').length}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* COLUNA: DOCUMENTOS EM REVISÃO (MÁXIMA ATENÇÃO) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b bg-amber-50/50 flex justify-between items-center border-amber-100">
              <h3 className="text-[11px] font-black text-amber-900 uppercase tracking-[0.2em] flex items-center">
                <History className="mr-3 text-amber-600" size={20} /> Notas de Ajuste
              </h3>
              <span className="bg-white px-3 py-1 rounded-lg text-[9px] font-black text-amber-700 border border-amber-200 uppercase">Supervisão Central</span>
            </div>
            <div className="p-8 space-y-6 flex-grow">
               {mySubmissions.filter(s => s.status === 'Devolvido').map(sub => (
                 <div key={sub.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative group hover:border-amber-400 transition-all cursor-pointer shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {sub.id}</span>
                        <span className="text-[10px] font-black text-rose-500 uppercase">{sub.date}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 mb-6 leading-relaxed italic">"{sub.feedback}"</p>
                    <button 
                        onClick={() => handleCorrectReport(sub)}
                        className="w-full bg-[#002B7F] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-black transition-all shadow-lg active:scale-95"
                    >
                        Rectificar Relatório <RefreshCw size={14} className="ml-2" />
                    </button>
                 </div>
               ))}
               {mySubmissions.filter(s => s.status === 'Devolvido').length === 0 && (
                   <div className="flex flex-col items-center justify-center py-20 text-center">
                       <ShieldCheck size={48} className="text-slate-200 mb-4" />
                       <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Sem pendências táticas.</p>
                   </div>
               )}
            </div>
          </div>
        </div>

        {/* COLUNA: MISSÕES EM EXECUÇÃO */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-10 border-b flex flex-col sm:flex-row justify-between items-center bg-slate-50/30 gap-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Arquivo Operativo</h3>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-3">Missões sob gestão direta do técnico</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Pesquisar missão..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Missão / ID</th>
                            <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Atual</th>
                            <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Prazo Limite</th>
                            <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {myActivities.map(act => (
                            <tr key={act.id} className="hover:bg-slate-50/50 transition-all group">
                                <td className="px-10 py-8">
                                    <p className="font-black text-slate-800 text-lg group-hover:text-blue-900 transition-colors leading-tight">{act.title}</p>
                                    <div className="flex items-center text-[11px] text-slate-400 font-bold uppercase mt-2 tracking-tighter">
                                        <MapPin size={14} className="mr-2 text-rose-500" /> {act.province} • <span className="ml-2 font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{act.id}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-center">
                                    <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                                        act.status === 'Em Curso' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                                    }`}>
                                        {act.status}
                                    </span>
                                </td>
                                <td className="px-10 py-8 text-center">
                                    <span className="text-sm font-black text-slate-700 uppercase tracking-widest">{act.deadline}</span>
                                </td>
                                <td className="px-10 py-8 text-center">
                                    <div className="flex justify-center gap-4">
                                        <button 
                                            onClick={() => handleGenerateReport(act)}
                                            className="bg-[#002B7F] text-white px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center"
                                        >
                                            <FileText size={16} className="mr-2.5" /> Gerar Relatório
                                        </button>
                                        <button 
                                            className="bg-white border border-slate-200 text-slate-400 px-4 py-4 rounded-[1.5rem] hover:bg-slate-50 transition-all shadow-sm"
                                            title="Registar Ocorrência de Campo"
                                        >
                                            <AlertTriangle size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TecnicoOperacaoCentralPage;
