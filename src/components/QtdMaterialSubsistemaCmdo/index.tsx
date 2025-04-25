import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useFetchData } from "utils/hooks/usefetchdata";
import { useElementSize } from "utils/hooks/useelementsize";
import { QtdMaterialSubsistemaCmdoType } from "types/relatorio/qtdmaterialsubsistemacmdo";

interface Props {
  selectedData?: QtdMaterialSubsistemaCmdoType[];
  onSelectCategoria: (comando: string | null, categoria: string | null) => void;
}

const QtdMaterialSubsistemaCmdo = ({ selectedData, onSelectCategoria }: Props) => {
  const { data, loading } = useFetchData<QtdMaterialSubsistemaCmdoType>({
    url: "/materiaisom/qtd/subsistema/cmdo",
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
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const comandoIndex = config.dataPointIndex;
          const subsistemaIndex = config.seriesIndex;

          const comando = chartContext.w.globals.labels[comandoIndex];       // ex: 'CMS'
          const subsistema = chartContext.w.config.series[subsistemaIndex].name; // ex: 'CTC'

          onSelectCategoria(comando, subsistema);
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "79%",
        dataLabels: {
          position: "top",
          hideOverflowingLabels: true
        },
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
      offsetY: -25,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
    xaxis: {
      categories: data.map((item) => item.cmdo),
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
    colors: ["#91DE18", "#DE7118", "#1818DE", "#986BE0"],
    legend: { show: true },
  };

  const series = [
    {
      name: "CTC",
      data: data.map((item) => item.ctc),
    },
    {
      name: "TAT",
      data: data.map((item) => item.tat),
    },
    {
      name: "SAT",
      data: data.map((item) => item.sat),
    },
    {
      name: "OUT",
      data: data.map((item) => item.out),
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
          <ReactApexChart options={options} series={series} type="bar" height={600} width={1400} />
        </div>
      )}
    </div>
  );
};

export default QtdMaterialSubsistemaCmdo;
