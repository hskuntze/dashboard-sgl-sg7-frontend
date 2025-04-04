import { useState } from "react";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdMaterialCmdoType } from "types/relatorio/qtdmaterialcmdo";

import "./styles.css";
import { useElementSize } from "utils/hooks/useelementsize";
import { useFetchData } from "utils/hooks/usefetchdata";

interface Props {
  onSelectedItem: (cmdo: string | null) => void;
}

const QtdMaterialCmdoSmall = ({ onSelectedItem }: Props) => {
  const { data, loading } = useFetchData<QtdMaterialCmdoType>({
    url: "/materiaisom/qtd/cmdo",
    initialData: null
  });

  const elementSize = useElementSize();

  const sortedData = data.sort((a, b) => b.quantidade - a.quantidade).filter((a, b) => a.cmdo !== "");

  const [selectedItem, setSelectedItem] = useState<QtdMaterialCmdoType | null>(null);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: {
        show: false,
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedIndex = config.dataPointIndex;
          const clickedItem = sortedData[selectedIndex];

          if (clickedItem && clickedItem.cmdo === selectedItem?.cmdo) {
            // Desseleção: o mesmo item foi clicado novamente
            setSelectedItem(null);
            onSelectedItem(null); // Notifica que nenhum item está selecionado
          } else {
            // Seleção: um novo item foi clicado
            setSelectedItem(clickedItem);
            onSelectedItem(clickedItem.cmdo);
          }
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 0,
        barHeight: "100%",
        colors: {
          ranges: [
            {
              from: 0,
              to: 100000,
              color: "#E6B301",
            },
          ],
        },
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: sortedData.map((item) => item.cmdo),
      title: {
        style: {
          fontSize: "0px",
          fontWeight: "bold",
          color: "#141824",
          fontFamily: "Nunito, serif",
        },
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
          fontWeight: "bold",
          color: "#141824",
          fontFamily: "Nunito, serif",
        },
      },
      show: true,
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
    dataLabels: {
      style: {
        colors: ["#303030"],
        fontWeight: 700,
        fontFamily: "Nunito, serif",
        fontSize: "14px",
      },
      offsetX: 5,
      enabled: true,
    },
    legend: {
      show: false,
    },
  };

  const series = [
    {
      name: "Quantidade",
      data: sortedData.map((item) => item.quantidade),
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

export default QtdMaterialCmdoSmall;
