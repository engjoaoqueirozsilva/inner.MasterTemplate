import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NotificationAlert from "react-notification-alert";
import './Login.css';

export default function SignIn() {
  const notificationAlert = useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const history = useHistory();

  const notify = (place, color) => {
    const type = ["", "primary", "success", "danger", "warning", "info"][color] || "info";
    const options = {
      place,
      message: (<b>Usuário Inválido</b>),
      type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7
    };
    notificationAlert.current.notificationAlert(options);
  };

  async function handleSignIn(e) {
    e.preventDefault();
    setLoadingAuth(true);

    if (email && password) {
      if (email === 'joao@trator.com' && password === '193178') {
        setTimeout(() => {
          history.push("/admin/Dashboard");
        }, 900); // tempo para a animação (300ms)
      } else {
        notify("tr", 3);
      }
    } else {
      alert('Preencha todos os campos.');
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
        <Link to="">Criar uma conta</Link>
      </div>
    </div>
  );
}
