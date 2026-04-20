import React from "react";
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, useLocation } from "react-router-dom";

import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

let ps;

function Dashboard(props) {
  const [backgroundColor] = React.useState("black");
  const [activeColor] = React.useState("info");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const mainPanel = React.useRef();
  const location = useLocation();

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1 && mainPanel.current) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
      });
      document.body.classList.add("perfect-scrollbar-on");
    }

    return () => {
      if (ps) ps.destroy();
      document.body.classList.remove("perfect-scrollbar-on");
    };
  }, []);

  React.useEffect(() => {
    if (mainPanel.current) {
      mainPanel.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`wrapper ${sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
      <Sidebar
        {...props}
        routes={routes}
        bgColor={backgroundColor}
        activeColor={activeColor}
        isOpen={sidebarOpen}
      />

      <div className="main-panel" ref={mainPanel}>
        <DemoNavbar {...props} toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <Switch>
          {routes.map((prop, key) => {
            return (
              <Route
                path={prop.layout + prop.path}
                component={prop.component}
                key={key}
              />
            );
          })}
        </Switch>

        <Footer fluid />
      </div>
    </div>
  );
}

export default Dashboard;