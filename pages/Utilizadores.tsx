
import React, { useState, lazy, Suspense, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, MoreVertical, ShieldCheck, ShieldOff, Edit, Trash2, 
  User, Check, MapPin, Hammer, Crown, Shield, Wrench, Server, 
  Settings2, ClipboardList
} from 'lucide-react';
import { UserRole } from '../types';

const ConvidarUtilizadorModal = lazy(() => import('../components/ConvidarUtilizadorModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));

const mockUsersData = [
  { id: 1, name: 'Geiger Carlos', email: 'glcarlos@sga.co.ao', role: 'Administrador', lastAccess: '2024-07-26 10:00', status: 'Ativo', province: null },
  { id: 2, name: 'Coord. Luanda', email: 'coord.luanda@cgcf.gov.ao', role: 'Coordenador da UTL Regional', lastAccess: '2024-07-26 09:30', status: 'Ativo', province: 'Luanda' },
  { id: 3, name: 'Gestor Cabinda', email: 'gestor.cabinda@cgcf.gov.ao', role: 'Gestor de Operação Provincial', lastAccess: '2024-07-26 08:45', status: 'Ativo', province: 'Cabinda' },
  { id: 4, name: 'Tecnico Zaire', email: 'tecnico.zaire@cgcf.gov.ao', role: 'Técnico de Operação Regional', lastAccess: '2024-07-25 16:20', status: 'Ativo', province: 'Zaire' },
];

const profilePermissions: Record<UserRole, { title: string; icon: React.ElementType; description: string; permissions: string[] }> = {
  administrador: {
    title: 'Administrador (TI)',
    icon: ShieldCheck,
    description: 'Gestão técnica total e configuração de infraestrutura.',
    permissions: ['Configuração global', 'Gestão de acessos', 'Auditoria'],
  },
  coordenador_central: {
    title: 'Coordenador Central',
    icon: Crown,
    description: 'Autoridade superior nacional.',
    permissions: ['Decisões nacionais', 'Estratégia nacional'],
  },
  coordenador_operacional_central: {
    title: 'Coordenador Operacional Central',
    icon: Settings2,
    description: 'Supervisão operacional nacional.',
    permissions: ['Coordenação nacional', 'KPIs nacionais'],
  },
  tecnico_operacional_central: {
    title: 'Técnico Central Operacional',
    icon: Server,
    description: 'Execução técnica central.',
    permissions: ['Relatórios centrais', 'Suporte'],
  },
  tecnico_si: {
    title: 'Técnico de SI',
    icon: Wrench,
    description: 'Manutenção de sistemas.',
    permissions: ['Tickets TI', 'Bugs'],
  },
  // NOVOS PERFIS UTL REGIONAL
  coordenador_utl_regional: {
    title: '📍 Coordenador da UTL Regional',
    icon: MapPin,
    description: 'Nível Supervisão Provincial. Supervisa processos somente da sua província.',
    permissions: [
      'Aprova, valida e revisa procedimentos locais',
      'Gera e revisa relatórios de desempenho provincial',
      'Solicita suporte à Central quando necessário',
      'Acompanha metas e indicadores locais'
    ],
  },
  gestor_operacao_provincial: {
    title: '🛠 Gestor de Operação Provincial',
    icon: ClipboardList,
    description: 'Nível Tático Regional. Gerencia a equipe operacional da província.',
    permissions: [
      'Redistribui tarefas e monitora prazos locais',
      'Relatórios operacionais internos e feedback',
      'Resolve impedimentos simples locais',
      'Atua como controle do fluxo operacional'
    ],
  },
  tecnico_operacao_provincial: {
    title: '🔧 Técnico de Operação',
    icon: Hammer,
    description: 'Nível Base Regional. Foco total na execução local.',
    permissions: [
      'Executa atividades da sua província',
      'Visualiza somente o que lhe é atribuído',
      'Registra evidências e observações da execução',
      'Acesso restrito à sua jurisdição'
    ],
  },
};

const statusColors: { [key: string]: string } = { 'Ativo': 'bg-green-100 text-green-800', 'Inativo': 'bg-gray-100 text-gray-800' };

const UtilizadoresPage: React.FC = () => {
  const [users, setUsers] = useState(mockUsersData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any | null>(null);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  return (
    <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Utilizadores e Perfis Regionais</h1>
            <p className="text-gray-600">Gestão de acessos UTL Regional (Alcance Provincial).</p>
          </div>
          <button onClick={() => { setUserToEdit(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-md">
            <UserPlus className="h-5 w-5 mr-2" /> Convidar Utilizador
          </button>
        </div>

        <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Matriz de Competências UTL Regional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Object.keys(profilePermissions) as Array<UserRole>).filter(role => role.includes('regional') || role.includes('provincial')).map(role => {
                    const profile = profilePermissions[role];
                    const Icon = profile.icon;
                    return (
                        <div key={role} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start mb-4">
                                <div className="p-3 bg-blue-50 rounded-lg mr-4">
                                    <Icon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{profile.title}</h3>
                                    <p className="text-[10px] text-blue-500 mt-1 uppercase font-black tracking-widest">{role.replace(/_/g, ' ')}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 italic leading-relaxed">{profile.description}</p>
                            <div className="mt-auto pt-4 border-t border-gray-100">
                                <ul className="space-y-2">
                                    {profile.permissions.map((perm, index) => (
                                        <li key={index} className="flex items-start text-xs text-gray-700 font-medium">
                                            <Check className="h-3.5 w-3.5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            <span>{perm}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Membros Regionais e Provinciais</h3>
          <div className="w-full overflow-x-auto">
              <table className="w-full">
                  <thead>
                      <tr className="bg-gray-50 text-slate-500">
                          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Utilizador</th>
                          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Província</th>
                          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Perfil de Função</th>
                          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Último Acesso</th>
                          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                      {users.map(u => (
                          <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                  <div className="text-base font-bold text-gray-900">{u.name}</div>
                                  <div className="text-sm text-gray-500">{u.email}</div>
                              </td>
                              <td className="px-6 py-4">
                                {u.province ? (
                                    <span className="flex items-center text-sm font-black text-blue-600">
                                        <MapPin size={14} className="mr-1" /> {u.province}
                                    </span>
                                ) : <span className="text-slate-300 italic text-xs">Nacional</span>}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 inline-flex text-[10px] font-black uppercase rounded-full border bg-slate-50`}>
                                    {u.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">{u.lastAccess}</td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-0.5 inline-flex text-[10px] font-black uppercase rounded-full ${statusColors[u.status]}`}>
                                      {u.status}
                                  </span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
        </div>
    </div>
  );
};

export default UtilizadoresPage;
