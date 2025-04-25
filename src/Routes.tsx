import Navbar from "components/Navbar";
import Admin from "pages/Admin";
import Acoes2024 from "pages/AGGE/Acoes2024";
import AcoesFinalisticas from "pages/AGGE/AcoesFinalisticas";
import Auth from "pages/Auth";
import Confirmar from "pages/Confirmar";
import DM7 from "pages/DM7";
import Distribuicao from "pages/DM7/Distribuicao";
import MaterialOM from "pages/MaterialOM";
import NaoEncontrado from "pages/NaoEncontrado";
import OMs from "pages/OM";
import Operacoes from "pages/Operacoes";
import QcpOM from "pages/QcpOM";
import UniquePage from "pages/UniquePage";
import PrivateRoute from "PrivateRoute";
import { BrowserRouter, Navigate, Route, Routes as Switch } from "react-router-dom";
import { isAuthenticated } from "utils/auth";

/**
 * Componente que controla as rotas da aplicação.
 * O prefixo definido para as rotas é "/dashboard-sgl-sg7".
 * Utiliza o BrowserRouter, comum para aplicações web
 * e SPA (Single Page Applications), sendo capaz de
 * gerenciar o histórico de navegação.
 */
const Routes = () => {
  return (
    <BrowserRouter>
      {isAuthenticated() && <Navbar />}
      <main id="main">
        <Switch>
          <Route path="/" element={<Navigate to="/dashboard-sgl-sg7" />} />
          <Route path="/dashboard-sgl-sg7/*" element={<Auth />} />
          <Route path="/dashboard-sgl-sg7/confirmado" element={<Confirmar />} />
          <Route path="/dashboard-sgl-sg7/nao-encontrado" element={<NaoEncontrado />} />
          <Route
            path="/dashboard-sgl-sg7"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                  { id: 5, autorizacao: "PERFIL_SLI" },
                ]}
              >
                <UniquePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard-sgl-sg7/usuario/*"
            element={
              <PrivateRoute roles={[{ id: 1, autorizacao: "PERFIL_ADMIN" }]}>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard-sgl-sg7/om/*"
            element={
              <PrivateRoute roles={[{ id: 1, autorizacao: "PERFIL_ADMIN" }]}>
                <OMs />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard-sgl-sg7/materialom/*"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                  { id: 5, autorizacao: "PERFIL_SLI" },
                ]}
              >
                <MaterialOM />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard-sgl-sg7/qcpom/*"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                  { id: 5, autorizacao: "PERFIL_SLI" },
                ]}
              >
                <QcpOM />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard-sgl-sg7/operacoes/*"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                  { id: 5, autorizacao: "PERFIL_SLI" },
                ]}
              >
                <Operacoes />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard-sgl-sg7/agge/acoes2024"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                  { id: 5, autorizacao: "PERFIL_SLI" },
                ]}
              >
                <Acoes2024 />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard-sgl-sg7/agge/acoesfinalisticas"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                  { id: 5, autorizacao: "PERFIL_SLI" },
                ]}
              >
                <AcoesFinalisticas />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard-sgl-sg7/dm7/*"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                  { id: 5, autorizacao: "PERFIL_SLI" },
                ]}
              >
                <DM7 />
              </PrivateRoute>
            }
          />
        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default Routes;
