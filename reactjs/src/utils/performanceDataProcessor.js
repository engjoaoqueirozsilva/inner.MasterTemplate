// Função para consolidar TODOS os conceitos de TODOS os atletas e fundamentos (Geral da Equipe)
export const consolidarGeralEquipe = (planos) => {
  const distribuicaoTotal = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  
  planos.forEach((plano) => {
    plano.atletas.forEach((atleta) => {
      atleta.fundamentos.forEach((fundamento) => {
        Object.keys(fundamento.distribuicao).forEach((conceito) => {
          distribuicaoTotal[conceito] += fundamento.distribuicao[conceito];
        });
      });
    });
  });
  
  return distribuicaoTotal;
};

// Função para consolidar por fundamento (todos os atletas)
export const consolidarPorFundamento = (planos) => {
  const fundamentos = {};
  
  planos.forEach((plano) => {
    plano.atletas.forEach((atleta) => {
      atleta.fundamentos.forEach((fundamento) => {
        if (!fundamentos[fundamento.nome]) {
          fundamentos[fundamento.nome] = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
        }
        
        Object.keys(fundamento.distribuicao).forEach((conceito) => {
          fundamentos[fundamento.nome][conceito] += fundamento.distribuicao[conceito];
        });
      });
    });
  });
  
  return fundamentos;
};

// Função para consolidar TODOS os fundamentos de um atleta específico
export const consolidarGeralAtleta = (atleta) => {
  const distribuicaoTotal = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  
  atleta.fundamentos.forEach((fundamento) => {
    Object.keys(fundamento.distribuicao).forEach((conceito) => {
      distribuicaoTotal[conceito] += fundamento.distribuicao[conceito];
    });
  });
  
  return distribuicaoTotal;
};

// Função para converter distribuição em formato Chart.js
export const distribuicaoParaChartData = (distribuicao, titulo = "") => {
  const conceitos = ['A', 'B', 'C', 'D', 'E', 'F'];
  const valores = conceitos.map((c) => distribuicao[c] || 0);
  const total = valores.reduce((acc, val) => acc + val, 0);
  
  // Calcular percentuais
  const percentuais = valores.map((val) => 
    total > 0 ? ((val / total) * 100).toFixed(1) : 0
  );
  
  return {
    labels: conceitos,
    datasets: [
      {
        label: titulo,
        data: valores,
        backgroundColor: [
          '#4CAF50', // A - Verde
          '#8BC34A', // B - Verde claro
          '#FFC107', // C - Amarelo
          '#FF9800', // D - Laranja
          '#F44336', // E - Vermelho
          '#9E9E9E', // F - Cinza
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
    percentuais, // Para usar em tooltips
  };
};

// Opções padrão para gráficos de pizza
export const getPieChartOptions = (titulo) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        font: {
          size: 12,
        },
        padding: 10,
      },
    },
    title: {
      display: true,
      text: titulo,
      font: {
        size: 16,
        weight: 'bold',
      },
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || '';
          const value = context.parsed || 0;
          const dataset = context.dataset.data;
          const total = dataset.reduce((acc, val) => acc + val, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `${label}: ${value} (${percentage}%)`;
        },
      },
    },
    datalabels: {
      color: '#fff',
      font: {
        weight: 'bold',
        size: 14,
      },
      formatter: (value, context) => {
        const dataset = context.dataset.data;
        const total = dataset.reduce((acc, val) => acc + val, 0);
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
        return percentage > 5 ? `${percentage}%` : ''; // Só mostra se > 5%
      },
    },
  },
});