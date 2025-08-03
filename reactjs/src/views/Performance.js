import React, { useEffect, useState } from "react";
import SelectModalidade from "../components/Select/SelectModalidade";
import SelectPlano from "../components/Select/SelectPlano";
import PlanoService from "../services/PlanoService";
import { Card, CardBody, Row, Col, FormGroup, Label, Input } from "reactstrap";

function Performance() {
  const planoService = new PlanoService();
  
  // Estado para os filtros
  const [modalidade, setModalidade] = useState("");
  const [planos, setPlanos] = useState([]);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);

  // Estado para o tipo de busca: 'modalidade' ou 'plano'
  const [tipoBusca, setTipoBusca] = useState("modalidade");
  
  // Estado para os dados de execução dos treinos
  const [treinos, setTreinos] = useState([]);
  
  // NOVO: Estado para a lista completa de planos (sem filtro por modalidade)
  const [planosCompletos, setPlanosCompletos] = useState([]);

  // useEffect para carregar os planos quando a modalidade mudar
  // OU para carregar todos os planos quando a busca for por 'plano'.
  useEffect(() => {
    // Se a busca for por modalidade, carrega os planos filtrados
    if (tipoBusca === "modalidade" && modalidade) {
      planoService.findByModalidade(modalidade).then((res) => {
        setPlanos(res);
        setPlanoSelecionado(null);
      });
    }
    // Se a busca for por plano, carrega todos os planos para o clube
    else if (tipoBusca === "plano") {
      planoService.findAll().then((res) => {
        setPlanosCompletos(res);
        setPlanoSelecionado(null);
      });
    } else {
      setPlanos([]);
      setPlanosCompletos([]);
      setPlanoSelecionado(null);
    }
  }, [tipoBusca, modalidade]);

  // useEffect para buscar os dados de execução
  useEffect(() => {
    const fetchTreinos = async () => {
      // Evita a chamada da API se não houver um ID selecionado
      if (tipoBusca === "modalidade" && !modalidade) {
        return;
      }
      if (tipoBusca === "plano" && !planoSelecionado) {
        return;
      }

      console.log("Iniciando busca de treinos...");
      console.log("Tipo de busca:", tipoBusca);
      
      let params = {};
      if (tipoBusca === "modalidade") {
        params.modalidadeId = modalidade;
        console.log("Buscando por modalidadeId:", modalidade);
      } else if (tipoBusca === "plano") {
        params.planoId = planoSelecionado._id;
        console.log("Buscando por planoId:", planoSelecionado._id);
      }
      
      // Simulação da chamada da API (você precisará de um TreinoService para isso)
      // const res = await treinoService.findAll(params);
      // setTreinos(res);
    };

    fetchTreinos();
  }, [tipoBusca, modalidade, planoSelecionado]);


  // Função para renderizar os seletores dinamicamente
  const renderSelectors = () => {
    if (tipoBusca === "modalidade") {
      return (
        <Row className="mb-3">
          <Col md="12">
            <Card>
              <CardBody>
                <SelectModalidade
                  value={modalidade}
                  onChange={(val) => {
                    setModalidade(val);
                    setPlanoSelecionado(null);
                  }}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      );
    } else if (tipoBusca === "plano") {
      return (
        <Row className="mb-3">
          <Col md="12">
            <Card>
              <CardBody>
                <SelectPlano
                  // NOVO: Usa a lista de planos completos, não a filtrada por modalidade
                  planos={planosCompletos} 
                  // CORREÇÃO: Adiciona a prop modalidadeId, mesmo que vazia,
                  // para evitar que o componente seja desabilitado
                  modalidadeId={modalidade} 
                  value={planoSelecionado?._id || ""}
                  onChange={(planoId) => {
                    const plano = planosCompletos.find((p) => p._id === planoId);
                    setPlanoSelecionado(plano);
                  }}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      );
    }
    return null;
  };

  return (
    <div className="content">
      <Card>
        <CardBody>
          <Row className="mb-3">
            {/* Seletor principal para definir o tipo de busca */}
            <Col md="12">
              <Card>
                <CardBody>
                  <FormGroup>
                    <Label for="tipoBusca">Visualizar por:</Label>
                    <Input
                      type="select"
                      name="tipoBusca"
                      id="tipoBusca"
                      value={tipoBusca}
                      onChange={(e) => {
                        setTipoBusca(e.target.value);
                        setModalidade("");
                        setPlanoSelecionado(null);
                      }}
                    >
                      <option value="modalidade">Equipe / Modalidade</option>
                      <option value="plano">Plano de Treino</option>
                    </Input>
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
          
          {/* Renderiza o seletor condicionalmente */}
          {renderSelectors()}
          
          <Row>
            <Col md="12">
              <Card>
                <CardBody>
                  {treinos.length > 0 ? (
                    <div>
                      <h3>Dados de Performance</h3>
                      <pre>{JSON.stringify(treinos, null, 2)}</pre>
                    </div>
                  ) : (
                    <p>Selecione uma opção para visualizar os dados.</p>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
}

export default Performance;
