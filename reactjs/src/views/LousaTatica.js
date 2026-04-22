import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Text,
  Arrow,
  Arc,
} from "react-konva";

import SelectModalidade from "../components/Select/SelectModalidade";
import AtletasService from "../services/AtletasService";
import LousaTaticaService from "../services/LousaTaticaService";

const TOOL_SELECT = "select";
const TOOL_OPPONENT = "opponent";
const TOOL_BALL = "ball";
const TOOL_TEXT = "text";
const TOOL_ARROW = "arrow";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;

function LousaTatica(props) {
  const notificationAlert = useRef(null);
  const stageRef = useRef(null);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [categoria, setCategoria] = useState("");
  const [layoutQuadra, setLayoutQuadra] = useState("futsal");
  const [tool, setTool] = useState(TOOL_SELECT);
  const [modoFoco, setModoFoco] = useState(false);

  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [historico, setHistorico] = useState([]);
  const [lousaAtualId, setLousaAtualId] = useState(null);

  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingAtletas, setLoadingAtletas] = useState(false);
  const [drawingArrow, setDrawingArrow] = useState(null);

  const [atletasDisponiveis, setAtletasDisponiveis] = useState([]);

  const clubeId = localStorage.getItem("clubeId");
  const nomeUsuario = localStorage.getItem("nome") || "";
  const userId = localStorage.getItem("userId") || "";

  const notify = (place, color, message) => {
    const type =
      ["", "primary", "success", "danger", "warning", "info"][color] || "info";

    notificationAlert.current?.notificationAlert({
      place,
      message: (
        <div>
          <b>{message}</b>
        </div>
      ),
      type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 5,
    });
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  useEffect(() => {
    carregarAtletas();
  }, [modalidade]);

  const carregarHistorico = async () => {
    try {
      setLoadingHistory(true);
      const result = await LousaTaticaService.findAll({ clubeId });
      setHistorico(result || []);
    } catch (error) {
      console.error(error);
      notify("tr", 3, "Erro ao carregar histórico da lousa tática.");
    } finally {
      setLoadingHistory(false);
    }
  };

  const carregarAtletas = async () => {
    try {
      if (!modalidade) {
        setAtletasDisponiveis([]);
        return;
      }

      setLoadingAtletas(true);
      const result = await AtletasService.findByModalidade(modalidade);
      setAtletasDisponiveis(result || []);
    } catch (error) {
      console.error(error);
      notify("tr", 3, "Erro ao carregar atletas da modalidade.");
    } finally {
      setLoadingAtletas(false);
    }
  };

  const novoId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const limparTela = () => {
    setNome("");
    setDescricao("");
    setCategoria("");
    setModalidade("");
    setLayoutQuadra("futsal");
    setElements([]);
    setSelectedId(null);
    setLousaAtualId(null);
    setDrawingArrow(null);
    setAtletasDisponiveis([]);
  };

  const alternarModoFoco = () => {
    if (!modoFoco && props?.sidebarOpen && props?.toggleSidebar) {
      props.toggleSidebar();
    }

    setModoFoco((prev) => !prev);
  };

  const adicionarAtletaAoCanvas = (atleta) => {
    const jaExiste = elements.some(
      (el) => el.type === "athlete" && el.atletaId === atleta._id
    );

    if (jaExiste) {
      notify("tr", 4, "Esse atleta já foi adicionado à lousa.");
      return;
    }

    const novoAtleta = {
      id: novoId(),
      type: "athlete",
      atletaId: atleta._id,
      nome: atleta.nome,
      camisa: atleta.camisa || "",
      label: atleta.camisa || atleta.nome?.slice(0, 2)?.toUpperCase() || "AT",
      team: "A",
      x: 220 + Math.floor(Math.random() * 80),
      y: 220 + Math.floor(Math.random() * 120),
      color: "#2563eb",
      size: 18,
      draggable: true,
    };

    setElements((prev) => [...prev, novoAtleta]);
  };

  const handleStageMouseDown = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();

    if (tool === TOOL_SELECT) {
      if (clickedOnEmpty) {
        setSelectedId(null);
      }
      return;
    }

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const { x, y } = pointer;

    if (tool === TOOL_OPPONENT) {
      const opponent = {
        id: novoId(),
        type: "opponent",
        label: "ADV",
        camisa: "",
        x,
        y,
        team: "B",
        color: "#ef4444",
        size: 18,
        draggable: true,
      };
      setElements((prev) => [...prev, opponent]);
      return;
    }

    if (tool === TOOL_BALL) {
      const ball = {
        id: novoId(),
        type: "ball",
        x,
        y,
        color: "#111827",
        size: 8,
        draggable: true,
      };
      setElements((prev) => [...prev, ball]);
      return;
    }

    if (tool === TOOL_TEXT) {
      const text = window.prompt("Digite o texto da lousa:");
      if (!text) return;

      const textEl = {
        id: novoId(),
        type: "text",
        x,
        y,
        text,
        color: "#172033",
        fontSize: 18,
        draggable: true,
      };
      setElements((prev) => [...prev, textEl]);
      return;
    }

    if (tool === TOOL_ARROW) {
      setDrawingArrow({
        id: novoId(),
        type: "arrow",
        points: [x, y, x, y],
        color: "#f59e0b",
        strokeWidth: 4,
        draggable: false,
      });
    }
  };

  const handleStageMouseMove = (e) => {
    if (!drawingArrow) return;

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const { x, y } = pointer;

    setDrawingArrow((prev) => ({
      ...prev,
      points: [prev.points[0], prev.points[1], x, y],
    }));
  };

  const handleStageMouseUp = () => {
    if (!drawingArrow) return;

    setElements((prev) => [...prev, drawingArrow]);
    setDrawingArrow(null);
  };

  const updateElementPosition = (id, x, y) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  };

  const handleElementClick = (id) => {
    if (tool === TOOL_SELECT) {
      setSelectedId(id);
    }
  };

  const removerSelecionado = () => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const exportarImagem = () => {
    if (!stageRef.current) return;

    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `${nome || "lousa-tatica"}.png`;
    link.href = uri;
    link.click();
  };

  const abrirLousa = (lousa) => {
    setLousaAtualId(lousa._id);
    setNome(lousa.nome || "");
    setDescricao(lousa.descricao || "");
    setCategoria(lousa.categoria || "");
    setModalidade(lousa.modalidade?._id || lousa.modalidade || "");
    setLayoutQuadra(lousa?.background?.tipo || "futsal");
    setElements(lousa.elements || []);
    setSelectedId(null);
    setDrawingArrow(null);
    notify("tr", 2, "Lousa carregada com sucesso.");
  };

  const salvarLousa = async () => {
    if (!nome.trim()) {
      notify("tr", 4, "Informe o nome da lousa.");
      return;
    }

    if (!modalidade) {
      notify("tr", 4, "Selecione a modalidade.");
      return;
    }

    const payload = {
      nome,
      descricao,
      categoria,
      modalidade,
      clubeId,
      tags: [],
      background: {
        tipo: layoutQuadra,
        variante: "completo",
      },
      canvas: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        zoom: 1,
      },
      elements,
      criadoPor: {
        userId,
        nome: nomeUsuario,
      },
    };

    try {
      if (lousaAtualId) {
        await LousaTaticaService.update(lousaAtualId, payload);
        notify("tr", 2, "Lousa atualizada com sucesso.");
      } else {
        const result = await LousaTaticaService.create(payload);
        setLousaAtualId(result?._id || null);
        notify("tr", 2, "Lousa salva com sucesso.");
      }

      carregarHistorico();
    } catch (error) {
      console.error(error);
      notify("tr", 3, "Erro ao salvar lousa tática.");
    }
  };

  const selectedElement = useMemo(
    () => elements.find((el) => el.id === selectedId) || null,
    [elements, selectedId]
  );

  const atualizarTextoSelecionado = () => {
    if (!selectedElement || selectedElement.type !== "text") return;

    const novoTexto = window.prompt(
      "Editar texto:",
      selectedElement.text || ""
    );
    if (!novoTexto) return;

    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedId
          ? {
              ...el,
              text: novoTexto,
            }
          : el
      )
    );
  };

  const fieldColor = "#cbd5e1";
  const outerX = 40;
  const outerY = 40;
  const outerW = CANVAS_WIDTH - 80;
  const outerH = CANVAS_HEIGHT - 80;
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2;

  const renderFutsal = () => (
    <>
      <Rect
        x={0}
        y={0}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        fill="#f8fbfd"
        cornerRadius={12}
      />
      <Rect
        x={outerX}
        y={outerY}
        width={outerW}
        height={outerH}
        stroke={fieldColor}
        strokeWidth={2}
        cornerRadius={8}
      />
      <Line
        points={[centerX, outerY, centerX, outerY + outerH]}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Circle
        x={centerX}
        y={centerY}
        radius={55}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Rect
        x={outerX}
        y={centerY - 90}
        width={120}
        height={180}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Rect
        x={outerX + outerW - 120}
        y={centerY - 90}
        width={120}
        height={180}
        stroke={fieldColor}
        strokeWidth={2}
      />
    </>
  );

  const renderFutebol = () => (
    <>
      <Rect
        x={0}
        y={0}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        fill="#f8fbfd"
        cornerRadius={12}
      />
      <Rect
        x={outerX}
        y={outerY}
        width={outerW}
        height={outerH}
        stroke={fieldColor}
        strokeWidth={2}
        cornerRadius={8}
      />
      <Line
        points={[centerX, outerY, centerX, outerY + outerH]}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Circle
        x={centerX}
        y={centerY}
        radius={60}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Rect
        x={outerX}
        y={centerY - 140}
        width={170}
        height={280}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Rect
        x={outerX}
        y={centerY - 70}
        width={60}
        height={140}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Rect
        x={outerX + outerW - 170}
        y={centerY - 140}
        width={170}
        height={280}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Rect
        x={outerX + outerW - 60}
        y={centerY - 70}
        width={60}
        height={140}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Circle x={outerX + 120} y={centerY} radius={3} fill={fieldColor} />
      <Circle
        x={outerX + outerW - 120}
        y={centerY}
        radius={3}
        fill={fieldColor}
      />
    </>
  );

  const renderBasquete = () => (
    <>
      <Rect
        x={0}
        y={0}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        fill="#f8fbfd"
        cornerRadius={12}
      />
      <Rect
        x={outerX}
        y={outerY}
        width={outerW}
        height={outerH}
        stroke={fieldColor}
        strokeWidth={2}
        cornerRadius={8}
      />
      <Line
        points={[centerX, outerY, centerX, outerY + outerH]}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Circle
        x={centerX}
        y={centerY}
        radius={60}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Rect
        x={outerX}
        y={centerY - 95}
        width={160}
        height={190}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Line
        points={[outerX + 160, centerY - 95, outerX + 160, centerY + 95]}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Arc
        x={outerX + 160}
        y={centerY}
        innerRadius={110}
        outerRadius={110}
        angle={120}
        rotation={-60}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Rect
        x={outerX + outerW - 160}
        y={centerY - 95}
        width={160}
        height={190}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Line
        points={[
          outerX + outerW - 160,
          centerY - 95,
          outerX + outerW - 160,
          centerY + 95,
        ]}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Arc
        x={outerX + outerW - 160}
        y={centerY}
        innerRadius={110}
        outerRadius={110}
        angle={120}
        rotation={120}
        stroke={fieldColor}
        strokeWidth={2}
      />
    </>
  );

  const renderVolei = () => (
    <>
      <Rect
        x={0}
        y={0}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        fill="#f8fbfd"
        cornerRadius={12}
      />
      <Rect
        x={120}
        y={100}
        width={CANVAS_WIDTH - 240}
        height={CANVAS_HEIGHT - 200}
        stroke={fieldColor}
        strokeWidth={2}
        cornerRadius={4}
      />
      <Line
        points={[centerX, 100, centerX, CANVAS_HEIGHT - 100]}
        stroke={fieldColor}
        strokeWidth={3}
      />
      <Line
        points={[centerX - 150, 100, centerX - 150, CANVAS_HEIGHT - 100]}
        stroke={fieldColor}
        strokeWidth={2}
      />
      <Line
        points={[centerX + 150, 100, centerX + 150, CANVAS_HEIGHT - 100]}
        stroke={fieldColor}
        strokeWidth={2}
      />
    </>
  );

  const renderBackground = () => {
    switch (layoutQuadra) {
      case "futebol":
        return renderFutebol();
      case "basquete":
        return renderBasquete();
      case "volei":
        return renderVolei();
      case "futsal":
      default:
        return renderFutsal();
    }
  };

  return (
    <div className="content">
      <NotificationAlert ref={notificationAlert} />

      <div className={`game-actions-page ${modoFoco ? "is-focus-mode" : ""}`}>
        {!modoFoco && (
          <Card className="game-actions-hero-card">
            <CardBody>
              <h2 className="game-actions-page-title">Lousa Tática</h2>
              <p className="game-actions-page-subtitle">
                Posicione atletas reais, simule adversários e organize cenários
                táticos reutilizáveis.
              </p>
            </CardBody>
          </Card>
        )}

        <Row>
          {!modoFoco && (
            <Col md="3">
              <Card className="game-actions-history-card">
                <CardBody>
                  <h4 className="game-actions-side-title">Elenco</h4>
                  <p className="game-actions-side-subtitle">
                    Atletas disponíveis na modalidade selecionada.
                  </p>

                  {loadingAtletas ? (
                    <p>Carregando atletas...</p>
                  ) : (
                    <ListGroup flush>
                      {atletasDisponiveis.length === 0 && (
                        <ListGroupItem className="game-actions-history-item">
                          Nenhum atleta disponível.
                        </ListGroupItem>
                      )}

                      {atletasDisponiveis.map((atleta) => (
                        <ListGroupItem
                          key={atleta._id}
                          className="game-actions-history-item"
                          tag="button"
                          action
                          onClick={() => adicionarAtletaAoCanvas(atleta)}
                        >
                          <div className="game-actions-history-name">
                            {atleta.nome}
                          </div>
                          <small className="game-actions-history-meta">
                            Camisa: {atleta.camisa || "-"} |{" "}
                            {atleta.posicaoPreferencial || "Sem posição"}
                          </small>
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  )}

                  <div className="mt-4">
                    <h4 className="game-actions-side-title">Histórico</h4>
                    <p className="game-actions-side-subtitle">
                      Lousas salvas recentemente.
                    </p>

                    {loadingHistory ? (
                      <p>Carregando...</p>
                    ) : (
                      <ListGroup flush>
                        {historico.length === 0 && (
                          <ListGroupItem className="game-actions-history-item">
                            Nenhuma lousa salva ainda.
                          </ListGroupItem>
                        )}

                        {historico.map((item) => (
                          <ListGroupItem
                            key={item._id}
                            className={`game-actions-history-item ${
                              lousaAtualId === item._id ? "is-active" : ""
                            }`}
                            onClick={() => abrirLousa(item)}
                            tag="button"
                            action
                          >
                            <div className="game-actions-history-name">
                              {item.nome}
                            </div>
                            <small className="game-actions-history-meta">
                              {item.categoria || "Sem categoria"}
                            </small>
                            <br />
                            <small className="game-actions-history-meta">
                              {item?.background?.tipo || "layout não definido"}
                            </small>
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}

          <Col md={modoFoco ? "12" : "9"}>
            <Card className="game-actions-main-card">
              <CardBody>
                {!modoFoco && (
                  <>
                    <Row className="mb-3">
                      <Col md="3">
                        <FormGroup>
                          <Label>Nome da lousa</Label>
                          <Input
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Ex.: saída 3x2 contra pressão"
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label>Categoria</Label>
                          <Input
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            placeholder="Ex.: jogada ensaiada"
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <SelectModalidade
                          value={modalidade}
                          onChange={(val) => setModalidade(val)}
                        />
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label>Layout</Label>
                          <Input
                            type="select"
                            value={layoutQuadra}
                            onChange={(e) => setLayoutQuadra(e.target.value)}
                          >
                            <option value="futsal">Futsal</option>
                            <option value="futebol">Futebol de Campo</option>
                            <option value="basquete">Basquete</option>
                            <option value="volei">Vôlei</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md="12">
                        <FormGroup>
                          <Label>Descrição</Label>
                          <Input
                            type="textarea"
                            rows="3"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Descreva a proposta tática da lousa."
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </>
                )}

                <div className="game-actions-toolbar">
                  <Button
                    color={tool === TOOL_SELECT ? "primary" : "secondary"}
                    onClick={() => setTool(TOOL_SELECT)}
                  >
                    Selecionar
                  </Button>

                  <Button
                    color={tool === TOOL_OPPONENT ? "primary" : "secondary"}
                    onClick={() => setTool(TOOL_OPPONENT)}
                  >
                    Adversário
                  </Button>

                  <Button
                    color={tool === TOOL_BALL ? "primary" : "secondary"}
                    onClick={() => setTool(TOOL_BALL)}
                  >
                    Bola
                  </Button>

                  <Button
                    color={tool === TOOL_TEXT ? "primary" : "secondary"}
                    onClick={() => setTool(TOOL_TEXT)}
                  >
                    Texto
                  </Button>

                  <Button
                    color={tool === TOOL_ARROW ? "primary" : "secondary"}
                    onClick={() => setTool(TOOL_ARROW)}
                  >
                    Seta
                  </Button>

                  <Button color="danger" outline onClick={removerSelecionado}>
                    Remover Selecionado
                  </Button>

                  <Button color="warning" outline onClick={atualizarTextoSelecionado}>
                    Editar Texto
                  </Button>

                  <Button color="secondary" outline onClick={limparTela}>
                    Novo / Limpar
                  </Button>

                  <Button color="success" onClick={salvarLousa}>
                    Salvar
                  </Button>

                  <Button color="info" outline onClick={exportarImagem}>
                    Exportar PNG
                  </Button>

                  <Button
                    color={modoFoco ? "dark" : "secondary"}
                    outline
                    onClick={alternarModoFoco}
                  >
                    {modoFoco ? "Sair do modo foco" : "Modo foco"}
                  </Button>
                </div>

                <div className="game-actions-canvas-wrap">
                  <Stage
                    ref={stageRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    onMouseDown={handleStageMouseDown}
                    onTouchStart={handleStageMouseDown}
                    onMouseMove={handleStageMouseMove}
                    onTouchMove={handleStageMouseMove}
                    onMouseUp={handleStageMouseUp}
                    onTouchEnd={handleStageMouseUp}
                    className="game-actions-stage"
                  >
                    <Layer>
                      {renderBackground()}

                      {elements.map((el) => {
                        if (el.type === "athlete") {
                          return (
                            <React.Fragment key={el.id}>
                              <Circle
                                x={el.x}
                                y={el.y}
                                radius={el.size || 18}
                                fill={el.color || "#2563eb"}
                                stroke={selectedId === el.id ? "#111827" : "#ffffff"}
                                strokeWidth={selectedId === el.id ? 3 : 2}
                                draggable
                                onClick={() => handleElementClick(el.id)}
                                onTap={() => handleElementClick(el.id)}
                                onDragEnd={(e) =>
                                  updateElementPosition(
                                    el.id,
                                    e.target.x(),
                                    e.target.y()
                                  )
                                }
                              />
                              <Text
                                x={el.x - 10}
                                y={el.y - 8}
                                text={el.label || ""}
                                fontSize={14}
                                fill="#ffffff"
                                fontStyle="bold"
                                listening={false}
                              />
                            </React.Fragment>
                          );
                        }

                        if (el.type === "opponent") {
                          return (
                            <React.Fragment key={el.id}>
                              <Circle
                                x={el.x}
                                y={el.y}
                                radius={el.size || 18}
                                fill={el.color || "#ef4444"}
                                stroke={selectedId === el.id ? "#111827" : "#ffffff"}
                                strokeWidth={selectedId === el.id ? 3 : 2}
                                draggable
                                onClick={() => handleElementClick(el.id)}
                                onTap={() => handleElementClick(el.id)}
                                onDragEnd={(e) =>
                                  updateElementPosition(
                                    el.id,
                                    e.target.x(),
                                    e.target.y()
                                  )
                                }
                              />
                              <Text
                                x={el.x - 14}
                                y={el.y - 8}
                                text={el.label || "ADV"}
                                fontSize={12}
                                fill="#ffffff"
                                fontStyle="bold"
                                listening={false}
                              />
                            </React.Fragment>
                          );
                        }

                        if (el.type === "ball") {
                          return (
                            <Circle
                              key={el.id}
                              x={el.x}
                              y={el.y}
                              radius={el.size || 8}
                              fill="#111827"
                              stroke={selectedId === el.id ? "#f59e0b" : "#ffffff"}
                              strokeWidth={selectedId === el.id ? 3 : 1}
                              draggable
                              onClick={() => handleElementClick(el.id)}
                              onTap={() => handleElementClick(el.id)}
                              onDragEnd={(e) =>
                                updateElementPosition(
                                  el.id,
                                  e.target.x(),
                                  e.target.y()
                                )
                              }
                            />
                          );
                        }

                        if (el.type === "text") {
                          return (
                            <Text
                              key={el.id}
                              x={el.x}
                              y={el.y}
                              text={el.text || ""}
                              fontSize={el.fontSize || 18}
                              fill={el.color || "#172033"}
                              draggable
                              onClick={() => handleElementClick(el.id)}
                              onTap={() => handleElementClick(el.id)}
                              onDragEnd={(e) =>
                                updateElementPosition(
                                  el.id,
                                  e.target.x(),
                                  e.target.y()
                                )
                              }
                            />
                          );
                        }

                        if (el.type === "arrow") {
                          return (
                            <Arrow
                              key={el.id}
                              points={el.points || []}
                              stroke={el.color || "#f59e0b"}
                              fill={el.color || "#f59e0b"}
                              strokeWidth={el.strokeWidth || 4}
                              pointerLength={10}
                              pointerWidth={10}
                              onClick={() => handleElementClick(el.id)}
                              onTap={() => handleElementClick(el.id)}
                            />
                          );
                        }

                        return null;
                      })}

                      {drawingArrow && (
                        <Arrow
                          points={drawingArrow.points}
                          stroke={drawingArrow.color}
                          fill={drawingArrow.color}
                          strokeWidth={drawingArrow.strokeWidth}
                          pointerLength={10}
                          pointerWidth={10}
                        />
                      )}
                    </Layer>
                  </Stage>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default LousaTatica;