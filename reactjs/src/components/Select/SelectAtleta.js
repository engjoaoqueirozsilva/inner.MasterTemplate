import React, { useEffect, useState } from "react";
import { Input, FormGroup, Label } from "reactstrap";
import AtletaService from "../../services/AtletasService";

function SelectAtleta({ modalidadeId, value, onChange }) {
  const [atletas, setAtletas] = useState([]);

  useEffect(() => {
    if (!modalidadeId) {
      setAtletas([]);
      return;
    }

    AtletaService.findByModalidade(modalidadeId)
      .then((res) => setAtletas(res))
      .catch(() => setAtletas([]));
  }, [modalidadeId]);

  return (
    <FormGroup>
      <Label for="selectAtleta">Atleta</Label>
      <Input
        type="select"
        id="selectAtleta"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!modalidadeId}
      >
        {!modalidadeId ? (
          <option>Selecione uma modalidade primeiro</option>
        ) : (
          <>
            <option value="">Selecione o atleta</option>
            {atletas.map((a) => (
              <option key={a._id} value={a._id}>
                {a.nome}
              </option>
            ))}
          </>
        )}
      </Input>
    </FormGroup>
  );
}

export default SelectAtleta;
