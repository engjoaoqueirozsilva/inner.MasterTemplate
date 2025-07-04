import axios from 'axios';

class BaseService {
  constructor(baseUrl, endpoint) {
    this.api = axios.create({
      baseURL: `${baseUrl}/${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async create(data) {
    const response = await this.api.post('/', data);
    return response.data;
  }

  async findAll(params = {}) {
    const response = await this.api.get('/', { params });
    return response.data;
  }

  async findById(id) {
    const response = await this.api.get(`/${id}`);
    return response.data;
  }

  async update(id, data) {
    const response = await this.api.put(`/${id}`, data);
    return response.data;
  }

  async delete(id) {
    const response = await this.api.delete(`/${id}`);
    return response.data;
  }
}

export default BaseService;
