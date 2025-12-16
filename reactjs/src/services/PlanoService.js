import BaseService from "./base/BaseService";

const API_BASE_URL = "http://harkonen.ia-outsider.com.br/api";

class PlanoService extends BaseService {
  constructor() {
    super(API_BASE_URL, "planos"); 
  }

  findByModalidade(modalidadeId) {
    return this.api.get(`/planos?modalidade=${modalidadeId}`).then((res) => res.data);
  }

  async create(data) {
    return await this.service.create(data);
  }

}

export default PlanoService;
