import React from "react";
import { FormGroup, Label, Input } from "reactstrap";

function SelectPlano({ planos = [], value, onChange, modalidadeId }) {
  return (
    <FormGroup>
      <Label>Plano de Treino</Label>
      <Input
        type="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!modalidadeId || planos.length === 0}
      >
        <option value="">Selecione um plano</option>
        {planos.map((plano) => (
          <option key={plano._id} value={plano._id}>
            {plano.nome}
          </option>
        ))}
      </Input>
    </FormGroup>
  );
}

export default SelectPlano;
