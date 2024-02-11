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
import React from "react";
import { useState } from "react";
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
  Button
} from "reactstrap";

function Modalidade() {

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


    const [modalidadeNome, setModalidadeNome ] = useState('');
    const [modalidadeResp, setModalidadeResp ] = useState('');
    const [modalidadeObs, setModalidadeObs ] = useState('');

   


  return (
    <>
      <div className="content">
      <NotificationAlert ref={notificationAlert} />
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Cadastro de Modalidade</CardTitle>
              </CardHeader>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Modalidade</CardTitle>
              </CardHeader>
              <CardBody>
              <Form>
                  <Row>
                    <Col className="pr-1" md="12">
                      <FormGroup>
                        <label>Nome da Modalidade</label>
                        <Input
                          placeholder="Nome da Modalidade"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Responsável Técnico</label>
                        <Input
                          placeholder="Responsável Técnico"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Auxiliar Técnico</label>
                        <Input
                          placeholder="Auxiliar Técnico"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Comentários/Observaçoes</label>
                        <Input
                          type="textarea"
                          placeholder="Comentários/Observaçoes"
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

                        onClick={() => notify("tr", 3)}
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

export default Modalidade;
