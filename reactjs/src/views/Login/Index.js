import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import NotificationAlert from "react-notification-alert";
import './Login.css';
import LoginService from '../../services/base/LoginService.js';

export default function SignIn() {
  const notificationAlert = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const history = useHistory();

  const notify = (place, color, message) => {
    const type = ["", "primary", "success", "danger", "warning", "info"][color] || "info";

    if (notificationAlert.current?.notificationAlert) {
      notificationAlert.current.notificationAlert({
        place,
        message: (<div><b>{message}</b></div>),
        type,
        icon: "nc-icon nc-bell-55",
        autoDismiss: 5
      });
    } else {
      console.warn("NotificationAlert não está disponível.");
    }
  };

  async function handleSignIn(e) {
    e.preventDefault();

    if (loadingAuth) return;

    if (!email || !password) {
      notify("tr", 3, "Preencha todos os campos.");
      return;
    }

    setLoadingAuth(true);

    try {
      const response = await LoginService.login(email, password);
      const result = response?.data || response;

      console.log("Resposta login:", result);

      if (result && result.userId) {
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("clubeId", result.clubeId || "");
        localStorage.setItem("nome", result.nome || "");
        localStorage.setItem("tipo", result.tipo || "");

        notify("tr", 2, "Login realizado com sucesso!");

        setTimeout(() => {
          history.push("/admin");
        }, 300);
      } else {
        notify("tr", 3, "Login inválido. Verifique suas credenciais.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      notify("tr", 3, err?.message || "Erro ao autenticar.");
    } finally {
      setLoadingAuth(false);
    }
  }

  return (
    <div className="elegant-login-container">
      <NotificationAlert ref={notificationAlert} />

      <div className="bg-pattern"></div>
      <div className="bg-gradient"></div>

      <div className="performance-indicator">
        <div className="indicator-line"></div>
        <div className="indicator-dots">
          <span className="dot active"></span>
          <span className="dot active"></span>
          <span className="dot"></span>
        </div>
      </div>

      <div className="login-card-elegant">
        <div className="login-header">
          <div className="header-line"></div>
          <div className="logo-elegant">
            <h1>IN-SET <span className="pro-text">PRO</span></h1>
            <p className="subtitle">Performance Management System</p>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="elegant-form">
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="text"
              placeholder="seu.email@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            className="btn-submit-elegant"
            disabled={loadingAuth}
          >
            {loadingAuth ? (
              <>
                <span className="loading-spinner"></span>
                <span>Autenticando</span>
              </>
            ) : (
              <>
                <span>Acessar</span>
                <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <a href="/" className="footer-link-elegant" onClick={(e) => e.preventDefault()}>
            Esqueci minha senha
          </a>
        </div>

        <div className="bottom-accent"></div>
      </div>
    </div>
  );
}