import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

function PieChartCard({ titulo, data, options, height = 300 }) {
  return (
    <Card>
      <CardBody>
        {titulo && <CardTitle tag="h5">{titulo}</CardTitle>}
        <div style={{ height: `${height}px`, position: "relative" }}>
          <Pie data={data} options={options} />
        </div>
      </CardBody>
    </Card>
  );
}

export default PieChartCard;