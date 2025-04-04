import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useFetchData } from "utils/hooks/usefetchdata";
import { useElementSize } from "utils/hooks/useelementsize";
import { SituacaoRiscoType } from "types/relatorio/situacaorisco";

interface Props {
  selectedData?: SituacaoRiscoType[];
}

const SituacaoRisco = ({ selectedData }: Props) => {
  const { data, loading } = useFetchData<SituacaoRiscoType>({
    url: "/situacaorisco",
    initialData: null,
  });

  const elementSize  = useElementSize();

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
      categories: data.map((item) => item.projeto),
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
    colors: ["#00A745", "#EEEE00", "#ECB000", "#EC0000"],
    legend: { show: true },
  };

  const series = [
    {
      name: "Baixo",
      data: data.map((item) => item.baixo),
    },
    {
      name: "Médio",
      data: data.map((item) => item.medio),
    },
    {
      name: "Alto",
      data: data.map((item) => item.alto),
    },
    {
      name: "Extremo",
      data: data.map((item) => item.extremo),
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

export default SituacaoRisco;
