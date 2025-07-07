/*!

=========================================================
* Paper Dashboard React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Cadastro from "views/Cadastro.js";
import Atleta from "views/DashAtleta.js";
import Equipe from "views/Equipe";
import Treino from "views/Treino.js";


var routes = [
   /*{
    path: "/Upload",
    name: "Uploads",
    icon: "nc-icon nc-cloud-upload-94",
    component: Upload,
    layout: "/admin"
  },
  {
    path: "/Arquivos",
    name: "Arquivos",
    icon: "nc-icon nc-cloud-upload-94",
    component: Arquivos,
    layout: "/admin"
  },
  {
    path: "/Photos",
    name: "Photos",
    icon: "nc-icon nc-cloud-upload-94",
    component: Photo,
    layout: "/admin"
  },*/
  {
    path: "/Dashboard",
    name: "Execução de Treino",
    icon: "nc-icon nc-sound-wave",
    component: Atleta,
    layout: "/admin"
  
  },
  {
    path: "/Equipes",
    name: "Equipes",
    icon: "nc-icon nc-trophy",
    component: Equipe,
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
    path: "/Cadastro",
    name: "Atletas",
    icon: "nc-icon nc-user-run",
    component: Cadastro,
    layout: "/admin"
  }
];
export default routes;
