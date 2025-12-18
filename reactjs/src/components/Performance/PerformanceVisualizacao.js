import React from "react";
import { Card, CardBody, CardTitle, Row, Col, Alert } from "reactstrap";
import PieChartCard from "../Charts/PieChartCard";
import AtletaPerformanceCard from "./AtletaPerformanceCard";
import {
  consolidarGeralEquipe,
  consolidarPorFundamento,
  distribuicaoParaChartData,
  getPieChartOptions,
} from "../../utils/performanceDataProcessor";

function PerformanceVisualizacao({ dados }) {
  if (!dados || !dados.planos || dados.planos.length === 0) {
    return (
      <Alert color="info">
        Nenhum dado disponível para o período selecionado.
      </Alert>
    );
  }

  const { planos, periodo } = dados;

  // Consolidações gerais
  const distribuicaoGeralEquipe = consolidarGeralEquipe(planos);
  const fundamentos = consolidarPorFundamento(planos);

  // Preparar dados para gráficos
  const chartDataGeralEquipe = distribuicaoParaChartData(
    distribuicaoGeralEquipe,
    "Performance Geral da Equipe"
  );

  return (
    <div>
      {/* Informações do período */}
      <Card className="mb-3">
        <CardBody>
          <Row>
            <Col md="6">
              <h5>Período Analisado</h5>
              <p className="mb-0">
                <strong>Início:</strong>{" "}
                {new Date(periodo.inicio).toLocaleDateString("pt-BR")}
                <br />
                <strong>Fim:</strong>{" "}
                {new Date(periodo.fim).toLocaleDateString("pt-BR")}
              </p>
            </Col>
            <Col md="6">
              <h5>Resumo</h5>
              <p className="mb-0">
                <strong>Planos Executados:</strong> {planos.length}
                <br />
                <strong>Total de Atletas:</strong>{" "}
                {planos.reduce((acc, p) => acc + p.atletas.length, 0)}
              </p>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Seção 1: Visão Geral da Equipe */}
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h4" className="mb-4">
            📊 Visão Geral da Equipe/Modalidade
          </CardTitle>
          <Row>
            {/* Gráfico geral da equipe */}
            <Col md="6" className="mb-3">
              <PieChartCard
                data={chartDataGeralEquipe}
                options={getPieChartOptions(
                  "Distribuição Geral de Conceitos - Toda Equipe"
                )}
                height={300}
              />
            </Col>

            {/* Estatísticas gerais */}
            <Col md="6" className="mb-3">
              <Card>
                <CardBody>
                  <CardTitle tag="h6">Estatísticas Gerais</CardTitle>
                  <div className="mt-3">
                    {Object.entries(distribuicaoGeralEquipe).map(
                      ([conceito, valor]) => {
                        const total = Object.values(
                          distribuicaoGeralEquipe
                        ).reduce((a, b) => a + b, 0);
                        const percentual =
                          total > 0 ? ((valor / total) * 100).toFixed(1) : 0;
                        return (
                          <div
                            key={conceito}
                            className="d-flex justify-content-between align-items-center mb-2"
                          >
                            <span>
                              <strong>Conceito {conceito}:</strong>
                            </span>
                            <span>
                              {valor} avaliações ({percentual}%)
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Seção 2: Visão por Fundamento (Geral da Equipe) */}
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h4" className="mb-4">
            🎯 Desempenho por Fundamento (Toda Equipe)
          </CardTitle>
          <Row>
            {Object.entries(fundamentos).map(([nome, distribuicao]) => {
              const chartData = distribuicaoParaChartData(distribuicao, nome);
              return (
                <Col md="6" lg="4" key={nome} className="mb-3">
                  <PieChartCard
                    titulo={nome}
                    data={chartData}
                    options={getPieChartOptions(
                      `${nome} - Distribuição da Equipe`
                    )}
                    height={250}
                  />
                </Col>
              );
            })}
          </Row>
        </CardBody>
      </Card>

      {/* Seção 3: Desempenho Individual por Atleta */}
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h4" className="mb-4">
            👤 Desempenho Individual por Atleta
          </CardTitle>
          {planos.map((plano) =>
            plano.atletas.map((atleta, idx) => (
              <AtletaPerformanceCard
                key={idx}
                atleta={atleta}
                planoNome={plano.planoNome}
              />
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default PerformanceVisualizacao;