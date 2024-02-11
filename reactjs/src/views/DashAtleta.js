
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
import { Line, Pie } from "react-chartjs-2";
import {
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart
} from "variables/charts.js";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  CardFooter,
  Col,
  Button
} from "reactstrap";

function DashAtleta() {


    //Saque
    let [count0, setCount0] = useState(0);
    let [count1, setCount1] = useState(0);
    let [deCount0, setDeCount0] = useState(0);
    let [deCount1, setDeCount1] = useState(0);

    //Ataque
    let [count2, setCount2] = useState(0);
    let [count3, setCount3] = useState(0);
    let [deCount2, setDeCount2] = useState(0);
    let [deCount3, setDeCount3] = useState(0);


    //Defesa
    let  [count4, setCount4] = useState(0);
    let [count5, setCount5] = useState(0);
    let [deCount4, setDeCount4] = useState(0);
    let [deCount5, setDeCount5] = useState(0);

    //Passe
    let [count6, setCount6] = useState(0);
    let [count7, setCount7] = useState(0);
    let [deCount6, setDeCount6] = useState(0);
    let [deCount7, setDeCount7] = useState(0);

    //Levantamento
    let [count8, setCount8] = useState(0);
    let [count9, setCount9] = useState(0);
    let [deCount8, setDeCount8] = useState(0);
    let [deCount9, setDeCount9] = useState(0);

    //Bloqueio
    let [count10, setCount10] = useState(0);
    let [count11, setCount11] = useState(0);
    let [deCount10, setDeCount10] = useState(0);
    let [deCount11, setDeCount11] = useState(0);


    let fundamentos = [
        "Saque",
        "Ataque",
        "Defesa",
        "Passe",
        "Levantamento",
        "Bloqueio"
    ]

    let cores = [
        "warning",
        "primary",
        "danger",
        "success",
        "default",
        "warning"
    ]

    let atletas = [
        "Manuella Penharbel",
        "Murillo Penharbel"
    ]

    let HandleAdd = (atleta, fundamento) => {
            if(atleta === "Manu Penharbel"){
                switch(fundamento){
                        case "Saque":           setCount0(++count0); break;
                        case "Ataque":          setCount2(++count2); break;
                        case "Defesa":          setCount4(++count4); break;
                        case "Passe":           setCount6(++count6); break;
                        case "Levantamento":    setCount8(++count8); break;
                        case "Bloqueio":        setCount10(++count10); break;
                        default:break;
                }
            }

            if(atleta === "Murillo Penharbel"){
                switch(fundamento){
                    case "Saque":           setCount1(++count1); break;
                    case "Ataque":          setCount3(++count3); break;
                    case "Defesa":          setCount5(++count5); break;
                    case "Passe":           setCount7(++count7); break;
                    case "Levantamento":    setCount9(++count9); break;
                    case "Bloqueio":        setCount11(++count11); break;
                    default:break;
                }
            }
    }

    let HandleRemove = (atleta, fundamento) => {
        if(atleta === "Manu Penharbel"){
            switch(fundamento){
                    case "Saque": setDeCount0(++deCount0); break;
                    case "Ataque": setDeCount2(++deCount2); break;
                    case "Defesa": setDeCount4(++deCount4); break;
                    case "Passe": setDeCount6(++deCount6); break;
                    case "Levantamento": setDeCount8(++deCount8); break;
                    case "Bloqueio": setDeCount10(++deCount10); break;
                    default:break;
            }
        }

        if(atleta === "Murillo Penharbel"){
            switch(fundamento){
                case "Saque": setDeCount1(++deCount1); break;
                case "Ataque": setDeCount3(++deCount3); break;
                case "Defesa": setDeCount5(++deCount5); break;
                case "Passe": setDeCount7(++deCount7); break;
                case "Levantamento": setDeCount9(++deCount9); break;
                case "Bloqueio": setDeCount11(++deCount11); break;
                default:break;
            }
        }
    }


  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Análise de Performance em Treino</CardTitle>
              </CardHeader>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Atletas</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                    <th>Nome Atleta</th>
                        {fundamentos.map( (fundamento) => 
                             <th>{fundamento}</th>
                        )}
                    </tr>
                  </thead>
                  <tbody>
                       {
                        atletas.map((atleta, index) => 
                                <tr>
                                    <td>{atleta}</td>
                                    {fundamentos.map( (fundamento, idx) => 
                                       

                                        <td>
                                            <Button
                                            block
                                            color={cores[idx]}
                                            onClick={() => HandleAdd(atleta, fundamento)}
                                        >
                                            +
                                        </Button><br/><Button
                                            block
                                            color={cores[idx]}
                                            onClick={() => HandleRemove(atleta, fundamento)}
                                        >
                                            -
                                        </Button>
                                        </td>
                                    )}
                                </tr>
                        )
                       }     
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
            <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4">Performance no Treino</CardTitle>
                    </CardHeader>
                    </Card>
                    <Card>
                        <CardBody>
                            <h4>Saque</h4>
                            <Table responsive>
                                <tbody>
                                    <tr>
                                        <td>
                                        <table>
                                            <theader className="text-primary">
                                                <tr>
                                                    <th>Manuella Penharbel</th>
                                                    <th>Murillo Penharbel</th>
                                                </tr>
                                            </theader>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table>
                                                                <theader>
                                                                    <th>Acertos</th>
                                                                    <th>Erros</th>
                                                                </theader>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{count0}</td>
                                                                        <td>{deCount0}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                        <td>
                                                            <table>
                                                                <theader>
                                                                    <th>Acertos</th>
                                                                    <th>Erros</th>
                                                                </theader>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{count1}</td>
                                                                        <td>{deCount1}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <h4>Ataque</h4>
                            <Table responsive>
                            <tbody>
                                    <tr>
                                        <td>
                                        <table>
                                            <theader className="text-primary">
                                                <tr>
                                                    <th>Manuella Penharbel</th>
                                                    <th>Murillo Penharbel</th>
                                                </tr>
                                            </theader>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table>
                                                                <theader>
                                                                    <th>Acertos</th>
                                                                    <th>Erros</th>
                                                                </theader>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{count2}</td>
                                                                        <td>{deCount2}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                        <td>
                                                            <table>
                                                                <theader>
                                                                    <th>Acertos</th>
                                                                    <th>Erros</th>
                                                                </theader>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{count3}</td>
                                                                        <td>{deCount3}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <h4>Defesa</h4>
                            <Table responsive>
                                <tbody>
                                    <tr>
                                        <td>
                                        <table>
                                            <theader className="text-primary">
                                                <tr>
                                                    <th>Manuella Penharbel</th>
                                                    <th>Murillo Penharbel</th>
                                                </tr>
                                            </theader>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table>
                                                                <theader>
                                                                    <th>Acertos</th>
                                                                    <th>Erros</th>
                                                                </theader>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{count4}</td>
                                                                        <td>{deCount4}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                        <td>
                                                            <table>
                                                                <theader>
                                                                    <th>Acertos</th>
                                                                    <th>Erros</th>
                                                                </theader>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{count5}</td>
                                                                        <td>{deCount5}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <h4>Passe</h4>
                            <Table responsive>
                            <tbody>
                                    <tr>
                                        <td>
                                        <table>
                                            <theader className="text-primary">
                                                <tr>
                                                    <th>Manuella Penharbel</th>
                                                    <th>Murillo Penharbel</th>
                                                </tr>
                                            </theader>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table>
                                                                <theader>
                                                                    <th>Acertos</th>
                                                                    <th>Erros</th>
                                                                </theader>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{count6}</td>
                                                                        <td>{deCount6}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                        <td>
                                                            <table>
                                                                <theader>
                                                                    <th>Acertos</th>
                                                                    <th>Erros</th>
                                                                </theader>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{count7}</td>
                                                                        <td>{deCount7}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <h4>Levantamento</h4>
                            <Table responsive>
                                <tbody>
                                    <tr>
                                        <td>
                                        <table>
                                            <theader className="text-primary">
                                                <tr>
                                                    <th>Manuella Penharbel</th>
                                                    <th>Murillo Penharbel</th>
                                                </tr>
                                            </theader>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table>
                                                                <theader>
                                                                    <th>Acertos</th>
                                                                    <th>Erros</th>
                                                                </theader>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{count8}</td>
                                                                        <td>{deCount8}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                        <td>
                                                            <table>
                                                                <theader>
                                                                    <th>Acertos</th>
                                                                    <th>Erros</th>
                                                                </theader>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{count9}</td>
                                                                        <td>{deCount9}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <h4>Bloqueio</h4>
                            <Table responsive>
                            <tbody>
                                    <tr>
                                        <td>
                                        <table>
                                            <theader className="text-primary">
                                                <tr>
                                                    <th>Manuella Penharbel</th>
                                                    <th>Murillo Penharbel</th>
                                                </tr>
                                            </theader>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table>
                                                                <theader>
                                                                    <th>Acertos</th>
                                                                    <th>Erros</th>
                                                                </theader>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{count10}</td>
                                                                        <td>{deCount10}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                        <td>
                                                            <table>
                                                                <theader>
                                                                    <th>Acertos</th>
                                                                    <th>Erros</th>
                                                                </theader>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{count11}</td>
                                                                        <td>{deCount11}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
            </Col>
        </Row>*/
        <Row>
          <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Análise de Treino</CardTitle>
                <p className="card-category">Ultimos 15 Treinos</p>
              </CardHeader>
              <CardBody style={{ height: "266px" }}>
                <Pie
                  data={dashboardEmailStatisticsChart.data}
                  options={dashboardEmailStatisticsChart.options}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-primary" /> Ataque{" "}
                  <i className="fa fa-circle text-warning" /> Defesa{" "}
                  <i className="fa fa-circle text-danger" /> Bloqueio{" "}
                  <i className="fa fa-circle text-gray" /> Saque
                </div>
                <hr />

              </CardFooter>
            </Card>
          </Col>
          <Col md="8">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h5">Evolução Mensal</CardTitle>
                <p className="card-category">Fundamentos Certos no Último Mês</p>
              </CardHeader>
              <CardBody>
                <Line
                  data={dashboardNASDAQChart.data}
                  options={dashboardNASDAQChart.options}
                  width={400}
                  height={100}
                />

              </CardBody>
              <CardFooter>
                <div className="chart-legend">
                  <i className="fa fa-circle text-info" /> Ataque{" "}
                  <i className="fa fa-circle text-warning" /> Defesa
                </div>
                <hr />
               
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default DashAtleta;
