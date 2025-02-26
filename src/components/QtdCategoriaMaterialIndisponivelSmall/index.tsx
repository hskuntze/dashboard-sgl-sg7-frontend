import Loader from "components/Loader";
import { ApexOptions } from "apexcharts";
import { CategoriaMaterialIndisponivelType } from "types/relatorio/qtdcategoriamaterialindisponivel";

import "./styles.css";
import { useElementSize } from "utils/hooks/useelementsize";
import { useFetchData } from "utils/hooks/usefetchdata";
import Chart from "components/Chart";

interface Props {
  selectedData?: CategoriaMaterialIndisponivelType[];
}

const QtdCategoriaMaterialIndisponivelSmall = ({ selectedData }: Props) => {
  const { data, loading } = useFetchData<CategoriaMaterialIndisponivelType>({
    url: "/materiaisom/qtd/ctgmtindisponivel",
    initialData: selectedData,
  });

  const elementSize = useElementSize();

  const top10Data = data
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 10)
    .filter((item) => item.categoria !== "OUTROS");

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
        colors: {
          ranges: [
            {
              from: 0,
              to: 100000,
              color: "#D01B11",
            },
          ],
        },
      },
    },
    xaxis: {
      categories: top10Data.map((item) => item.categoria),
      title: {
        text: "Cat.",
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
      show: true,
    },
    dataLabels: {
      style: {
        colors: ["#333"],
        fontWeight: 700,
        fontFamily: "Nunito, serif",
        fontSize: "11px",
      },
      enabled: true,
      background: {
        enabled: true,
        borderColor: "#ccc",
        borderRadius: 5,
        borderWidth: 1,
        foreColor: "#fff",
      },
      offsetY: 20,
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

  const series = [{ name: "Quantidade", data: top10Data.map((item) => item.quantidade) }];

  return (
    <div className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <div className="severity-column-chart">
          <Chart options={options} series={series} type="bar" height={elementSize.height} width={elementSize.width} />
        </div>
      )}
    </div>
  );
};

export default QtdCategoriaMaterialIndisponivelSmall;
