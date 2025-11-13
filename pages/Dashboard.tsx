





import React from "react";
import DashboardCard from "../components/DashboardCard";
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  ListChecks,
  FolderKanban,
  Users,
  Archive,
  ShieldAlert,
  UserCog,
  ClipboardList,
  LifeBuoy,
  ShieldCheck,
  SlidersHorizontal,
  BarChart3,
  DollarSign,
  BookCopy,
  Wrench,
  Library,
  ClipboardCheck,
  TowerControl,
  ShieldQuestion,
  Network,
  Handshake,
  Map,
  Bug,
  AlertCircle,
  Mail,
  GanttChartSquare,
} from "lucide-react";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const handleCardClick = (route: string) => {
    if (route) {
      navigate(route);
    }
  };

  const modules = [
    { 
      title: "Relatórios", 
      icon: FileText, 
      color: "blue",
      category: "Planeamento Estratégico",
      description: "Crie, visualize e exporte relatórios mensais de atividades.",
      allowedRoles: ['administrador', 'gestor'],
      route: "/relatorios"
    },
    { 
      title: "Termos de Referência",
      icon: ClipboardList, 
      color: "orange",
      category: "Planeamento Estratégico",
      description: "Elabore e gira propostas formais para projetos e aquisições.",
      allowedRoles: ['administrador', 'gestor'],
      route: "/termos-de-referencia",
      hidden: true
    },
    { 
      title: "Plano de Ação", 
      icon: ClipboardCheck, 
      color: "purple",
      category: "Planeamento Estratégico",
      description: "Planeje, registe e acompanhe planos de ação coordenados.",
      allowedRoles: ['administrador', 'gestor'],
      route: "/plano-de-acao"
    },
    { 
      title: "Atividades", 
      icon: ListChecks, 
      color: "green",
      category: "Gestão Operacional",
      description: "Registe e acompanhe todas as missões de fiscalização e tarefas.",
      allowedRoles: ['administrador', 'gestor', 'tecnico_op', 'tecnico_si'],
      route: "/atividades"
    },
    { 
      title: "Projetos", 
      icon: FolderKanban, 
      color: "violet",
      category: "Gestão Operacional",
      description: "Organize e monitorize o progresso dos projetos em formato Kanban.",
      allowedRoles: ['administrador', 'gestor', 'tecnico_op', 'tecnico_si'],
      route: "/projetos",
      hidden: true
    },
    { 
      title: "Ordens de Serviço", 
      icon: Wrench,
      color: "indigo",
      category: "Gestão Operacional",
      description: "Crie e monitorize ordens de serviço para manutenção e outras tarefas.",
      allowedRoles: ['administrador', 'gestor', 'tecnico_op', 'tecnico_si'],
      route: "/ordens-de-servico",
      hidden: true
    },
    { 
      title: "Postos Fronteiriços", 
      icon: TowerControl,
      color: "teal",
      category: "Gestão Operacional",
      description: "Gira dados dos postos e pontos fronteiriços (tipo, localização, status).",
      allowedRoles: ['administrador', 'gestor', 'tecnico_op', 'tecnico_si'],
      route: "/postos-fronteiricos",
      hidden: true
    },
    { 
      title: "Procedimento GMA",
      icon: GanttChartSquare,
      color: "rose",
      category: "Gestão Operacional",
      description: "Procedimentos para Grupos Móveis de Fiscalização e Ações.",
      allowedRoles: ['administrador', 'gestor', 'tecnico_op'],
      route: "/procedimento-gma"
    },
    { 
      title: "Gestão de Risco e Fiscalização", 
      icon: ShieldQuestion, 
      color: "amber",
      category: "Gestão Operacional",
      description: "Monitore operações conjuntas, riscos e medidas aplicadas.",
      allowedRoles: ['administrador', 'gestor'],
      route: "/gestao-de-risco",
      hidden: true
    },
    { 
      title: "Análise Geoespacial (GIS)", 
      icon: Map, 
      color: "cyan",
      category: "Análise e Inteligência",
      description: "Visualize dados operacionais num mapa interativo para análise geoespacial.",
      allowedRoles: ['administrador', 'gestor'],
      route: "/gis",
      hidden: true
    },
     { 
      title: "Análises e Estatísticas", 
      icon: BarChart3, 
      color: "sky",
      category: "Análise e Inteligência",
      description: "Visualize dados operacionais através de gráficos e KPIs interativos.",
      allowedRoles: ['administrador', 'gestor'],
      route: "/analises",
      hidden: true
    },
    { 
      title: "Recursos Humanos", 
      icon: Users, 
      color: "emerald",
      category: "Administrativo",
      description: "Consulte informações sobre os colaboradores e a estrutura da organização.",
      allowedRoles: ['administrador', 'gestor'],
      route: "/rh",
      hidden: true
    },
    { 
      title: "Orçamento e Finanças", 
      icon: DollarSign, 
      color: "lime",
      category: "Administrativo",
      description: "Gira orçamentos, recursos, receitas, despesas e relatórios financeiros.",
      allowedRoles: ['administrador', 'gestor'],
      route: "/financeiro",
      hidden: true
    },
    { 
      title: "Contabilidade", 
      icon: BookCopy, 
      color: "pink",
      category: "Administrativo",
      description: "Plano de contas, lançamentos e balancetes contabilísticos.",
      allowedRoles: ['administrador', 'gestor'],
      route: "/contabilidade",
      hidden: true
    },
    { 
      title: "Património e Meios", 
      icon: Archive, 
      color: "slate",
      category: "Administrativo",
      description: "Inventarie e controle todos os ativos, viaturas e equipamentos.",
      allowedRoles: ['administrador', 'tecnico_op', 'tecnico_si'],
      route: "/patrimonio-e-meios",
      hidden: true
    },
    { 
      title: "Órgãos e Composição", 
      icon: Library, 
      color: "sky",
      category: "Administrativo",
      description: "Cadastre entidades do CGCF (Ministérios, Serviços, Direções).",
      allowedRoles: ['administrador', 'gestor'],
      route: "/orgaos-e-composicao",
      hidden: true
    },
    { 
      title: "Observadores e Parceiros", 
      icon: Handshake, 
      color: "fuchsia",
      category: "Administrativo",
      description: "Registe entidades externas com acesso supervisionado ao sistema.",
      allowedRoles: ['administrador', 'gestor'],
      route: "/observadores-e-parceiros",
      hidden: true
    },
    { 
      title: "Ocorrências / Suporte", 
      icon: AlertCircle, 
      color: "yellow",
      category: "Suporte",
      description: "Abra e gira tickets de suporte para problemas técnicos e operacionais.",
      allowedRoles: ['administrador', 'gestor', 'tecnico_op', 'tecnico_si'],
      route: "/ocorrencias",
      hidden: true
    },
    { 
      title: "Gestão de Bugs", 
      icon: Bug, 
      color: "zinc",
      category: "Suporte",
      description: "Registe, priorize e acompanhe bugs e falhas do sistema.",
      allowedRoles: ['administrador', 'tecnico_si'],
      route: "/bugs",
      hidden: true
    },
    { 
      title: "Comunicações SMS/Email", 
      icon: Mail, 
      color: "neutral",
      category: "Suporte",
      description: "Envie e monitorize comunicações por SMS e Email.",
      allowedRoles: ['administrador', 'tecnico_si'],
      route: "/sms-email",
      hidden: true
    },
    { 
      title: "Gestão de Crises", 
      icon: LifeBuoy, 
      color: "red",
      category: "Controlo",
      description: "Planos de contingência, simulações e gestão de incidentes críticos.",
      allowedRoles: ['administrador', 'gestor'],
      route: "/gestao-crises",
      hidden: true
    },
     { 
      title: "Segurança e Acessos", 
      icon: ShieldCheck, 
      color: "stone",
      category: "Controlo",
      description: "Controle permissões, monitore acessos e audite atividades do sistema.",
      allowedRoles: ['administrador'],
      route: "/seguranca-auditoria",
      hidden: true
    },
    { 
      title: "Gestão de Ameaças Cibernéticas", 
      icon: ShieldAlert, 
      color: "rose",
      category: "Controlo",
      description: "Monitore, analise e responda a ameaças à segurança da informação.",
      allowedRoles: ['administrador', 'tecnico_si'],
      route: "/ameacas-ciberneticas",
      hidden: true
    },
    { 
      title: "Comunicação Interinstitucional", 
      icon: Network, 
      color: "gray",
      category: "Controlo",
      description: "Centralize comunicações entre órgãos (migração, polícia, saúde, etc).",
      allowedRoles: ['administrador', 'gestor'],
      route: "/comunicacao-interinstitucional",
      hidden: true
    },
    { 
      title: "Configuração do Sistema", 
      icon: SlidersHorizontal, 
      color: "light-blue",
      category: "Controlo",
      description: "Gira parâmetros, módulos, automações e integrações do SGO.",
      allowedRoles: ['administrador', 'tecnico_si'],
      route: "/configuracoes",
      hidden: true
    },
    { 
      title: "Utilizadores e Perfis", 
      icon: UserCog, 
      color: "dark-green",
      category: "Controlo",
      description: "Administre as contas de utilizador e os seus níveis de permissão.",
      allowedRoles: ['administrador'],
      route: "/utilizadores"
    },
  ];

  const accessibleModules = modules
    .filter(module => 
      !(module as any).hidden && module.allowedRoles.some(role => hasRole(role as UserRole))
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-4">
        {accessibleModules.map((module, index) => (
          <DashboardCard
            key={index}
            title={module.title}
            icon={module.icon}
            color={module.color}
            description={module.description}
            onClick={() => handleCardClick(module.route)}
          />
        ))}
      </div>
    </>
  );
};

export default DashboardPage;