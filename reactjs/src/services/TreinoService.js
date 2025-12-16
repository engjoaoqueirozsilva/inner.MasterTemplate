import  BaseService  from './base/BaseService';

const API_BASE_URL = 'http://harkonen.ia-outsider.com.br/api';


class TreinoService extends BaseService {
  constructor() {
    super(API_BASE_URL, 'treinos');
  }

    findByModalidade(modalidadeId) {
    return this.api.get(`/treinos?modalidade=${modalidadeId}`).then((res) => res.data);
  }
}
export default TreinoService;