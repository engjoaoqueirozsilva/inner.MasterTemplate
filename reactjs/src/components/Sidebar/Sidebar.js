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

      <div className="sidebar-wrapper" ref={sidebar}>
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

          <div className="sidebar-section-label">
            {isOpen && <small>Conta</small>}
          </div>

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
              <i className="nc-icon nc-button-power" />
              {isOpen && <span>Sair</span>}
            </a>
          </li>
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;