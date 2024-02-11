import React , { useState, useEffect } from "react";
import axios from "axios";
import {
    Col,
    Row,
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    Table,
    Button
} from "reactstrap";

function Files(){
    const [ fileNames, setFileNames ] = useState([""])

    useEffect(() => {
        axios.get('https://localhost:44311/AllFiles').then(resp => {
            setFileNames(resp.data.result)
        })
        .catch(err => {
            console.log("err",err);
        });    
    },[]);

   async function handleDownload(posFile){
        let file = fileNames[posFile];

        axios.get('https://localhost:44311/Download?file=' + file)
        .then(resp => 
        {
          const binaryString = atob(resp.data.result.buffer);

          // Converte a string binária para um ArrayBuffer
          const arrayBuffer = new ArrayBuffer(binaryString.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          
          for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
          }

          const ret = resp.data.result;
          const fileType = ret.contentType;

          const blob = new Blob([uint8Array], {type: fileType});

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          
          link.href = url;
          
          link.setAttribute('download', ret.name);

          document.body.appendChild(link);

          link.click();
        })
        .catch(err => 
        {
            console.log("err",err);
        });    
    }

    return <>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Arquivos Não Baixados</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th> Nome do Arquivo</th>
                      <th> Realizar Download</th>
                    </tr>
                  </thead>
                  <tbody>
                        {
                            fileNames?.map(
                                (x,i) => {
                                    return (
                                        <tr key={i}>
                                            <td key={i}>
                                                {x}
                                            </td>  
                                            <td>
                                                <Button 
                                                    onClick={(e) => handleDownload(i)} 
                                                    className="btn-round"
                                                >
                                                    Baixar
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                }   
                           )
                        }
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
    </>
}

export default Files;