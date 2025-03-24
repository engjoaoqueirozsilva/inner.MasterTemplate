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
//import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
//import Typography from "views/Typography.js";
//import UserPage from "views/User.js";
import Cadastro from "views/Cadastro.js";
//import TableList from "views/Tables.js";
import Atleta from "views/DashAtleta.js";
import Modalidade from "views/Modalidade.js";
import Categoria from "views/Categorias.js";
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
    name: "Performance",
    icon: "nc-icon nc-sound-wave",
    component: Atleta,
    layout: "/admin"
  
  },
  {
    path: "/Dashboard",
    name: "Gráfico de Risco",
    icon: "nc-icon nc-sound-wave",
    component: Atleta,
    layout: "/admin"
  
  },
  {
    path: "/Atletas",
    name: "Performance",
    icon: "nc-icon nc-sound-wave",
    component: Atleta,
    layout: "/admin"
  
  },
  {
    path: "/Modalidade",
    name: "Modalidade",
    icon: "nc-icon nc-trophy",
    component: Modalidade,
    layout: "/admin"
  
  },
  {
    path: "/Categoria",
    name: "Categorias",
    icon: "nc-icon nc-bullet-list-67",
    component: Categoria,
    layout: "/admin"
  },
  {
    path: "/Treino",
    name: "Treino",
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
  }/*,
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-diamond",
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin"
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: UserPage,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-caps-small",
    component: Typography,
    layout: "/admin"
  }*/
];
export default routes;
