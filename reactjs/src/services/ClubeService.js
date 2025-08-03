import  BaseService  from './base/BaseService';

const API_BASE_URL = 'http://harkonen.ia-outsider.com.br/api';

class ClubeService extends BaseService {
  constructor() {
    super(API_BASE_URL, 'clubes');
  }

}
export default ClubeService;