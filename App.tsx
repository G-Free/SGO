import React, { lazy, Suspense } from "react";
import { HashRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/useTheme";
import { NotificationProvider } from "./components/Notification";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Lazy load pages
const LoginPage = lazy(() => import("./pages/Login"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const PerfilPage = lazy(() => import("./pages/Perfil"));
const RelatoriosPage = lazy(() => import("./pages/Relatorios"));
const CriarRelatorioPage = lazy(() => import("./pages/CriarRelatorio"));
const AtividadesPage = lazy(() => import("./pages/Atividades"));
const CriarRelatorioAtividadePage = lazy(
  () => import("./pages/CriarRelatorioAtividade"),
);
const RecursosHumanosPage = lazy(() => import("./pages/RecursosHumanos"));
const OcorrenciasPage = lazy(() => import("./pages/Ocorrencias"));
const UtilizadoresPage = lazy(() => import("./pages/Utilizadores"));
const SegurancaAuditoriaPage = lazy(() => import("./pages/SegurancaAuditoria"));
const ConfiguracoesPage = lazy(() => import("./pages/Configuracoes"));
const OrdensDeServicoPage = lazy(() => import("./pages/OrdensDeServico"));
const CriarOrdemServicoPage = lazy(() => import("./pages/CriarOrdemServico"));
const PlanoDeAcaoPage = lazy(() => import("./pages/PlanoDeAcao"));
const NotificacoesPage = lazy(() => import("./pages/Notificacoes"));
const AmeacasCiberneticasPage = lazy(
  () => import("./pages/AmeacasCiberneticas"),
);
const BugsPage = lazy(() => import("./pages/Bugs"));
const AnalisesPage = lazy(() => import("./pages/Analises"));
const ProcedimentoGmaPage = lazy(() => import("./pages/ProcedimentoGma"));
const MonitorizacaoOperacionalPage = lazy(
  () => import("./pages/GestaoOperacional"),
);
const CoordenacaoCentralPage = lazy(() => import("./pages/CoordenacaoCentral"));
const CoordenacaoRegionalPage = lazy(
  () => import("./pages/CoordenacaoRegional"),
);
const TecnicoOperacaoCentralPage = lazy(
  () => import("./pages/TecnicoOperacaoCentral"),
);

const FullPageLoader = () => (
  <div className="flex justify-center items-center h-screen bg-slate-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
  </div>
);

const Root = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const role = user?.profile.role;

  // Coordenador Central (PCA) vai diretamente para a Monitorização Operacional
  if (role === "coordenador_central")
    return <Navigate to="/gestao-operacional" replace />;

  // Coordenação Regional vai para a vista regional
  if (role === "coordenador_utl_regional")
    return <Navigate to="/coordenacao-regional" replace />;

  // Apenas Técnicos Provinciais (locais) vão para o cockpit provincial automaticamente
  if (role === "tecnico_operacao_provincial")
    return <Navigate to="/tecnico-operacao-central" replace />;

  // Redirecionamento padrão para Dashboard Principal
  // Inclui: administrador, coordenador_operacional_central (Direção) e técnicos centrais
  return <Navigate to="/dashboard" replace />;
};

const AuthenticatedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

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

                <Route element={<AuthenticatedRoute />}>
                  <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route
                      path="/notificacoes"
                      element={<NotificacoesPage />}
                    />
                    <Route path="/perfil" element={<PerfilPage />} />

                    {/* Coordenação Central e Relatórios */}
                    <Route
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            "administrador",
                            "coordenador_operacional_central",
                            "tecnico_operacional_central",
                          ]}
                        />
                      }
                    >
                      <Route
                        path="/coordenacao-central"
                        element={<CoordenacaoCentralPage />}
                      />
                      <Route path="/relatorios" element={<RelatoriosPage />} />
                      <Route
                        path="/relatorios/novo"
                        element={<CriarRelatorioPage />}
                      />
                      <Route
                        path="/relatorios/editar/:reportId"
                        element={<CriarRelatorioPage />}
                      />
                      <Route
                        path="/plano-de-acao"
                        element={<PlanoDeAcaoPage />}
                      />
                      <Route path="/analises" element={<AnalisesPage />} />
                    </Route>

                    {/* Monitorização */}
                    <Route
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            "administrador",
                            "coordenador_central",
                            "coordenador_operacional_central",
                            "tecnico_operacional_central",
                            "coordenador_utl_regional",
                          ]}
                        />
                      }
                    >
                      <Route
                        path="/gestao-operacional"
                        element={<MonitorizacaoOperacionalPage />}
                      />
                    </Route>

                    {/* Coordenação Regional */}
                    <Route
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            "administrador",
                            "coordenador_utl_regional",
                          ]}
                        />
                      }
                    >
                      <Route
                        path="/coordenacao-regional"
                        element={<CoordenacaoRegionalPage />}
                      />
                    </Route>

                    {/* Execução e Operação */}
                    <Route
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            "administrador",
                            "coordenador_operacional_central",
                            "tecnico_operacional_central",
                            "coordenador_utl_regional",
                            "gestor_operacao_provincial",
                            "tecnico_operacao_provincial",
                          ]}
                        />
                      }
                    >
                      <Route
                        path="/tecnico-operacao-central"
                        element={<TecnicoOperacaoCentralPage />}
                      />
                      <Route path="/atividades" element={<AtividadesPage />} />
                      <Route
                        path="/atividades/:activityId/relatorio"
                        element={<CriarRelatorioAtividadePage />}
                      />
                      <Route
                        path="/ordens-de-servico"
                        element={<OrdensDeServicoPage />}
                      />
                      <Route
                        path="/ordens-de-servico/nova"
                        element={<CriarOrdemServicoPage />}
                      />
                      <Route
                        path="/ordens-de-servico/editar/:orderId"
                        element={<CriarOrdemServicoPage />}
                      />
                      <Route
                        path="/procedimento-gma"
                        element={<ProcedimentoGmaPage />}
                      />
                    </Route>

                    {/* Ocorrências */}
                    <Route
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            "administrador",
                            "coordenador_utl_regional",
                            "gestor_operacao_provincial",
                          ]}
                        />
                      }
                    >
                      <Route
                        path="/ocorrencias"
                        element={<OcorrenciasPage />}
                      />
                    </Route>

                    {/* Património e HR */}
                    <Route
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            "administrador",
                            "coordenador_operacional_central",
                            "tecnico_si",
                          ]}
                        />
                      }
                    >
                      <Route path="/rh" element={<RecursosHumanosPage />} />
                    </Route>

                    {/* TI e Auditoria */}
                    <Route
                      element={
                        <ProtectedRoute
                          allowedRoles={["administrador", "tecnico_si"]}
                        />
                      }
                    >
                      <Route
                        path="/configuracoes"
                        element={<ConfiguracoesPage />}
                      />
                      <Route
                        path="/ameacas-ciberneticas"
                        element={<AmeacasCiberneticasPage />}
                      />
                      <Route path="/bugs" element={<BugsPage />} />
                      <Route
                        path="/utilizadores"
                        element={<UtilizadoresPage />}
                      />
                      <Route
                        path="/seguranca-auditoria"
                        element={<SegurancaAuditoriaPage />}
                      />
                    </Route>
                  </Route>
                </Route>

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
