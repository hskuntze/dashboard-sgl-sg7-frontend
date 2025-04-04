import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useFetchData } from "utils/hooks/usefetchdata";
import { useElementSize } from "utils/hooks/useelementsize";
import { ExecucaoFinanceiraType } from "types/relatorio/execucaofinanceira";
import { formatarNumero } from "utils/functions";

interface Props {
  selectedData?: ExecucaoFinanceiraType[];
}

const ExecucaoFinanceira = ({ selectedData }: Props) => {
  const { data, loading } = useFetchData<ExecucaoFinanceiraType>({
    url: "/execucaofinanceira",
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
        columnWidth: "80%",
        dataLabels: {
          position: "top",
          hideOverflowingLabels: true
        }
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "10px",
        fontFamily: "Nunito, serif",
        fontWeight: 500,
        colors: ["#333"],
      },
      formatter: (val: number) => (val > 0 ? formatarNumero(val) : ""),
      offsetY: -20,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => (val > 0 ? val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : ""),
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
        formatter: (val: number) => formatarNumero(val)
      },
    },
    colors: ["#EE5600", "#E3000F", "#760076", "#09D809"],
    legend: { show: true },
  };

  const series = [
    {
      name: "PDR 2024",
      data: [...data.map((item) => item.pdr2024)],
    },
    {
      name: "Descentralizado",
      data: [...data.map((item) => item.descentralizado)],
    },
    {
      name: "Empenhado",
      data: [...data.map((item) => item.empenhado)],
    },
    {
      name: "RPNP",
      data: [...data.map((item) => item.rpnp)],
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
          <ReactApexChart options={options} series={series} type="bar" height={300} width={610} />
        </div>
      )}
    </div>
  );
};

export default ExecucaoFinanceira;
