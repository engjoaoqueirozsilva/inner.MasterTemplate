import BaseService from "./base/BaseService";

class LousaTaticaService {
  constructor() {
    this.service = new BaseService("", "lousa");
  }

  async findAll(params = {}) {
    return await this.service.findAll(params);
  }

  async findById(id) {
    return await this.service.findById(id);
  }

  async create(data) {
    return await this.service.create(data);
  }

  async update(id, data) {
    return await this.service.update(id, data);
  }

  async deleteById(id) {
    return await this.service.delete(id);
  }
}

export default new LousaTaticaService();