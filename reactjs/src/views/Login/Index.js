import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
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
    <div className="elegant-login-container">
      <NotificationAlert ref={notificationAlert} />
      
      {/* Subtle Background Pattern */}
      <div className="bg-pattern"></div>
      <div className="bg-gradient"></div>
      
      {/* Side Performance Indicator */}
      <div className="performance-indicator">
        <div className="indicator-line"></div>
        <div className="indicator-dots">
          <span className="dot active"></span>
          <span className="dot active"></span>
          <span className="dot"></span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="login-card-elegant">
        
        {/* Header Section */}
        <div className="login-header">
          <div className="header-line"></div>
          <div className="logo-elegant">
            <h1>IN-SET <span className="pro-text">PRO</span></h1>
            <p className="subtitle">Performance Management System</p>
          </div>
        </div>

        {/* Form Section */}
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

        {/* Footer */}
        <div className="login-footer">
          <a href="#" className="footer-link-elegant">Esqueci minha senha</a>
        </div>

        {/* Bottom Accent */}
        <div className="bottom-accent"></div>
      </div>

 
    </div>
  );
}
