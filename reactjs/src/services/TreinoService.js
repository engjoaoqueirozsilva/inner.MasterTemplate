import BaseService from './base/BaseService';

const API_BASE_URL = 'http://harkonen.ia-outsider.com.br/api';

class TreinoService extends BaseService {
  constructor() {
    super(API_BASE_URL, 'treinos');
  }

  findByModalidade(modalidadeId) {
    return this.api.get(`/treinos?modalidade=${modalidadeId}`).then((res) => res.data);
  }

  getConsolidado(filtros) {
    const { modalidadeId, dataInicio, dataFim } = filtros;
    
    let queryParams = [];
    
    if (modalidadeId) {
      queryParams.push(`modalidadeId=${modalidadeId}`);
    }
    
    if (dataInicio) {
      queryParams.push(`dataInicio=${dataInicio}`);
    }
    
    if (dataFim) {
      queryParams.push(`dataFim=${dataFim}`);
    }
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    return this.api.get(`/treinos/consolidado${queryString}`).then((res) => res.data);
  }
}

export default TreinoService;