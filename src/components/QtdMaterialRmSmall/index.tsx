import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdMaterialRmType } from "types/relatorio/qtdmaterialrm";

import "./styles.css";
import { useFetchData } from "utils/hooks/usefetchdata";
import { useElementSize } from "utils/hooks/useelementsize";

interface Props {
  selectedData?: QtdMaterialRmType[];
}

const QtdMaterialRmSmall = ({ selectedData }: Props) => {
  const {data, loading} = useFetchData<QtdMaterialRmType>({
    url: "/materiaisom/qtd/rm",
    initialData: selectedData,
  });

  const elementSize = useElementSize();

  // Função para extrair o número da RM (ex: "3ª RM" -> 3)
  const extractNumber = (rm: string) => {
    const match = rm.match(/^(\d+)ª RM$/);
    return match ? parseInt(match[1], 10) : 999; // Se não encontrar, coloca no final
  };

  // Ordena os dados corretamente de 1 a 12
  const sortedData = [...data].sort((a, b) => extractNumber(a.rm) - extractNumber(b.rm));

  // Define os rótulos e valores para o gráfico de pizza
  const labels = sortedData.map((item) => item.rm);
  const values = sortedData.map((item) => item.quantidade);

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
    labels: labels,
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
    colors: ["#018AE6", "#1184D0", "#1F7DBB", "#2974A6", "#306A91", "#335E7B", "#335266", "#2F4351", "#28343C", "#262E33", "#2B3033", "#2D3133"],
    stroke: {
      show: false,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          minAngleToShowLabel: 20,
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
        <div className="severity-column-chart">
          <ReactApexChart options={options} series={values} type="pie" height={elementSize.height} width={elementSize.width} />
        </div>
      )}
    </div>
  );
};

export default QtdMaterialRmSmall;
