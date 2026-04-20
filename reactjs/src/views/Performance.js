import React, { useEffect, useState, useMemo } from "react";
import SelectModalidade from "../components/Select/SelectModalidade";
import SelectPlano from "../components/Select/SelectPlano";
import PlanoService from "../services/PlanoService";
import TreinoService from "../services/TreinoService";
import PerformanceVisualizacao from "../components/Performance/PerformanceVisualizacao";
import {
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Spinner,
  Button,
} from "reactstrap";

function Performance() {
  const planoService = new PlanoService();
  const treinoService = new TreinoService();

  const [modalidade, setModalidade] = useState("");
  const [planos, setPlanos] = useState([]);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);

  const [tipoBusca, setTipoBusca] = useState("modalidade");
  const [treinos, setTreinos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [planosCompletos, setPlanosCompletos] = useState([]);

  const getPeriodoMesAtual = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    const primeiroDia = new Date(ano, 0, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    const formatarData = (data) => {
      const y = data.getFullYear();
      const m = String(data.getMonth() + 1).padStart(2, "0");
      const d = String(data.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    return {
      dataInicio: formatarData(primeiroDia),
      dataFim: formatarData(ultimoDia),
    };
  };

  useEffect(() => {
    if (tipoBusca === "modalidade" && modalidade) {
      planoService.findByModalidade(modalidade).then((res) => {
        setPlanos(res || []);
        setPlanoSelecionado(null);
      });
    } else if (tipoBusca === "plano") {
      treinoService.getPlanosComExecucao().then((res) => {
        const planosAdaptados = (res || []).map((p) => ({
          _id: p.planoId,
          nome: p.planoNome,
          modalidade: p.modalidade || null,
        }));
        setPlanosCompletos(planosAdaptados);
        setPlanoSelecionado(null);
      });
    } else {
      setPlanos([]);
      setPlanosCompletos([]);
      setPlanoSelecionado(null);
    }
  }, [tipoBusca, modalidade]);

  useEffect(() => {
    const fetchConsolidado = async () => {
      if (tipoBusca === "modalidade" && modalidade) {
        try {
          setLoading(true);

          const periodo = getPeriodoMesAtual();

          const resultado = await treinoService.getConsolidado({
            modalidadeId: modalidade,
            dataInicio: periodo.dataInicio,
            dataFim: periodo.dataFim,
          });

          const resultadoComTipo = {
            ...resultado,
            tipoBusca: "modalidade",
          };

          setTreinos(resultadoComTipo);
        } catch (error) {
          console.error("Erro ao buscar dados consolidados:", error);
          setTreinos(null);
        } finally {
          setLoading(false);
        }
      } else {
        setTreinos(null);
      }
    };

    fetchConsolidado();
  }, [modalidade, tipoBusca]);

  useEffect(() => {
    const fetchConsolidadoPorPlano = async () => {
      if (tipoBusca === "plano" && planoSelecionado) {
        try {
          setLoading(true);

          const periodo = getPeriodoMesAtual();
          const modalidadeDoPlano =
            planoSelecionado.modalidade?._id || planoSelecionado.modalidade;

          const resultado = await treinoService.getConsolidado({
            modalidadeId: modalidadeDoPlano,
            dataInicio: periodo.dataInicio,
            dataFim: periodo.dataFim,
          });

          if (
            !resultado ||
            (!resultado.consolidadoGeral && !resultado.analiseQuartis)
          ) {
            setTreinos(null);
            setLoading(false);
            return;
          }

          const consolidadoFiltrado =
            resultado.consolidadoGeral?.filter(
              (p) => p.planoId?.toString() === planoSelecionado._id?.toString()
            ) || [];

          const quartisFiltrado =
            resultado.analiseQuartis?.filter(
              (p) => p.planoId?.toString() === planoSelecionado._id?.toString()
            ) || [];

          const resultadoFiltrado = {
            ...resultado,
            tipoBusca: "plano",
            planoSelecionado,
            consolidadoGeral: consolidadoFiltrado,
            analiseQuartis: quartisFiltrado,
            temDados:
              consolidadoFiltrado.length > 0 || quartisFiltrado.length > 0,
          };

          setTreinos(resultadoFiltrado);
        } catch (error) {
          console.error("Erro ao buscar dados consolidados do plano:", error);
          setTreinos(null);
        } finally {
          setLoading(false);
        }
      } else if (tipoBusca === "plano" && !planoSelecionado) {
        setTreinos(null);
      }
    };

    fetchConsolidadoPorPlano();
  }, [planoSelecionado, tipoBusca]);

  const periodoAtual = useMemo(() => getPeriodoMesAtual(), []);

  const totalConsolidado = treinos?.consolidadoGeral?.length || 0;
  const totalQuartis = treinos?.analiseQuartis?.length || 0;
  const temDados = totalConsolidado > 0 || totalQuartis > 0;

  const resetBusca = (novoTipo) => {
    setTipoBusca(novoTipo);
    setModalidade("");
    setPlanoSelecionado(null);
    setTreinos(null);
  };

  const renderSelectors = () => {
    if (tipoBusca === "modalidade") {
      return (
        <Row className="mb-3">
          <Col md="12">
            <Card className="perf-filter-card">
              <CardBody>
                <div className="perf-filter-header">
                  <h5 className="perf-filter-title">Selecione a equipe/modalidade</h5>
                  <p className="perf-filter-subtitle">
                    Veja a consolidação dos treinos executados no período atual.
                  </p>
                </div>

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
    }

    if (tipoBusca === "plano") {
      return (
        <Row className="mb-3">
          <Col md="12">
            <Card className="perf-filter-card">
              <CardBody>
                <div className="perf-filter-header">
                  <h5 className="perf-filter-title">Selecione o plano de treino</h5>
                  <p className="perf-filter-subtitle">
                    Visualize a análise consolidada de um plano específico.
                  </p>
                </div>

                <SelectPlano
                  planos={planosCompletos}
                  modalidadeId={modalidade}
                  value={planoSelecionado?._id || ""}
                  onChange={(planoId) => {
                    const plano = planosCompletos.find((p) => p._id === planoId);
                    setPlanoSelecionado(plano || null);
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
      <div className="performance-page">
        <Card className="performance-hero-card">
          <CardBody>
            <div className="performance-hero-top">
              <div>
                <h2 className="performance-page-title">Central de Performance</h2>
                <p className="performance-page-subtitle">
                  Analise a evolução da equipe e transforme execução em decisão
                  técnica.
                </p>
              </div>

              <div className="performance-period-badge">
                <span>Período analisado</span>
                <strong>
                  {periodoAtual.dataInicio} até {periodoAtual.dataFim}
                </strong>
              </div>
            </div>

            <div className="perf-toggle-wrap">
              <Label className="perf-toggle-label">Visualizar por</Label>
              <div className="perf-toggle">
                <Button
                  type="button"
                  className={`perf-toggle-btn ${
                    tipoBusca === "modalidade" ? "active" : ""
                  }`}
                  onClick={() => resetBusca("modalidade")}
                >
                  Equipe / Modalidade
                </Button>

                <Button
                  type="button"
                  className={`perf-toggle-btn ${
                    tipoBusca === "plano" ? "active" : ""
                  }`}
                  onClick={() => resetBusca("plano")}
                >
                  Plano de Treino
                </Button>
              </div>
            </div>

            <Row className="performance-stats-row">
              <Col md="4">
                <div className="performance-stat-card">
                  <span className="performance-stat-label">Tipo de análise</span>
                  <strong className="performance-stat-value">
                    {tipoBusca === "modalidade" ? "Equipe" : "Plano"}
                  </strong>
                </div>
              </Col>

              <Col md="4">
                <div className="performance-stat-card">
                  <span className="performance-stat-label">Consolidados</span>
                  <strong className="performance-stat-value">{totalConsolidado}</strong>
                </div>
              </Col>

              <Col md="4">
                <div className="performance-stat-card">
                  <span className="performance-stat-label">Quartis</span>
                  <strong className="performance-stat-value">{totalQuartis}</strong>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {renderSelectors()}

        {loading ? (
          <Card className="performance-feedback-card">
            <CardBody className="text-center p-5">
              <Spinner color="primary" />
              <p className="mt-3 mb-0">
                Analisando desempenho e consolidando os dados do período...
              </p>
            </CardBody>
          </Card>
        ) : temDados ? (
          <>
            <Card className="performance-insight-card">
              <CardBody>
                <h4 className="performance-insight-title">Resumo da análise</h4>
                <p className="performance-insight-text">
                  Foram encontrados <strong>{totalConsolidado}</strong> registros
                  consolidados e <strong>{totalQuartis}</strong> análises por quartil
                  para esta visão.
                </p>
                <p className="performance-insight-helper">
                  Use os blocos abaixo para identificar padrões, consistência e
                  pontos de atenção da equipe.
                </p>
              </CardBody>
            </Card>

            <PerformanceVisualizacao dados={treinos} tipoBusca={tipoBusca} />
          </>
        ) : modalidade || planoSelecionado ? (
          <Card className="performance-feedback-card">
            <CardBody className="text-center">
              <h5 className="mb-2">Sem dados suficientes ainda</h5>
              <p className="mb-2">
                Nenhum dado de performance foi encontrado para o período selecionado.
              </p>
              <small className="text-muted">
                Consolidado: {totalConsolidado} | Quartis: {totalQuartis}
              </small>
            </CardBody>
          </Card>
        ) : (
          <Card className="performance-feedback-card">
            <CardBody className="text-center">
              <h5 className="mb-2">Escolha uma visão para começar</h5>
              <p className="mb-0">
                {tipoBusca === "modalidade"
                  ? "Selecione uma equipe/modalidade para visualizar os dados de performance."
                  : "Selecione um plano de treino para visualizar os dados de performance."}
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Performance;