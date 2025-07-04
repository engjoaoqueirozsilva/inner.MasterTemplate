import mongoose from 'mongoose';

// Schema para as avaliações por fundamento
const AvaliacaoSchema = new mongoose.Schema({
  Saque: [String],
  Ataque: [String],
  Defesa: [String],
  Passe: [String],
  Levantamento: [String],
  Bloqueio: [String]
}, { _id: false });

// Schema para os atletas
const AtletaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  avaliacoes: { type: AvaliacaoSchema, required: true }
}, { _id: false });

// Schema principal do treino
const TreinoSchema = new mongoose.Schema({
  treinoId: { type: String, required: true },
  data: { type: Date, required: true },
  modalidade: { type: String, required: true },
  responsavel: { type: String, required: true },
  local: { type: String, required: true },
  atletas: { type: [AtletaSchema], required: true },
  observacoes: { type: String },
  finalizado: { type: Boolean, default: false }
}, {
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  collection: 'in-set-pro' // Define explicitamente a collection
});

// Exporta o model para uso com BaseService e rotas
export const Treino = mongoose.model('Treino', TreinoSchema);
