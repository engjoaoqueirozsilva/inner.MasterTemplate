import React, { useEffect, useState } from "react";
import { Button, Col, Row, FormGroup, Label } from "reactstrap";
import AtletaService from "../../services/AtletasService";

function SelectAtletasParticipantes({ modalidadeId, selecionados, setSelecionados }) {
  const [atletas, setAtletas] = useState([]);

  useEffect(() => {
    if (!modalidadeId) {
      setAtletas([]);
      setSelecionados([]);
      return;
    }

    AtletaService.findByModalidade(modalidadeId)
      .then((res) => {
        setAtletas(res);
        setSelecionados([]);
      })
      .catch(() => {
        setAtletas([]);
        setSelecionados([]);
      });
  }, [modalidadeId, setSelecionados]);

  const adicionar = (id) => {
    if (!selecionados.includes(id)) {
      setSelecionados([...selecionados, id]);
    }
  };

  const remover = (id) => {
    setSelecionados(selecionados.filter((sid) => sid !== id));
  };

  return (
    <FormGroup>
      <Label>Atletas Participantes</Label>
      <Row>
        <Col md="6">
          <Label>Disponíveis</Label>
          {atletas
            .filter((a) => !selecionados.includes(a._id))
            .map((a) => (
              <div
                key={a._id}
                className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
              >
                <span>{a.nome}</span>
                <Button
                  size="sm"
                  color="success"
                  onClick={() => adicionar(a._id)}
                >
                  +
                </Button>
              </div>
            ))}
        </Col>
        <Col md="6">
          <Label>Selecionados</Label>
          {atletas
            .filter((a) => selecionados.includes(a._id))
            .map((a) => (
              <div
                key={a._id}
                className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
              >
                <span>{a.nome}</span>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => remover(a._id)}
                >
                  ×
                </Button>
              </div>
            ))}
        </Col>
      </Row>
    </FormGroup>
  );
}

export default SelectAtletasParticipantes;
