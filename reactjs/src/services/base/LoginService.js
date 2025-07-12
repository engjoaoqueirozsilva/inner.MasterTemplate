// src/services/LoginService.js
import BaseService from "./BaseService";


const LoginService = {
  async login(email, senha) {
    return await BaseService.login(email, senha);
  }
};

export default LoginService;
