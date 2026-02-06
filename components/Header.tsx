<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';
import logo from '../conteudo/imagem/Imagem1_logo.png';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Settings, Bell, FileText, AlertTriangle, Trash2, LayoutGrid } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
=======
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  LogIn,
  LogOut,
  User,
  Settings,
  Bell,
  FileText,
  AlertTriangle,
  Trash2,
  LayoutGrid,
  ListChecks,
  MapPin,
  Timer,
  GanttChartSquare,
  BrainCircuit,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import cgcfLogo from "../conteudo/imagem/logo_sistema_5.png";
>>>>>>> 6695a7d (Remove componentes e páginas descontinuadas)

interface HeaderProps {
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [now, setNow] = useState(new Date());
  const weekday = now.toLocaleDateString("pt-PT", { weekday: "long" });
  const capitalWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const day = now.getDate();
  const month = now.toLocaleDateString("pt-PT", { month: "long" });
  const capitalMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const year = now.getFullYear();
  const time = now.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const restOfDateWithCapitalMonth = `${day} de ${capitalMonth} de ${year}, ${time}`;

  const [openDropdown, setOpenDropdown] = useState<
    "profile" | "notifications" | null
  >(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [notifications] = useState([
    {
      id: 1,
      icon: FileText,
      text: "Novo relatório submetido para validação.",
      time: "há 5 minutos",
    },
  ]);

  const role = user?.profile.role as string;
  const isRegional = [
    "coordenador_utl_regional",
    "gestor_operacao_provincial",
    "tecnico_operacao_provincial",
  ].includes(role || "");

  const roles = user?.profile.role as string;
  const isperfil = [
    "coordenador_operacional_central",
    "tecnico_operacional_central",
  ].includes(role || "");
  

  const homeLink =
    role === "coordenador_central"
      ? "/gestao-operacional"
      : "/"; 

  const toggleDropdown = (dropdown: "profile" | "notifications") => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node) &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
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
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-gradient-to-r from-red-700 via-red-900 to-black text-white shadow-lg sticky top-0 z-20 border-b-4 border-yellow-400">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
<<<<<<< HEAD
          
          {/* Left: Logo, System Name, Page Title */}
          <div className="flex items-center space-x-5">
              <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
                  <div className="w-16 h-14 rounded-md  flex items-center justify-center">
                       <span className="text-xl font-black text-white"><img src={logo} alt="CGCF Logo" /></span>
                  </div>
              </Link>
              <div className="w-px h-6 bg-white/30" />
              <h1 className="text-lg font-semibold text-gray-200 hidden sm:block">{pageTitle}</h1>
=======
          <div className="flex items-center space-x-4 h-full">
            <Link
              to={homeLink}
              className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center justify-center rounded px-2 py-1 h-20 w-44 bg-white/10shadow-sm">
                <img
                  src={cgcfLogo}
                  alt="CGCF Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>

            <div className="w-px h-6 bg-white/30 hidden md:block" />

            {/* Indicador de Província (Regional) */}
            {isRegional && user?.province && (
              <div className="hidden sm:flex items-center bg-white/10 px-3 py-1.5 rounded-full border border-white/20 animate-fadeIn">
                <MapPin size={14} className="text-yellow-400 mr-2" />
                <span className="text-[11px] font-black uppercase tracking-widest text-white">
                  UTL {user.province}
                </span>
              </div>
            )}

            <nav className="hidden lg:flex items-center space-x-1">
              {isperfil && (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === "/dashboard" ? "bg-white/20 text-yellow-400" : "text-gray-100 hover:bg-white/10"}`}
                  >
                    <LayoutGrid size={16} className="mr-2" /> Painel
                  </Link>
                </>
              )}
            </nav>
>>>>>>> 6695a7d (Remove componentes e páginas descontinuadas)
          </div>

          {/* Data e hora */}
          <div className="flex items-center space-x-2 sm:space-x-4 text-sm">
            {capitalWeekday}, {restOfDateWithCapitalMonth}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 text-sm">
            {/* Notificações */}
            <div
              className="relative hidden sm:block border-l border-white/30 pl-3"
              ref={notificationsRef}
            >
              <button
                onClick={() => toggleDropdown("notifications")}
                className="relative text-white hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-white/10"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="notification-dot"></span>
                )}
              </button>
            </div>

            <div className="w-px h-6 bg-white/30" />

            {/* Perfil */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => toggleDropdown("profile")}
                className="flex items-center space-x-2 cursor-pointer group p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border-2 border-transparent group-hover:border-yellow-400 transition-colors">
                  <User size={18} className="text-white" />
                </div>
                <div className="flex flex-col items-start leading-none hidden sm:flex">
                  <span className="font-black text-white text-[10px] uppercase tracking-tighter">
                    {user?.profile.name}
                  </span>
                  {isRegional && (
                    <span className="text-[8px] font-bold text-yellow-400 uppercase mt-0.5">
                      {user?.province}
                    </span>
                  )}
                </div>
              </button>

              <div
                className={`dropdown-menu ${openDropdown === "profile" ? "open" : ""}`}
              >
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                  <p className="font-bold text-gray-800 dark:text-white">
                    {user?.username}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold mt-1">
                    {user?.profile.name}
                  </p>
                  {isRegional && (
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                      Província: {user?.province}
                    </p>
                  )}
                </div>
                <div className="p-2">
                  <Link
                    to="/perfil"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <User size={16} className="mr-3" /> Meu Perfil
                  </Link>
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-slate-700">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
                  >
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
