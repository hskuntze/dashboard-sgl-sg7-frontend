import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdMaterialTipoEqpExistentePrevisto } from "types/relatorio/qtdmaterialtipoeqp";
import { useFetchData } from "utils/hooks/usefetchdata";
import { useElementSize } from "utils/hooks/useelementsize";

interface Props {
  selectedData?: QtdMaterialTipoEqpExistentePrevisto[];
}

const QtdMaterialTipoEqpSmall = ({ selectedData }: Props) => {
  const { data, loading } = useFetchData<QtdMaterialTipoEqpExistentePrevisto>({
    url: "/materiaisom/qtd/tipoeqp",
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
        horizontal: true,
        columnWidth: "60%",
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
        fontFamily: "Nunito, serif",
        fontWeight: 600,
        colors: ["#333"],
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
    xaxis: {
      categories: data.map((item) => item.tipo),
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
    colors: ["#00A023", "#FF5733"],
    legend: { show: true },
  };

  const series = [
    {
      name: "Existente",
      data: data.map((item) => item.existente),
    },
    {
      name: "Previsto",
      data: data.map((item) => item.previsto),
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
          <ReactApexChart options={options} series={series} type="bar" height={320} width={540} />
        </div>
      )}
    </div>
  );
};

export default QtdMaterialTipoEqpSmall;
