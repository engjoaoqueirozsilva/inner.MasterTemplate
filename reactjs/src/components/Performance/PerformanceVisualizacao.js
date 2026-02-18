import React, { useState } from "react";
import { Bar, Line, Radar } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Table,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";

function PerformanceVisualizacao({ dados, tipoBusca }) {
  const [activeTab, setActiveTab] = useState("geral");

  // Verificar se há dados
  if (!dados || (!dados.consolidadoGeral?.length && !dados.analiseQuartis?.length)) {
    return (
      <Card>
        <CardBody className="text-center">
          <p>Nenhum dado disponível para visualização.</p>
        </CardBody>
      </Card>
    );
  }

  // ========== DADOS GERAIS ==========
  const planoGeral = dados.consolidadoGeral?.[0];
  const planoQuartis = dados.analiseQuartis?.[0];

  // Preparar dados para gráfico de distribuição geral por fundamento
  const prepararDadosDistribuicaoGeral = () => {
    if (!planoGeral) return null;

    const labels = [];
    const datasetsMap = {
      A: [], B: [], C: [], D: [], E: [], F: []
    };

    planoGeral.atletas.forEach(atleta => {
      atleta.fundamentos.forEach(fund => {
        if (!labels.includes(fund.nome)) {
          labels.push(fund.nome);
        }
      });
    });

    // Agregar dados de todos os atletas por fundamento
    labels.forEach(fundamento => {
      const totais = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
      
      planoGeral.atletas.forEach(atleta => {
        const fund = atleta.fundamentos.find(f => f.nome === fundamento);
        if (fund) {
          Object.keys(totais).forEach(conceito => {
            totais[conceito] += fund.distribuicao[conceito] || 0;
          });
        }
      });

      Object.keys(datasetsMap).forEach(conceito => {
        datasetsMap[conceito].push(totais[conceito]);
      });
    });

    return {
      labels,
      datasets: [
        {
          label: 'A - Excelente',
          data: datasetsMap.A,
          backgroundColor: 'rgba(40, 167, 69, 0.8)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 1
        },
        {
          label: 'B - Bom',
          data: datasetsMap.B,
          backgroundColor: 'rgba(0, 123, 255, 0.8)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        },
        {
          label: 'C - Regular',
          data: datasetsMap.C,
          backgroundColor: 'rgba(255, 193, 7, 0.8)',
          borderColor: 'rgba(255, 193, 7, 1)',
          borderWidth: 1
        },
        {
          label: 'D - Ruim',
          data: datasetsMap.D,
          backgroundColor: 'rgba(255, 152, 0, 0.8)',
          borderColor: 'rgba(255, 152, 0, 1)',
          borderWidth: 1
        },
        {
          label: 'E - Muito Ruim',
          data: datasetsMap.E,
          backgroundColor: 'rgba(220, 53, 69, 0.8)',
          borderColor: 'rgba(220, 53, 69, 1)',
          borderWidth: 1
        },
        {
          label: 'F - Péssimo',
          data: datasetsMap.F,
          backgroundColor: 'rgba(108, 117, 125, 0.8)',
          borderColor: 'rgba(108, 117, 125, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  // Preparar dados para gráfico de performance por quartil
  const prepararDadosQuartis = () => {
    if (!planoQuartis) return null;

    const fundamentos = [];
    const quartisData = { Q1: {}, Q2: {}, Q3: {}, Q4: {} };

    // Coletar todos os fundamentos e suas médias por quartil
    planoQuartis.atletas.forEach(atleta => {
      atleta.fundamentos.forEach(fund => {
        if (!fundamentos.includes(fund.nome)) {
          fundamentos.push(fund.nome);
        }

        fund.quartis.forEach(q => {
          if (!quartisData[q.quartil][fund.nome]) {
            quartisData[q.quartil][fund.nome] = [];
          }
          quartisData[q.quartil][fund.nome].push(q.mediaNumerica);
        });
      });
    });

    // Calcular média de cada fundamento por quartil
    const datasets = ['Q1', 'Q2', 'Q3', 'Q4'].map((quartil, idx) => {
      const cores = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)'
      ];

      return {
        label: quartil,
        data: fundamentos.map(fund => {
          const valores = quartisData[quartil][fund] || [];
          if (valores.length === 0) return 0;
          return valores.reduce((a, b) => a + b, 0) / valores.length;
        }),
        backgroundColor: cores[idx],
        borderColor: cores[idx].replace('0.8', '1'),
        borderWidth: 2,
        fill: false
      };
    });

    return {
      labels: fundamentos,
      datasets
    };
  };

  // Preparar dados para gráfico de evolução por quartil (linha)
  const prepararDadosEvolucaoQuartis = () => {
    if (!planoQuartis) return null;

    const fundamentos = [];
    
    planoQuartis.atletas.forEach(atleta => {
      atleta.fundamentos.forEach(fund => {
        if (!fundamentos.includes(fund.nome)) {
          fundamentos.push(fund.nome);
        }
      });
    });

    const datasets = fundamentos.map((fundamento, idx) => {
      const cores = [
        '#28a745', '#007bff', '#ffc107', '#dc3545', '#6c757d', '#17a2b8'
      ];

      const mediasPorQuartil = ['Q1', 'Q2', 'Q3', 'Q4'].map(quartil => {
        let soma = 0;
        let count = 0;

        planoQuartis.atletas.forEach(atleta => {
          const fund = atleta.fundamentos.find(f => f.nome === fundamento);
          if (fund) {
            const q = fund.quartis.find(qu => qu.quartil === quartil);
            if (q) {
              soma += q.mediaNumerica;
              count++;
            }
          }
        });

        return count > 0 ? soma / count : 0;
      });

      return {
        label: fundamento,
        data: mediasPorQuartil,
        borderColor: cores[idx % cores.length],
        backgroundColor: cores[idx % cores.length],
        fill: false,
        tension: 0.4
      };
    });

    return {
      labels: ['Q1 (0-25%)', 'Q2 (25-50%)', 'Q3 (50-75%)', 'Q4 (75-100%)'],
      datasets
    };
  };

  const dadosDistribuicaoGeral = prepararDadosDistribuicaoGeral();
  const dadosQuartis = prepararDadosQuartis();
  const dadosEvolucaoQuartis = prepararDadosEvolucaoQuartis();

  return (
    <div>
      {/* Cabeçalho com informações do plano */}
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">
                📊 {planoGeral?.planoNome || "Performance"}
              </CardTitle>
              <p className="card-category">
                Período: {new Date(dados.periodo.inicio).toLocaleDateString()} até{" "}
                {new Date(dados.periodo.fim).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="4">
                  <h5>Total de Treinos</h5>
                  <h2>{planoGeral?.totalTreinos || 0}</h2>
                </Col>
                <Col md="4">
                  <h5>Atletas</h5>
                  <h2>{planoGeral?.atletas?.length || 0}</h2>
                </Col>
                <Col md="4">
                  <h5>Fundamentos</h5>
                  <h2>
                    {planoGeral?.atletas?.[0]?.fundamentos?.length || 0}
                  </h2>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Abas de navegação */}
      <Row>
        <Col md="12">
          <Card>
            <CardBody>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={activeTab === "geral" ? "active" : ""}
                    onClick={() => setActiveTab("geral")}
                    style={{ cursor: "pointer" }}
                  >
                    Visão Geral
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === "quartis" ? "active" : ""}
                    onClick={() => setActiveTab("quartis")}
                    style={{ cursor: "pointer" }}
                  >
                    Análise por Quartis
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === "atletas" ? "active" : ""}
                    onClick={() => setActiveTab("atletas")}
                    style={{ cursor: "pointer" }}
                  >
                    Detalhes por Atleta
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab} className="mt-3">
                {/* ABA GERAL */}
                <TabPane tabId="geral">
                  <Row>
                    <Col md="12">
                      <Card>
                        <CardHeader>
                          <CardTitle tag="h5">
                            Distribuição de Conceitos por Fundamento
                          </CardTitle>
                        </CardHeader>
                        <CardBody style={{ height: "400px" }}>
                          {dadosDistribuicaoGeral && (
                            <Bar
                              data={dadosDistribuicaoGeral}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                  x: { stacked: true },
                                  y: { stacked: true, beginAtZero: true }
                                },
                                plugins: {
                                  legend: { position: "bottom" },
                                  title: {
                                    display: true,
                                    text: "Total de execuções por conceito em cada fundamento"
                                  }
                                }
                              }}
                            />
                          )}
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>

                  {/* Tabela resumo geral */}
                  <Row>
                    <Col md="12">
                      <Card>
                        <CardHeader>
                          <CardTitle tag="h5">Resumo Geral</CardTitle>
                        </CardHeader>
                        <CardBody>
                          <Table responsive>
                            <thead className="text-primary">
                              <tr>
                                <th>Fundamento</th>
                                <th>Total Avaliações</th>
                                <th>% Positivo</th>
                                <th>Média Numérica</th>
                                <th>Conceito Prevalente</th>
                              </tr>
                            </thead>
                            <tbody>
                              {planoGeral?.atletas?.map((atleta, idx) =>
                                atleta.fundamentos.map((fund, fidx) => (
                                  <tr key={`${idx}-${fidx}`}>
                                    <td><strong>{fund.nome}</strong></td>
                                    <td>{fund.totalAvaliacoes}</td>
                                    <td>
                                      <span
                                        className={`badge ${
                                          fund.percentualPositivo >= 70
                                            ? "badge-success"
                                            : fund.percentualPositivo >= 50
                                            ? "badge-warning"
                                            : "badge-danger"
                                        }`}
                                      >
                                        {fund.percentualPositivo}%
                                      </span>
                                    </td>
                                    <td>{fund.mediaNumerica.toFixed(2)}</td>
                                    <td>
                                      <span className={`badge badge-${
                                        fund.conceitoPrevalente === 'A' ? 'success' :
                                        fund.conceitoPrevalente === 'B' ? 'primary' :
                                        fund.conceitoPrevalente === 'C' ? 'warning' :
                                        'danger'
                                      }`}>
                                        {fund.conceitoPrevalente}
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </Table>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>

                {/* ABA QUARTIS */}
                <TabPane tabId="quartis">
                  <Row>
                    <Col md="12">
                      <Card>
                        <CardHeader>
                          <CardTitle tag="h5">
                            Evolução de Performance por Quartil
                          </CardTitle>
                          <p className="card-category">
                            Como a performance muda ao longo do treino
                          </p>
                        </CardHeader>
                        <CardBody style={{ height: "400px" }}>
                          {dadosEvolucaoQuartis && (
                            <Line
                              data={dadosEvolucaoQuartis}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                  y: {
                                    beginAtZero: true,
                                    max: 5,
                                    ticks: {
                                      stepSize: 1
                                    }
                                  }
                                },
                                plugins: {
                                  legend: { position: "bottom" },
                                  title: {
                                    display: true,
                                    text: "Média numérica por período do treino"
                                  }
                                }
                              }}
                            />
                          )}
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <Card>
                        <CardHeader>
                          <CardTitle tag="h5">
                            Comparação de Quartis por Fundamento
                          </CardTitle>
                        </CardHeader>
                        <CardBody style={{ height: "400px" }}>
                          {dadosQuartis && (
                            <Bar
                              data={dadosQuartis}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                  y: {
                                    beginAtZero: true,
                                    max: 5
                                  }
                                },
                                plugins: {
                                  legend: { position: "bottom" },
                                  title: {
                                    display: true,
                                    text: "Média de performance em cada período do treino"
                                  }
                                }
                              }}
                            />
                          )}
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>

                  {/* Tabela detalhada de quartis */}
                  <Row>
                    <Col md="12">
                      <Card>
                        <CardHeader>
                          <CardTitle tag="h5">Detalhamento por Quartil</CardTitle>
                        </CardHeader>
                        <CardBody>
                          {planoQuartis?.atletas?.map((atleta, aidx) => (
                            <div key={aidx}>
                              <h5 className="mt-3">👤 {atleta.nome}</h5>
                              {atleta.fundamentos.map((fund, fidx) => (
                                <Card key={fidx} className="mb-3">
                                  <CardHeader>
                                    <strong>{fund.nome}</strong>
                                  </CardHeader>
                                  <CardBody>
                                    <Table size="sm" responsive>
                                      <thead>
                                        <tr>
                                          <th>Quartil</th>
                                          <th>Execuções</th>
                                          <th>A</th>
                                          <th>B</th>
                                          <th>C</th>
                                          <th>D</th>
                                          <th>E</th>
                                          <th>F</th>
                                          <th>% Positivo</th>
                                          <th>Média</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {fund.quartis.map((q, qidx) => (
                                          <tr key={qidx}>
                                            <td><strong>{q.quartil}</strong></td>
                                            <td>{q.totalExecucoes}</td>
                                            <td>{q.distribuicao.A}</td>
                                            <td>{q.distribuicao.B}</td>
                                            <td>{q.distribuicao.C}</td>
                                            <td>{q.distribuicao.D}</td>
                                            <td>{q.distribuicao.E}</td>
                                            <td>{q.distribuicao.F}</td>
                                            <td>
                                              <span className={`badge ${
                                                q.percentualPositivo >= 70 ? 'badge-success' :
                                                q.percentualPositivo >= 50 ? 'badge-warning' :
                                                'badge-danger'
                                              }`}>
                                                {q.percentualPositivo}%
                                              </span>
                                            </td>
                                            <td>{q.mediaNumerica.toFixed(2)}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  </CardBody>
                                </Card>
                              ))}
                            </div>
                          ))}
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>

                {/* ABA ATLETAS */}
                <TabPane tabId="atletas">
                  <Row>
                    <Col md="12">
                      {planoGeral?.atletas?.map((atleta, idx) => (
                        <Card key={idx} className="mb-3">
                          <CardHeader>
                            <CardTitle tag="h5">👤 {atleta.nome}</CardTitle>
                            <p className="card-category">
                              {atleta.totalTreinos} treino(s) no período
                            </p>
                          </CardHeader>
                          <CardBody>
                            <Table responsive>
                              <thead className="text-primary">
                                <tr>
                                  <th>Fundamento</th>
                                  <th>Avaliações</th>
                                  <th>A</th>
                                  <th>B</th>
                                  <th>C</th>
                                  <th>D</th>
                                  <th>E</th>
                                  <th>F</th>
                                  <th>% Positivo</th>
                                  <th>Média</th>
                                </tr>
                              </thead>
                              <tbody>
                                {atleta.fundamentos.map((fund, fidx) => (
                                  <tr key={fidx}>
                                    <td><strong>{fund.nome}</strong></td>
                                    <td>{fund.totalAvaliacoes}</td>
                                    <td>{fund.distribuicao.A}</td>
                                    <td>{fund.distribuicao.B}</td>
                                    <td>{fund.distribuicao.C}</td>
                                    <td>{fund.distribuicao.D}</td>
                                    <td>{fund.distribuicao.E}</td>
                                    <td>{fund.distribuicao.F}</td>
                                    <td>
                                      <span className={`badge ${
                                        fund.percentualPositivo >= 70 ? 'badge-success' :
                                        fund.percentualPositivo >= 50 ? 'badge-warning' :
                                        'badge-danger'
                                      }`}>
                                        {fund.percentualPositivo}%
                                      </span>
                                    </td>
                                    <td>{fund.mediaNumerica.toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </CardBody>
                        </Card>
                      ))}
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PerformanceVisualizacao;