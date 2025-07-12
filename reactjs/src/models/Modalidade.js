import mongoose from "mongoose";

const ModalidadeSchema = new mongoose.Schema({
  nome: String,
  responsavelTecnico: String,
  auxiliarTecnico: String,
  observacoes: String,
  clubeId: { type: String, required: true }
});

export const ModalidadeModel = mongoose.model("Modalidade", ModalidadeSchema);
