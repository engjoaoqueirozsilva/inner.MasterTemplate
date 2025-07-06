import axios from 'axios';

const API_KEY = '0c4d8a7a-bde6-4e3a-a2ef-5cde95727e2e'; // Sua chave secreta

class BaseService {
  constructor(baseUrl, endpoint) {
    this.api = axios.create({
      baseURL: `${baseUrl}/${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key':'0c4d8a7a-bde6-4e3a-a2ef-5cde95727e2e'
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
