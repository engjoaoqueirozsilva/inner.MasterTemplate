import React, { useState, useRef, useEffect } from "react";
import NotificationAlert from "react-notification-alert";
import AtletaService from "../services/AtletasService";
import SelectModalidade from "../components/Select/SelectModalidade";
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
      telefone: ""
    }
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
      message: <div><b>{mensagem}</b></div>,
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
      setFormData(prev => ({
        ...prev,
        contatoEmergencia: {
          ...prev.contatoEmergencia,
          [campo]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCamisaChange = (e) => {
    const valor = e.target.value.replace(/\D/g, "");
    if (valor.length <= 3) {
      setFormData(prev => ({ ...prev, camisa: valor }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const novoAtleta = await AtletaService.create(formData);
      notify("tr", 2, "Atleta cadastrado com sucesso!");
      setAtletas(prev => [...prev, novoAtleta]);
      setFormData({
        nome: "",
        posicaoPreferencial: "",
        posicaoSecundaria: "",
        modalidade: "",
        camisa: "",
        contatoEmergencia: { nome: "", telefone: "" }
      });
    } catch (error) {
      console.error(error);
      notify("tr", 3, "Erro ao salvar atleta.");
    }
  };

  return (
    <>
      <div className="content">
        <NotificationAlert ref={notificationAlert} />

        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Cadastro de Atleta</CardTitle>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Nome</label>
                        <Input
                          name="nome"
                          value={formData.nome}
                          onChange={handleChange}
                          placeholder="Nome"
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <SelectModalidade
                        value={formData.modalidade}
                        onChange={(val) => setFormData(prev => ({ ...prev, modalidade: val }))}
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
                          placeholder="Posição Preferencial"
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
                          placeholder="Posição Secundária"
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
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Nome do Contato de Emergência</label>
                        <Input
                          name="contatoEmergencia.nome"
                          value={formData.contatoEmergencia.nome}
                          onChange={handleChange}
                          placeholder="Nome do contato"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label>Telefone do Contato de Emergência</label>
                        <Input
                          name="contatoEmergencia.telefone"
                          value={formData.contatoEmergencia.telefone}
                          onChange={handleChange}
                          placeholder="Telefone do contato"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
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
                <CardTitle tag="h5">Atletas Cadastrados</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
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
                        <td>{a.posicaoPreferencial}</td>
                        <td>{a.camisa || "-"}</td>
                        <td>{a.modalidade?.nome || "-"}</td>
                        <td>{a.contatoEmergencia?.nome} - {a.contatoEmergencia?.telefone}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Atleta;
