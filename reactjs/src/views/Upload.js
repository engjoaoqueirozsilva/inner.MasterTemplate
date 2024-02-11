import React from "react";
import Uploader from "../components/Uploader/Uploader";
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
    Col
} from "reactstrap";



function Upload() {
    return (
        <>
          <div className="content">
          <Row>
            <Col md="12">
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h5">Upload de Arquivos</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="pr-1" md="4">
                        <FormGroup>
                          <label>Nome do Arquivo</label>
                          <Input
                            placeholder="Nome do Arquivo"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pm-1" md="4">
                        <FormGroup>
                          <label htmlFor="exampleInputEmail1">
                            Número de Controle / Código Aso
                          </label>
                          <Input placeholder="Número Controle" type="text" />
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="4">
                        <FormGroup>
                          <label htmlFor="exampleInputEmail1">
                            Empresa Origem
                          </label>
                          <Input placeholder="Empresa Origem" type="text" />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                    <Col className="pr-1" md="6">
                        <FormGroup>
                          <label>Número Aso</label>
                          <Input
                            placeholder="Número Aso"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pr-1" md="6">
                        <FormGroup>
                          <label>Empresa Destino</label>
                          <Input
                            placeholder="Empresa Destino"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="6">
                        <Uploader/>
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

export default Upload;
