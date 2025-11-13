



import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ChatbotWidget';

const routeTitles: { [key: string]: string } = {
  '/dashboard': 'Painel Principal',
  '/perfil': 'Meu Perfil',
  '/notificacoes': 'Central de Notificações',
  '/relatorios': 'Relatórios',
  '/relatorios/novo': 'Novo Relatório',
  '/termos-de-referencia': 'Termos de Referência',
  '/termos-de-referencia/novo': 'Novo Termo de Referência',
  '/rh': 'Recursos Humanos',
  '/financeiro': 'Orçamento e Finanças',
  '/contabilidade': 'Módulo de Contabilidade',
  '/contabilidade/balancete': 'Balancete de Verificação',
  '/contabilidade/dre': 'Demonstração de Resultados',
  '/gestao-crises': 'Gestão de Crises',
  '/atividades': 'Atividades',
  '/projetos': 'Projetos',
  '/ocorrencias': 'Ocorrências e Suporte',
  '/ordens-de-servico': 'Ordens de Serviço',
  '/patrimonio-e-meios': 'Património e Meios',
  '/utilizadores': 'Utilizadores e Perfis',
  '/seguranca-auditoria': 'Segurança e Acessos',
  '/configuracoes': 'Configuração do Sistema',
  '/orgaos-e-composicao': 'Órgãos e Composição',
  '/plano-de-acao': 'Plano de Ação e Estratégias',
  '/postos-fronteiricos': 'Postos Fronteiriços',
  '/gestao-de-risco': 'Gestão de Risco e Fiscalização',
  '/comunicacao-interinstitucional': 'Comunicação Interinstitucional',
  '/observadores-e-parceiros': 'Observadores e Parceiros',
  '/gis': 'Análise Geoespacial (GIS)',
  '/analises': 'Análises e Estatísticas',
  '/ameacas-ciberneticas': 'Gestão de Ameaças Cibernéticas',
  '/bugs': 'Gestão de Bugs',
  '/sms-email': 'Comunicações SMS/Email',
  '/procedimento-gma': 'Procedimento GMA',
};

const getPageTitle = (pathname: string): string => {
  if (pathname.match(/^\/relatorios\/editar\/.+/)) return 'Editar Relatório';
  if (pathname.match(/^\/termos-de-referencia\/editar\/.+/)) return 'Editar Termo de Referência';
  if (pathname.match(/^\/atividades\/.+\/relatorio/)) return 'Relatório de Atividade';
  return routeTitles[pathname] || 'SGO';
};


const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    document.body.classList.add('has-bg-image');
    return () => {
      document.body.classList.remove('has-bg-image');
    };
  }, []);

  useEffect(() => {
    // On every refresh, the app remounts and this ref is true.
    // This effect redirects to the dashboard on the first render after a refresh.
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

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