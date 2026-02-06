import React, { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatbotWidget from "../components/ChatbotWidget";
import { useAuth } from "../hooks/useAuth";

const routeTitles: { [key: string]: string } = {
  "/dashboard": "Painel Principal",
  "/perfil": "Meu Perfil",
  "/notificacoes": "Central de Notificações",
  "/relatorios": "Gestão de Relatórios",
  "/coordenacao-central": "Centro de Coordenação Central",
  "/tecnico-operacao-central": "Cockpit do Técnico Operacional",
  "/gestao-operacional": "Monitorização Operacional",
  "/atividades": "Atividades e Missões",
  "/utilizadores": "Utilizadores e Funções",
  "/configuracoes": "Configurações do Sistema",
  "/coordenacao-regional": "Coordenação Regional",
  "/ordens-de-servico": "Ordens Operativas",
  "/ordens-de-servico/nova": "Emitir Ordem Operativa",
  "/procedimento-gma": "Procedimentos GMA",
};

const getPageTitle = (pathname: string): string => {
  if (pathname.match(/^\/relatorios\/editar\/.+/)) return "Editar Relatório";
  if (pathname.match(/^\/atividades\/.+\/relatorio/))
    return "Gerar Relatório de Missão";
  if (pathname.match(/^\/ordens-de-servico\/editar\/.+/))
    return "Editar Ordem Operativa";
  return routeTitles[pathname] || "SGO";
};

const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    document.body.classList.add("has-bg-image");
    return () => document.body.classList.remove("has-bg-image");
  }, []);

  useEffect(() => {
    const path = location.pathname;
    const role = user?.profile.role;

    // BLOQUEIO PCA: Só pode ver Monitorização, Perfil, Notificações e Dashboard
    if (role === "coordenador_central") {
      const allowed = [
        "/gestao-operacional",
        "/perfil",
        "/notificacoes",
        "/dashboard",
      ];
      const isAllowed = allowed.some((p) => path.startsWith(p));
      if (!isAllowed) {
        navigate("/gestao-operacional", { replace: true });
      }
    } else if (role === "coordenador_operacional_central") {
      // Adicionado '/ordens-de-servico' à lista de permissões da Direção
      if (
        !path.startsWith("/dashboard") &&
        path !== "/perfil" &&
        path !== "/dashboard" &&
        !path.startsWith("/relatorios") &&
        !path.startsWith("/atividades") &&
        !path.startsWith("/plano-de-acao") &&
        !path.startsWith("/gestao-operacional") &&
        !path.startsWith("/ordens-de-servico")
      ) {
        navigate("/dashboard", { replace: true });
      }
    } else if (role === "tecnico_operacional_central") {
      const allowed = [
        "/relatorios",
        "/atividades",
        "/perfil",
        "/notificacoes",
        "/dashboard",
        "/gestao-operacional",
        "/procedimento-gma",
      ];
      const isAllowed = allowed.some((p) => path.startsWith(p));
      if (!isAllowed) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate, user, location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header pageTitle={pageTitle} />
      <main className="container mx-auto px-6 py-6 flex-1">
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
};

export default MainLayout;
