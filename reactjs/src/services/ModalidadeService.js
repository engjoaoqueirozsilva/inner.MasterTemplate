import  BaseService  from './base/BaseService';

const API_BASE_URL = 'http://t4kc4cg04kgoo8kcccowwscw.147.93.68.31.sslip.io/api';

class ModalidadeService extends BaseService {
  constructor() {
    super(API_BASE_URL, 'modalidades');
  }

  // findAll já vem do BaseService, mas se quiser pode sobrescrever
  // create, update, delete também estão herdados
}

export default new ModalidadeService();
