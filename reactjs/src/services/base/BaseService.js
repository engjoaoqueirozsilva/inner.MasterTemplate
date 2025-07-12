import axiosInstance from "../axios/axiosInstance";

const API_BASE_URL = 'http://harkonen.ia-outsider.com.br/api'; 
const API_KEY = '0c4d8a7a-bde6-4e3a-a2ef-5cde95727e2e';

class BaseService {
  constructor(baseUrl, endpoint) {
    this.api = axiosInstance;
    this.endpoint = '/' + endpoint;
  }

  async create(data) {
    const response = await this.api.post(this.endpoint, data);
    return response.data;
  }

  async findAll(params = {}) {
    const response = await this.api.get(this.endpoint, { params });
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

  static async login(email, senha) {
    try {
      const response = await this.api.post(`${API_BASE_URL}/auth/login`, {
        email,
        senha
      }, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error("Falha no login: " + (error.response?.data?.error || error.message));
    }
  }
}

export default BaseService;
