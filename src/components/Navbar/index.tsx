import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import LogotipoSISFRON from "assets/images/corujinhaLoginEb.png";
import LogotipoCTCEA from "assets/images/logo_ctcea.png";
import LogotipoCCOMGEX from "assets/images/ccomgex.png";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "utils/contexts/AuthContext";
import { removeAuthData, removeUserData } from "utils/storage";
import { hasAnyRoles } from "utils/auth";

const Navbar = () => {
  const { setAuthContextData } = useContext(AuthContext);

  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isPaginaConfirmacao, setIsPaginaConfirmacao] = useState(false);

  const logout = () => {
    removeAuthData();
    removeUserData();

    setAuthContextData({
      authenticated: false,
    });

    navigate("/dashboard-sgl-sg7");
  };

  useEffect(() => {
    setIsAdmin(hasAnyRoles([{ id: 1, autorizacao: "PERFIL_ADMIN" }]));

    if (window.location.href.includes("/confirmado")) {
      setIsPaginaConfirmacao(true);
    }
  }, []);

  return (
    <nav className="navbar-container navbar-expand-md">
      <div className="navbar-top-element">
        <div className="navbar-inner-top-element">
          <Link to="/dashboard-sgl-sg7">
            <img className="navbar-logo" src={LogotipoSISFRON} alt="Logotipo sisfron" />
          </Link>
          <div>
            <img src={LogotipoCCOMGEX} className="ccomgex-logo" alt="Logitpo CComGEx" />
          </div>
          <span className="navbar-title">
            Consciência Situacional <span className="versao">Vs 1.0</span> 
            {/* <span className="real-time-label"> Em tempo real</span> */}
          </span>
          <div>
            <img src={LogotipoCTCEA} className="ctcea-logo" alt="Logotipo CTCEA" />
          </div>
          {!isAdmin && (
            <div className="sair-topo">
              <button onClick={logout} className="nav-link">
                Sair <i className="bi bi-door-open" />
              </button>
            </div>
          )}
        </div>
      </div>
      {isAdmin && (
        <div className="navbar-bottom-element">
          <button
            className="navbar-menu-toggle navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
            aria-controls="navbarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list" />
          </button>
          <div className="collapse navbar-collapse" id="navbarMenu">
            <ul className="navbar-nav navbar-menu">
              {isPaginaConfirmacao ? (
                <li className="nav-item">
                  <button onClick={logout} className="nav-link">
                    Login
                  </button>
                </li>
              ) : (
                <>
                  {isAdmin && (
                    <li className="nav-item dropdown">
                      <button className="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        Administrador
                      </button>
                      <ul className="dropdown-menu bigger-dropdown">
                        <li>
                          <Link className="nav-link" to="/dashboard-sgl-sg7/usuario">
                            Controle de usuário
                          </Link>
                        </li>
                        <li>
                          <Link className="nav-link" to="/dashboard-sgl-sg7/om">
                            Controle de OMs
                          </Link>
                        </li>
                      </ul>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard-sgl-sg7/trocarsenha">
                      Trocar senha
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button onClick={logout} className="nav-link">
                      Sair <i className="bi bi-door-open" />
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
