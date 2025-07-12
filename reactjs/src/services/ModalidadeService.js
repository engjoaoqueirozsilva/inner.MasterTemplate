// src/services/ModalidadeService.js
import BaseService from "./base/BaseService";

class ModalidadeService {
  constructor() {
    this.service = new BaseService("", "modalidades");
  }

  async findAll(params = {}) {
    return await this.service.findAll(params);
  }

  async create(data) {
    return await this.service.create(data); // Correto
  }

}

export default new ModalidadeService();
