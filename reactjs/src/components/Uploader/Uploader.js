import React , { useState }from "react";
import {
    Button,
    FormGroup,
    Input,
    Col,
    Row
} from "reactstrap";


function Uploader(){
    
    const [file, setFile] = useState(null);
    
    //const [ progress, setProgress] = useState({started: false, pc: 0});
    
    const [ msg, setMsg ] = useState(null);

   async function handleUpload(){
        if(!file){
            setMsg('Deu Ruim')
            return
        }

        const fd = new FormData();

        if(file.length === 1){
            fd.append('file', file[0]);
        }
        else if(file.length > 1){
            for(let i = 0; i < file.length; i++){
                fd.append('file'+ (1 + i), file[i]);
            }
        }

        fetch("https://localhost:44311/Upload",{
            method: "POST",
            body: fd,
            headers:{ Accept: "multipart/form-data",    }
        })
        .then(res => {
            setFile(null)
            
            console.log('res',res)
            setMsg('Deu Bom')
        })
        .catch(err => {
            setMsg('Deu Muito Ruim');
        })
    }

    return(
        <div>
            <Row>
                <Col className="pr-1" md="12">
                        <FormGroup>
                        <Input
                            type="file"
                            onChange={(e) => {
                                setFile(e.target.files) 
                            }}
                            multiple
                            />
                        <Button
                            className="btn-round"
                            color="primary"
                            type="button"
                            onClick={ () => handleUpload() }
                        >Upload</Button>
                           
                        </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    {msg && <span>{msg}</span>}
                </Col>
            </Row>                
        </div>
    );
}

export default Uploader;
