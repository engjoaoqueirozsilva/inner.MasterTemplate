import React  from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "reactstrap";
import  ClubeService  from "../../services/ClubeService";
import PerfectScrollbar from "perfect-scrollbar";


var ps;

function Sidebar(props) {
  const sidebar = React.useRef();
  const [clube, setClube] = React.useState({});
  const clubeService = new ClubeService();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });

  React.useEffect(() => {
    const clubeId = localStorage.getItem("clubeId");

    if (clubeId) {
      // CORREÇÃO AQUI:
      // Agora chamamos o método findById na instância que criamos
      clubeService.findById(clubeId)
        .then((res) => {
          console.log("Clube encontrado:", res);
          setClube(res);
        })
        .catch((err) => {  
          // É uma boa prática logar o erro completo para depuração
          console.error("Erro ao buscar clube:", err);
        });
      }
  }, []);

  return (
    <div
      className="sidebar"
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div className="logo">
    
        <a
          href="/admin"
          className="simple-text logo-normal"
        >
          In-Set PRO 
        </a>
        <a
          href="/admin"
          className="simple-text logo-normal-clube-nome">
          {clube.nome}
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          {props.routes.map((prop, key) => {
            return (
              <li
                className={
                  activeRoute(prop.path) + (prop.pro ? " active-pro" : "")
                }
                key={key}
              >
                <NavLink
                  to={prop.layout + prop.path}
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className={prop.icon} />
                  <p>{prop.name}</p>
                </NavLink>
              </li>
            );
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
