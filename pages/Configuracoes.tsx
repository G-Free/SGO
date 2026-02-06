
import React, { useState, Fragment, lazy, Suspense } from 'react';
import {
  Settings,
  LayoutTemplate,
  Puzzle,
  TerminalSquare,
  SlidersHorizontal,
  Network,
  DatabaseBackup,
  ScrollText,
  ChevronRight,
  ShieldAlert,
  Save,
  Upload,
  Play,
  PlusCircle,
  Clock,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useNotification } from '../components/Notification';

const NovoScriptModal = lazy(() => import('../components/NovoScriptModal'));
const ConfirmationModal = lazy(() => import('../components/ConfirmationModal'));

type SectionId = 'geral' | 'layout' | 'modulos' | 'scripts' | 'parametros' | 'apis' | 'backup' | 'logs';

const sections: { id: SectionId; title: string; icon: React.ElementType }[] = [
  { id: 'geral', title: 'Geral', icon: Settings },
  { id: 'layout', title: 'Interface e Layout', icon: LayoutTemplate },
  { id: 'modulos', title: 'Gestão de Módulos', icon: Puzzle },
  { id: 'scripts', title: 'Scripts e Automação', icon: TerminalSquare },
  { id: 'parametros', title: 'Parâmetros do Sistema', icon: SlidersHorizontal },
  { id: 'apis', title: 'Integrações e APIs', icon: Network },
  { id: 'backup', title: 'Backup e Restauração', icon: DatabaseBackup },
  { id: 'logs', title: 'Logs e Auditoria', icon: ScrollText },
];

const SectionCard: React.FC<{ title: string; description?: string; children: React.ReactNode; actions?: React.ReactNode; }> = ({ title, description, children, actions }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
                </div>
                {actions && <div className="flex items-center space-x-2 flex-shrink-0 ml-4">{actions}</div>}
            </div>
        </div>
        <div className="p-6 bg-slate-50/70 rounded-b-xl">
            {children}
        </div>
    </div>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onToggle(); }}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
  >
    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const GeralSection: React.FC = () => (
    <SectionCard
        title="Configurações Gerais"
        description="Ajuste as informações básicas e de identidade do sistema."
        actions={
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center text-sm">
                <Save className="h-4 w-4 mr-2" /> Salvar Alterações
            </button>
        }
    >
        <div className="space-y-6">
            <div className="p-5 bg-white rounded-lg border">
                <h4 className="font-semibold text-gray-800 mb-3">Identidade da Unidade</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome da Instituição</label>
                        <input title="Nome da instituição" type="text" defaultValue="Comité de Gestão Coordenada de Fronteiras" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Unidade Local</label>
                        <input title="Nome da unidade local" type="text" defaultValue="Unidade Técnica Local de Luanda" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Responsável Técnico</label>
                        <input type="text" defaultValue="Eng. António Freire" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contacto</label>
                        <input type="text" defaultValue="+244 9XX XXX XXX" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" />
                    </div>
                </div>
            </div>
            <div className="p-5 bg-white rounded-lg border">
                <h4 className="font-semibold text-gray-800 mb-3">Informação do Sistema</h4>
                <div className="text-sm space-y-2 text-gray-700">
                    <p><strong>Versão do SGO:</strong> <span className="font-mono text-gray-900">v2.3.1</span></p>
                    <p><strong>Licença Válida até:</strong> <span className="font-mono text-gray-900">Dezembro/2026</span></p>
                    <p><strong>Estado do Servidor:</strong> <span className="font-semibold text-green-600">Operacional</span></p>
                    <p><strong>Armazenamento Utilizado:</strong> <span className="font-mono text-gray-900">25.6 GB / 100 GB</span></p>
                </div>
            </div>
        </div>
    </SectionCard>
);

const LayoutSection: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <SectionCard
            title="Temas e Aparência"
            description="Personalize a aparência do sistema, incluindo temas e logotipos."
            actions={
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center text-sm">
                    <Save className="h-4 w-4 mr-2" /> Salvar Aparência
                </button>
            }
        >
            <div className="space-y-6">
                <div className="p-5 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3">Tema Visual</h4>
                    <p className="text-sm text-gray-500 mb-4">Selecione o tema de cores para a interface.</p>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center cursor-pointer p-3 border rounded-lg w-full transition-colors hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-200">
                            <input
                                type="radio" name="theme" value="light" checked={theme === 'light'}
                                onChange={() => setTheme('light')}
                                className="mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            Claro
                        </label>
                        <label className="flex items-center cursor-pointer p-3 border rounded-lg w-full transition-colors hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-200">
                            <input
                                type="radio" name="theme" value="dark" checked={theme === 'dark'}
                                onChange={() => setTheme('dark')}
                                className="mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            Escuro
                        </label>
                    </div>
                </div>
                <div className="p-5 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3">Logotipo do Cabeçalho</h4>
                    <p className="text-sm text-gray-500 mb-4">Faça o upload do logotipo para ser exibido no cabeçalho principal.</p>
                    <input title="Logotipo do cabeçalho" type="file" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
                </div>
            </div>
        </SectionCard>
    );
};


const ModulosSection: React.FC = () => {
    const [modules, setModules] = useState([
        { id: 1, name: 'Relatórios', active: true, profiles: 'Administrador, Gestor', expanded: false, subModules: [
            { id: 11, name: 'Relatórios Mensais', active: true, profiles: 'Administrador, Gestor' },
            { id: 12, name: 'Relatórios de Atividade', active: true, profiles: 'Administrador, Gestor' },
        ]},
        { id: 2, name: 'Termos de Referência', active: true, profiles: 'Administrador, Gestor', expanded: false, subModules: [] },
        { id: 3, name: 'Análises e Estatísticas', active: true, profiles: 'Administrador, Gestor', expanded: false, subModules: [] },
        { id: 4, name: 'Atividades', active: true, profiles: 'Administrador, Gestor, Técnico', expanded: false, subModules: [] },
        { id: 5, name: 'Projetos', active: true, profiles: 'Administrador, Gestor, Técnico', expanded: false, subModules: [] },
        { id: 6, name: 'Recursos Humanos', active: true, profiles: 'Administrador, Gestor', expanded: false, subModules: [] },
        { id: 7, name: 'Financeiro', active: true, profiles: 'Administrador, Gestor', expanded: false, subModules: [] },
        { id: 8, name: 'Património e Meios', active: true, profiles: 'Administrador, Técnico', expanded: false, subModules: [
            { id: 81, name: 'Gestão de Ativos', active: true, profiles: 'Administrador, Técnico' },
            { id: 82, name: 'Manutenção de Viaturas', active: false, profiles: 'Administrador, Técnico' },
        ]},
        { id: 9, name: 'Ocorrências / Suporte', active: true, profiles: 'Todos', expanded: false, subModules: [] },
        { id: 10, name: 'Gestão de Crises', active: false, profiles: 'Administrador, Gestor', expanded: false, subModules: [] },
        { id: 11, name: 'Segurança e Auditoria', active: true, profiles: 'Administrador', expanded: false, subModules: [] },
        { id: 12, name: 'Utilizadores e Perfis', active: true, profiles: 'Administrador', expanded: false, subModules: [] },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const toggleModule = (moduleId: number, subModuleId?: number) => {
        setModules(mods => mods.map(m => {
            if (m.id !== moduleId) return m;
            if (subModuleId !== undefined) {
                const updatedSubModules = m.subModules.map(sm => 
                    sm.id === subModuleId ? {...sm, active: !sm.active} : sm
                );
                return {...m, subModules: updatedSubModules};
            }
            return {...m, active: !m.active};
        }));
    };

    const toggleExpand = (moduleId: number) => {
        setModules(mods => mods.map(m => m.id === moduleId ? {...m, expanded: !m.expanded} : m));
    };

    return (
        <SectionCard
            title="Gestão de Módulos"
            description="Ative, desative e configure os módulos disponíveis no sistema."
            actions={
                 <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg flex items-center text-sm">
                    <PlusCircle className="h-4 w-4 mr-2" /> Novo Módulo
                 </button>
            }
        >
             {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-lg p-6 w-96" onClick={e => e.stopPropagation()}>
                        <h4 className="font-bold mb-4">Gerir Módulo</h4>
                        <p>Funcionalidade em desenvolvimento.</p>
                         <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Fechar</button>
                    </div>
                 </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-12"></th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Módulo</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Perfis com Acesso</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {modules.map((mod) => (
                            <Fragment key={mod.id}>
                                <tr className="hover:bg-white transition-colors">
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => toggleExpand(mod.id)} className="p-1 rounded-full hover:bg-gray-200">
                                            {mod.expanded ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{mod.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{mod.profiles}</td>
                                    <td className="px-4 py-3 text-center"><ToggleSwitch enabled={mod.active} onToggle={() => toggleModule(mod.id)} /></td>
                                    <td className="px-4 py-3 text-center text-sm"><button onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }} className="text-blue-600 hover:underline font-semibold">Configurar</button></td>
                                </tr>
                                {mod.expanded && mod.subModules.map((sub) => (
                                    <tr key={sub.id} className="bg-slate-100/50 hover:bg-slate-100 transition-colors">
                                        <td></td>
                                        <td className="px-4 py-2 pl-12 text-sm text-gray-700">{sub.name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-500">{sub.profiles}</td>
                                        <td className="px-4 py-2 text-center"><ToggleSwitch enabled={sub.active} onToggle={() => toggleModule(mod.id, sub.id)} /></td>
                                        <td className="px-4 py-2 text-center text-sm"><button onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }} className="text-blue-600 hover:underline font-semibold">Configurar</button></td>
                                    </tr>
                                ))}
                                {mod.expanded && mod.subModules.length > 0 && (
                                    <tr className="bg-slate-100/50">
                                      <td colSpan={5} className="px-4 py-2 pl-12">
                                         <button onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center">
                                             <PlusCircle size={14} className="mr-2"/> Adicionar Sub-módulo
                                         </button>
                                      </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </SectionCard>
    );
};

const ScriptsSection: React.FC = () => {
    const [tasks, setTasks] = useState([
        { id: 1, schedule: '0 2 * * *', command: 'archive_tickets.sh', description: 'Arquiva ocorrências com mais de 90 dias.' },
        { id: 2, schedule: '0 0 1 * *', command: 'generate_monthly_summary.py', description: 'Gera resumo estatístico do mês anterior.' }
    ]);
    const [isNovoScriptModalOpen, setIsNovoScriptModalOpen] = useState(false);
    const [scriptToDelete, setScriptToDelete] = useState<any | null>(null);
    const { addNotification } = useNotification();

    const handleAddTask = (newTask: any) => {
        setTasks(currentTasks => [
            ...currentTasks,
            { id: Math.max(0, ...currentTasks.map(t => t.id)) + 1, ...newTask }
        ]);
        addNotification(`Tarefa agendada "${newTask.command}" adicionada.`, 'success', 'Automação');
    };

    const handleConfirmDelete = () => {
        if (scriptToDelete) {
            setTasks(currentTasks => currentTasks.filter(t => t.id !== scriptToDelete.id));
            addNotification(`Tarefa agendada "${scriptToDelete.command}" removida.`, 'success', 'Automação');
            setScriptToDelete(null);
        }
    };

    return (
        <>
        <SectionCard
            title="Scripts e Automação"
            description="Execute scripts manualmente ou agende tarefas para automação de processos."
        >
            <div className="space-y-6">
                <div className="p-5 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3">Execução Manual</h4>
                    <div className="flex items-center space-x-2">
                        <input title="Selecionar script para execução manual" type="file" className="flex-grow block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"/>
                        <button className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"><Play className="h-4 w-4 mr-2" /> Executar</button>
                    </div>
                </div>
                <div className="p-5 bg-white rounded-lg border">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-800">Tarefas Agendadas (CRON)</h4>
                        <button onClick={() => setIsNovoScriptModalOpen(true)} className="bg-blue-100 text-blue-700 font-semibold py-2 px-3 rounded-lg flex items-center text-sm"><PlusCircle className="h-4 w-4 mr-2" /> Nova Tarefa</button>
                    </div>
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Agendamento</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Comando</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {tasks.map(task => (
                                <tr key={task.id}>
                                    <td className="px-4 py-3 font-mono text-sm">{task.schedule}</td>
                                    <td className="px-4 py-3 font-mono text-sm">{task.command}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{task.description}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button title="Remover tarefa" onClick={() => setScriptToDelete(task)} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SectionCard>
        <Suspense fallback={null}>
            <NovoScriptModal 
                isOpen={isNovoScriptModalOpen} 
                onClose={() => setIsNovoScriptModalOpen(false)} 
                onSave={handleAddTask}
            />
            <ConfirmationModal 
                isOpen={!!scriptToDelete} 
                onClose={() => setScriptToDelete(null)} 
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message={`Tem a certeza que deseja remover a tarefa agendada "${scriptToDelete?.command}"?`}
            />
        </Suspense>
        </>
    );
};

const ParametrosSection: React.FC = () => (
    <SectionCard
        title="Parâmetros do Sistema"
        description="Ajuste as configurações regionais e outros parâmetros essenciais."
         actions={
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center text-sm">
                <Save className="h-4 w-4 mr-2" /> Salvar Parâmetros
            </button>
        }
    >
        <div className="p-5 bg-white rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-3">Configurações Regionais</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Idioma Padrão</label>
                    <select title="Idioma padrão do sistema" className="mt-1 block w-full rounded-md border-gray-300"><option>Português (Angola)</option></select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fuso Horário</label>
                    <select title="Fuso horário padrão do sistema" className="mt-1 block w-full rounded-md border-gray-300"><option>(UTC+01:00) Luanda</option></select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Moeda</label>
                    <select title="Moeda padrão do sistema" className="mt-1 block w-full rounded-md border-gray-300"><option>AOA (Kwanza)</option></select>
                </div>
            </div>
        </div>
    </SectionCard>
);

const ApisSection: React.FC = () => (
    <SectionCard
        title="Integrações e APIs"
        description="Gira a conexão com sistemas externos."
        actions={
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg flex items-center text-sm">
                <PlusCircle className="h-4 w-4 mr-2" /> Registrar Integração
            </button>
        }
    >
        <div className="space-y-3">
            <div className="p-4 border rounded-lg flex justify-between items-center bg-white">
                <p className="font-medium text-gray-800">Polícia de Fronteira</p>
                <div className="flex items-center space-x-3 text-sm">
                    <span className="text-green-600 font-semibold">Ativa</span>
                    <a href="#" className="text-blue-600 hover:underline font-semibold">Configurar</a>
                </div>
            </div>
             <div className="p-4 border rounded-lg flex justify-between items-center bg-white">
                <p className="font-medium text-gray-800">Alfândega</p>
                <div className="flex items-center space-x-3 text-sm">
                    <span className="text-gray-500 font-semibold">Inativa</span>
                    <a href="#" className="text-blue-600 hover:underline font-semibold">Configurar</a>
                </div>
            </div>
        </div>
    </SectionCard>
);

const BackupSection: React.FC = () => (
  <SectionCard
    title="Backup e Restauração"
    description="Gira as cópias de segurança da base de dados do sistema."
    >
    <div className="space-y-6">
        <div className="p-5 bg-white rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-3">Gestão de Backups</h4>
            <div className="flex items-center space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm">Criar Backup Manual</button>
                <p className="text-sm text-gray-600">Último backup: Hoje, às 02:00 (Automático)</p>
            </div>
        </div>
        <div className="p-5 bg-white rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-3">Histórico de Backups</h4>
            <div className="space-y-2">
                <div className="p-2 border rounded-md flex justify-between items-center text-sm">
                    <p>backup-2024-07-27.zip (Completo)</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-500">2.1 GB</span>
                        <button className="text-blue-600 hover:underline font-semibold">Restaurar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </SectionCard>
);

const LogsSection: React.FC = () => (
    <SectionCard
        title="Logs e Auditoria Técnica"
        description="Visualize os logs técnicos para diagnóstico de problemas."
    >
        <div className="p-4 border rounded-lg bg-gray-800 text-white font-mono text-sm overflow-x-auto">
            <pre className="text-green-300">
                [2024-07-27 14:05:12] <span className="text-cyan-300">INFO</span>: User 'Admin' updated permissions for module 'Financeiro'. IP: 10.15.3.22
            </pre>
             <pre className="text-yellow-300">
                [2024-07-27 14:10:05] <span className="text-cyan-300">WARN</span>: API endpoint 'externo/alfandega' is not responding.
            </pre>
        </div>
    </SectionCard>
);

const ConfiguracoesPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('modulos');

  const renderSection = () => {
    switch (activeSection) {
      case 'geral': return <GeralSection />;
      case 'layout': return <LayoutSection />;
      case 'modulos': return <ModulosSection />;
      case 'scripts': return <ScriptsSection />;
      case 'parametros': return <ParametrosSection />;
      case 'apis': return <ApisSection />;
      case 'backup': return <BackupSection />;
      case 'logs': return <LogsSection />;
      default: return null;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Configuração do Sistema</h1>
        <p className="text-gray-600">Gira os parâmetros centrais, módulos, automações e integrações do SGO.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <div className="bg-white rounded-xl border p-2">
            <nav className="space-y-1">
                {sections.map(section => {
                const Icon = section.icon;
                return (
                    <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 border-l-4 ${
                        activeSection === section.id
                        ? 'border-blue-700 text-blue-700 font-semibold bg-blue-50'
                        : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{section.title}</span>
                    </button>
                );
                })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
            <div className="space-y-8">
                {renderSection()}
            </div>
            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex">
                <div className="flex-shrink-0">
                    <ShieldAlert className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                    <strong>Atenção:</strong> As alterações nesta área afetam todo o sistema. Apenas utilizadores autorizados devem proceder com modificações.
                    </p>
                </div>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;