

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Activity, AlertTriangle, FolderKanban, TrendingUp, Target, BarChart3, Calendar } from 'lucide-react';

// --- MOCK DATA ---

// Atividades por Estado
const activitiesData = [
  { name: 'Concluída', value: 400 },
  { name: 'Em Andamento', value: 150 },
  { name: 'Planeada', value: 200 },
];
const PIE_COLORS = ['#10B981', '#3B82F6', '#F59E0B'];

// Evolução Mensal
const evolutionDataByYear: { [key: string]: { name: string; missoes: number; infracoes: number }[] } = {
  '2024': [
    { name: 'Jan', missoes: 20, infracoes: 4 },
    { name: 'Fev', missoes: 28, infracoes: 5 },
    { name: 'Mar', missoes: 35, infracoes: 12 },
    { name: 'Abr', missoes: 42, infracoes: 8 },
    { name: 'Mai', missoes: 51, infracoes: 15 },
    { name: 'Jun', missoes: 45, infracoes: 10 },
    { name: 'Jul', missoes: 48, infracoes: 13 },
  ],
  '2023': [
    { name: 'Jan', missoes: 18, infracoes: 6 },
    { name: 'Fev', missoes: 25, infracoes: 8 },
    { name: 'Mar', missoes: 30, infracoes: 10 },
    { name: 'Abr', missoes: 38, infracoes: 7 },
    { name: 'Mai', missoes: 45, infracoes: 12 },
    { name: 'Jun', missoes: 40, infracoes: 9 },
    { name: 'Jul', missoes: 42, infracoes: 11 },
  ]
};

// Projetos por Departamento
const projectsDataByDept = {
  'Todos': [ { name: 'Planeado', value: 12 }, { name: 'Em Execução', value: 25 }, { name: 'Concluído', value: 18 }, { name: 'Atrasado', value: 5 } ],
  'Operações': [ { name: 'Planeado', value: 5 }, { name: 'Em Execução', value: 10 }, { name: 'Concluído', value: 8 }, { name: 'Atrasado', value: 2 } ],
  'Tecnologia': [ { name: 'Planeado', value: 4 }, { name: 'Em Execução', value: 8 }, { name: 'Concluído', value: 6 }, { name: 'Atrasado', value: 1 } ],
  'Administrativo': [ { name: 'Planeado', value: 3 }, { name: 'Em Execução', value: 7 }, { name: 'Concluído', value: 4 }, { name: 'Atrasado', value: 2 } ],
};

// Infrações por Categoria
const infractionsData = [
  { name: 'Pesca Ilegal', value: 31 },
  { name: 'Documentação', value: 27 },
  { name: 'Equipamento', value: 16 },
  { name: 'Poluição', value: 8 },
  { name: 'Outros', value: 18 },
];
const BAR_COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];


// --- COMPONENTS ---

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, change: { value: string, isPositive: boolean } }> = ({ icon: Icon, title, value, change }) => (
  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-base font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <Icon className="h-6 w-6 text-gray-400" />
    </div>
    <p className={`text-sm mt-2 flex items-center ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
      <TrendingUp className={`h-4 w-4 mr-1 ${!change.isPositive && 'transform rotate-180'}`} />
      {change.value} em relação ao mês passado
    </p>
  </div>
);

const ChartContainer: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; filter?: React.ReactNode; }> = ({ title, icon: Icon, children, filter }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Icon className="h-5 w-5 mr-3 text-gray-500" />
                {title}
            </h3>
            {filter}
        </div>
        <div className="w-full h-[300px]">
            {children}
        </div>
    </div>
);

// --- MAIN PAGE ---

const AnalisesPage: React.FC = () => {
  const [evolutionYear, setEvolutionYear] = useState('2024');
  const [projectDept, setProjectDept] = useState('Todos');
  
  const stats = useMemo(() => {
    const currentYearData = evolutionDataByYear['2024'];
    const currentMonthIndex = currentYearData.length - 1;
    const prevMonthIndex = currentMonthIndex - 1;

    const totalActivities = activitiesData.reduce((sum, item) => sum + item.value, 0);
    const totalProjects = projectsDataByDept['Todos'].reduce((sum, item) => sum + item.value, 0);

    const infracoesCurrent = currentYearData[currentMonthIndex].infracoes;
    const infracoesPrev = prevMonthIndex >= 0 ? currentYearData[prevMonthIndex].infracoes : infracoesCurrent;
    const infracoesChange = ((infracoesCurrent - infracoesPrev) / infracoesPrev * 100).toFixed(1);

    return {
        totalActivities,
        totalProjects,
        infracoesCurrent,
        infracoesChange: {
            value: `${infracoesChange}%`,
            isPositive: parseFloat(infracoesChange) < 0 // Menos infrações é positivo
        },
        taxaSucesso: '92.5%',
        taxaSucessoChange: {
            value: `+1.8%`,
            isPositive: true
        }
    };
  }, []);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Módulo de Análises e Estatísticas</h1>
        <p className="text-gray-600">Visualize os dados operacionais da GMA através de gráficos e KPIs interativos.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Activity} title="Total de Atividades" value={String(stats.totalActivities)} change={{ value: '+5.2%', isPositive: true }} />
        <StatCard icon={FolderKanban} title="Projetos Ativos" value={String(stats.totalProjects)} change={{ value: '+2', isPositive: true }} />
        <StatCard icon={AlertTriangle} title="Infrações (Mês)" value={String(stats.infracoesCurrent)} change={stats.infracoesChange} />
        <StatCard icon={Target} title="Taxa de Sucesso (Missões)" value={stats.taxaSucesso} change={stats.taxaSucessoChange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer title="Atividades por Estado" icon={Activity}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={activitiesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                         {activitiesData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value} atividades`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
            title="Evolução Mensal (Missões vs Infrações)"
            icon={TrendingUp}
            filter={
                <select value={evolutionYear} onChange={e => setEvolutionYear(e.target.value)} className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                </select>
            }
        >
            <ResponsiveContainer>
                <LineChart data={evolutionDataByYear[evolutionYear]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="missoes" stroke="#3B82F6" strokeWidth={2} name="Missões" />
                    <Line type="monotone" dataKey="infracoes" stroke="#EF4444" strokeWidth={2} name="Infrações" />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer 
            title="Projetos por Categoria" 
            icon={FolderKanban}
            filter={
                 <select value={projectDept} onChange={e => setProjectDept(e.target.value)} className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    {Object.keys(projectsDataByDept).map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
            }
        >
            <ResponsiveContainer>
                <BarChart data={projectsDataByDept[projectDept as keyof typeof projectsDataByDept]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Nº de Projetos" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Distribuição de Infrações" icon={BarChart3}>
            <ResponsiveContainer>
                <BarChart data={infractionsData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(value: number) => `${value} casos`} />
                    <Bar dataKey="value" name="Quantidade" barSize={20}>
                        {infractionsData.map((entry, index) => <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default AnalisesPage;