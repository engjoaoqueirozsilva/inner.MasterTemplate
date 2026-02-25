  import React, { useState, useRef, useEffect } from "react";
  import NotificationAlert from "react-notification-alert";
  import SelectModalidade from "../components/Select/SelectModalidade";
  import SelectAtletasParticipantes from "../components/Select/SelectAtletasParticipantes";
  import SelectFundamento from "../components/Select/SelectFundamento";
  import PlanoService from "../services/PlanoService";

  import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
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

    /*
    |--------------------------------------------------------------------------
    | Presets de Expectativa (UX Inteligente)
    |--------------------------------------------------------------------------
    */

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

    const renderTooltip = () => {
      if (!hoverNivel) return null;
      const preset = EXPECTATIVA_PRESETS[hoverNivel];
      if (!preset) return null;

      const linha = (titulo, bloco) => (
        <>
          <b>{titulo}</b>
          <br />
          Compliance: {FAIXAS_LABEL[bloco.compliance.faixas[0]]}
          <br />
          Performance: {FAIXAS_LABEL[bloco.performance.faixas[0]]}
          <br />
          OverPerformance: {FAIXAS_LABEL[bloco.overPerformance.faixas[0]]}
          <br />
          <br />
        </>
      );

      return (
        <div
          style={{
            background: "#1e1e2f",
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "12px",
            marginTop: "8px",
          }}
        >
          {linha("✔ Expectativa de Acerto", preset.positivo)}
          {linha("✖ Expectativa de Erro", preset.negativo)}
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
              p.modalidade?._id === formData.modalidade,
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
      t.nome.toLowerCase().includes(filtro.toLowerCase()),
    );

    return (
      <div className="content">
        <NotificationAlert ref={notificationAlert} />

        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Plano de Treino por Equipe</CardTitle>
              </CardHeader>

              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Nome do Treino</label>
                        <Input
                          name="nome"
                          value={formData.nome}
                          onChange={handleChange}
                          placeholder="Nome do Treino"
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

                  <hr />

                  <CardTitle tag="h5">Expectativa de Aproveitamento</CardTitle>

                  <FormGroup>
                    <label>Nível de Exigência do Treino</label>
                    <Input
                      type="select"
                      value={formData.nivelExigencia}
                      onChange={(e) => handleNivelExigencia(e.target.value)}
                      onMouseEnter={(e)=>setHoverNivel(e.target.value)}
                      onMouseLeave={()=>setHoverNivel(null)}
                    >
                      <option value="">Selecione o nível</option>
                      <option value="aprendizagem">Aprendizagem</option>
                      <option value="basico">Básico</option>
                      <option value="competitivo">Competitivo</option>
                      <option value="altaPerformance">Alta Performance</option>
                      <option value="elite">Elite</option>
                    </Input>
                    {renderTooltip()}
                  </FormGroup>

                  <p style={{ fontSize: "13px", color: "#6c757d" }}>
                    O sistema ajusta automaticamente as metas de acertos e erros
                    conforme o nível escolhido.
                  </p>

                  <Row>
                    <div className="update ml-auto mr-auto">
                      <Button className="btn-round" color="primary" type="submit">
                        Incluir
                      </Button>
                    </div>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Treinos Cadastrados</CardTitle>
              </CardHeader>

              <CardBody>
                <FormGroup>
                  <label>Filtrar por nome</label>
                  <Input
                    type="text"
                    placeholder="Digite um nome para filtrar"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                  />
                </FormGroup>

                <Table responsive>
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
                        <td>{treino.fundamentos?.join(", ") || "-"}</td>
                        <td>
                          {treino.participantes
                            ?.map((p) => p.nome)
                            .filter(Boolean)
                            .join(", ") || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  export default Treino;
