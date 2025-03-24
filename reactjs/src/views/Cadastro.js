/* eslint-disable no-unused-vars */
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
import React, { useState } from "react";

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    Label
} from "reactstrap";

function Tables() {
  const [modalidade, setModalidade] = useState("")

  return (
    <>
      <div className="content">
      <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Cadastro de Atletas</CardTitle>
              </CardHeader>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card className="card-user">
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-1" md="4">
                      <FormGroup>
                        <label>Nome do Atleta</label>
                        <Input
                          placeholder="Nome"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pm-1" md="4">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">
                          Email
                        </label>
                        <Input placeholder="Email" type="email" />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="4">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">
                          Telefone
                        </label>
                        <Input placeholder="Telefone" type="Telefone" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Posicao Preferencial</label>
                        <Input
                          placeholder="Posição Preferencial"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Posição Secundária</label>
                        <Input
                          placeholder="Posicao Secundaria"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
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
                    <Col className="pl-1" md="3">
                      <FormGroup>
                        <label>CPF</label>
                        <Input
                          defaultValue="CPF"
                          placeholder="CPF"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="3">
                      <FormGroup>
                        <label>RG</label>
                        <Input
                          defaultValue="RG"
                          placeholder="RG"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Endereço</label>
                        <Input
                          placeholder="Endereço"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <FormGroup>
                        <label>Cidade</label>
                        <Input
                          placeholder="Cidade"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-1" md="4">
                      <FormGroup>   
                        <label>Estado</label>
                        <Input
                        placeholder="Estado"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="4">
                      <FormGroup>
                        <label>CEP</label>
                        <Input placeholder="CEP" type="number" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Nome do Contato de Emergência</label>
                        <Input
                            type="Text"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label>Telefone do Contato de Emergência</label>
                        <Input
                            type="Text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Comentários</label>
                        <Input
                          type="textarea"
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

export default Tables;
