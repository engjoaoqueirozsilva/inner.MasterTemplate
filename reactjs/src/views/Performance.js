import React, { useEffect, useState } from "react";
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
} from "reactstrap";

function Performance() {
  const planoService = new PlanoService();
  const treinoService = new TreinoService();

  // Estado para os filtros
  const [modalidade, setModalidade] = useState("");
  const [planos, setPlanos] = useState([]);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);

  // Estado para o tipo de busca: 'modalidade' ou 'plano'
  const [tipoBusca, setTipoBusca] = useState("modalidade");

  // Estado para os dados de execução dos treinos
  const [treinos, setTreinos] = useState(null);

  // Estado para loading
  const [loading, setLoading] = useState(false);

  // NOVO: Estado para a lista completa de planos (sem filtro por modalidade)
  const [planosCompletos, setPlanosCompletos] = useState([]);

  // Função para calcular primeiro e último dia do mês atual
  const getPeriodoMesAtual = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    // Formatar para YYYY-MM-DD
    const formatarData = (data) => {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const dia = String(data.getDate()).padStart(2, "0");
      return `${ano}-${mes}-${dia}`;
    };

    return {
      dataInicio: formatarData(primeiroDia),
      dataFim: formatarData(ultimoDia),
    };
  };

  // useEffect para carregar os planos quando a modalidade mudar
  useEffect(() => {
    if (tipoBusca === "modalidade" && modalidade) {

      console.log("🔍 Carregando planos para modalidade:");
      planoService.findByModalidade(modalidade).then((res) => {
        setPlanos(res);
        setPlanoSelecionado(null);
      });
    } else if (tipoBusca === "plano") {
      console.log("🔍 Carregando todos os planos para seleção de plano");
        treinoService.getPlanosComExecucao().then((res) => {
          console.log("✅ Planos com execução recebidos:", res);
          const planosAdaptados = res.map(p => ({
            _id: p.planoId,
            nome: p.planoNome,
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

  // useEffect para buscar dados consolidados quando modalidade mudar
  // useEffect para buscar dados consolidados quando modalidade mudar
  useEffect(() => {
    const fetchConsolidado = async () => {
      if (tipoBusca === "modalidade" && modalidade) {
        try {
          setLoading(true);
          console.log(
            "🔍 Buscando dados consolidados para modalidade:",
            modalidade,
          );

          const periodo = getPeriodoMesAtual();
          console.log("📅 Período:", periodo);

          const resultado = await treinoService.getConsolidado({
            modalidadeId: modalidade,
            dataInicio: periodo.dataInicio,
            dataFim: periodo.dataFim,
          });

          // ✅ Adicionar identificador
          const resultadoComTipo = {
            ...resultado,
            tipoBusca: "modalidade",
          };

          console.log("✅ Dados consolidados recebidos:", resultadoComTipo);
          setTreinos(resultadoComTipo);
        } catch (error) {
          console.error("❌ Erro ao buscar dados consolidados:", error);
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

  // useEffect para buscar dados consolidados quando PLANO for selecionado
  useEffect(() => {
    const fetchConsolidadoPorPlano = async () => {
      if (tipoBusca === "plano" && planoSelecionado) {
        try {
          setLoading(true);
          console.log(
            "🔍 Buscando dados consolidados para plano:",
            planoSelecionado._id,
          );

          const periodo = getPeriodoMesAtual();
          console.log("📅 Período:", periodo);

          // Buscar usando a modalidade do plano selecionado
          const modalidadeDoPlano =
            planoSelecionado.modalidade?._id || planoSelecionado.modalidade;

          const resultado = await treinoService.getConsolidado({
            modalidadeId: modalidadeDoPlano,
            dataInicio: periodo.dataInicio,
            dataFim: periodo.dataFim,
          });

          console.log("📦 Resultado bruto recebido:", resultado);

          // ✅ Verificar se tem dados antes de filtrar
          if (
            !resultado ||
            (!resultado.consolidadoGeral && !resultado.analiseQuartis)
          ) {
            console.warn("⚠️ Nenhum dado retornado do backend");
            setTreinos(null);
            setLoading(false);
            return;
          }

          // Filtrar apenas o plano selecionado do resultado
          const consolidadoFiltrado =
            resultado.consolidadoGeral?.filter(
              (p) => p.planoId.toString() === planoSelecionado._id.toString(),
            ) || [];

          const quartisFiltrado =
            resultado.analiseQuartis?.filter(
              (p) => p.planoId.toString() === planoSelecionado._id.toString(),
            ) || [];

          console.log("🔍 Consolidado filtrado:", consolidadoFiltrado);
          console.log("🔍 Quartis filtrado:", quartisFiltrado);

          // ✅ Montar resultado final
          const resultadoFiltrado = {
            ...resultado,
            tipoBusca: "plano",
            planoSelecionado: planoSelecionado,
            consolidadoGeral: consolidadoFiltrado,
            analiseQuartis: quartisFiltrado,
            // ✅ Adicionar flag se tem dados
            temDados:
              consolidadoFiltrado.length > 0 || quartisFiltrado.length > 0,
          };

          console.log("✅ Dados finais a serem exibidos:", resultadoFiltrado);
          setTreinos(resultadoFiltrado);
        } catch (error) {
          console.error(
            "❌ Erro ao buscar dados consolidados do plano:",
            error,
          );
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
                  planos={planosCompletos}
                  modalidadeId={modalidade}
                  value={planoSelecionado?._id || ""}
                  onChange={(planoId) => {
                    const plano = planosCompletos.find(
                      (p) => p._id === planoId,
                    );
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
                        setTreinos(null);
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

          {renderSelectors()}

          {loading ? (
            <div className="text-center p-5">
              <Spinner color="primary" />
              <p className="mt-3">Carregando dados de performance...</p>
            </div>
          ) : treinos &&
            (treinos.consolidadoGeral?.length > 0 ||
              treinos.analiseQuartis?.length > 0) ? (
            <PerformanceVisualizacao dados={treinos} tipoBusca={tipoBusca} />
          ) : modalidade || planoSelecionado ? (
            <Card>
              <CardBody className="text-center">
                <p>Nenhum dado encontrado para o período selecionado.</p>
                <small className="text-muted">
                  {treinos && (
                    <>
                      Consolidado: {treinos.consolidadoGeral?.length || 0} |
                      Quartis: {treinos.analiseQuartis?.length || 0}
                    </>
                  )}
                </small>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody className="text-center">
                <p>
                  {tipoBusca === "modalidade"
                    ? "Selecione uma equipe/modalidade para visualizar os dados de performance."
                    : "Selecione um plano de treino para visualizar os dados de performance."}
                </p>
              </CardBody>
            </Card>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Performance;
