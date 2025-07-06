import  BaseService  from './base/BaseService';

const API_BASE_URL = 'http://harkonen.ia-outsider.com.br/api';

class ModalidadeService extends BaseService {
  constructor() {
    super(API_BASE_URL, 'modalidades');
  }

  // findAll já vem do BaseService, mas se quiser pode sobrescrever
  // create, update, delete também estão herdados
}

export default new ModalidadeService();
