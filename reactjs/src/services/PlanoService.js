import  BaseService  from './base/BaseService';

const API_BASE_URL = 'http://harkonen.ia-outsider.com.br/api';

class PlanoService extends BaseService {
  constructor() {
    super(API_BASE_URL, 'planos');
  }

  // findAll já vem do BaseService, mas se quiser pode sobrescrever
  // create, update, delete também estão herdados
}

export default new PlanoService();
