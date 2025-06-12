import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { ExecucaoValorCFF } from "types/relatorio/execucaopagocff";
import { useFetchData } from "utils/hooks/usefetchdata";
import { formatarNumero } from "utils/functions";

interface Props {
  selectedData?: ExecucaoValorCFF[];
}

const ExecucaoOmDestinoCFF = ({ selectedData }: Props) => {
  const { data, loading } = useFetchData<ExecucaoValorCFF>({
    url: "/cff/execucao/omDestino",
    initialData: selectedData,
  });

  // Definição das categorias no eixo X
  const categorias = data.map((x) => x.elemento);

  // Criando as séries baseadas em `grupoCodUo`

  const series = [
    {
      name: "Total",
      data: data.map((x) => x.valor),
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
      categories: categorias, // Definindo os rótulos no eixo X
      labels: {
        style: {
          fontSize: "9px",
          fontWeight: 600,
          fontFamily: "Nunito, serif",
        },
      },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const seriesName = w.config.series[seriesIndex].name;
        const dataValue = w.config.series[seriesIndex].data[dataPointIndex];

        // Formatação do valor como moeda
        const formattedValue = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(dataValue);

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
      width: 2, // aumenta o "hitbox"
      colors: ["#444"],
      lineCap: "butt"
    },
    plotOptions: {
      bar: {
        horizontal: false, // Barras verticais
        columnWidth: "60%", // Largura das colunas
        distributed: true,
        borderRadius: 0,
        dataLabels: {
          hideOverflowingLabels: true,
          position: "top",
          total: {
            offsetY: -5,
            enabled: true,
            formatter: (val?: string | number) => {
              const num = typeof val === "string" ? parseFloat(val) : val;
              if (typeof num !== "number" || isNaN(num)) return "R$ 0,00";

              if(typeof num === "number" && num > 1_000_000) {
                return formatarNumero(num);
              } else {
                return "";
              }
            },
            style: {
              fontSize: "10px",
              color: "#333"
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#5262D9", "#DB8A1D", "#008BDB", "#BE1DDB"], // Cores para cada série
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
        <ReactApexChart options={options} series={series} type="bar" height={300} width={860} />
      )}
    </div>
  );
};

export default ExecucaoOmDestinoCFF;
