import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useFetchData } from "utils/hooks/usefetchdata";
import { useElementSize } from "utils/hooks/useelementsize";
import { QuantidadeDemandaType } from "types/relatorio/quantidadedemanda";

interface Props {
  selectedData?: QuantidadeDemandaType[];
}

const QuantidadeDemandas = ({ selectedData }: Props) => {
  const { data, loading } = useFetchData<QuantidadeDemandaType>({
    url: "/demandaprojeto",
    initialData: null,
  });

  const elementSize  = useElementSize();

  const totalQuantidade = data.reduce((sum, item) => sum + item.quantidade, 0);

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
    },
    plotOptions: {
      bar: {
        columnWidth: "70%",
        distributed: true,
        dataLabels: {
          position: "top",
          hideOverflowingLabels: true
        }
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontFamily: "Nunito, serif",
        fontWeight: 500,
        colors: ["#333"],
      },
      offsetY: -20,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
    xaxis: {
      categories: [...data.map((item) => item.projeto), "Total"],
      labels: {
        style: {
          fontSize: elementSize.width > 400 ? "12px" : "8px",
          colors: "#31374a",
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: elementSize.width > 400 ? "12px" : "10px",
          fontWeight: 600,
        },
      },
    },
    colors: ["#01BEEB", "#0059F1", "#0015B2", "#F1F100", "#EE5600", "#E3000F", "#760076", "#09D809", "#4D7F2C"],
    legend: { show: false },
  };

  const series = [
    {
      name: "Quantidade",
      data: [...data.map((item) => item.quantidade).reverse(), totalQuantidade],
    },
  ];

  return (
    <div className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <div className="column-chart">
          <ReactApexChart options={options} series={series} type="bar" height={300} width={500} />
        </div>
      )}
    </div>
  );
};

export default QuantidadeDemandas;
