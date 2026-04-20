import React, { useState, useRef, useEffect } from "react";
import NotificationAlert from "react-notification-alert";
import AtletaService from "../services/AtletasService";
import SelectModalidade from "../components/Select/SelectModalidade";
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

function Atleta() {
  const notificationAlert = useRef();

  const [formData, setFormData] = useState({
    nome: "",
    posicaoPreferencial: "",
    posicaoSecundaria: "",
    modalidade: "",
    camisa: "",
    contatoEmergencia: {
      nome: "",
      telefone: "",
    },
  });

  const [atletas, setAtletas] = useState([]);

  useEffect(() => {
    const clubeId = localStorage.getItem("clubeId");

    if (!clubeId) {
      notify("tr", 4, "Clube não identificado.");
      return;
    }

    AtletaService.findAll({ clubeId })
      .then(setAtletas)
      .catch(() => notify("tr", 4, "Erro ao buscar atletas"));
  }, []);

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

    if (name.startsWith("contatoEmergencia.")) {
      const campo = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contatoEmergencia: {
          ...prev.contatoEmergencia,
          [campo]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCamisaChange = (e) => {
    const valor = e.target.value.replace(/\D/g, "");
    if (valor.length <= 3) {
      setFormData((prev) => ({ ...prev, camisa: valor }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const novoAtleta = await AtletaService.create(formData);
      notify("tr", 2, "Atleta cadastrado com sucesso!");
      setAtletas((prev) => [...prev, novoAtleta]);
      setFormData({
        nome: "",
        posicaoPreferencial: "",
        posicaoSecundaria: "",
        modalidade: "",
        camisa: "",
        contatoEmergencia: { nome: "", telefone: "" },
      });
    } catch (error) {
      console.error(error);
      notify("tr", 3, "Erro ao salvar atleta.");
    }
  };

  return (
    <div className="content">
      <NotificationAlert ref={notificationAlert} />

      <div className="athlete-page">
        <Card className="athlete-hero-card">
          <CardBody>
            <h2 className="athlete-page-title">Cadastro de Atletas</h2>
            <p className="athlete-page-subtitle">
              Gerencie os atletas do clube, organize posições e mantenha os
              contatos importantes sempre acessíveis.
            </p>
          </CardBody>
        </Card>

        <Card className="athlete-form-card">
          <CardBody>
            <div className="training-form-header">
              <h4 className="training-section-title">Cadastrar novo atleta</h4>
              <p className="training-section-subtitle">
                Preencha os dados principais do atleta e adicione um contato de
                emergência para consulta rápida.
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              <h5 className="athlete-block-title">Dados do Atleta</h5>

              <Row>
                <Col md="6">
                  <FormGroup>
                    <label>Nome</label>
                    <Input
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Nome do atleta"
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

              <Row>
                <Col md="4">
                  <FormGroup>
                    <label>Posição Preferencial</label>
                    <Input
                      name="posicaoPreferencial"
                      value={formData.posicaoPreferencial}
                      onChange={handleChange}
                      placeholder="Ex: Atacante"
                    />
                  </FormGroup>
                </Col>

                <Col md="4">
                  <FormGroup>
                    <label>Posição Secundária</label>
                    <Input
                      name="posicaoSecundaria"
                      value={formData.posicaoSecundaria}
                      onChange={handleChange}
                      placeholder="Ex: Ala"
                    />
                  </FormGroup>
                </Col>

                <Col md="4">
                  <FormGroup>
                    <label>Número da Camisa</label>
                    <Input
                      name="camisa"
                      value={formData.camisa}
                      onChange={handleCamisaChange}
                      placeholder="Ex: 10"
                      maxLength="3"
                      inputMode="numeric"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <hr className="athlete-divider" />

              <h5 className="athlete-block-title">Contato de Emergência</h5>

              <Row>
                <Col md="6">
                  <FormGroup>
                    <label>Nome do Contato</label>
                    <Input
                      name="contatoEmergencia.nome"
                      value={formData.contatoEmergencia.nome}
                      onChange={handleChange}
                      placeholder="Nome do responsável"
                    />
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup>
                    <label>Telefone</label>
                    <Input
                      name="contatoEmergencia.telefone"
                      value={formData.contatoEmergencia.telefone}
                      onChange={handleChange}
                      placeholder="(xx) xxxxx-xxxx"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <div className="athlete-submit">
                <Button className="btn-round" color="primary" type="submit">
                  Incluir Atleta
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>

        <Card className="training-list-card">
          <CardBody>
            <div className="training-list-header">
              <h4 className="training-section-title">Atletas cadastrados</h4>
              <p className="training-section-subtitle">
                Visualize rapidamente os atletas já cadastrados, suas posições e
                dados principais.
              </p>
            </div>

            <div className="athlete-table-wrap">
              <Table responsive className="athlete-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Posição</th>
                    <th>Camisa</th>
                    <th>Equipe</th>
                    <th>Contato Emergência</th>
                  </tr>
                </thead>

                <tbody>
                  {atletas.map((a, idx) => (
                    <tr key={idx}>
                      <td>{a.nome}</td>

                      <td>
                        {a.posicaoPreferencial ? (
                          <span className="athlete-tag">
                            {a.posicaoPreferencial}
                          </span>
                        ) : (
                          <span className="athlete-tag athlete-tag-neutral">
                            -
                          </span>
                        )}
                      </td>

                      <td>
                        {a.camisa ? (
                          <span className="athlete-tag">#{a.camisa}</span>
                        ) : (
                          <span className="athlete-tag athlete-tag-neutral">
                            -
                          </span>
                        )}
                      </td>

                      <td>
                        {a.modalidade?.nome ? (
                          <span className="athlete-tag">{a.modalidade.nome}</span>
                        ) : (
                          <span className="athlete-tag athlete-tag-neutral">
                            -
                          </span>
                        )}
                      </td>

                      <td>
                        {a.contatoEmergencia?.nome || a.contatoEmergencia?.telefone
                          ? `${a.contatoEmergencia?.nome || "-"} - ${
                              a.contatoEmergencia?.telefone || "-"
                            }`
                          : "-"}
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

export default Atleta;