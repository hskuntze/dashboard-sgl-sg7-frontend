import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { QtdChamadoCategoriaType } from "types/relatorio/qtdchamadoscategoria";

interface Props {
  ano: number;
}

const QtdChamadoSubsistemaSmall = ({ ano }: Props) => {
  const [data, setData] = useState<QtdChamadoCategoriaType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [subsistema, setSubsistema] = useState<string>();

  const [elementSize, setElementSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;

      if (newWidth < 768) {
        setElementSize({
          height: 300,
          width: 300,
        });
      } else if (newWidth >= 768 && newWidth < 1600) {
        setElementSize({
          height: 300,
          width: 400,
        });
      } else if (newWidth >= 1600 && newWidth < 1800) {
        setElementSize({
          height: 570,
          width: 620,
        });
      } else {
        setElementSize({
          height: 670,
          width: 750,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Chama a função uma vez para definir o estado inicial

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadData = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: `/chamados/subsistema/${ano}`,
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as QtdChamadoCategoriaType[]);
      })
      .catch(() => {
        toast.error("Erro ao carregar dados de quantidade de chamados por ano.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ano]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const series = [
    {
      name: "Quantidade",
      data: [...data.map((item) => item.quantidade)],
    },
  ];

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
          const clickedItem = data[selectedIndex];

          setSubsistema(clickedItem.categoria);
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "13px",
        fontFamily: "Nunito, serif",
        fontWeight: "bold",
        colors: ["#333"],
      },
      offsetY: -20,
    },
    xaxis: {
      categories: [...data.map((item) => item.categoria)],
      labels: {
        style: {
          fontSize: "10px",
          fontFamily: "Nunito, serif",
          fontWeight: 600,
        },
        rotate: -40,
      },
    },
    yaxis: {
      title: {
        text: "Quantidade",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          fontFamily: "Nunito, serif",
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
    colors: [
      "#3091E6",
      "#30E6C5",
      "#3058E6",
      "#30E688",
      "#31CDE8",
      "#E68B37",
      "#E66C37",
      "#E6D037",
      "#E8A22A",
      "#E64E30",
      "#2047E6",
      "#3820E6",
      "#BA20E6",
      "#8C41E8",
    ],
    grid: {
      show: false,
    },
    legend: {
      show: false,
    },
  };

  return (
    <div className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <ReactApexChart options={options} series={series} type="bar" height={elementSize.height} width={elementSize.width} />
      )}
    </div>
  );
};

export default QtdChamadoSubsistemaSmall;
