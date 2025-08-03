import React, { useEffect, useState } from "react";
import { FormGroup, Label, Input } from "reactstrap";
import PlanoService from "../../services/PlanoService";
import ModalidadeService from "../../services/ModalidadeService";

/**
 * Componente de seleção de planos autônomo.
 * Esta versão é autossuficiente para buscar todos os planos do clube.
 *
 * @param {string} value - O ID do plano selecionado.
 * @param {Function} onChange - Callback para ser executado quando o valor muda.
 */
function SelectPlanoCompleto({ value, onChange }) {
  const planoService = new PlanoService();
  const modalidadeService = new ModalidadeService();
  
  const [planos, setPlanos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlanosDoClube = async () => {
      setIsLoading(true);
      try {
        const clubeId = localStorage.getItem("clubeId");
        if (!clubeId) {
          console.error("clubeId não encontrado no localStorage");
          setIsLoading(false);
          return;
        }

        // Primeiro, buscamos todas as modalidades do clube
        const modalidades = await modalidadeService.findByClubeId(clubeId);
        
        // Em seguida, extraímos os IDs das modalidades
        const modalidadeIds = modalidades.map(m => m._id);

        // Agora, buscamos todos os planos associados a essas modalidades
        const planosDoClube = await planoService.findByModalidadeIds(modalidadeIds);
        setPlanos(planosDoClube);

      } catch (error) {
        console.error("Erro ao buscar planos do clube:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // O useEffect é disparado apenas uma vez, ao montar o componente
    fetchPlanosDoClube();
  }, []);

  return (
    <FormGroup>
      <Label>Plano de Treino</Label>
      <Input
        type="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // O select é desabilitado enquanto os dados estão sendo carregados ou se a lista estiver vazia
        disabled={isLoading || planos.length === 0}
      >
        <option value="">
          {isLoading ? "Carregando planos..." : "Selecione um plano"}
        </option>
        {planos.map((plano) => (
          <option key={plano._id} value={plano._id}>
            {plano.nome}
          </option>
        ))}
      </Input>
    </FormGroup>
  );
}

export default SelectPlanoCompleto;
