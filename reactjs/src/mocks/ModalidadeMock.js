// src/views/Modalidades.js
import React, { useEffect, useState } from 'react';
import { ModalidadeService } from '../services/ModalidadeService';

const modalidadeService = new ModalidadeService();

export default function Modalidades() {
  const [modalidades, setModalidades] = useState([]);

  useEffect(() => {
    modalidadeService.findAll()
      .then(setModalidades)
      .catch(console.error);
  }, []);

  const adicionarModalidade = async () => {
    const nova = {
      nome: "Basquete",
      responsavelTecnico: "Treinador A",
      auxiliarTecnico: "Auxiliar B",
      observacoes: "Incluir fundamentos de passe e arremesso"
    };

    try {
      const criada = await modalidadeService.create(nova);
      setModalidades([...modalidades, criada]);
    } catch (err) {
      console.error('Erro ao adicionar modalidade:', err);
    }
  };

  return (
    <div>
      <h2>Modalidades</h2>
      <button onClick={adicionarModalidade}>Adicionar Modalidade</button>
      <ul>
        {modalidades.map(m => (
          <li key={m._id}>
            {m.nome} - Técnico: {m.responsavelTecnico}
          </li>
        ))}
      </ul>
    </div>
  );
}
