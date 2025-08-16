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

    const clubeId = localStorage.getItem("clubeId");
    
    if (!clubeId) {
      return;
    }

    AtletaService.findByModalidade(modalidadeId)
      .then((res) => {
        console.log(res);
        setAtletas(res);
        setSelecionados([]);
      })
      .catch(() => {
        setAtletas([]);
        setSelecionados([]);
      });
  }, [modalidadeId, setSelecionados]);

  const adicionar = (id) => {
    const atleta = atletas.find((a) => a._id === id);
    if (atleta && !selecionados.some((s) => s._id === id)) {
      setSelecionados([...selecionados, atleta]);
    }
  };

  const remover = (id) => {
    setSelecionados(selecionados.filter((s) => s._id !== id));
  };

  const formatarInfo = (a) => {
    const posicao = a.posicaoPreferencial?.trim();
    const camisa = a.camisa?.trim();

    // Se a posição for "Não Aplica", não mostramos nada (nem camisa)
    if (posicao && posicao.toLowerCase() === "não aplica") {
      return "";
    }

    const partes = [];

    if (posicao) partes.push(posicao);
    if (camisa) partes.push(`#${camisa}`);

    return partes.length ? ` (${partes.join(", ")})` : "";
  };

  return (
    <FormGroup>
      <Label>Atletas Participantes</Label>
      <Row>
        <Col md="6">
          <Label>Disponíveis</Label>
          {atletas
            .filter((a) => !selecionados.some((s) => s._id === a._id))
            .map((a) => (
              <div
                key={a._id}
                className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
              >
                <span>{a.nome}{formatarInfo(a)}</span>
                <Button size="sm" color="success" onClick={() => adicionar(a._id)}>
                  +
                </Button>
              </div>
            ))}
        </Col>
        <Col md="6">
          <Label>Selecionados</Label>
          {selecionados.map((a) => (
            <div
              key={a._id}
              className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
            >
              <span>{a.nome}{formatarInfo(a)}</span>
              <Button size="sm" color="danger" onClick={() => remover(a._id)}>
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
