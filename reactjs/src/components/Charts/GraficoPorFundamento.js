import React, { useMemo, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardBody, 
  UncontrolledDropdown, 
  DropdownToggle, 
  DropdownMenu, 
  DropdownItem 
} from "reactstrap";

const GraficoPorFundamento = ({
  fundamentos,
  filtroFundamento,
  atletas,
  filtroAtleta,
  avaliacoes,
  niveis,
}) => {
  // Estado para o filtro interno do gráfico (ex: BASE, PASSE)
  const [fundamentoAtivo, setFundamentoAtivo] = useState("");

  // Inicializa o filtro interno com o primeiro fundamento disponível
  useEffect(() => {
    if (fundamentos && fundamentos.length > 0 && !fundamentoAtivo) {
      setFundamentoAtivo(fundamentos[0]);
    }
  }, [fundamentos, fundamentoAtivo]);

  // Cores mais opacas (suaves)
  const coresOpacas = [
    "rgba(231, 76, 60, 0.7)",  // Nível A
    "rgba(241, 196, 15, 0.7)",  // Nível B
    "rgba(46, 204, 113, 0.7)",  // Nível C
    "rgba(52, 152, 219, 0.7)",  // Nível D
    "rgba(63, 81, 181, 0.7)",   // Nível E
    "rgba(155, 89, 182, 0.7)",  // Nível F
  ];

  const data = useMemo(() => {
    const atletasVisiveis = atletas.filter((a) => filtroAtleta.includes(a));
    
    const datasets = niveis.map((nivel, idx) => ({
      label: `Nível ${nivel}`,
      backgroundColor: coresOpacas[idx],
      borderColor: coresOpacas[idx].replace("0.7", "1"),
      borderWidth: 1,
      data: atletasVisiveis.map((atleta) => {
        // Contabiliza apenas o fundamento selecionado no dropdown interno
        const jogadas = avaliacoes[atleta]?.[fundamentoAtivo] || [];
        return jogadas.filter((j) => {
          const nivelJogada = typeof j === 'object' ? j.nivel : j;
          return nivelJogada === nivel;
        }).length;
      }),
    }));

    return {
      labels: atletasVisiveis,
      datasets,
    };
  }, [atletas, filtroAtleta, fundamentoAtivo, avaliacoes, niveis]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { 
        stacked: false, // Alterado para falso para mostrar barras lado a lado como na imagem
        grid: { display: false }
      },
      y: { 
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: { display: true, text: 'Qtd. de Execuções' }
      },
    },
    plugins: {
      legend: { position: "top" },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
  };

  return (
    <Card className="mt-4">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <CardTitle tag="h5" className="mb-0">Distribuição por Nível por Fundamento</CardTitle>
        
        {/* Filtro interno dentro do gráfico */}
        <UncontrolledDropdown>
          <DropdownToggle caret color="secondary" size="sm" className="text-uppercase">
            {fundamentoAtivo || "Selecionar"}
          </DropdownToggle>
          <DropdownMenu end>
            {fundamentos.map((fund, i) => (
              <DropdownItem 
                key={i} 
                onClick={() => setFundamentoAtivo(fund)}
                active={fundamentoAtivo === fund}
              >
                {fund}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardHeader>
      
      <CardBody>
        <div style={{ height: "400px", position: "relative" }}>
          <Bar 
            data={data} 
            options={options} 
            key={JSON.stringify(avaliacoes) + fundamentoAtivo} 
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default GraficoPorFundamento;