import React, { useState, useRef, useEffect } from "react";
import NotificationAlert from "react-notification-alert";
import ModalidadeService from "../services/ModalidadeService";

// reactstrap components
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

function Equipe() {
  const notificationAlert = useRef();

  const [formData, setFormData] = useState({
    nome: "",
    responsavelTecnico: "",
    auxiliarTecnico: "",
    observacoes: "",
  });

  const [modalidades, setModalidades] = useState([]);

  useEffect(() => {
    ModalidadeService.findAll()
      .then(setModalidades)
      .catch(() => notify("tr", 4, "Erro ao buscar modalidades"));
  }, []);

  const notify = (place, type, mensagem) => {
    const types = ["", "primary", "success", "danger", "warning", "info"];
    const options = {
      place: place,
      message: <div><b>{mensagem}</b></div>,
      type: types[type],
      icon: "nc-icon nc-bell-55",
      autoDismiss: 5,
    };
    notificationAlert.current.notificationAlert(options);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nova = await ModalidadeService.create(formData);
      notify("tr", 2, "Equipe cadastrada com sucesso!");
      setModalidades(prev => [...prev, nova]);
      setFormData({
        nome: "",
        responsavelTecnico: "",
        auxiliarTecnico: "",
        observacoes: "",
      });
    } catch (error) {
      notify("tr", 3, "Erro ao salvar modalidade.");
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
                <CardTitle tag="h4">Cadastro de Equipe</CardTitle>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Nome da Equipe</label>
                        <Input
                          name="nome"
                          placeholder="Nome da Modalidade"
                          type="text"
                          value={formData.nome}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Responsável Técnico</label>
                        <Input
                          name="responsavelTecnico"
                          placeholder="Responsável Técnico"
                          type="text"
                          value={formData.responsavelTecnico}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label>Auxiliar Técnico</label>
                        <Input
                          name="auxiliarTecnico"
                          placeholder="Auxiliar Técnico"
                          type="text"
                          value={formData.auxiliarTecnico}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Comentários/Observações</label>
                        <Input
                          name="observacoes"
                          type="textarea"
                          placeholder="Comentários/Observações"
                          value={formData.observacoes}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <div className="update ml-auto mr-auto">
                      <Button
                        className="btn-round"
                        color="primary"
                        type="submit"
                      >
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
                <CardTitle tag="h5">Equipes Cadastradas</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Responsável Técnico</th>
                      <th>Auxiliar Técnico</th>
                      <th>Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalidades.map((mod, idx) => (
                      <tr key={idx}>
                        <td>{mod.nome}</td>
                        <td>{mod.responsavelTecnico}</td>
                        <td>{mod.auxiliarTecnico}</td>
                        <td>{mod.observacoes}</td>
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

export default Equipe;
