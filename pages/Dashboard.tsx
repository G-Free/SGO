import React from "react";
import DashboardCard from "../components/DashboardCard";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ListChecks,
  UserCog,
  LayoutDashboard,
  BrainCircuit,
  Zap,
  Target,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Wrench,
  Cog,
  Bug,
  BarChart3,
  GanttChartSquare,
} from "lucide-react";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasRole, user } = useAuth();

  const role = user?.profile.role;
  const isRegional = [
    "coordenador_utl_regional",
    "gestor_operacao_provincial",
    "tecnico_operacao_provincial",
  ].includes(role || "");

  const modules = [
    {
      title: "Dashboard",
      icon: BrainCircuit,
      color: "blue",
      description:
        "Centro unificado de gestão estratégica e supervisão operacional nacional.",
      allowedRoles: ["administrador", "coordenador_operacional_central"],
      route: "/coordenacao-central",
    },
    {
      title: `Dashboard Coordenação ${user?.province}`,
      icon: MapPin,
      color: "blue",
      description: `Supervisão de processos e validação de procedimentos da província de ${user?.province}.`,
  allowedRoles: ["administrador",],
      route: "/coordenacao-regional",
    },  
    {
      title: "Dashboard Operacional",
      icon: LayoutDashboard,
      color: "sky",
      description: "Telemetria e KPIs táticos em tempo real.",
      allowedRoles: ["administrador", "coordenador_central"],
      route: "/gestao-operacional",
    },
    {
      title: "Relatórios",
      icon: FileText,
      color: "purple",
      description:
        "Crie, visualize e exporte relatórios mensais de atividades.",
      allowedRoles: [
        "administrador",
        "coordenador_operacional_central",
        "tecnico_operacional_central",
        "coordenador_utl_regional",
        "tecnico_operacao_provincial",
      ],
      route: "/relatorios",
    },
    {
      title: "Ordens Operativas",
      icon: Wrench,
      color: "amber",
      description:
        "Gestão técnica, missões táticas e ordens de intervenção operativa.",
      allowedRoles: [
        "administrador",
        "coordenador_central",
        "gestor_operacao_provincial",
        "coordenador_operacional_central",
        "coordenador_utl_regional",
        "tecnico_si",
      ],
      route: "/ordens-de-servico",
    },
    {
      title: "Atividades",
      icon: ListChecks,
      color: "green",
      description:
        "Gestão e acompanhamento de missões operacionais provinciais.",
      allowedRoles: [
        "administrador",
        "coordenador_operacional_central",
        "tecnico_operacional_central",
        "coordenador_utl_regional",
        "tecnico_operacao_provincial",
      ],
      route: "/atividades",
    },
    {
      title: "Plano de Acção",
      icon: Target,
      color: "indigo",
      description: "Acompanhamento de metas e diretrizes estratégicas.",
      allowedRoles: ["administrador", "coordenador_operacional_central", "coordenador_utl_regional",],
      route: "/plano-de-acao",
    },
    {
      title: `Monitorização ${user?.province}`,
      icon: BarChart3,
      color: "indigo",
      description: "Análise tática e indicadores de desempenho regional.",
      allowedRoles: ["administrador", "coordenador_utl_regional","gestor_operacao_provincial"],
      route: "/monitorizacao-regional",
    },
    {
      title: "Suporte e Ocorrências",
      icon: AlertTriangle,
      color: "rose",
      description: "Registo de incidentes e pedidos de suporte à Central.",
      allowedRoles: [
        "administrador",
      ],
      route: "/ocorrencias",
    },
    {
      title: "Administração",
      icon: UserCog,
      color: "red",
      description: "Configuração de acessos e perfis do sistema.",
      allowedRoles: ["administrador"],
      route: "/utilizadores",
    },
    {
      title: "Configuração",
      icon: Cog,
      color: "lime",
      description: "Configuração do sistema.",
      allowedRoles: ["administrador"],
      route: "/configuracoes",
    },
    {
      title: "Bugs",
      icon: Bug,
      color: "teal",
      description: "Configuração do Bug.",
      allowedRoles: ["administrador"],
      route: "/bugs",
    },
    {
      title: "Procedimento GMA",
      icon: GanttChartSquare,
      color: "amber",
      category: "Gestão Operacional",
      description: "Procedimentos para Grupos Móveis de Fiscalização e Ações.",
      allowedRoles: [
        "administrador",
        "coordenador_operacional_central",
        "tecnico_operacional_central",
        "tecnico_operacao_provincial",
        "tecnico_si",
        "coordenador_utl_regional",
      ],
      route: "/procedimento-gma",
    },
  ];

  const accessibleModules = modules
    .filter((module) =>
      module.allowedRoles.some((role) => hasRole(role as UserRole)),
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {accessibleModules.map((module, index) => (
          <DashboardCard
            key={index}
            title={module.title}
            icon={module.icon}
            color={module.color}
            description={module.description}
            onClick={() => navigate(module.route)}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;