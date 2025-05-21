import Loader from "components/Loader";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { useFetchData } from "utils/hooks/usefetchdata";
import Chart from "components/Chart";
import { ApoioDiretoOmType } from "types/relatorio/apoiodiretoom";

interface Props {
  selectedData?: ApoioDiretoOmType[];
  onSelectOm: (om: string | null) => void;
}

const ApoioDiretoOM = ({ selectedData, onSelectOm }: Props) => {
  const { data, loading } = useFetchData<ApoioDiretoOmType>({
    url: "/apoiodireto/om",
    initialData: selectedData,
  });

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
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedIndex = config.dataPointIndex;
          const clickedItem = data[selectedIndex];

          onSelectOm(clickedItem.om);
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
              color: "#7BB2F5",
            },
          ],
        },
        dataLabels: {
          position: "top",
        },
      },
    },
    xaxis: {
      categories: data.map((item) => item.om),
      title: {
        text: "Cat.",
        style: {
          fontSize: "1px",
          fontWeight: "bold",
          color: "#141824",
          fontFamily: "Nunito, serif",
        },
      },
      labels: {
        style: {
          fontSize: "11px",
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
      offsetY: -20,
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

  const series = [{ name: "Quantidade", data: data.map((item) => item.quantidade) }];

  return (
    <div className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <div className="severity-column-chart">
          <Chart options={options} series={series} type="bar" height={350} width={1100} />
        </div>
      )}
    </div>
  );
};

export default ApoioDiretoOM;
