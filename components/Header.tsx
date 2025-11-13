import React, { useState, useRef, useEffect } from 'react';
import logo from '../conteudo/imagem/Imagem1.png';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Settings, Bell, FileText, AlertTriangle, Trash2, LayoutGrid } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps {
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [openDropdown, setOpenDropdown] = useState<'profile' | 'notifications' | null>(null);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, icon: FileText, text: "Novo relatório submetido para validação.", time: "há 5 minutos" },
    { id: 2, icon: AlertTriangle, text: "Ticket de suporte #TIC-004 atualizado.", time: "há 2 horas" },
    { id: 3, icon: User, text: "Novo utilizador 'Consultor Externo' foi adicionado.", time: "ontem" },
  ]);

  const toggleDropdown = (dropdown: 'profile' | 'notifications') => {
    setOpenDropdown(prev => (prev === dropdown ? null : dropdown));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current && !profileRef.current.contains(event.target as Node) &&
        notificationsRef.current && !notificationsRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpenDropdown(null);
    logout();
    navigate('/login', { replace: true });
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setOpenDropdown(null);
  };
  
  return (
    <header className="bg-gradient-to-r from-red-700 via-red-900 to-black text-white shadow-lg sticky top-0 z-20 border-b-4 border-yellow-400">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Logo, System Name, Page Title */}
          <div className="flex items-center space-x-5">
              <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
                  <div className="w-16 h-14 rounded-md  flex items-center justify-center">
                       <span className="text-xl font-black text-white"><img src={logo} alt="CGCF Logo" /></span>
                  </div>
              </Link>
              <div className="w-px h-6 bg-white/30" />
              <h1 className="text-lg font-semibold text-gray-200 hidden sm:block">{pageTitle}</h1>
          </div>

          {/* Right User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4 text-sm">
            
              {/* Notifications Dropdown */}
              <div className="relative" ref={notificationsRef}>
                  <button onClick={() => toggleDropdown('notifications')} className="relative text-white hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-white/10" title="Notificações">
                      <Bell size={20} />
                      {notifications.length > 0 && <span className="notification-dot"></span>}
                  </button>

                  <div className={`dropdown-menu ${openDropdown === 'notifications' ? 'open' : ''}`}>
                      <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                          <h3 className="font-bold text-gray-800 dark:text-white">Notificações</h3>
                          {notifications.length > 0 && <span className="text-xs font-semibold text-black bg-yellow-400 px-2 py-0.5 rounded-full">{notifications.length}</span>}
                      </div>
                      <div className="p-2 max-h-64 overflow-y-auto">
                          {notifications.length > 0 ? notifications.map((notif) => {
                              const Icon = notif.icon;
                              return (
                                  <div key={notif.id} className="flex items-start p-3 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer">
                                      <Icon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                      <div className="ml-3">
                                          <p className="text-sm text-gray-700 dark:text-slate-300">{notif.text}</p>
                                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{notif.time}</p>
                                      </div>
                                  </div>
                              );
                          }) : (
                            <p className="text-center text-sm text-gray-500 py-4">Nenhuma notificação nova.</p>
                          )}
                      </div>
                      <div className="p-2 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
                          <button onClick={handleClearNotifications} className="flex items-center text-sm font-semibold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                              <Trash2 size={14} className="mr-1.5" />
                              Limpar
                          </button>
                          <Link to="/notificacoes" onClick={() => setOpenDropdown(null)} className="text-sm font-semibold text-yellow-600 hover:underline dark:text-yellow-400">
                              Ver todas
                          </Link>
                      </div>
                  </div>
              </div>

              {/* Dashboard Grid Link */}
               <Link to="/dashboard" className="text-white hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-white/10" title="Menu Principal">
                  <LayoutGrid size={20} />
              </Link>
              
              <div className="w-px h-6 bg-white/30" />

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                  <button onClick={() => toggleDropdown('profile')} className="flex items-center space-x-2 cursor-pointer group p-1.5 rounded-full hover:bg-white/10 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border-2 border-transparent group-hover:border-yellow-400 transition-colors">
                          <User size={18} className="text-white" />
                      </div>
                      <span className="font-semibold text-white group-hover:text-yellow-300 transition-colors hidden sm:block">{user?.username || 'Utilizador'}</span>
                  </button>

                  <div className={`dropdown-menu ${openDropdown === 'profile' ? 'open' : ''}`}>
                      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                          <p className="font-bold text-gray-800 dark:text-white">{user?.username}</p>
                          <p className="text-sm text-gray-500 dark:text-slate-400">{user?.email}</p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold mt-1">{user?.profile.name}</p>
                      </div>
                      <div className="p-2">
                          <Link to="/perfil" onClick={() => setOpenDropdown(null)} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700">
                              <User size={16} className="mr-3" /> Meu Perfil
                          </Link>
                          <Link to="/configuracoes" onClick={() => setOpenDropdown(null)} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700">
                              <Settings size={16} className="mr-3" /> Configurações
                          </Link>
                      </div>
                      <div className="p-2 border-t border-gray-200 dark:border-slate-700">
                          <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400">
                              <LogOut size={16} className="mr-3" /> Terminar Sessão
                          </button>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
