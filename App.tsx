



import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { NotificationProvider } from './components/Notification';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';

// Lazy load pages for code-splitting and better performance
const LoginPage = lazy(() => import('./pages/Login'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const PerfilPage = lazy(() => import('./pages/Perfil'));
const RelatoriosPage = lazy(() => import('./pages/Relatorios'));
const CriarRelatorioPage = lazy(() => import('./pages/CriarRelatorio'));
const AtividadesPage = lazy(() => import('./pages/Atividades'));
const CriarRelatorioAtividadePage = lazy(() => import('./pages/CriarRelatorioAtividade'));
const ProjetosPage = lazy(() => import('./pages/Projetos'));
const RecursosHumanosPage = lazy(() => import('./pages/RecursosHumanos'));
const OcorrenciasPage = lazy(() => import('./pages/Ocorrencias'));
const UtilizadoresPage = lazy(() => import('./pages/Utilizadores'));
const TermosDeReferenciaPage = lazy(() => import('./pages/TermosDeReferencia'));
const CriarTermoDeReferenciaPage = lazy(() => import('./pages/CriarTermoDeReferencia'));
const PatrimonioEMeiosPage = lazy(() => import('./pages/PatrimonioEMeios'));
const GestaoCrisesPage = lazy(() => import('./pages/GestaoCrises'));
const SegurancaAuditoriaPage = lazy(() => import('./pages/SegurancaAuditoria'));
const ConfiguracoesPage = lazy(() => import('./pages/Configuracoes'));
const FinanceiroPage = lazy(() => import('./pages/Financeiro'));
const ContabilidadePage = lazy(() => import('./pages/Contabilidade'));
const BalancetePage = lazy(() => import('./pages/Balancete'));
const DemonstracaoResultadosPage = lazy(() => import('./pages/DemonstracaoResultados'));
const OrdensDeServicoPage = lazy(() => import('./pages/OrdensDeServico'));
const OrgaosEComposicaoPage = lazy(() => import('./pages/OrgaosEComposicao'));
const PlanoDeAcaoPage = lazy(() => import('./pages/PlanoDeAcao'));
const GestaoDeRiscoPage = lazy(() => import('./pages/GestaoDeRisco'));
const ComunicacaoInterinstitucionalPage = lazy(() => import('./pages/ComunicacaoInterinstitucional'));
const ObservadoresEParceirosPage = lazy(() => import('./pages/ObservadoresEParceiros'));
const PostosFronteiricosPage = lazy(() => import('./pages/PostosFronteiricos'));
const GisPage = lazy(() => import('./pages/GisPage'));
const NotificacoesPage = lazy(() => import('./pages/Notificacoes'));
const AmeacasCiberneticasPage = lazy(() => import('./pages/AmeacasCiberneticas'));
const BugsPage = lazy(() => import('./pages/Bugs'));
const SmsEmailPage = lazy(() => import('./pages/SmsEmail'));
const AnalisesPage = lazy(() => import('./pages/Analises'));
const ProcedimentoGmaPage = lazy(() => import('./pages/ProcedimentoGma'));


// A simple full-page loader for suspense fallback
const FullPageLoader = () => (
    <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
);

// Root component for initial navigation
const Root = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};


// This component protects routes that require authentication
const AuthenticatedRoute = () => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <HashRouter>
            <Suspense fallback={<FullPageLoader />}>
              <Routes>
                <Route path="/" element={<Root />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Area */}
                <Route element={<AuthenticatedRoute />}>
                  <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/notificacoes" element={<NotificacoesPage />} />
                    <Route path="/perfil" element={<PerfilPage />} />

                    {/* Routes for admin & gestor */}
                    <Route element={<ProtectedRoute allowedRoles={['administrador', 'gestor']} />}>
                      <Route path="/relatorios" element={<RelatoriosPage />} />
                      <Route path="/relatorios/novo" element={<CriarRelatorioPage />} />
                      <Route path="/relatorios/editar/:reportId" element={<CriarRelatorioPage />} />
                      <Route path="/termos-de-referencia" element={<TermosDeReferenciaPage />} />
                      <Route path="/termos-de-referencia/novo" element={<CriarTermoDeReferenciaPage />} />
                      <Route path="/termos-de-referencia/editar/:tdrId" element={<CriarTermoDeReferenciaPage />} />
                      <Route path="/rh" element={<RecursosHumanosPage />} />
                      <Route path="/financeiro" element={<FinanceiroPage />} />
                      <Route path="/contabilidade" element={<ContabilidadePage />} />
                      <Route path="/contabilidade/balancete" element={<BalancetePage />} />
                      <Route path="/contabilidade/dre" element={<DemonstracaoResultadosPage />} />
                      <Route path="/gestao-crises" element={<GestaoCrisesPage />} />

                      {/* New routes */}
                      <Route path="/orgaos-e-composicao" element={<OrgaosEComposicaoPage />} />
                      <Route path="/plano-de-acao" element={<PlanoDeAcaoPage />} />
                      <Route path="/gestao-de-risco" element={<GestaoDeRiscoPage />} />
                      <Route path="/comunicacao-interinstitucional" element={<ComunicacaoInterinstitucionalPage />} />
                      <Route path="/observadores-e-parceiros" element={<ObservadoresEParceirosPage />} />
                      <Route path="/gis" element={<GisPage />} />
                      <Route path="/analises" element={<AnalisesPage />} />
                    </Route>

                    {/* Routes for admin, gestor & tecnicos */}
                    <Route element={<ProtectedRoute allowedRoles={['administrador', 'gestor', 'tecnico_op', 'tecnico_si']} />}>
                      <Route path="/atividades" element={<AtividadesPage />} />
                      <Route path="/atividades/:activityId/relatorio" element={<CriarRelatorioAtividadePage />} />
                      <Route path="/projetos" element={<ProjetosPage />} />
                      <Route path="/ocorrencias" element={<OcorrenciasPage />} />
                      <Route path="/ordens-de-servico" element={<OrdensDeServicoPage />} />
                      
                      {/* New routes */}
                      <Route path="/postos-fronteiricos" element={<PostosFronteiricosPage />} />
                      <Route path="/procedimento-gma" element={<ProcedimentoGmaPage />} />
                    </Route>
                    
                    {/* Routes for admin & all tecnicos */}
                    <Route element={<ProtectedRoute allowedRoles={['administrador', 'tecnico_op', 'tecnico_si']} />}>
                       <Route path="/patrimonio-e-meios" element={<PatrimonioEMeiosPage />} />
                    </Route>

                    {/* Routes for admin & tecnico_si */}
                     <Route element={<ProtectedRoute allowedRoles={['administrador', 'tecnico_si']} />}>
                       <Route path="/configuracoes" element={<ConfiguracoesPage />} />
                       <Route path="/ameacas-ciberneticas" element={<AmeacasCiberneticasPage />} />
                       <Route path="/bugs" element={<BugsPage />} />
                       <Route path="/sms-email" element={<SmsEmailPage />} />
                    </Route>
                    
                    {/* Routes for admin only */}
                    <Route element={<ProtectedRoute allowedRoles={['administrador']} />}>
                      <Route path="/utilizadores" element={<UtilizadoresPage />} />
                      <Route path="/seguranca-auditoria" element={<SegurancaAuditoriaPage />} />
                    </Route>
                  </Route>
                </Route>
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </HashRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;