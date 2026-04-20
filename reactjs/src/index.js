import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "layouts/Admin.js";
import Login from "views/Login/Index.js";

// 🔐 Simples controle de auth (pode evoluir depois)
const isAuthenticated = () => {
  return !!localStorage.getItem("userId");
};

// 🔒 Rota protegida
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

ReactDOM.render(
  <BrowserRouter>
    <Route
      render={({ location }) => (
        <AnimatePresence exitBeforeEnter>
          <Switch location={location} key={location.pathname}>
            
            {/* Login */}
            <Route path="/login" component={Login} />

            {/* Área protegida */}
            <PrivateRoute path="/admin" component={AdminLayout} />

            {/* Redirect padrão */}
            <Redirect to="/login" />

          </Switch>
        </AnimatePresence>
      )}
    />
  </BrowserRouter>,
  document.getElementById("root")
);