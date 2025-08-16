// services/AtletasService.js
import BaseService from './base/BaseService';

class AtletasService {
  constructor() {
    // Inicializa o BaseService para a entidade 'atletas'.
    // Suponho que o primeiro parâmetro seja a URL base ou algo semelhante,
    // e o segundo seja o nome da coleção/endpoint.
    this.service = new BaseService("", "atletas");
  }

  /**
   * Busca todos os atletas. Pode aceitar parâmetros de filtro.
   * Quando usado sem filtro, trará todos do clube (se o backend filtrar).
   * @param {object} params - Objeto de parâmetros de query (ex: { nome: "João" }).
   * @returns {Promise<Array>} Uma promessa que resolve para um array de atletas.
   */
  async findAll(params = {}) {
    return await this.service.findAll(params);
  }

  /**
   * Busca atletas de uma modalidade específica.
   * O filtro por clube será handled no backend, mas para esta função
   * o foco é apenas o ID da modalidade.
   * @param {string} modalidadeId - O ID da modalidade pela qual filtrar.
   * @returns {Promise<Array>} Uma promessa que resolve para um array de atletas.
   */
  async findByModalidade(modalidadeId) {
    // Reutiliza o método findAll do BaseService, passando o ID da modalidade como filtro.
    // O BaseService deve ser capaz de traduzir isso para uma query string (ex: ?modalidade=ID).
    return await this.service.findAll({ modalidade: modalidadeId });
  }

}

export default new AtletasService();