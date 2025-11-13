import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, ShieldAlert, ClipboardList, CalendarPlus, Flame, Shield, Clock, Eye } from 'lucide-react';

const NovoIncidenteModal = lazy(() => import('../components/NovoIncidenteModal'));
const DetalheIncidenteModal = lazy(() => import('../components/DetalheIncidenteModal'));

// Mock Data
const mockContingencyPlans = [
  { id: 'PC-01', title: 'Derramamento de Químicos', department: 'Operações Marítimas', lastUpdated: '2024-05-20' },
  { id: 'PC-02', title: 'Ataque Cibernético', department: 'Tecnologia da Informação', lastUpdated: '2024-03-15' },
  { id: 'PC-03', title: 'Incidente de Pirataria', department: 'Segurança', lastUpdated: '2024-06-01' },
  { id: 'PC-04', title: 'Falha Geral de Energia', department: 'Infraestrutura', lastUpdated: '2023-12-10' },
];

const mockIncidents = [
  { id: 'INC-2024-001', title: 'Ataque de Phishing em Massa', severity: 'Alto', status: 'Ativo', startDate: '2024-07-26 14:00', lead: 'António Freire', log: [{ timestamp: '2024-07-26 14:05', entry: 'Plano PC-02 ativado. Equipa de TI notificada.'}, { timestamp: '2024-07-26 14:30', entry: 'Servidores de email isolados para análise.' }] },
  { id: 'INC-2024-002', title: 'Mancha de Óleo Detectada', severity: 'Crítico', status: 'Ativo', startDate: '2024-07-25 09:15', lead: 'Manuel Santos', log: [{ timestamp: '2024-07-25 09:20', entry: 'Plano PC-01 ativado. Equipa de Resposta Rápida mobilizada.' }] },
];

const mockSimulations = [
  { id: 'SIM-01', plan: 'PC-03: Incidente de Pirataria', date: '2024-08-15', participants: ['Equipa de Segurança', 'Operações'] },
  { id: 'SIM-02', plan: 'PC-04: Falha Geral de Energia', date: '2024-09-05', participants: ['Todos os Departamentos'] },
];

const severityColors: { [key: string]: { bg: string, text: string, icon: React.ElementType } } = {
  'Crítico': { bg: 'bg-red-100', text: 'text-red-800', icon: Flame },
  'Alto': { bg: 'bg-orange-100', text: 'text-orange-800', icon: ShieldAlert },
  'Moderado': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Shield },
};

const GestaoCrisesPage: React.FC = () => {
    const navigate = useNavigate();
    const [incidents] = useState(mockIncidents);
    const [isNovoIncidenteModalOpen, setIsNovoIncidenteModalOpen] = useState(false);
    const [isDetalheIncidenteModalOpen, setIsDetalheIncidenteModalOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState<any | null>(null);

    const handleViewIncident = (incident: any) => {
        setSelectedIncident(incident);
        setIsDetalheIncidenteModalOpen(true);
    };

    return (
        <>
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Módulo de Gestão de Crises</h1>
                        <p className="text-gray-600">Monitorize incidentes, planos de contingência e simulações.</p>
                    </div>
                    <button
                        onClick={() => setIsNovoIncidenteModalOpen(true)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Ativar Novo Incidente
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Active Incidents */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><ShieldAlert className="h-5 w-5 mr-3 text-red-500" /> Incidentes Ativos</h3>
                        <div className="space-y-3">
                            {incidents.map(incident => {
                                const severity = severityColors[incident.severity] || severityColors['Moderado'];
                                const SeverityIcon = severity.icon;
                                return (
                                    <div key={incident.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center">
                                                    <span className={`px-2 py-1 inline-flex items-center text-xs font-semibold rounded-full ${severity.bg} ${severity.text}`}>
                                                        <SeverityIcon className="h-4 w-4 mr-1.5" />
                                                        {incident.severity}
                                                    </span>
                                                </div>
                                                <p className="font-bold text-gray-800 mt-2">{incident.title}</p>
                                            </div>
                                            <button onClick={() => handleViewIncident(incident)} className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center">
                                                <Eye className="h-4 w-4 mr-1.5" /> Ver
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2 flex items-center">
                                            <Clock size={12} className="mr-1.5" />
                                            <span>Início: {incident.startDate}</span>
                                            <span className="mx-2">|</span>
                                            <span>Responsável: {incident.lead}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Contingency Plans */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><ClipboardList className="h-5 w-5 mr-3 text-blue-500" /> Planos de Contingência</h3>
                        <div className="space-y-2">
                            {mockContingencyPlans.map(plan => (
                                <div key={plan.id} className="p-3 border rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800">{plan.title}</p>
                                        <p className="text-xs text-gray-500">{plan.department}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">Atualizado: {plan.lastUpdated}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Simulations */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><CalendarPlus className="h-5 w-5 mr-3 text-green-500" /> Simulações Agendadas</h3>
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Plano Simulado</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data Agendada</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Participantes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {mockSimulations.map(sim => (
                                    <tr key={sim.id}>
                                        <td className="px-4 py-3 font-medium text-gray-800">{sim.plan}</td>
                                        <td className="px-4 py-3 text-gray-600">{sim.date}</td>
                                        <td className="px-4 py-3 text-gray-600">{sim.participants.join(', ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Suspense fallback={null}>
                <NovoIncidenteModal
                    isOpen={isNovoIncidenteModalOpen}
                    onClose={() => setIsNovoIncidenteModalOpen(false)}
                    plans={mockContingencyPlans}
                />
                <DetalheIncidenteModal
                    isOpen={isDetalheIncidenteModalOpen}
                    onClose={() => setIsDetalheIncidenteModalOpen(false)}
                    incident={selectedIncident}
                />
            </Suspense>
        </>
    );
};

export default GestaoCrisesPage;