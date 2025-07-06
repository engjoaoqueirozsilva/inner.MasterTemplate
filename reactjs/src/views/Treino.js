import React, { useState, useRef, useEffect } from "react";
import NotificationAlert from "react-notification-alert";
import SelectModalidade from "../components/Select/SelectModalidade";
import SelectAtletasParticipantes from "../components/Select/SelectAtletasParticipantes";
import SelectFundamento from "../components/Select/SelectFundamento";
import PlanoService from "../services/PlanoService"; // Importando o serviço de Plano


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

  const [formData, setFormData] = useState({
    nome: "",
    modalidade: "",
    fundamentos: [] // corrigido: inicia vazio
  });

  const [participantes, setParticipantes] = useState([]);
  const [treinos, setTreinos] = useState([]);
  const [filtro, setFiltro] = useState("");

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const treinoFinal = {
        ...formData,
        participantes: participantes.map((p) => ({
          id: p._id,
          nome: p.nome,
          posicao: p.posicao,
          camisa: p.camisa
        })),

      };

      console.log("🔍 Payload enviado:", treinoFinal); // 👈 debug útil

      await PlanoService.create(treinoFinal);
      setTreinos((prev) => [...prev, treinoFinal]);

      notify("tr", 2, "Treino cadastrado com sucesso!");

      setFormData({
        nome: "",
        modalidade: "",
        fundamentos: [],
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
        const todos = await PlanoService.findAll();
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

      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Cadastro de Treino por Modalidade/Equipe</CardTitle>
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
                        setFormData((prev) => ({ ...prev, fundamentos: listaAtualizada }))
                      }
                    />
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
                        {treino.participantes?.map((p) => p.nome).filter(Boolean).join(", ") || "-"}
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
