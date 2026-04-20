import React, { useEffect, useState, useMemo, useRef } from "react";
import { Pie } from "react-chartjs-2";
import TreinoService from "../services/TreinoService";
import PlanoService from "../services/PlanoService";
import SelectModalidade from "../components/Select/SelectModalidade";
import SelectPlano from "../components/Select/SelectPlano";
import GraficoPorFundamento from "../components/Charts/GraficoPorFundamento";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import NotificationAlert from "react-notification-alert";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
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

  const notificationAlert = useRef();

  const niveis = ["A", "B", "C", "D", "E", "F"];
  const cores = [
    "warning",
    "primary",
    "danger",
    "success",
    "default",
    "warning",
  ];

  const [showStartButton, setShowStartButton] = useState(false);
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [showEndButton, setShowEndButton] = useState(false);

  const [modalCancelar, setModalCancelar] = useState(false);
  const [modalFinalizar, setModalFinalizar] = useState(false);

  const [timerInicio, setTimerInicio] = useState(null);

  const treinoEmExecucao = showStartButton === true;

  const notify = (place, color, message) => {
    const type =
      ["", "primary", "success", "danger", "warning", "info"][color] || "info";
    const options = {
      place,
      message: <b>{message}</b>,
      type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlert.current.notificationAlert(options);
  };

  useEffect(() => {
    setShowStartButton(true);
    setShowCancelButton(true);
    setShowEndButton(true);
  }, []);

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

    setShowStartButton(false);

    setPlanoSelecionado(plano);
    setAtletas(plano.participantes.map((p) => p.nome));
    setFundamentos(plano.fundamentos);

    setFiltroAtleta(plano.participantes.map((p) => p.nome));
    setFiltroFundamento(plano.fundamentos);
    setAvaliacoes({});
    localStorage.removeItem("avaliacoes");
  };

  const cancelarTreino = () => {
    setModalCancelar(true);
  };

  const finalizarTreino = () => {
    setModalFinalizar(true);
  };

  const confirmarFinalizacao = () => {
    enviarParaAPI();
    setModalFinalizar(false);
  };

  const confirmarCancelamento = () => {
    setModalidade("");
    setPlanos([]);
    setPlanoSelecionado(null);
    setAtletas([]);
    setFundamentos([]);
    setFiltroAtleta([]);
    setFiltroFundamento([]);
    setAvaliacoes({});
    setShowStartButton(true);
    setShowCancelButton(true);
    setShowEndButton(true);
    setTimerInicio(null);
    localStorage.removeItem("avaliacoes");
    setModalCancelar(false);
  };

  const handleStartTreino = () => {
    setShowStartButton(true);
    setShowCancelButton(false);
    setShowEndButton(false);
    setTimerInicio(Date.now());
  };

  const registrarJogada = (atleta, fundamento, nivel) => {
    const timestampAtual = timerInicio
      ? Math.floor((Date.now() - timerInicio) / 1000)
      : 0;

    const treinoEmExec = showStartButton === true;
    if (treinoEmExec) {
      setAvaliacoes((prev) => {
        const jogadasPrevias = prev[atleta]?.[fundamento] || [];
        return {
          ...prev,
          [atleta]: {
            ...(prev[atleta] || {}),
            [fundamento]: [
              ...jogadasPrevias,
              {
                nivel,
                timestamp: timestampAtual,
              },
            ],
          },
        };
      });
    } else {
      notify("tr", 3, "Inicie o treino para registrar as execuções.");
    }
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
    const duracaoTotal = timerInicio
      ? Math.floor((Date.now() - timerInicio) / 1000)
      : 0;

    const treinoPayload = {
      treinoId: `TREINO-${Math.floor(Math.random() * 1000)}`,
      data: new Date().toISOString(),
      modalidade: planoSelecionado?.modalidade?._id || planoSelecionado?.modalidade,
      plano: planoSelecionado?._id,
      responsavel: "Sistema Automático",
      local: "Quadra A",
      duracaoTreino: duracaoTotal,
      atletas: Object.keys(avaliacoes).map((nome) => ({
        nome,
        avaliacoes: Object.entries(avaliacoes[nome]).map(
          ([fundamento, conceitos]) => ({
            fundamento,
            conceitos,
          })
        ),
      })),
      observacoes: `Treino do plano ${planoSelecionado?.nome || ""}`,
      finalizado: true,
    };

    console.log("📋 Payload do Treino:", JSON.stringify(treinoPayload, null, 2));

    try {
      await treinoService.create(treinoPayload);

      console.log("📤 Enviado:", treinoPayload);

      setAvaliacoes({});
      setModalidade("");
      setPlanos([]);
      setPlanoSelecionado(null);
      setAtletas([]);
      setFundamentos([]);
      setFiltroAtleta([]);
      setFiltroFundamento([]);
      setAvaliacoes({});
      setShowStartButton(true);
      setShowCancelButton(true);
      setShowEndButton(true);
      setTimerInicio(null);

      localStorage.removeItem("avaliacoes");
    } catch (err) {
      notify("tr", 3, `❌ Erro ao enviar procure o suporte`);
    }
  };

  const totaisFundamento = useMemo(() => {
    return fundamentos.map((fundamento) => {
      if (!filtroFundamento.includes(fundamento)) return 0;
      return atletas.reduce((acc, atleta) => {
        if (!filtroAtleta.includes(atleta)) return acc;
        return acc + (avaliacoes[atleta]?.[fundamento]?.length || 0);
      }, 0);
    });
  }, [fundamentos, filtroFundamento, atletas, filtroAtleta, avaliacoes]);

  const totalGeral = useMemo(() => {
    return atletas.reduce((accAtleta, atleta) => {
      if (!filtroAtleta.includes(atleta)) return accAtleta;

      const totalAtleta = fundamentos.reduce((accFund, fundamento) => {
        if (!filtroFundamento.includes(fundamento)) return accFund;
        return accFund + (avaliacoes[atleta]?.[fundamento]?.length || 0);
      }, 0);

      return accAtleta + totalAtleta;
    }, 0);
  }, [atletas, fundamentos, filtroAtleta, filtroFundamento, avaliacoes]);

  const totalAtletasVisiveis = atletas.filter((a) => filtroAtleta.includes(a)).length;
  const totalFundamentosVisiveis = fundamentos.filter((f) =>
    filtroFundamento.includes(f)
  ).length;

  const TimerDisplay = React.memo(({ timerInicio }) => {
    const [tempoDecorrido, setTempoDecorrido] = useState(0);

    useEffect(() => {
      let interval;
      if (timerInicio) {
        interval = setInterval(() => {
          setTempoDecorrido(Math.floor((Date.now() - timerInicio) / 1000));
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [timerInicio]);

    const formatarTempo = (segundos) => {
      const horas = Math.floor(segundos / 3600);
      const minutos = Math.floor((segundos % 3600) / 60);
      const segs = segundos % 60;
      return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(
        2,
        "0"
      )}:${String(segs).padStart(2, "0")}`;
    };

    if (!timerInicio) {
      return (
        <div className="execution-timer-box">
          <span className="execution-timer-label">Tempo de treino</span>
          <div className="execution-timer-value">00:00:00</div>
        </div>
      );
    }

    return (
      <div className="execution-timer-box">
        <span className="execution-timer-label">Tempo de treino</span>
        <div className="execution-timer-value">{formatarTempo(tempoDecorrido)}</div>
      </div>
    );
  });

  return (
    <div className="content">
      <NotificationAlert ref={notificationAlert} />

      <Modal isOpen={modalCancelar} toggle={() => setModalCancelar(false)}>
        <ModalHeader toggle={() => setModalCancelar(false)}>
          Confirmar Cancelamento
        </ModalHeader>
        <ModalBody>
          Tem certeza que deseja cancelar este treino? Todos os dados não salvos serão perdidos.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalCancelar(false)}>
            Não
          </Button>
          <Button color="danger" onClick={confirmarCancelamento}>
            Sim, Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalFinalizar} toggle={() => setModalFinalizar(false)}>
        <ModalHeader toggle={() => setModalFinalizar(false)}>
          Confirmar Finalização
        </ModalHeader>
        <ModalBody>Tem certeza que deseja Finalizar este treino?</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalFinalizar(false)}>
            Não
          </Button>
          <Button color="danger" onClick={confirmarFinalizacao}>
            Sim, Finalizar
          </Button>
        </ModalFooter>
      </Modal>

      <div className="execution-page">
        <Card className="execution-hero-card">
          <CardBody>
            <h2 className="execution-page-title">Execução de Treino</h2>
            <p className="execution-page-subtitle">
              Selecione a equipe, carregue o plano e registre as execuções dos atletas com mais clareza e velocidade.
            </p>

            <div className="execution-hero-grid">
              <div className="execution-hero-field">
                <span className="execution-hero-field-label">Equipe</span>
                <SelectModalidade
                  value={modalidade}
                  onChange={(val) => {
                    setModalidade(val);
                    setPlanoSelecionado(null);
                  }}
                />
              </div>

              <div className="execution-hero-field">
                <span className="execution-hero-field-label">Plano de treino</span>
                <SelectPlano
                  planos={planos}
                  modalidadeId={modalidade}
                  value={planoSelecionado?._id || ""}
                  onChange={(planoId) => {
                    const plano = planos.find((p) => p._id === planoId);
                    if (plano) iniciarTreino(plano);
                  }}
                />
              </div>

              <div className="execution-hero-action">
                <div className="execution-status-wrap">
                  <div
                    className={`execution-status-badge ${
                      treinoEmExecucao ? "is-running" : "is-waiting"
                    }`}
                  >
                    {treinoEmExecucao ? "Treino em andamento" : "Treino aguardando início"}
                  </div>
                  <TimerDisplay timerInicio={timerInicio} />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="execution-filters-card">
          <CardBody>
            <div className="execution-filters-header">
              <h4 className="execution-section-title">Filtros ativos</h4>
              <p className="execution-section-subtitle">
                Refine a visualização por atleta e fundamento para acelerar o registro da sessão.
              </p>
            </div>

            <div className="execution-filter-block">
              <span className="execution-filter-label">Atletas</span>
              <div className="execution-chips">
                {atletas.map((nome, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`execution-chip ${
                      filtroAtleta.includes(nome) ? "is-active" : ""
                    }`}
                    onClick={() =>
                      setFiltroAtleta((prev) =>
                        prev.includes(nome)
                          ? prev.filter((n) => n !== nome)
                          : [...prev, nome]
                      )
                    }
                  >
                    {nome}
                  </button>
                ))}
              </div>
            </div>

            <div className="execution-filter-block">
              <span className="execution-filter-label">Fundamentos</span>
              <div className="execution-chips">
                {fundamentos.map((fund, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`execution-chip ${
                      filtroFundamento.includes(fund) ? "is-active" : ""
                    }`}
                    onClick={() =>
                      setFiltroFundamento((prev) =>
                        prev.includes(fund)
                          ? prev.filter((f) => f !== fund)
                          : [...prev, fund]
                      )
                    }
                  >
                    {fund}
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="execution-actions-card">
          <CardBody>
            <div className="execution-actions-left">
              <h3 className="execution-actions-title">Registro de Performance</h3>
              <p className="execution-actions-subtitle">
                {totalAtletasVisiveis} atleta(s) visível(is), {totalFundamentosVisiveis} fundamento(s) ativo(s) e {totalGeral} execução(ões) registrada(s).
              </p>
            </div>

            <div className="execution-actions-right">
              <Button
                color="secondary"
                onClick={cancelarTreino}
                hidden={showCancelButton}
                className="execution-btn-secondary"
              >
                Cancelar treino
              </Button>

              <Button
                color="danger"
                onClick={finalizarTreino}
                hidden={showEndButton}
                className="execution-btn-danger"
              >
                Finalizar treino
              </Button>

              <Button
                color="success"
                onClick={handleStartTreino}
                hidden={showStartButton}
                className="execution-btn-primary"
              >
                Iniciar treino
              </Button>
            </div>
          </CardBody>
        </Card>

        {atletas.filter((a) => filtroAtleta.includes(a)).length === 0 ||
        fundamentos.filter((f) => filtroFundamento.includes(f)).length === 0 ? (
          <Card className="execution-athlete-card">
            <CardBody>
              <div className="execution-empty">
                <h5 className="execution-empty-title">Nada para exibir no momento</h5>
                <p className="execution-empty-text">
                  Selecione ao menos um atleta e um fundamento para começar a registrar as execuções.
                </p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="execution-athletes-grid">
            {atletas
              .filter((a) => filtroAtleta.includes(a))
              .map((atleta, index) => {
                const totalAtleta = fundamentos
                  .filter((f) => filtroFundamento.includes(f))
                  .reduce((acc, fundamento) => {
                    return acc + (avaliacoes[atleta]?.[fundamento]?.length || 0);
                  }, 0);

                return (
                  <Card className="execution-athlete-card" key={index}>
                    <CardBody>
                      <div className="execution-athlete-header">
                        <h4 className="execution-athlete-name">{atleta}</h4>
                        <span className="execution-athlete-badge">
                          {totalAtleta} execução(ões) registradas
                        </span>
                      </div>

                      <div className="execution-fundamentos-grid">
                        {fundamentos
                          .filter((f) => filtroFundamento.includes(f))
                          .map((fundamento, idx) => {
                            const total =
                              avaliacoes[atleta]?.[fundamento]?.length || 0;

                            return (
                              <div
                                className="execution-fundamento-card"
                                key={`${index}-${idx}`}
                              >
                                <div className="execution-fundamento-top">
                                  <h5 className="execution-fundamento-title">
                                    {fundamento}
                                  </h5>
                                  <span className="execution-fundamento-total">
                                    Total: {total}
                                  </span>
                                </div>

                                <NivelBotaoSet
                                  atleta={atleta}
                                  fundamento={fundamento}
                                  cor={cores[idx]}
                                  onClick={registrarJogada}
                                />

                                <div className="execution-fundamento-actions">
                                  <Button
                                    size="sm"
                                    color="danger"
                                    outline
                                    disabled={total === 0}
                                    onClick={() => desfazerUltima(atleta, fundamento)}
                                    className="execution-mini-btn"
                                  >
                                    Desfazer
                                  </Button>

                                  <Button
                                    size="sm"
                                    color="secondary"
                                    outline
                                    disabled={total === 0}
                                    onClick={() => limparFundamento(atleta, fundamento)}
                                    className="execution-mini-btn"
                                  >
                                    Limpar
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
          </div>
        )}

        <Card className="execution-chart-card">
          <CardHeader>
            <CardTitle tag="h5">Jogadas por Fundamento</CardTitle>
            <p className="card-category">Distribuição total registrada</p>
          </CardHeader>
          <CardBody style={{ height: "320px", position: "relative" }}>
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

        <GraficoPorFundamento
          fundamentos={fundamentos}
          filtroFundamento={filtroFundamento}
          atletas={atletas}
          filtroAtleta={filtroAtleta}
          avaliacoes={avaliacoes}
          niveis={niveis}
        />
      </div>
    </div>
  );
}

export default DashAtleta;