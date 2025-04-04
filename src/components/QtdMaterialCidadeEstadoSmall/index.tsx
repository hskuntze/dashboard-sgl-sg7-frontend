import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdMaterialCidadeEstadoType } from "types/relatorio/qtdmaterialcidadeestado";

import "./styles.css";
import { useElementSize } from "utils/hooks/useelementsize";
import { useFetchData } from "utils/hooks/usefetchdata";

interface Props {
  selectedData?: QtdMaterialCidadeEstadoType[];
}

const QtdMaterialCidadeEstadoSmall = ({ selectedData }: Props) => {
  const { data, loading } = useFetchData<QtdMaterialCidadeEstadoType>({
    url: "/materiaisom/qtd/cidadeestado",
    initialData: selectedData,
  });

  const elementSize = useElementSize();

  const top10Data = [...data].sort((a, b) => b.quantidade - a.quantidade).slice(0, 10);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 1000,
        },
      },
    },
    title: {
      text: "",
      align: "center",
      style: {
        fontSize: "1px",
        fontWeight: "bold",
        color: "#141824",
        fontFamily: "Nunito, serif",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        barHeight: "100%",
        colors: {
          ranges: [
            {
              from: 0,
              to: 100000,
              color: selectedData && selectedData.length > 0 ? "#5D29A6" : "#51337B",
            },
          ],
        },
      },
    },
    xaxis: {
      categories: top10Data.map((item) => item.cidadeestado),
      title: {
        text: "Cidade/UF",
        style: {
          fontSize: "1px",
          fontWeight: "bold",
          color: "#141824",
          fontFamily: "Nunito, serif",
        },
      },
    },
    grid: {
      show: false,
    },
    yaxis: {
      title: {
        text: "",
        style: {
          fontSize: "1px",
          fontWeight: "bold",
          color: "#141824",
          fontFamily: "Nunito, serif",
        },
      },
      show: false,
    },
    dataLabels: {
      style: {
        colors: selectedData && selectedData.length > 0 ? ["#020202"] : ["#fff"],
        fontWeight: 700,
        fontFamily: "Nunito, serif",
        fontSize: elementSize.width > 400 ? "12px" : "6px",
      },
      enabled: true,
      offsetY: 10,
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      y: {
        formatter: (val: number) => `${val}`,
      },
      style: {
        fontSize: "15px",
        fontFamily: "Nunito, serif",
      },
    },
    legend: {
      show: false,
    },
  };

  const series = [
    {
      name: "Quantidade",
      data: top10Data.map((item) => item.quantidade),
    },
  ];

  return (
    <div className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <div className="severity-column-chart">
          <ReactApexChart options={options} series={series} type="bar" height={elementSize.height} width={elementSize.width} />
        </div>
      )}
    </div>
  );
};

export default QtdMaterialCidadeEstadoSmall;
