import React from 'react';
import { Button, Row } from 'reactstrap';

export default function NivelBotaoSet({ atleta, fundamento, cor, onClick }) {
  const niveis = [["A", "B", "C"], ["D", "E", "F"]];

  return (
    <>
      {niveis.map((grupo, gIdx) => (
        <Row key={gIdx} className="mb-1" style={{ gap: "5px" }}>
          {grupo.map((nivel, i) => (
            <Button
              key={nivel}
              color={cor}
              style={{ opacity: 1 - (gIdx * 0.3 + i * 0.1) }}
              title={`Nível ${nivel}`}
              onClick={() => onClick(atleta, fundamento, nivel)}
            >
              {nivel}
            </Button>
          ))}
        </Row>
      ))}
    </>
  );
}
