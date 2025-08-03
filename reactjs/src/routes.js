import Cadastro from "views/Cadastro.js";
import Atleta from "views/DashAtleta.js";
import Equipe from "views/Equipe";
import Treino from "views/Treino.js";
import Performance from "views/Performance.js";


var routes = [
   {
    path: "/Equipes",
    name: "Equipes",
    icon: "nc-icon nc-trophy",
    component: Equipe,
    layout: "/admin"
  },
  {
    path: "/Cadastro",
    name: "Atletas",
    icon: "nc-icon nc-user-run",
    component: Cadastro,
    layout: "/admin"
  },
  {
    path: "/Treino",
    name: "Plano de Treino",
    icon: "nc-icon nc-spaceship",
    component: Treino,
    layout: "/admin"
  },
  {
    path: "/Dashboard",
    name: "Execução de Treino",
    icon: "nc-icon nc-sound-wave",
    component: Atleta,
    layout: "/admin"
  },
  {
    path: "/Performance",
    name: "Performance",
    icon: "nc-icon nc-align-center",
    component: Performance,
    layout: "/admin"
  }
];
export default routes;
