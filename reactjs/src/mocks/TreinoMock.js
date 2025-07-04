// src/views/Treinos.js
import React, { useEffect, useState } from 'react';
import { TreinoService } from '../services/TreinoService';

const treinoService = new TreinoService();

export default function Treinos() {
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar todos os treinos
    treinoService.findAll()
      .then(setTreinos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const adicionarTreino = async () => {
    const novoTreino = {
      treinoId: "TREINO-999",
      data: new Date(),
      modalidade: "Futsal",
      responsavel: "Prof. João",
      local: "Quadra 1",
      atletas: [
        {
          nome: "João Silva",
          avaliacoes: {
            Saque: ["A"],
            Ataque: ["B"],
            Defesa: ["C"],
            Passe: ["A"],
            Levantamento: ["B"],
            Bloqueio: ["C"]
          }
        }
      ],
      observacoes: "Teste de treino via front-end",
      finalizado: false
    };

    try {
      const created = await treinoService.create(novoTreino);
      setTreinos([...treinos, created]);
    } catch (err) {
      console.error('Erro ao criar treino:', err);
    }
  };

  const atualizarTreino = async (id) => {
    try {
      const updated = await treinoService.update(id, { finalizado: true });
      setTreinos(treinos.map(t => t._id === id ? updated : t));
    } catch (err) {
      console.error('Erro ao atualizar treino:', err);
    }
  };

  const deletarTreino = async (id) => {
    try {
      await treinoService.delete(id);
      setTreinos(treinos.filter(t => t._id !== id));
    } catch (err) {
      console.error('Erro ao deletar treino:', err);
    }
  };

  if (loading) return <p>Carregando treinos...</p>;

  return (
    <div>
      <h2>Lista de Treinos</h2>
      <button onClick={adicionarTreino}>Adicionar Treino</button>
      <ul>
        {treinos.map(t => (
          <li key={t._id}>
            {t.treinoId} - {t.modalidade} - {t.responsavel}
            <button onClick={() => atualizarTreino(t._id)}>Finalizar</button>
            <button onClick={() => deletarTreino(t._id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
