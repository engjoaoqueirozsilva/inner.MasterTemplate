import  BaseService  from './base/BaseService';

const API_BASE_URL = 'http://t4kc4cg04kgoo8kcccowwscw.147.93.68.31.sslip.io/api';

class TreinoService extends BaseService {
  constructor() {
    super(API_BASE_URL, 'treinos');
  }

  // Métodos adicionais específicos de treino podem ser colocados aqui
}
export default TreinoService;