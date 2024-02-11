/* eslint-disable no-unused-vars */

/* eslint-disable no-undef */
/*!

=========================================================
* Paper Dashboard React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useState } from "react";
import React  from "react";
import NotificationAlert from "react-notification-alert";

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
    Label
} from "reactstrap";

function Treino() {
    const notificationAlert = React.useRef();
    const notify = (place, color) => {
      var type;
      switch (color) {
        case 1:
          type = "primary";
          break;
        case 2:
          type = "success";
          break;
        case 3:
          type = "danger";
          break;
        case 4:
          type = "warning";
          break;
        case 5:
          type = "info";
          break;
        default:
          break;
      }
      var options = {};
      options = {
        place: place,
        message: (
          <div>
            <div>
                <b>Ó o auÊ aí hein... camabada de cuzão</b> bando de cu de pombo do caraio
            </div>
          </div>
        ),
        type: type,
        icon: "nc-icon nc-bell-55",
        autoDismiss: 7
      };
      notificationAlert.current.notificationAlert(options);
    };

    const [modalidade, setModalidade] = useState("")

  return (
    <>
      <div className="content">
      <NotificationAlert ref={notificationAlert} />
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Cadastro de  Treino Por Modalidade/Equipe</CardTitle>
              </CardHeader>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Treino</CardTitle>
              </CardHeader>
              <CardBody>
              <Form>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Nome do Treino</label>
                        <Input
                          placeholder="Nome"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                      <Label for="exampleSelect1">Modalidade</Label>
                            <Input type="select" name="select" id="exampleSelect1" onChange={() => setModalidade(this.value)}>
                            <option>Selecione ...</option>
                            <option value="1">VolleyBall Quadra</option>
                            <option value="2">VolleyBall Praia</option>
                            <option value="3">FuteVolley</option>
                            <option value="4">Futebol Campo(Soccer)</option>
                            <option value="5">Futebol Salão(Futsal)</option>
                            <option value="6">Futebol Americano(Football)</option>
                            <option value="17">Futebol Americano Sem Contato(Flag Football)</option>
                            <option value="7">Futebol de 7(Society/Sintético)</option>
                            <option value="8">Basquete (NBA)</option>
                            <option value="9">Basquete (FIBA)</option>
                            <option value="10">Basquete de 3(Street)</option>
                            <option value="11">Musculação</option>
                            <option value="12">Funcional</option>
                            <option value="13">Karate</option>
                            <option value="14">Taekwondo</option>
                            <option value="15">Jiu-Jitsu</option>
                            <option value="16">Volleibinhas de Vila</option>
                            </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Fundamento 1</label>
                        <Input
                          defaultValue="Fundamento 1"
                          placeholder="Company"
                          type="Select"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Fundamento 2 </label>
                        <Input
                          placeholder="Fundamento 2"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Fundamento 3</label>
                        <Input
                            placeholder="Fundamento 3"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Fundamento 4 </label>
                        <Input
                          placeholder="Fundamento 4"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Fundamento 5</label>
                        <Input
                          placeholder="Fundamento 5"
                          type="Select"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Fundamento 6</label>
                        <Input
                          placeholder="Fundamento 6"
                          type="text"
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
      </div>
    </>
  );
}

export default Treino;
