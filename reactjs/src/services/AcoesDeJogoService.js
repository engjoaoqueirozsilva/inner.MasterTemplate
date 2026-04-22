import BaseService from "./base/BaseService";

class AcaoDeJogoService {
  constructor() {
    this.service = new BaseService("", "acoes-jogo");
  }

  /**
   * Lista ações de jogo com filtros
   */
  async findAll(params = {}) {
    return await this.service.findAll(params);
  }

  /**
   * Busca uma ação por ID
   */
  async findById(id) {
    return await this.service.findById(id);
  }

  /**
   * Cria nova ação
   */
  async create(data) {
    return await this.service.create(data);
  }

  /**
   * Atualiza ação existente
   */
  async update(id, data) {
    return await this.service.update(id, data);
  }

  /**
   * Remove ação (soft delete no backend)
   */
  async deleteById(id) {
    return await this.service.delete(id);
  }
}

export default new AcaoDeJogoService();