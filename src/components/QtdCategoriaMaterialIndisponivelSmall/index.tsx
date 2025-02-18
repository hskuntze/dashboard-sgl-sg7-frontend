import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { CategoriaMaterialIndisponivelType } from "types/relatorio/qtdcategoriamaterialindisponivel";

import "./styles.css";

interface Props {
  selectedData?: CategoriaMaterialIndisponivelType[];
}

const QtdCategoriaMaterialIndisponivelSmall = ({ selectedData }: Props) => {
  const [data, setData] = useState<CategoriaMaterialIndisponivelType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
          height: 300,
          width: 420,
        });
      } else {
        setElementSize({
          height: 300,
          width: 450,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Chama a função uma vez para definir o estado inicial

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadData = useCallback(() => {
    setLoading(true);

    if (selectedData && selectedData.length > 0) {
      setTimeout(() => {
        setData(selectedData);
      }, 300);
      setLoading(false);
    } else {
      const requestParams: AxiosRequestConfig = {
        url: "/materiaisom/qtd/ctgmtindisponivel",
        method: "GET",
        withCredentials: true,
      };

      requestBackend(requestParams)
        .then((res) => {
          setTimeout(() => {
            setData(res.data as CategoriaMaterialIndisponivelType[]);
          }, 300);
        })
        .catch(() => {
          toast.error(
            "Erro ao carregar dados de quantidade de categorias de materiais indisponíveis."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const top10Data =
    selectedData && selectedData.length > 0
      ? [...data].sort((a, b) => b.quantidade - a.quantidade).slice(0, 10)
      : [...data]
          .sort((a, b) => b.quantidade - a.quantidade)
          .slice(0, 10)
          .filter((a, b) => a.categoria !== "OUTROS");

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
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={elementSize.height}
            width={elementSize.width}
          />
        </div>
      )}
    </div>
  );
};

export default QtdCategoriaMaterialIndisponivelSmall;
