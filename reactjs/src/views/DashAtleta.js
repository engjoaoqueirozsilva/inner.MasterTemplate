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
  Table,
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
  // Modal de confirmação
  const [modalCancelar, setModalCancelar] = useState(false);
  const [modalFinalizar, setModalFinalizar] = useState(false);

  // Timer
  const [timerInicio, setTimerInicio] = useState(null);
  const notify = (place, color, message) => {
    const type = ["", "primary", "success", "danger", "warning", "info"][color] || "info";
    const options = {
      place,
      message: (<b>{message}</b>),
      type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7
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

    // Resetar timer
    setTimerInicio(null);
   

    localStorage.removeItem("avaliacoes");
    setModalCancelar(false);
  };

  const handleStartTreino = () => {
    setShowStartButton(true);
    setShowCancelButton(false);
    setShowEndButton(false);

    //TODO:Iniciar timer para capturar em que momento do treino cada execução foi feita
    setTimerInicio(Date.now());
   
  };

  const registrarJogada = (atleta, fundamento, nivel) => {
      const timestampAtual = timerInicio ? Math.floor((Date.now() - timerInicio) / 1000) : 0;

      const treinoEmExec = showStartButton === true;
      if(treinoEmExec){
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
                timestamp: timestampAtual
              }
            ],
          },
        };
      });
    }
    else{      
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
      // Calcular duração total do treino
    const duracaoTotal = timerInicio ? Math.floor((Date.now() - timerInicio) / 1000) : 0;
    
    const treinoPayload = {
      treinoId: `TREINO-${Math.floor(Math.random() * 1000)}`,
      data: new Date().toISOString(),
      modalidade: planoSelecionado?.modalidade?._id || planoSelecionado?.modalidade,
      plano: planoSelecionado?._id,
      responsavel: "Sistema Automático",
      local: "Quadra A",
      duracaoTreino: duracaoTotal,  // ✅ Adicionar duração
      atletas: Object.keys(avaliacoes).map((nome) => ({
        nome,
        avaliacoes: Object.entries(avaliacoes[nome]).map(([fundamento, conceitos]) => ({
          fundamento,
          conceitos  // ✅ Agora são objetos {nivel, timestamp}
        }))
      })),
      observacoes: `Treino do plano ${planoSelecionado?.nome || ""}`,
      finalizado: true,
    };

    console.log("📋 Payload do Treino:", JSON.stringify(treinoPayload, null, 2));

    try {
      await treinoService.create(treinoPayload);
           
      console.log("📤 Enviado:", treinoPayload);
      
      // Resetar tudo após envio
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

      // Resetar timer
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

  // Componente separado para o Timer (evita re-renders desnecessários)
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
      return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segs).padStart(2, "0")}`;
    };

    if (!timerInicio) return null;

    return (
      <div className="text-center mx-3">
        <small className="text-muted d-block">Tempo de Treino</small>
        <strong style={{ fontSize: "1.2em", color: "#51cbce" }}>
          {formatarTempo(tempoDecorrido)}
        </strong>
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
          Tem certeza que deseja cancelar este treino? Todos os dados não salvos
          serão perdidos.
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
        <ModalBody>
          Tem certeza que deseja Finalizar este treino? 
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalFinalizar(false)}>
            Não
          </Button>
          <Button color="danger" onClick={confirmarFinalizacao}>
            Sim, Finalizar
          </Button>
        </ModalFooter>
      </Modal>
      <Card>
        <CardBody>
          <Row className="mb-3">
            <Col md="6">
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
            <Col md="6">
              <Card>
                <CardBody>
                  <SelectPlano
                    planos={planos}
                    modalidadeId={modalidade}
                    value={planoSelecionado?._id || ""}
                    onChange={(planoId) => {
                      const plano = planos.find((p) => p._id === planoId);
                      if (plano) iniciarTreino(plano);
                    }}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Row>
        <Col md="12">
          <Card>
            <CardBody>
              <Row>
                <Col md="6" className="filtro-bloco">
                  <div className="filtro-titulo">Filtrar por Atletas:</div>
                  <div className="filtro-container">
                    {atletas.map((nome, i) => (
                      <div
                        key={i}
                        className={`filtro-botao ${filtroAtleta.includes(nome) ? "ativo" : ""}`}
                        onClick={() =>
                          setFiltroAtleta((prev) =>
                            prev.includes(nome)
                              ? prev.filter((n) => n !== nome)
                              : [...prev, nome],
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
                          setFiltroFundamento((prev) =>
                            prev.includes(fund)
                              ? prev.filter((f) => f !== fund)
                              : [...prev, fund],
                          )
                        }
                      >
                        {fund}
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">Análise de Performance em Treino</CardTitle>
              <TimerDisplay timerInicio={timerInicio} />
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  color="secondary"
                  onClick={cancelarTreino}
                  hidden={showCancelButton}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  onClick={finalizarTreino}
                  hidden={showEndButton}
                >
                  Finalizar
                </Button>
                <Button
                  size="sm"
                  color="success"
                  onClick={handleStartTreino}
                  hidden={showStartButton}
                >
                  Iniciar
                </Button>
              </div>
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
                      .filter((f) => filtroFundamento.includes(f))
                      .map((fundamento, idx) => (
                        <th key={idx}>{fundamento}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {atletas
                    .filter((a) => filtroAtleta.includes(a))
                    .map((atleta, index) => (
                      <tr key={index}>
                        <td>{atleta}</td>
                        {fundamentos
                          .filter((f) => filtroFundamento.includes(f))
                          .map((fundamento, idx) => {
                            const total =
                              avaliacoes[atleta]?.[fundamento]?.length || 0;

                            return (
                              <td key={`${index}-${idx}`}>
                                <NivelBotaoSet
                                  atleta={atleta}
                                  fundamento={fundamento}
                                  cor={cores[idx]}
                                  onClick={registrarJogada}
                                />
                                <div className="d-flex justify-content-between align-items-center mt-1 gap-1">
                                  <small className="text-muted">
                                    Total: {total}
                                  </small>
                                  <Button
                                    size="sm"
                                    color="danger"
                                    outline
                                    disabled={total === 0}
                                    onClick={() =>
                                      desfazerUltima(atleta, fundamento)
                                    }
                                  >
                                    Desfazer
                                  </Button>
                                  <Button
                                    size="sm"
                                    color="secondary"
                                    outline
                                    disabled={total === 0}
                                    onClick={() =>
                                      limparFundamento(atleta, fundamento)
                                    }
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
        </Col>
      </Row>

      <GraficoPorFundamento
        fundamentos={fundamentos}
        filtroFundamento={filtroFundamento} // Importante para o cálculo interno
        atletas={atletas}
        filtroAtleta={filtroAtleta}
        avaliacoes={avaliacoes}
        niveis={niveis}
      />
    </div>
  );
}

export default DashAtleta;
