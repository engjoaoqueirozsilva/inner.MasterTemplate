import mongoose from 'mongoose';

const ClubeSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cnpj: { type: String },
  cidade: { type: String },
  estado: { type: String },
  supervisao: { type: String },
  email: { type: String },
  telefone: { type: String },
}, {  timestamps: true });
export const ClubeModel = mongoose.model('Clube', ClubeSchema);