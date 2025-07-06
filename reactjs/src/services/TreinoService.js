import  BaseService  from './base/BaseService';

const API_BASE_URL = 'http://harkonen.ia-outsider.com.br/api';

class TreinoService extends BaseService {
  constructor() {
    super(API_BASE_URL, 'treinos');
  }

  // Métodos adicionais específicos de treino podem ser colocados aqui
}
export default TreinoService;