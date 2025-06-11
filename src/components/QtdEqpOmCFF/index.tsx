import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { useFetchData } from "utils/hooks/usefetchdata";
import { QtdEqpPorOmDestinoCff } from "types/relatorio/qtdeqpomcff";

interface Props {
  selectedData?: QtdEqpPorOmDestinoCff[];
}

const QtdEqpOmCFF = ({ selectedData }: Props) => {
  const { data, loading } = useFetchData<QtdEqpPorOmDestinoCff>({
    url: "/cff/equipamentos/om/qtd",
    initialData: selectedData,
  });

  const categorias = data.map((x) => x.omDestino);
  const valores = data.map((x) => x.qtd);

  const options: ApexOptions = {
    chart: {
      type: "pie",
      background: "transparent",
      animations: {
        enabled: true,
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 1000,
        },
      },
    },
    labels: categorias,
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "13px",
        fontWeight: "bold",
        fontFamily: "Nunito, serif",
        colors: ["#FFF"],
      },
      formatter: function (val: number, opts) {
        const rmLabel = opts.w.config.labels[opts.seriesIndex]; // Obtém o nome da RM
        const value = val; // Obtém o valor formatado
        return [`${value.toFixed(2)}%`, rmLabel]; // Exibe "xª RM" e o valor na fatia da pizza
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val}`,
      },
      style: {
        fontSize: "15px",
        fontFamily: "Nunito, serif",
      },
      fillSeriesColor: false,
    },
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontFamily: "Nunito, serif",
      fontWeight: 800,
      formatter: (val) => `${val}`,
      width: 400,
      offsetX: 80,
      show: false,
    },
    colors: ["#5262D9", "#DB8A1D", "#008BDB", "#BE1DDB", "#6ADB1D", "#DB1D1D"],
    stroke: {
      show: false,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          minAngleToShowLabel: 13,
          offset: -10,
        },
      },
    },
  };

  return (
    <div className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <ReactApexChart options={options} series={valores} type="pie" height={350} />
      )}
    </div>
  );
};

export default QtdEqpOmCFF;
