import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useFetchData } from "utils/hooks/usefetchdata";
import { useElementSize } from "utils/hooks/useelementsize";
import { QtdMaterialDisponibilidadeCmdoType } from "types/relatorio/qtdmaterialdisponibilidadecmdo";

interface Props {
  selectedData?: QtdMaterialDisponibilidadeCmdoType[];
}

const QtdMaterialDisponibilidadePorCmdo = ({ selectedData }: Props) => {
  const { data, loading } = useFetchData<QtdMaterialDisponibilidadeCmdoType>({
    url: "/materiaisom/qtd/material/cmdo",
    initialData: selectedData,
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
      offsetX: 5,
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
    colors: ["#DEA35B", "#A4E009"],
    legend: { show: true },
  };

  const series = [
    {
      name: "Disponível",
      data: data.map((item) => item.disponivel),
    },
    {
      name: "Indisponível",
      data: data.map((item) => item.indisponivel),
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

export default QtdMaterialDisponibilidadePorCmdo;
