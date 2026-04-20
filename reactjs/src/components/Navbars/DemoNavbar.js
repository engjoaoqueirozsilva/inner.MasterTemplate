import React from "react";
import { useLocation } from "react-router-dom";
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Container,
  Button
} from "reactstrap";

import routes from "routes.js";

function Header(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [color, setColor] = React.useState("transparent");
  const sidebarToggle = React.useRef();
  const location = useLocation();

  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("dark");
    }
    setIsOpen(!isOpen);
  };

  const getBrand = () => {
    let brandName =
      "Treine como se a sua vida dependesse disso, vença como se fosse a única coisa que importa.";

    routes.forEach((prop) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
    });

    return brandName;
  };

  const openSidebarMobile = () => {
    document.documentElement.classList.toggle("nav-open");
    if (sidebarToggle.current) {
      sidebarToggle.current.classList.toggle("toggled");
    }
  };

  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("dark");
    } else {
      setColor("transparent");
    }
  };

  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
    return () => {
      window.removeEventListener("resize", updateColor);
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      if (sidebarToggle.current) {
        sidebarToggle.current.classList.toggle("toggled");
      }
    }
  }, [location]);

  return (
    <Navbar
      color={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "dark"
          : color
      }
      expand="lg"
      className={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "navbar-absolute fixed-top"
          : "navbar-absolute fixed-top " +
            (color === "transparent" ? "navbar-transparent " : "")
      }
    >
      <Container fluid>
        <div className="navbar-wrapper d-flex align-items-center">
          {/* Toggle mobile padrão */}
          <div className="navbar-toggle d-lg-none">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={openSidebarMobile}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>

          {/* Toggle desktop para recolher/expandir sidebar */}
          <Button
            type="button"
            color="default"
            className="btn-icon btn-round sidebar-toggle-btn d-none d-lg-inline-flex mr-3"
            onClick={props.toggleSidebar}
          >
            <i
              className={`nc-icon ${
                props.sidebarOpen ? "nc-minimal-left" : "nc-minimal-right"
              }`}
            />
          </Button>

          <NavbarBrand href="/admin">{getBrand()}</NavbarBrand>
        </div>

        <NavbarToggler onClick={toggle}>
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </NavbarToggler>
      </Container>
    </Navbar>
  );
}

export default Header;