import React, { useState, useRef, useEffect } from "react";
import NotificationAlert from "react-notification-alert";
import SelectModalidade from "../components/Select/SelectModalidade";
import SelectAtletasParticipantes from "../components/Select/SelectAtletasParticipantes";
import SelectFundamento from "../components/Select/SelectFundamento";
import PlanoService from "../services/PlanoService";

import {
  Card,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  Table,
} from "reactstrap";

function Treino() {
  const notificationAlert = useRef();
  const planoService = new PlanoService();

  const [hoverNivel, setHoverNivel] = useState(null);

  const FAIXAS_LABEL = {
    F1_0_25: "0–25%",
    F2_26_50: "26–50%",
    F3_51_75: "51–75%",
    F4_75_89: "75–89%",
    F5_90_100: "90–100%",
  };

  const [formData, setFormData] = useState({
    nome: "",
    modalidade: "",
    fundamentos: [],
    nivelExigencia: "",
    expectativasAproveitamento: {
      positivo: {},
      negativo: {},
    },
  });

  const [participantes, setParticipantes] = useState([]);
  const [treinos, setTreinos] = useState([]);
  const [filtro, setFiltro] = useState("");

  const notify = (place, type, mensagem) => {
    const types = ["", "primary", "success", "danger", "warning", "info"];
    const options = {
      place,
      message: (
        <div>
          <b>{mensagem}</b>
        </div>
      ),
      type: types[type],
      icon: "nc-icon nc-bell-55",
      autoDismiss: 5,
    };
    notificationAlert.current.notificationAlert(options);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const EXPECTATIVA_PRESETS = {
    aprendizagem: {
      aprendizagem: {
        positivo: {
          compliance: { tipoIntervalo: "ate", faixas: ["F2_26_50"] },
          performance: { tipoIntervalo: "ate", faixas: ["F3_51_75"] },
          overPerformance: { tipoIntervalo: "ate", faixas: ["F4_75_89"] },
        },
        negativo: {
          compliance: { tipoIntervalo: "entre", faixas: ["F3_51_75"] },
          performance: { tipoIntervalo: "entre", faixas: ["F2_26_50"] },
          overPerformance: { tipoIntervalo: "ate", faixas: ["F1_0_25"] },
        },
      },

      elite: {
        positivo: {
          compliance: { tipoIntervalo: "ate", faixas: ["F5_90_100"] },
          performance: { tipoIntervalo: "ate", faixas: ["F5_90_100"] },
          overPerformance: { tipoIntervalo: "ate", faixas: ["F5_90_100"] },
        },
        negativo: {
          compliance: { tipoIntervalo: "ate", faixas: ["F1_0_25"] },
          performance: { tipoIntervalo: "ate", faixas: ["F1_0_25"] },
          overPerformance: { tipoIntervalo: "ate", faixas: ["F1_0_25"] },
        },
      },
      positivo: {
        compliance: { tipoIntervalo: "ate", faixas: ["F2_26_50"] },
        performance: { tipoIntervalo: "ate", faixas: ["F3_51_75"] },
        overPerformance: { tipoIntervalo: "ate", faixas: ["F4_75_89"] },
      },
      negativo: {
        compliance: { tipoIntervalo: "entre", faixas: ["F3_51_75"] },
        performance: { tipoIntervalo: "entre", faixas: ["F2_26_50"] },
        overPerformance: { tipoIntervalo: "ate", faixas: ["F1_0_25"] },
      },
    },

    basico: {
      positivo: {
        compliance: { tipoIntervalo: "ate", faixas: ["F2_26_50"] },
        performance: { tipoIntervalo: "entre", faixas: ["F3_51_75"] },
        overPerformance: { tipoIntervalo: "ate", faixas: ["F5_90_100"] },
      },
      negativo: {
        compliance: { tipoIntervalo: "ate", faixas: ["F4_75_89"] },
        performance: { tipoIntervalo: "entre", faixas: ["F2_26_50"] },
        overPerformance: { tipoIntervalo: "ate", faixas: ["F1_0_25"] },
      },
    },

    competitivo: {
      positivo: {
        compliance: { tipoIntervalo: "entre", faixas: ["F3_51_75"] },
        performance: { tipoIntervalo: "entre", faixas: ["F4_75_89"] },
        overPerformance: { tipoIntervalo: "ate", faixas: ["F5_90_100"] },
      },
      negativo: {
        compliance: { tipoIntervalo: "entre", faixas: ["F3_51_75"] },
        performance: { tipoIntervalo: "entre", faixas: ["F2_26_50"] },
        overPerformance: { tipoIntervalo: "ate", faixas: ["F1_0_25"] },
      },
    },

    altaPerformance: {
      positivo: {
        compliance: { tipoIntervalo: "entre", faixas: ["F4_75_89"] },
        performance: { tipoIntervalo: "ate", faixas: ["F5_90_100"] },
        overPerformance: { tipoIntervalo: "ate", faixas: ["F5_90_100"] },
      },
      negativo: {
        compliance: { tipoIntervalo: "entre", faixas: ["F2_26_50"] },
        performance: { tipoIntervalo: "ate", faixas: ["F1_0_25"] },
        overPerformance: { tipoIntervalo: "ate", faixas: ["F1_0_25"] },
      },
    },

    elite: {
      positivo: {
        compliance: { tipoIntervalo: "ate", faixas: ["F5_90_100"] },
        performance: { tipoIntervalo: "ate", faixas: ["F5_90_100"] },
        overPerformance: { tipoIntervalo: "ate", faixas: ["F5_90_100"] },
      },
      negativo: {
        compliance: { tipoIntervalo: "ate", faixas: ["F1_0_25"] },
        performance: { tipoIntervalo: "ate", faixas: ["F1_0_25"] },
        overPerformance: { tipoIntervalo: "ate", faixas: ["F1_0_25"] },
      },
    },
  };

  const renderResumoExigencia = () => {
    const nivel = hoverNivel || formData.nivelExigencia;
    if (!nivel) return null;

    const preset = EXPECTATIVA_PRESETS[nivel];
    if (!preset?.positivo || !preset?.negativo) return null;

    const linha = (titulo, bloco) => (
      <div className="training-level-block">
        <b>{titulo}</b>
        <div className="training-level-line">
          Compliance: {FAIXAS_LABEL[bloco.compliance.faixas[0]]}
        </div>
        <div className="training-level-line">
          Performance: {FAIXAS_LABEL[bloco.performance.faixas[0]]}
        </div>
        <div className="training-level-line">
          OverPerformance: {FAIXAS_LABEL[bloco.overPerformance.faixas[0]]}
        </div>
      </div>
    );

    return (
      <div className="training-level-card">
        <span className="training-level-card-title">
          Expectativa automática para o nível selecionado
        </span>

        <div className="training-level-grid">
          {linha("✔ Expectativa de acerto", preset.positivo)}
          {linha("✖ Expectativa de erro", preset.negativo)}
        </div>
      </div>
    );
  };

  const handleNivelExigencia = (nivel) => {
    setFormData((prev) => ({
      ...prev,
      nivelExigencia: nivel,
      expectativasAproveitamento: EXPECTATIVA_PRESETS[nivel] || {
        positivo: {},
        negativo: {},
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const treinoFinal = {
        ...formData,
        participantes: participantes.map((p) => ({
          id: p._id,
          nome: p.nome,
          posicao: p.posicaoPreferencial,
          camisa: p.camisa,
        })),
      };

      await planoService.create(treinoFinal);
      setTreinos((prev) => [...prev, treinoFinal]);

      notify("tr", 2, "Treino cadastrado com sucesso!");

      setFormData({
        nome: "",
        modalidade: "",
        fundamentos: [],
        nivelExigencia: "",
        expectativasAproveitamento: {
          positivo: {},
          negativo: {},
        },
      });

      setParticipantes([]);
    } catch (error) {
      console.error(error);
      notify("tr", 3, "Erro ao cadastrar treino.");
    }
  };

  useEffect(() => {
    const carregarPlanosPorModalidade = async () => {
      if (!formData.modalidade) {
        setTreinos([]);
        return;
      }

      try {
        const todos = await planoService.findAll();
        const planosFiltrados = todos.filter(
          (p) =>
            p.modalidade === formData.modalidade ||
            p.modalidade?._id === formData.modalidade
        );
        setTreinos(planosFiltrados);
      } catch (error) {
        console.error("Erro ao carregar planos:", error);
        setTreinos([]);
      }
    };

    carregarPlanosPorModalidade();
  }, [formData.modalidade]);

  const treinosFiltrados = treinos.filter((t) =>
    t.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="content">
      <NotificationAlert ref={notificationAlert} />

      <div className="training-page">
        <Card className="training-hero-card">
          <CardBody>
            <h2 className="training-page-title">Plano de Treino por Equipe</h2>
            <p className="training-page-subtitle">
              Estruture treinos por modalidade, selecione atletas participantes e defina o nível de exigência esperado para a sessão.
            </p>

            <div className="training-hero-stats">
              <div className="training-stat-card">
                <span className="training-stat-label">Modalidade selecionada</span>
                <div className="training-stat-value">
                  {formData.modalidade ? "Definida" : "Não selecionada"}
                </div>
              </div>

              <div className="training-stat-card">
                <span className="training-stat-label">Participantes</span>
                <div className="training-stat-value">{participantes.length}</div>
              </div>

              <div className="training-stat-card">
                <span className="training-stat-label">Fundamentos</span>
                <div className="training-stat-value">
                  {formData.fundamentos?.length || 0}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="training-form-card">
          <CardBody>
            <div className="training-form-header">
              <h4 className="training-section-title">Cadastrar novo treino</h4>
              <p className="training-section-subtitle">
                Preencha os dados do treino e deixe o sistema ajustar automaticamente a expectativa de aproveitamento.
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <label>Nome do Treino</label>
                    <Input
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Ex.: Treino técnico ofensivo"
                      required
                    />
                  </FormGroup>
                </Col>

                <Col md="6">
                  <SelectModalidade
                    value={formData.modalidade}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, modalidade: val }))
                    }
                  />
                </Col>
              </Row>

              <SelectAtletasParticipantes
                modalidadeId={formData.modalidade}
                selecionados={participantes}
                setSelecionados={setParticipantes}
              />

              <Row>
                <Col md="12">
                  <SelectFundamento
                    fundamentos={formData.fundamentos}
                    onChange={(listaAtualizada) =>
                      setFormData((prev) => ({
                        ...prev,
                        fundamentos: listaAtualizada,
                      }))
                    }
                  />
                </Col>
              </Row>

              <hr className="training-divider" />

              <div className="training-level-wrap">
                <h5 className="training-block-title">Expectativa de Aproveitamento</h5>

                <FormGroup>
                  <label>Nível de Exigência do Treino</label>
                  <Input
                    type="select"
                    value={formData.nivelExigencia}
                    onChange={(e) => handleNivelExigencia(e.target.value)}
                    onMouseEnter={(e) => setHoverNivel(e.target.value)}
                    onMouseLeave={() => setHoverNivel(null)}
                  >
                    <option value="">Selecione o nível</option>
                    <option value="aprendizagem">Aprendizagem</option>
                    <option value="basico">Básico</option>
                    <option value="competitivo">Competitivo</option>
                    <option value="altaPerformance">Alta Performance</option>
                    <option value="elite">Elite</option>
                  </Input>

                  {renderResumoExigencia()}
                </FormGroup>

                <p className="training-helper-text">
                  O sistema ajusta automaticamente as metas de acertos e erros conforme o nível escolhido.
                </p>
              </div>

              <div className="training-actions">
                <Button className="training-submit-btn" color="primary" type="submit">
                  Incluir treino
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>

        <Card className="training-list-card">
          <CardBody>
            <div className="training-list-header">
              <h4 className="training-section-title">Treinos cadastrados</h4>
              <p className="training-section-subtitle">
                Visualize os treinos já registrados e filtre rapidamente pelo nome.
              </p>
            </div>

            <div className="training-filter-box">
              <FormGroup>
                <label>Filtrar por nome</label>
                <Input
                  type="text"
                  placeholder="Digite um nome para filtrar"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </FormGroup>
            </div>

            <div className="training-table-wrap">
              <Table responsive className="training-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Fundamentos</th>
                    <th>Participantes</th>
                  </tr>
                </thead>

                <tbody>
                  {treinosFiltrados.map((treino, idx) => (
                    <tr key={idx}>
                      <td>{treino.nome}</td>

                      <td>
                        {treino.fundamentos?.length ? (
                          <div className="training-tag-list">
                            {treino.fundamentos.map((fundamento, index) => (
                              <span className="training-tag" key={index}>
                                {fundamento}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="training-tag training-tag-neutral">-</span>
                        )}
                      </td>

                      <td>
                        {treino.participantes?.length ? (
                          <div className="training-tag-list">
                            {treino.participantes
                              .map((p) => p.nome)
                              .filter(Boolean)
                              .map((nome, index) => (
                                <span
                                  className="training-tag training-tag-neutral"
                                  key={index}
                                >
                                  {nome}
                                </span>
                              ))}
                          </div>
                        ) : (
                          <span className="training-tag training-tag-neutral">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Treino;