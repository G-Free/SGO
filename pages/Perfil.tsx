import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User as UserIcon, Mail, Building, Shield, Edit, KeyRound, History, LogIn, FileText, ListChecks } from 'lucide-react';

const PerfilPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'details' | 'security' | 'activity'>('details');
    
    // Mock data for recent activity
    const recentActivity = [
        { id: 1, icon: LogIn, text: 'Iniciou sessão no sistema', time: 'há 2 horas' },
        { id: 2, icon: FileText, text: 'Visualizou o relatório "REL-001"', time: 'ontem' },
        { id: 3, icon: ListChecks, text: 'Atualizou o estado da atividade "ATV-005"', time: 'há 2 dias' },
    ];

    if (!user) {
        return <p>A carregar informações do perfil...</p>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto border-4 border-white ring-4 ring-blue-200">
                        <UserIcon className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.username}</h2>
                    <p className="mt-1 text-base text-blue-600 font-semibold">{user.profile.name}</p>
                    <p className="mt-2 text-sm text-gray-500">{user.organization.name}</p>

                    <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Perfil
                    </button>
                    
                    <div className="mt-6 pt-4 border-t text-left space-y-3">
                         <div className="flex items-center text-sm text-gray-600">
                            <Mail size={14} className="mr-3 flex-shrink-0" />
                            <span>{user.email}</span>
                        </div>
                         <div className="flex items-center text-sm text-gray-600">
                            <Building size={14} className="mr-3 flex-shrink-0" />
                            <span>{user.organization.name}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-6 px-6">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                Detalhes da Conta
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'security' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                Segurança
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'activity' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                Atividade Recente
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'details' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Informações do Perfil</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                                    <div><p className="font-medium text-gray-500">Nome Completo</p><p className="text-gray-900">{user.username}</p></div>
                                    <div><p className="font-medium text-gray-500">Email</p><p className="text-gray-900">{user.email}</p></div>
                                    <div><p className="font-medium text-gray-500">Organização</p><p className="text-gray-900">{user.organization.name}</p></div>
                                    <div><p className="font-medium text-gray-500">Perfil de Acesso</p><p className="text-gray-900">{user.profile.name}</p></div>
                                    <div className="md:col-span-2"><p className="font-medium text-gray-500">Descrição do Perfil</p><p className="text-gray-900">{user.profile.description}</p></div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Alterar Palavra-passe</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Palavra-passe Atual</label>
                                    <input title="Palavra-passe atual" type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nova Palavra-passe</label>
                                    <input title="Nova palavra-passe" type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirmar Nova Palavra-passe</label>
                                    <input title="Confirmar nova palavra-passe" type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base" />
                                </div>
                                <div className="flex justify-end">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                                        <KeyRound className="h-4 w-4 mr-2" /> Salvar Alterações
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'activity' && (
                             <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Atividade Recente</h3>
                                <ul className="space-y-4">
                                    {recentActivity.map(item => {
                                        const Icon = item.icon;
                                        return (
                                            <li key={item.id} className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                                                    <Icon className="h-5 w-5 text-gray-500" />
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-sm text-gray-800">{item.text}</p>
                                                    <p className="text-xs text-gray-400">{item.time}</p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfilPage;
