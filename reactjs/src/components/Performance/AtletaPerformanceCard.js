import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Table,
  Collapse,
  Button,
} from "reactstrap";
import PieChartCard from "../Charts/PieChartCard";
import {
  consolidarGeralAtleta,
  distribuicaoParaChartData,
  getPieChartOptions,
} from "../../";

function AtletaPerformanceCard({ atleta, planoNome }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  // Consolidar todos os fundamentos do atleta
  const distribuicaoGeral = consolidarGeralAtleta(atleta);
  const chartDataGeral = distribuicaoParaChartData(
    distribuicaoGeral,
    `Performance Geral - ${atleta.nome}`
  );

  return (
    <Card className="mb-3">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <CardTitle tag="h4">{atleta.nome}</CardTitle>
            <p className="text-muted mb-0">
              Plano: {planoNome} | Total de Treinos: {atleta.totalTreinos}
            </p>
          </div>
          <Button color="primary" onClick={toggle} size="sm">
            {isOpen ? "Ocultar Detalhes" : "Ver Detalhes"}
          </Button>
        </div>

        <Row>
          {/* Gráfico de pizza - Performance geral do atleta */}
          <Col md="6">
            <PieChartCard
              data={chartDataGeral}
              options={getPieChartOptions(
                `Distribuição Geral - ${atleta.nome}`
              )}
              height={250}
            />
          </Col>

          {/* Tabela resumo */}
          <Col md="6">
            <Card>
              <CardBody>
                <CardTitle tag="h6">Resumo por Fundamento</CardTitle>
                <Table size="sm" responsive>
                  <thead>
                    <tr>
                      <th>Fundamento</th>
                      <th>Prevalente</th>
                      <th>% Positivo</th>
                      <th>Média</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atleta.fundamentos.map((fund, idx) => (
                      <tr key={idx}>
                        <td>{fund.nome}</td>
                        <td>
                          <span
                            className={`badge badge-${getColorByConceito(
                              fund.conceitoPrevalente
                            )}`}
                          >
                            {fund.conceitoPrevalente}
                          </span>
                        </td>
                        <td>{fund.percentualPositivo}%</td>
                        <td>{fund.mediaNumerica}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Detalhes expandíveis - Gráficos por fundamento */}
        <Collapse isOpen={isOpen}>
          <hr />
          <h5 className="mt-3 mb-3">Detalhamento por Fundamento</h5>
          <Row>
            {atleta.fundamentos.map((fundamento, idx) => {
              const chartData = distribuicaoParaChartData(
                fundamento.distribuicao,
                fundamento.nome
              );
              return (
                <Col md="6" lg="4" key={idx} className="mb-3">
                  <PieChartCard
                    titulo={fundamento.nome}
                    data={chartData}
                    options={getPieChartOptions(
                      `${fundamento.nome} - ${atleta.nome}`
                    )}
                    height={200}
                  />
                  <Card className="mt-2">
                    <CardBody className="p-2">
                      <small>
                        <strong>Avaliações:</strong> {fundamento.totalAvaliacoes}
                        <br />
                        <strong>Prevalente:</strong>{" "}
                        <span
                          className={`badge badge-${getColorByConceito(
                            fundamento.conceitoPrevalente
                          )}`}
                        >
                          {fundamento.conceitoPrevalente}
                        </span>
                        <br />
                        <strong>% Positivo:</strong>{" "}
                        {fundamento.percentualPositivo}%
                        <br />
                        <strong>Média:</strong> {fundamento.mediaNumerica}
                      </small>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Collapse>
      </CardBody>
    </Card>
  );
}

// Função auxiliar para cores dos badges
function getColorByConceito(conceito) {
  const cores = {
    A: "success",
    B: "info",
    C: "warning",
    D: "warning",
    E: "danger",
    F: "secondary",
  };
  return cores[conceito] || "secondary";
}

export default AtletaPerformanceCard;