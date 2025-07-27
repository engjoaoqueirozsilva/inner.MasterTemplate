import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
//import { Link } from 'react-router-dom';
import NotificationAlert from "react-notification-alert";
import './Login.css';
import LoginService from '../../services/base/LoginService.js';

export default function SignIn() {
  const notificationAlert = useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const history = useHistory();
  

  const notify = (place, color, message) => {
    const type = ["", "primary", "success", "danger", "warning", "info"][color] || "info";
    const options = {
      place,
      message: (<b>{message}</b>),
      type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7
    };
    notificationAlert.current.notificationAlert(options);
  };

  async function handleSignIn(e) {
    e.preventDefault();
    setLoadingAuth(true);

    if (!email || !password) {
      notify("tr", 3, "Preencha todos os campos.");
      setLoadingAuth(false);
      return;
    }

    try {
      const result = await LoginService.login(email, password);

      if (result && result.userId) {
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("clubeId", result.clubeId);
        localStorage.setItem("nome", result.nome);
        localStorage.setItem("tipo", result.tipo);

        history.push("/admin");
      } else {
        notify("tr", 3, "Login inválido. Verifique suas credenciais.");
      }
    } catch (err) {
      notify("tr", 3, err.message);
    }

    setLoadingAuth(false);
  }

  return (
    <div className="container-center fade-in">
      <NotificationAlert ref={notificationAlert} />
      <div className="login-glass">
        <h1 className="logo-title">IN-SET <span>PRO</span></h1>
        <form onSubmit={handleSignIn}>
          <input
            type="text"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">
            {loadingAuth ? "Carregando..." : "Acessar"}
          </button>
        </form>
        {/*<Link to="">Criar uma conta</Link>
        <Link to="">Esqueci minha senha</Link>*/}
      </div>
    </div>
  );
}
