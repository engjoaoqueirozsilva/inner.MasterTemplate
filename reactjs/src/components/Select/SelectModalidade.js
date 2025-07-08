import React, { useEffect, useState } from "react";
import { Input, Label, FormGroup } from "reactstrap";
import ModalidadeService from "../../services/ModalidadeService";

function SelectModalidade({ value, onChange }) {
  const [modalidades, setModalidades] = useState([]);

  useEffect(() => {
    ModalidadeService.findAll()
      .then(setModalidades)
      .catch(() => alert("Erro ao buscar modalidades"));
  }, []);

  return (
    <FormGroup>
      <Label for="selectModalidade">Equipe</Label>
      <Input
        type="select"
        id="selectModalidade"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Selecione ...</option>
        {modalidades.map((m, index) => (
          <option key={index} value={m.id || m._id}>
            {m.nome}
          </option>
        ))}
      </Input>
    </FormGroup>
  );
}

export default SelectModalidade;
