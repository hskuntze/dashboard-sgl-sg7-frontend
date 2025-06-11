import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { ExecucaoPagoCFF } from "types/relatorio/execucaopagocff";
import { useFetchData } from "utils/hooks/usefetchdata";

interface Props {
  selectedData?: ExecucaoPagoCFF[];
}

const ExecucaoElementoDespesaCFF = ({ selectedData }: Props) => {
  const { data, loading } = useFetchData<ExecucaoPagoCFF>({
    url: "/cff/execucao/elementoDespesa",
    initialData: selectedData,
  });

  // Definição das categorias no eixo X
  const categorias = data.map((x) => x.elemento);

  // Criando as séries baseadas em `grupoCodUo`

  const series = [
    {
      name: "Total",
      data: data.map((x) => x.pago),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      stacked: true,
      toolbar: { show: false },
      fontFamily: "Nunito, serif",
    },
    xaxis: {
      // xaxis agora representa o valor (R$)
      labels: {
        formatter: (val) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(val)),
        style: {
          fontSize: "9px",
          fontWeight: 600,
          fontFamily: "Nunito, serif",
        },
      },
      categories: categorias
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "9px",
          fontWeight: 600,
          fontFamily: "Nunito, serif",
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const seriesName = w.config.series[seriesIndex].name;
        const dataValue = w.config.series[seriesIndex].data[dataPointIndex];

        const formattedValue = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(dataValue);

        return `
        <div style="padding: 10px; background: #00000cc; border: 1px solid #ccc;">
          <strong>${seriesName}</strong><br />
          Valor: ${formattedValue}<br />
        </div>
      `;
      },
    },
    stroke: {
      show: true,
    },
    plotOptions: {
      bar: {
        horizontal: true, // <<< BARRAS HORIZONTAIS
        columnWidth: "40%",
        distributed: true,
        dataLabels: {
          position: "top",
          total: {
            offsetX: 1,
            enabled: true,
            style: {
              fontSize: "9px"
            },
            formatter: (val?: string | number) => {
              const num = typeof val === "string" ? parseFloat(val) : val;
              if (typeof num !== "number" || isNaN(num)) return "R$ 0,00";

              return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(num);
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#5262D9", "#DB8A1D", "#008BDB", "#BE1DDB"],
    legend: {
      show: false,
    },
  };

  return (
    <div className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <ReactApexChart options={options} series={series} type="bar" height={300} width={930} />
      )}
    </div>
  );
};

export default ExecucaoElementoDespesaCFF;
