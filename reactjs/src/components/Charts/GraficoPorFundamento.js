import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

function GraficoPorFundamento({ fundamentos, filtroFundamento, setFiltroFundamento, atletas, filtroAtleta, avaliacoes, niveis }) {
  const fundamentoSelecionado = filtroFundamento[0] || fundamentos[0] || "";

  const contagemPorNivelEAtleta = niveis.map((nivel, nivelIdx) => ({
    label: `Nível ${nivel}`,
    backgroundColor: `hsl(${nivelIdx * 60}, 70%, 60%)`,
    data: atletas
      .filter((a) => filtroAtleta.includes(a))
      .map((atleta) => {
        const jogadas = avaliacoes[atleta]?.[fundamentoSelecionado] || [];
        return jogadas.filter((n) => n === nivel).length;
      }),
  }));

  return (
    <Row>
      <Col md="12">
        <Card className="card-chart">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <CardTitle tag="h5" className="mb-0">
              Distribuição por Nível por Fundamento
            </CardTitle>
            <UncontrolledDropdown>
              <DropdownToggle caret color="secondary">
                {fundamentoSelecionado || "Selecionar Fundamento"}
              </DropdownToggle>
              <DropdownMenu>
                {fundamentos.map((fund, idx) => (
                  <DropdownItem
                    key={idx}
                    onClick={() => setFiltroFundamento([fund])}
                  >
                    {fund}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          </CardHeader>

          <CardBody style={{ height: "400px", position: "relative" }}>
            <Bar
              data={{
                labels: atletas.filter((a) => filtroAtleta.includes(a)),
                datasets: contagemPorNivelEAtleta,
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  tooltip: { mode: "index", intersect: false },
                  datalabels: {
                    anchor: "end",
                    align: "top",
                    font: { weight: "bold" },
                    formatter: Math.round,
                  },
                },
                scales: {
                  x: {
                    stacked: false,
                    title: { display: true, text: "Atletas" },
                  },
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: "Qtd. de Execuções" },
                    ticks: { stepSize: 1 },
                  },
                },
              }}
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default GraficoPorFundamento;
