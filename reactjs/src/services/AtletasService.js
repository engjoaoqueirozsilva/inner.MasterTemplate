import  BaseService  from './base/BaseService';

const API_BASE_URL = 'http://harkonen.ia-outsider.com.br/api';

class AtletasService extends BaseService {
  constructor() {
    super(API_BASE_URL, 'atletas');
  }

  findByModalidade(modalidadeId) {
    return this.api.get(`/atletas?modalidade=${modalidadeId}`).then((res) => res.data);
  }

}

export default new AtletasService();
