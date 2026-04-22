import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Nav } from "reactstrap";
import ClubeService from "../../services/ClubeService";
import PerfectScrollbar from "perfect-scrollbar";

let ps;

function Sidebar(props) {
  const sidebar = React.useRef();
  const [clube, setClube] = React.useState({});
  const clubeService = new ClubeService();
  const history = useHistory();
  const [legalOpen, setLegalOpen] = React.useState(false);
  const [userOpen, setUserOpen] = React.useState(false);

  const activeRoute = (routeName) =>
    props.location.pathname.indexOf(routeName) > -1 ? "active" : "";

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1 && sidebar.current) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }

    return () => {
      if (ps) ps.destroy();
    };
  }, []);

  React.useEffect(() => {
    const clubeId = localStorage.getItem("clubeId");

    if (clubeId) {
      clubeService
        .findById(clubeId)
        .then((res) => setClube(res))
        .catch((err) => console.error("Erro ao buscar clube:", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("clubeId");
    localStorage.removeItem("nome");
    localStorage.removeItem("tipo");
    history.push("/login");
  };

  const isOpen = props.isOpen;
  const nomeClube = clube?.nome || "Carregando...";
  const brandMini = "IP";

  return (
    <div
      className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-mini"}`}
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div className="logo">
        <div className="sidebar-brand-wrap">
          {isOpen ? (
            <div className="sidebar-brand-full">
              <span className="sidebar-brand-title">In-Set PRO</span>
              <small className="sidebar-brand-club">{nomeClube}</small>
            </div>
          ) : (
            <div className="sidebar-brand-mini" title="In-Set PRO">
              {brandMini}
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-wrapper d-flex flex-column" ref={sidebar}>
        {/* MENU PRINCIPAL */}
        <Nav className="flex-column">
          {props.routes.map((prop, key) => (
            <li className={`nav-item ${activeRoute(prop.path)}`} key={key}>
              <NavLink
                to={prop.layout + prop.path}
                className="nav-link d-flex align-items-center"
                activeClassName="active"
                title={!isOpen ? prop.name : ""}
              >
                <i className={prop.icon} />
                {isOpen && <span>{prop.name}</span>}
              </NavLink>
            </li>
          ))}
        </Nav>

        {/* ESPAÇADOR PARA EMPURRAR O RODAPÉ */}
        <div style={{ flex: 1 }} />



        {/* SEÇÃO LEGAL */}
        {/* <div className="sidebar-section-label mt-3">
          {isOpen && <small>Legal</small>}
        </div> */}

        <Nav className="flex-column mb-2">
          {/* BOTÃO DO DROPDOWN */}
          <li className="nav-item">
            <a
              href="/"
              className="nav-link d-flex align-items-center"
              onClick={(e) => {
                e.preventDefault();
                if (isOpen) setLegalOpen(!legalOpen);
              }}
              title={!isOpen ? "LGPD" : ""}
            >
              <i className="nc-icon nc-paper" />
              {isOpen && (
                <>
                  <span>LGPD</span>
                  <i
                    className="nc-icon nc-minimal-down"
                    style={{
                      marginLeft: "auto",
                      transform: legalOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "0.2s",
                    }}
                  />
                </>
              )}
            </a>
          </li>

          {/* LINKS INTERNOS */}
          {isOpen && legalOpen && (
            <>
              <li className="nav-item">
                <a
                  href="/html/termos-de-uso.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link d-flex align-items-center sidebar-subitem"
                >
                  <i className="nc-icon nc-single-copy-04" />
                  <span>Termos de Uso</span>
                </a>
              </li>

              <li className="nav-item">
                <a
                  href="/html/politica-de-privacidade.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link d-flex align-items-center sidebar-subitem"
                >
                  <i className="nc-icon nc-lock-circle-open" />
                  <span>Privacidade</span>
                </a>
              </li>
            </>
          )}
        </Nav>
                <Nav className="flex-column mb-2">
          {/* BOTÃO DO DROPDOWN */}
          <li className="nav-item">
            <a
              href="/"
              className="nav-link d-flex align-items-center"
              onClick={(e) => {
                e.preventDefault();
                if (isOpen) setUserOpen(!userOpen);
              }}
              title={!isOpen ? "Conta" : ""}
            >
              <i className="nc-icon nc-button-power" />
              {isOpen && (
                <>
                  <span>Conta</span>
                  <i
                    className="nc-icon nc-minimal-down"
                    style={{
                      marginLeft: "auto",
                      transform: legalOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "0.2s",
                    }}
                  />
                </>
              )}
            </a>
          </li>

          {/* LINKS INTERNOS */}
          {isOpen && userOpen && (
            <>
              <li className="nav-item">
                <a
              href="/"
              className="nav-link text-danger d-flex align-items-center"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              title={!isOpen ? "Sair" : ""}
            >
              <i className="nc-icon nc-people" />
              {isOpen && <span>Sair</span>}
            </a> 
              </li>
            </>
          )}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
