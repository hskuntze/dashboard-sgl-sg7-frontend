import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { useFetchData } from "utils/hooks/usefetchdata";
import { ExecucaoTotalCffType } from "types/relatorio/execucaototalcff";

interface Props {
  selectedData?: ExecucaoTotalCffType[];
  onSelectedConjunto: (conjunto: string, tipo: number) => void;
}

const ExecucaoTotalConjuntoCFF = ({ selectedData, onSelectedConjunto }: Props) => {
  const { data, loading } = useFetchData<ExecucaoTotalCffType>({
    url: "/cff/execucao/total",
    initialData: selectedData,
  });

  // Definição das categorias no eixo X
  const categorias = data.map((x) => x.conjunto);

  // Criando as séries baseadas em `grupoCodUo`

  const series = [
    {
      name: "Valor Pago",
      data: data.map((x) => x.valorPago),
    },
    {
      name: "Valor Contrato",
      data: data.map((x) => x.valorContrato),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "Nunito, serif",
      animations: {
        enabled: true,
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 1000,
        },
      },
      stacked: true, // <-- CRUCIAL: Habilita barras empilhadas
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedIndex = config.dataPointIndex;
          const seriesIndex = config.seriesIndex;
          const clickedItem = data[selectedIndex];

          if (clickedItem.conjunto) {
            const tipo = seriesIndex;
            onSelectedConjunto(clickedItem.conjunto, tipo);
          }
        },
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: categorias, // Definindo os rótulos no eixo X
      labels: {
        style: {
          fontSize: "11px",
          fontWeight: 600,
          fontFamily: "Nunito, serif",
        },
      },
    },
    yaxis: {
      show: true,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number, { seriesIndex, w }) => {
          return `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        },
      },
    },
    stroke: {
      show: false,
    },
    plotOptions: {
      bar: {
        horizontal: false, // Barras verticais
        columnWidth: "40%", // Largura das colunas
        dataLabels: {
          position: "top",
          total: {
            enabled: true,
            formatter: function (val, opts) {
              const dataIndex = opts.dataPointIndex;

              const valorContrato = data[dataIndex]?.valorContrato ?? 0;

              return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(valorContrato);
            },
            style: {
              fontSize: "10px",
              fontWeight: 700,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
      style: {
        fontSize: "10px",
        fontWeight: 900,
        colors: ["#333"],
      },
    },
    colors: ["#009B3A", "#FEDF00"], // Cores para cada série
    legend: {
      show: true,
    },
  };

  return (
    <div className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <ReactApexChart options={options} series={series} type="bar" height={700} width={900} />
      )}
    </div>
  );
};

export default ExecucaoTotalConjuntoCFF;
