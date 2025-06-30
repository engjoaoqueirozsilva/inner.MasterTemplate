import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Input
} from "reactstrap";

import NivelBotaoSet from "./NivelBotaoSet";

function DashAtleta() {
  const fundamentos = ["Saque", "Ataque", "Defesa", "Passe", "Levantamento", "Bloqueio"];
  const cores = ["warning", "primary", "danger", "success", "default", "warning"];
  const atletas = ["Manuella Penharbel", "Murillo Penharbel"];
  const niveis = ["A", "B", "C", "D", "E", "F"];

  const [avaliacoes, setAvaliacoes] = useState({});
  const [filtroAtleta, setFiltroAtleta] = useState("Todos");
  const [filtroFundamento, setFiltroFundamento] = useState("Todos");

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
    try {
      const response = await fetch("/api/avaliacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treinoId: 123, avaliacoes })
      });

      if (response.ok) {
        alert("Avaliação enviada com sucesso!");
        console.log("Dados enviados:", avaliacoes);
        setAvaliacoes({});
        localStorage.removeItem("avaliacoes");
      } else {
        alert("Erro ao enviar os dados.");
      }
    } catch (err) {
      console.error("Erro ao enviar para a API:", err);
      alert("Falha na comunicação com o servidor.");
    }
  };

  const totaisFundamento = fundamentos.map(fundamento => {
    if (filtroFundamento !== "Todos" && filtroFundamento !== fundamento) return 0;
    return atletas.reduce((acc, atleta) => {
      if (filtroAtleta !== "Todos" && filtroAtleta !== atleta) return acc;
      return acc + (avaliacoes[atleta]?.[fundamento]?.length || 0);
    }, 0);
  });

  const contagemPorNivel = niveis.map(nivel => {
    let total = 0;
    for (const atleta in avaliacoes) {
      if (filtroAtleta !== "Todos" && filtroAtleta !== atleta) continue;
      for (const fundamento in avaliacoes[atleta]) {
        if (filtroFundamento !== "Todos" && filtroFundamento !== fundamento) continue;
        total += avaliacoes[atleta][fundamento].filter(n => n === nivel).length;
      }
    }
    return total;
  });

  return (
    <div className="content">
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

      <Row className="mb-3 px-3">
        <Col md="3">
          <label>Filtrar por Atleta:</label>
          <Input
            type="select"
            value={filtroAtleta}
            onChange={(e) => setFiltroAtleta(e.target.value)}
          >
            <option>Todos</option>
            {atletas.map((a, i) => (
              <option key={i}>{a}</option>
            ))}
          </Input>
        </Col>
        <Col md="3">
          <label>Filtrar por Fundamento:</label>
          <Input
            type="select"
            value={filtroFundamento}
            onChange={(e) => setFiltroFundamento(e.target.value)}
          >
            <option>Todos</option>
            {fundamentos.map((f, i) => (
              <option key={i}>{f}</option>
            ))}
          </Input>
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
                      .filter(f => filtroFundamento === "Todos" || filtroFundamento === f)
                      .map((fundamento, idx) => (
                        <th key={idx}>{fundamento}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {atletas
                    .filter(a => filtroAtleta === "Todos" || filtroAtleta === a)
                    .map((atleta, index) => (
                      <tr key={index}>
                        <td>{atleta}</td>
                        {fundamentos
                          .filter(f => filtroFundamento === "Todos" || filtroFundamento === f)
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
                                  {total > 0 && (
                                    <>
                                      <Button
                                        size="sm"
                                        color="danger"
                                        outline
                                        onClick={() => desfazerUltima(atleta, fundamento)}
                                      >
                                        Desfazer
                                      </Button>
                                      <Button
                                        size="sm"
                                        color="secondary"
                                        outline
                                        onClick={() => limparFundamento(atleta, fundamento)}
                                      >
                                        Limpar
                                      </Button>
                                    </>
                                  )}
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
