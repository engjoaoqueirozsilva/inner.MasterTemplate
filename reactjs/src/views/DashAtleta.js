
// Arquivo DashAtleta corrigido

import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import TreinoService from "../services/TreinoService";
import PlanoService from "../services/PlanoService";
import SelectModalidade from "../components/Select/SelectModalidade";
import SelectPlano from "../components/Select/SelectPlano";
import GraficoPorFundamento from "../components/Charts/GraficoPorFundamento";

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
} from "reactstrap";
import NivelBotaoSet from "./NivelBotaoSet";
import "./DashAtleta.css";

const treinoService = new TreinoService();
const planoService = new PlanoService();

function DashAtleta() {
  const [avaliacoes, setAvaliacoes] = useState({});
  const [filtroAtleta, setFiltroAtleta] = useState([]);
  const [filtroFundamento, setFiltroFundamento] = useState([]);

  const [modalidade, setModalidade] = useState("");
  const [planos, setPlanos] = useState([]);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);

  const [atletas, setAtletas] = useState([]);
  const [fundamentos, setFundamentos] = useState([]);

  const niveis = ["A", "B", "C", "D", "E", "F"];
  const cores = ["warning", "primary", "danger", "success", "default", "warning"];

  useEffect(() => {
    const salvo = localStorage.getItem("avaliacoes");
    if (salvo) setAvaliacoes(JSON.parse(salvo));
  }, []);

  useEffect(() => {
    localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
  }, [avaliacoes]);

  useEffect(() => {
    if (!modalidade) {
      setPlanos([]);
      return;
    }
    planoService.findByModalidade(modalidade).then((res) => {
      setPlanos(res);
    });
  }, [modalidade]);

  const iniciarTreino = (plano) => {
    if (!plano) return;

    setPlanoSelecionado(plano);
    setAtletas(plano.participantes.map((p) => p.nome));
    setFundamentos(plano.fundamentos);

    setFiltroAtleta(plano.participantes.map((p) => p.nome));
    setFiltroFundamento(plano.fundamentos);
    setAvaliacoes({});
    localStorage.removeItem("avaliacoes");
  };

  const cancelarTreino = () => {
    setModalidade("");
    setPlanos([]);
    setPlanoSelecionado(null);
    setAtletas([]);
    setFundamentos([]);
    setFiltroAtleta([]);
    setFiltroFundamento([]);
    setAvaliacoes({});
    localStorage.removeItem("avaliacoes");
  };

  const registrarJogada = (atleta, fundamento, nivel) => {
    setAvaliacoes((prev) => {
      const jogadasPrevias = prev[atleta]?.[fundamento] || [];
      return {
        ...prev,
        [atleta]: {
          ...(prev[atleta] || {}),
          [fundamento]: [...jogadasPrevias, nivel],
        },
      };
    });
  };

  const desfazerUltima = (atleta, fundamento) => {
    setAvaliacoes((prev) => {
      const jogadas = prev[atleta]?.[fundamento] || [];
      const novasJogadas = jogadas.slice(0, -1);
      return {
        ...prev,
        [atleta]: {
          ...prev[atleta],
          [fundamento]: novasJogadas,
        },
      };
    });
  };

  const limparFundamento = (atleta, fundamento) => {
    setAvaliacoes((prev) => ({
      ...prev,
      [atleta]: {
        ...prev[atleta],
        [fundamento]: [],
      },
    }));
  };

  const enviarParaAPI = async () => {
    const treinoPayload = {
      treinoId: `TREINO-${Math.floor(Math.random() * 1000)}`,
      data: new Date().toISOString(),
      modalidade: planoSelecionado?.modalidade?.nome || "Indefinido",
      responsavel: "Sistema Automático",
      local: "Quadra A",
      atletas: Object.keys(avaliacoes).map((nome) => ({
        nome,
        avaliacoes: avaliacoes[nome],
      })),
      observacoes: `Treino do plano ${planoSelecionado?.nome || ""}`,
      finalizado: true,
    };

    console.log("📋 Payload do Treino:", treinoPayload);

    console.log("📋 Json do Treino:", JSON.stringify(treinoPayload));

    try {

      await treinoService.create(treinoPayload);

      alert("✅ Avaliação enviada ao MongoDB!");

      console.log("📤 Enviado:", treinoPayload);
      
      setAvaliacoes({});
      
      localStorage.removeItem("avaliacoes");

    } catch (err) {
      console.error(err);

      alert("❌ Erro ao enviar os dados ao MongoDB.");

    }
  };

  const totaisFundamento = fundamentos.map((fundamento) => {
    if (!filtroFundamento.includes(fundamento)) return 0;
    return atletas.reduce((acc, atleta) => {
      if (!filtroAtleta.includes(atleta)) return acc;
      return acc + (avaliacoes[atleta]?.[fundamento]?.length || 0);
    }, 0);
  });

  const contagemPorNivel = niveis.map((nivel) => {
    let total = 0;
    for (const atleta in avaliacoes) {
      if (!filtroAtleta.includes(atleta)) continue;
      for (const fundamento in avaliacoes[atleta]) {
        if (!filtroFundamento.includes(fundamento)) continue;
        total += avaliacoes[atleta][fundamento].filter((n) => n === nivel).length;
      }
    }
    return total;
  });

  return (
    <div className="content">
      <Card>
        <CardBody>
          <Row className="mb-3">
            <Col md="6">
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
            <Col md="6">
              <Card>
                <CardBody>

                  <SelectPlano
                    planos={planos}
                    modalidadeId={modalidade}
                    value={planoSelecionado?._id || ""}
                    onChange={(planoId) => {
                      const plano = planos.find((p) => p._id === planoId);
                      if (plano) iniciarTreino(plano);
                    }}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>


      <Row>
        <Col md="12">
          <Card>
            <CardBody>
              <Row>
                <Col md="6" className="filtro-bloco">
                  <div className="filtro-titulo">Filtrar por Atletas:</div>
                  <div className="filtro-container">
                    {atletas.map((nome, i) => (
                      <div
                        key={i}
                        className={`filtro-botao ${filtroAtleta.includes(nome) ? "ativo" : ""}`}
                        onClick={() =>
                          setFiltroAtleta((prev) =>
                            prev.includes(nome)
                              ? prev.filter((n) => n !== nome)
                              : [...prev, nome]
                          )
                        }
                      >
                        {nome}
                      </div>
                    ))}
                  </div>
                </Col>
                <Col md="6" className="filtro-bloco">
                  <div className="filtro-titulo">Filtrar por Fundamentos:</div>
                  <div className="filtro-container">
                    {fundamentos.map((fund, i) => (
                      <div
                        key={i}
                        className={`filtro-botao ${filtroFundamento.includes(fund) ? "ativo" : ""}`}
                        onClick={() =>
                          setFiltroFundamento((prev) =>
                            prev.includes(fund)
                              ? prev.filter((f) => f !== fund)
                              : [...prev, fund]
                          )
                        }
                      >
                        {fund}
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">Análise de Performance em Treino</CardTitle>
              <div className="d-flex gap-2">
                <Button size="sm" color="secondary" onClick={cancelarTreino}>
                  Cancelar
                </Button>
                <Button size="sm" color="success" onClick={enviarParaAPI}>
                  Finalizar
                </Button>
              </div>
            </CardHeader>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <Card>
            <CardBody>
              <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Nome Atleta</th>
                    {fundamentos
                      .filter((f) => filtroFundamento.includes(f))
                      .map((fundamento, idx) => (
                        <th key={idx}>{fundamento}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {atletas
                    .filter((a) => filtroAtleta.includes(a))
                    .map((atleta, index) => (
                      <tr key={index}>
                        <td>{atleta}</td>
                        {fundamentos
                          .filter((f) => filtroFundamento.includes(f))
                          .map((fundamento, idx) => {
                            const total = avaliacoes[atleta]?.[fundamento]?.length || 0;

                            return (
                              <td key={`${index}-${idx}`}>
                                <NivelBotaoSet
                                  atleta={atleta}
                                  fundamento={fundamento}
                                  cor={cores[idx]}
                                  onClick={registrarJogada}
                                />
                                <div className="d-flex justify-content-between align-items-center mt-1 gap-1">
                                  <small className="text-muted">Total: {total}</small>
                                  <Button
                                    size="sm"
                                    color="danger"
                                    outline
                                    disabled={total === 0}
                                    onClick={() => desfazerUltima(atleta, fundamento)}
                                  >
                                    Desfazer
                                  </Button>
                                  <Button
                                    size="sm"
                                    color="secondary"
                                    outline
                                    disabled={total === 0}
                                    onClick={() => limparFundamento(atleta, fundamento)}
                                  >
                                    Limpar
                                  </Button>
                                </div>
                              </td>
                            );
                          })}
                      </tr>
                    ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Jogadas por Fundamento</CardTitle>
              <p className="card-category">Distribuição Total Registrada</p>
            </CardHeader>
            <CardBody style={{ height: "300px", position: "relative" }}>
              <Pie
                data={{
                  labels: fundamentos,
                  datasets: [
                    {
                      data: totaisFundamento,
                      backgroundColor: [
                        "#4e73df",
                        "#1cc88a",
                        "#36b9cc",
                        "#f6c23e",
                        "#e74a3b",
                        "#858796",
                      ],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" },
                  },
                }}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <GraficoPorFundamento
  fundamentos={fundamentos}
  filtroFundamento={filtroFundamento}
  setFiltroFundamento={setFiltroFundamento}
  atletas={atletas}
  filtroAtleta={filtroAtleta}
  avaliacoes={avaliacoes}
  niveis={niveis}
/>


    </div>
  );
}

export default DashAtleta;
