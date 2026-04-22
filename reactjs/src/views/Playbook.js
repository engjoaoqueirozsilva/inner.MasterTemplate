import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Input,
  FormGroup,
  Label,
  Collapse,
  Button,
} from "reactstrap";
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
import PlaybookService from "../services/PlaybookService";

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 420;

function Playbook() {
  const [playbooks, setPlaybooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filtroNome, setFiltroNome] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [abertoId, setAbertoId] = useState(null);

  const clubeId = localStorage.getItem("clubeId");

  useEffect(() => {
    carregarPlaybooks();
  }, [modalidade]);

  const carregarPlaybooks = async () => {
    try {
      setLoading(true);

      const params = {
        clubeId,
      };

      if (modalidade) {
        params.modalidade = modalidade;
      }

      const result = await PlaybookService.findAll(params);
      setPlaybooks(result || []);
    } catch (error) {
      console.error("Erro ao carregar playbooks:", error);
      setPlaybooks([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (id) => {
    setAbertoId((prev) => (prev === id ? null : id));
  };

  const playbooksFiltrados = useMemo(() => {
    if (!filtroNome.trim()) return playbooks;

    return playbooks.filter((item) =>
      item.nome?.toLowerCase().includes(filtroNome.toLowerCase())
    );
  }, [playbooks, filtroNome]);

  const fieldColor = "#cbd5e1";

  const renderFutsal = () => {
    const outerX = 30;
    const outerY = 30;
    const outerW = CANVAS_WIDTH - 60;
    const outerH = CANVAS_HEIGHT - 60;
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    return (
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
          radius={40}
          stroke={fieldColor}
          strokeWidth={2}
        />
        <Rect
          x={outerX}
          y={centerY - 65}
          width={90}
          height={130}
          stroke={fieldColor}
          strokeWidth={2}
        />
        <Rect
          x={outerX + outerW - 90}
          y={centerY - 65}
          width={90}
          height={130}
          stroke={fieldColor}
          strokeWidth={2}
        />
      </>
    );
  };

  const renderFutebol = () => {
    const outerX = 30;
    const outerY = 30;
    const outerW = CANVAS_WIDTH - 60;
    const outerH = CANVAS_HEIGHT - 60;
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    return (
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
          radius={42}
          stroke={fieldColor}
          strokeWidth={2}
        />
        <Rect
          x={outerX}
          y={centerY - 95}
          width={120}
          height={190}
          stroke={fieldColor}
          strokeWidth={2}
        />
        <Rect
          x={outerX}
          y={centerY - 45}
          width={40}
          height={90}
          stroke={fieldColor}
          strokeWidth={2}
        />
        <Rect
          x={outerX + outerW - 120}
          y={centerY - 95}
          width={120}
          height={190}
          stroke={fieldColor}
          strokeWidth={2}
        />
        <Rect
          x={outerX + outerW - 40}
          y={centerY - 45}
          width={40}
          height={90}
          stroke={fieldColor}
          strokeWidth={2}
        />
      </>
    );
  };

  const renderBasquete = () => {
    const outerX = 30;
    const outerY = 30;
    const outerW = CANVAS_WIDTH - 60;
    const outerH = CANVAS_HEIGHT - 60;
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    return (
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
          radius={42}
          stroke={fieldColor}
          strokeWidth={2}
        />
        <Rect
          x={outerX}
          y={centerY - 70}
          width={110}
          height={140}
          stroke={fieldColor}
          strokeWidth={2}
        />
        <Arc
          x={outerX + 110}
          y={centerY}
          innerRadius={75}
          outerRadius={75}
          angle={120}
          rotation={-60}
          stroke={fieldColor}
          strokeWidth={2}
        />
        <Rect
          x={outerX + outerW - 110}
          y={centerY - 70}
          width={110}
          height={140}
          stroke={fieldColor}
          strokeWidth={2}
        />
        <Arc
          x={outerX + outerW - 110}
          y={centerY}
          innerRadius={75}
          outerRadius={75}
          angle={120}
          rotation={120}
          stroke={fieldColor}
          strokeWidth={2}
        />
      </>
    );
  };

  const renderVolei = () => {
    return (
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
          x={90}
          y={60}
          width={CANVAS_WIDTH - 180}
          height={CANVAS_HEIGHT - 120}
          stroke={fieldColor}
          strokeWidth={2}
          cornerRadius={4}
        />
        <Line
          points={[CANVAS_WIDTH / 2, 60, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 60]}
          stroke={fieldColor}
          strokeWidth={3}
        />
        <Line
          points={[
            CANVAS_WIDTH / 2 - 110,
            60,
            CANVAS_WIDTH / 2 - 110,
            CANVAS_HEIGHT - 60,
          ]}
          stroke={fieldColor}
          strokeWidth={2}
        />
        <Line
          points={[
            CANVAS_WIDTH / 2 + 110,
            60,
            CANVAS_WIDTH / 2 + 110,
            CANVAS_HEIGHT - 60,
          ]}
          stroke={fieldColor}
          strokeWidth={2}
        />
      </>
    );
  };

  const renderBackground = (tipo) => {
    switch (tipo) {
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

  const renderElements = (elements = []) => {
    return elements.map((el) => {
      if (el.type === "player" || el.type === "athlete") {
        return (
          <React.Fragment key={el.id}>
            <Circle
              x={el.x}
              y={el.y}
              radius={el.size || 16}
              fill={el.color || "#2563eb"}
              stroke="#ffffff"
              strokeWidth={2}
              listening={false}
            />
            <Text
              x={el.x - 10}
              y={el.y - 7}
              text={el.label || el.camisa || ""}
              fontSize={12}
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
              radius={el.size || 16}
              fill={el.color || "#ef4444"}
              stroke="#ffffff"
              strokeWidth={2}
              listening={false}
            />
            <Text
              x={el.x - 12}
              y={el.y - 7}
              text={el.label || "ADV"}
              fontSize={11}
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
            stroke="#ffffff"
            strokeWidth={1}
            listening={false}
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
            fontSize={el.fontSize || 16}
            fill={el.color || "#172033"}
            listening={false}
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
            listening={false}
          />
        );
      }

      if (el.type === "line" || el.type === "scribble") {
        return (
          <Line
            key={el.id}
            points={el.points || []}
            stroke={el.color || "#111827"}
            strokeWidth={el.strokeWidth || 2}
            lineCap="round"
            lineJoin="round"
            listening={false}
          />
        );
      }

      return null;
    });
  };

  return (
    <div className="content">
      <div className="playbook-page">
        <Card className="playbook-hero-card">
          <CardBody>
            <h2 className="playbook-page-title">Playbook</h2>
            <p className="playbook-page-subtitle">
              Consulte jogadas organizadas e visualize a estrutura tática em modo
              somente leitura.
            </p>
          </CardBody>
        </Card>

        <Card className="playbook-filter-card">
          <CardBody>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Buscar por nome da jogada</Label>
                  <Input
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                    placeholder="Digite o nome da jogada"
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <SelectModalidade
                  value={modalidade}
                  onChange={(val) => setModalidade(val)}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Card className="playbook-list-card">
          <CardBody>
            {loading ? (
              <div className="text-center p-4">Carregando playbook...</div>
            ) : playbooksFiltrados.length === 0 ? (
              <div className="text-center p-4">
                Nenhuma jogada encontrada.
              </div>
            ) : (
              playbooksFiltrados.map((item) => (
                <div key={item._id} className="playbook-accordion-item">
                  <button
                    className={`playbook-accordion-header ${
                      abertoId === item._id ? "is-open" : ""
                    }`}
                    onClick={() => toggleAccordion(item._id)}
                    type="button"
                  >
                    <div className="playbook-accordion-main">
                      <div className="playbook-accordion-title">{item.nome}</div>
                      <div className="playbook-accordion-meta">
                        {item.categoria || "Sem categoria"} •{" "}
                        {item.modalidade?.nome || "Modalidade"}
                      </div>
                    </div>

                    <div className="playbook-accordion-icon">
                      {abertoId === item._id ? "−" : "+"}
                    </div>
                  </button>

                  <Collapse isOpen={abertoId === item._id}>
                    <div className="playbook-accordion-body">
                      <Row>
                        <Col md="4">
                          <div className="playbook-detail-block">
                            <h5 className="playbook-detail-title">Detalhes</h5>

                            <p>
                              <strong>Nome:</strong> {item.nome}
                            </p>
                            <p>
                              <strong>Categoria:</strong>{" "}
                              {item.categoria || "-"}
                            </p>
                            <p>
                              <strong>Modalidade:</strong>{" "}
                              {item.modalidade?.nome || "-"}
                            </p>
                            <p>
                              <strong>Origem:</strong>{" "}
                              {item.origem || "manual"}
                            </p>
                            <p>
                              <strong>Descrição:</strong>{" "}
                              {item.descricao || "Sem descrição"}
                            </p>
                          </div>
                        </Col>

                        <Col md="8">
                          <div className="playbook-canvas-box">
                            <Stage
                              width={CANVAS_WIDTH}
                              height={CANVAS_HEIGHT}
                              className="playbook-stage"
                            >
                              <Layer listening={false}>
                                {renderBackground(item?.background?.tipo)}
                                {renderElements(item?.elements || [])}
                              </Layer>
                            </Stage>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Collapse>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Playbook;    