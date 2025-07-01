import { useState } from 'react'
import React  from "react";
import './Login.css'
import {  useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import NotificationAlert from "react-notification-alert";
import { NULL } from 'sass';


export default function SignIn(){
  const notificationAlert = React.useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [user, setUser] = useState(null)


  const notify = (place, color) => {
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
              <b>Usuário Inválido</b>
          </div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7
    };
    notificationAlert.current.notificationAlert(options);
  };

  const history = useHistory()

  async function handleSignIn(e){
    e.preventDefault();

    setLoadingAuth(true);

    if(email !== null && email !== undefined && email !== '' && password !== null && password !== undefined && password !== ''){
        if(email === 'joao@trator.com' && password === '193178'){
          setUser(JSON.stringify({ email: email, password: password}))
          
          if(user !== null)
            console.log("user", user);

          history.push("/admin/Dashboard")
        }
        else{
          notify("tr", 3)
      }
        
    }
    else{
        alert('UsuarioInvalido');
    }
    // Chamada Login
    setLoadingAuth(false);

  }


  return(
    <div className="container-center">
      <NotificationAlert ref={notificationAlert} />
      <div className="login">
        <div className="login-area">
          <img alt="Logo do sistema de chamados" />
        </div>

        <form onSubmit={handleSignIn}>
          <h1>Entrar</h1>
          <input 
            type="text" 
            placeholder="email@email.com"
            value={email}
            onChange={ (e) => setEmail(e.target.value) }
          />

          <input 
            type="password" 
            placeholder="********"
            value={password}
            onChange={ (e) => setPassword(e.target.value) }
          />

          <button type="submit">
            {loadingAuth ? "Carregando..." : "Acessar"}
          </button>
        </form>

        <Link to="">Criar uma conta</Link>

      </div>
    </div>
  )
}