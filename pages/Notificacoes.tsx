import React, { useState, useMemo } from 'react';
import { Bell, FileText, AlertTriangle, User, Trash2, Check, Eye, EyeOff, XCircle } from 'lucide-react';

const allNotificationsData = [
  { id: 1, icon: FileText, title: "Relatório Submetido", text: "O 'Relatório Mensal de Julho/2024' foi submetido para validação.", time: "há 5 minutos", read: false },
  { id: 2, icon: AlertTriangle, title: "Ticket de Suporte", text: "Ticket de suporte #TIC-004 foi atualizado com uma nova resposta.", time: "há 2 horas", read: false },
  { id: 3, icon: User, title: "Novo Utilizador", text: "Novo utilizador 'Consultor Externo' foi adicionado ao sistema.", time: "ontem", read: true },
  { id: 4, icon: Check, title: "Atividade Concluída", text: "A atividade 'ATV-006: Patrulha de rotina' foi marcada como concluída.", time: "ontem", read: false },
  { id: 5, icon: FileText, title: "TdR Aprovado", text: "O Termo de Referência 'TDR-003' foi aprovado pela direção.", time: "há 2 dias", read: true },
  { id: 6, icon: User, title: "Acesso Negado", text: "Tentativa de acesso não autorizada ao módulo de 'Configurações'.", time: "há 2 dias", read: true },
  { id: 7, icon: AlertTriangle, title: "Ordem de Serviço", text: "Nova Ordem de Serviço 'OS-004' de prioridade Baixa foi criada.", time: "há 3 dias", read: true },
];


const NotificacoesPage: React.FC = () => {
  const [notifications, setNotifications] = useState(allNotificationsData);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') return notifications.filter(n => !n.read);
    if (filter === 'read') return notifications.filter(n => n.read);
    return notifications;
  }, [notifications, filter]);

  const toggleRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };
  
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteAll = () => {
    setNotifications([]);
  };

  const getIcon = (icon: React.ElementType) => {
    const Icon = icon;
    return <Icon className="h-6 w-6" />;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Central de Notificações</h1>
          <p className="text-gray-600">Veja, gira e acompanhe todas as suas notificações.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-1">
            <button onClick={() => setFilter('all')} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${filter === 'all' ? 'bg-white shadow' : 'text-gray-600'}`}>Todas</button>
            <button onClick={() => setFilter('unread')} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${filter === 'unread' ? 'bg-white shadow' : 'text-gray-600'}`}>Não Lidas</button>
            <button onClick={() => setFilter('read')} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${filter === 'read' ? 'bg-white shadow' : 'text-gray-600'}`}>Lidas</button>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={markAllAsRead} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"><Check className="h-4 w-4 mr-1.5"/> Marcar todas como lidas</button>
            <button onClick={deleteAll} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"><XCircle className="h-4 w-4 mr-1.5"/> Limpar tudo</button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(n => {
              const Icon = n.icon;
              return (
                <div key={n.id} className={`p-4 rounded-lg flex items-start gap-4 transition-colors ${n.read ? 'bg-gray-50 text-gray-500' : 'bg-blue-50 text-gray-800 border border-blue-200'}`}>
                  <div className={`flex-shrink-0 mt-1 ${n.read ? 'text-gray-400' : 'text-blue-600'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-grow">
                    <p className={`font-bold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                    <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-700'}`}>{n.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    <button onClick={() => toggleRead(n.id)} className="p-2 rounded-full hover:bg-gray-200" title={n.read ? "Marcar como não lida" : "Marcar como lida"}>
                      {n.read ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-blue-600" />}
                    </button>
                    <button onClick={() => deleteNotification(n.id)} className="p-2 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600" title="Apagar notificação">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Nenhuma notificação aqui</h3>
              <p>Não há notificações para exibir neste filtro.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificacoesPage;
