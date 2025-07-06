import React, { useState } from "react";
import {
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  Button,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import { FaPlus } from "react-icons/fa";

function SelectFundamentos({ fundamentos, onChange }) {
  const [novoFundamento, setNovoFundamento] = useState("");

  const handleAdicionarFundamento = () => {
    const valor = novoFundamento.trim();
    if (valor && fundamentos.length < 10 && !fundamentos.includes(valor)) {
      onChange([...fundamentos, valor]);
      setNovoFundamento("");
    }
  };

  const handleRemoverFundamento = (index) => {
    const atualizados = fundamentos.filter((_, i) => i !== index);
    onChange(atualizados);
  };

  return (
    <FormGroup>
      <Label>Fundamentos do Treino (máx. 10)</Label>
      <InputGroup className="mb-3">
        <Input
          type="text"
          placeholder="Digite um fundamento"
          value={novoFundamento}
          onChange={(e) => setNovoFundamento(e.target.value)}
          disabled={fundamentos.length >= 10}
        />
        <InputGroupText
          style={{ cursor: "pointer", backgroundColor: "#28a745", color: "#fff" }}
          onClick={handleAdicionarFundamento}
          title="Adicionar fundamento"
          disabled={!novoFundamento.trim() || fundamentos.length >= 10}
        >
          <FaPlus />
        </InputGroupText>
      </InputGroup>

      <ListGroup>
        {fundamentos
          .filter((f) => f.trim() !== "")
          .map((f, index) => (
            <ListGroupItem key={index} className="d-flex justify-content-between align-items-center">
              {f}
              <Button close onClick={() => handleRemoverFundamento(index)} />
            </ListGroupItem>
          ))}
      </ListGroup>
    </FormGroup>
  );
}

export default SelectFundamentos;
