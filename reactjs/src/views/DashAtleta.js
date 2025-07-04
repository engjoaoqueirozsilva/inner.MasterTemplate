import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import  TreinoService  from "../services/TreinoService";

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button
} from "reactstrap";
import NivelBotaoSet from "./NivelBotaoSet";
import "./DashAtleta.css";

const treinoService = new TreinoService()

function DashAtleta() {
  const fundamentos = ["Saque", "Ataque", "Defesa", "Passe", "Levantamento", "Bloqueio"];
  const cores = ["warning", "primary", "danger", "success", "default", "warning"];
  const atletas = ["Manuella Penharbel", "Murillo Penharbel"];
  const niveis = ["A", "B", "C", "D", "E", "F"];

  const [avaliacoes, setAvaliacoes] = useState({});
  const [filtroAtleta, setFiltroAtleta] = useState(atletas);
  const [filtroFundamento, setFiltroFundamento] = useState(fundamentos);

  useEffect(() => {
    const salvo = localStorage.getItem("avaliacoes");
    if (salvo) setAvaliacoes(JSON.parse(salvo));
  }, []);

  useEffect(() => {
    localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
  }, [avaliacoes]);

  const registrarJogada = (atleta, fundamento, nivel) => {
    setAvaliacoes(prev => {
      const jogadasPrevias = prev[atleta]?.[fundamento] || [];
      return {
        ...prev,
        [atleta]: {
          ...(prev[atleta] || {}),
          [fundamento]: [...jogadasPrevias, nivel]
        }
      };
    });
  };

  const desfazerUltima = (atleta, fundamento) => {
    setAvaliacoes(prev => {
      const jogadas = prev[atleta]?.[fundamento] || [];
      const novasJogadas = jogadas.slice(0, -1);
      return {
        ...prev,
        [atleta]: {
          ...prev[atleta],
          [fundamento]: novasJogadas
        }
      };
    });
  };

  const limparFundamento = (atleta, fundamento) => {
    setAvaliacoes(prev => {
      return {
        ...prev,
        [atleta]: {
          ...prev[atleta],
          [fundamento]: []
        }
      };
    });
  };

  const enviarParaAPI = async () => {
    const treinoPayload = {
      treinoId: `TREINO-${Math.floor(Math.random() * 1000)}`,
      data: new Date().toISOString(),
      modalidade: "Vôlei",
      responsavel: "Sistema Automático",
      local: "Quadra A",
      atletas: Object.keys(avaliacoes).map(nome => ({
        nome,
        avaliacoes: avaliacoes[nome]
      })),
      observacoes: "Treino registrado via DashAtleta",
      finalizado: true
    };

    try {
      await treinoService.create(treinoPayload); // chamada via axios
      alert("✅ Avaliação enviada ao MongoDB!");
      console.log("📤 Enviado:", treinoPayload);
      setAvaliacoes({});
      localStorage.removeItem("avaliacoes");
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao enviar os dados ao MongoDB.");
    }
  };


  const totaisFundamento = fundamentos.map(fundamento => {
    if (!filtroFundamento.includes(fundamento)) return 0;
    return atletas.reduce((acc, atleta) => {
      if (!filtroAtleta.includes(atleta)) return acc;
      return acc + (avaliacoes[atleta]?.[fundamento]?.length || 0);
    }, 0);
  });

  const contagemPorNivel = niveis.map(nivel => {
    let total = 0;
    for (const atleta in avaliacoes) {
      if (!filtroAtleta.includes(atleta)) continue;
      for (const fundamento in avaliacoes[atleta]) {
        if (!filtroFundamento.includes(fundamento)) continue;
        total += avaliacoes[atleta][fundamento].filter(n => n === nivel).length;
      }
    }
    return total;
  });

  return (
    <div className="content">
      <Row className="px-3 mb-3">
        <Col md="6" className="filtro-bloco">
          <div className="filtro-titulo">Filtrar por Atletas:</div>
          <div className="filtro-container">
            {atletas.map((nome, i) => (
              <div
                key={i}
                className={`filtro-botao ${filtroAtleta.includes(nome) ? "ativo" : ""}`}
                onClick={() =>
                  setFiltroAtleta(prev =>
                    prev.includes(nome)
                      ? prev.filter(n => n !== nome)
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
                  setFiltroFundamento(prev =>
                    prev.includes(fund)
                      ? prev.filter(f => f !== fund)
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

      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">Análise de Performance em Treino</CardTitle>
              <Button color="success" onClick={enviarParaAPI}>
                Finalizar Avaliação
              </Button>
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
                      .filter(f => filtroFundamento.includes(f))
                      .map((fundamento, idx) => (
                        <th key={idx}>{fundamento}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {atletas
                    .filter(a => filtroAtleta.includes(a))
                    .map((atleta, index) => (
                      <tr key={index}>
                        <td>{atleta}</td>
                        {fundamentos
                          .filter(f => filtroFundamento.includes(f))
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
                        "#858796"
                      ]
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" }
                  }
                }}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <Card className="card-chart">
            <CardHeader>
              <CardTitle tag="h5">Distribuição por Nível</CardTitle>
              <p className="card-category">Total De Cada Tipo De Jogada (A–F)</p>
            </CardHeader>
            <CardBody style={{ height: "300px", position: "relative" }}>
              <Line
                data={{
                  labels: niveis,
                  datasets: [
                    {
                      label: "Total por Nível",
                      data: contagemPorNivel,
                      borderColor: "#A259FF",
                      borderWidth: 2,
                      pointBackgroundColor: "#A259FF",
                      pointRadius: 4,
                      backgroundColor: "rgba(162, 89, 255, 0.2)",
                      fill: true,
                      tension: 0.4
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1 }
                    }
                  },
                  plugins: {
                    legend: { display: true, position: "top" },
                    tooltip: { mode: "index", intersect: false }
                  }
                }}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashAtleta;
