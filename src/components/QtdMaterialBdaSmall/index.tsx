import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdMaterialBdaType } from "types/relatorio/qtdmaterialbda";

interface Props {
  selectedData?: QtdMaterialBdaType[];
}

const QtdMaterialBdaSmall = ({ selectedData }: Props) => {
  const [data, setData] = useState<QtdMaterialBdaType[]>([]);
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
        url: "/materiaisom/qtd/bda",
        method: "GET",
        withCredentials: true,
      };

      requestBackend(requestParams)
        .then((res) => {
          setTimeout(() => {
            setData(res.data as QtdMaterialBdaType[]);
          }, 300);
        })
        .catch(() => {
          toast.error(
            "Erro ao carregar dados de quantidade de materiais por comando."
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

  // Ordena os dados do maior para o menor e seleciona os 10 primeiros
  const top10Data = [...data]
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 10);

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
        fontFamily: "Nunito, serif",
        fontSize: "2px",
        fontWeight: "bold",
        color: "#141824",
      },
    },
    plotOptions: {
      bar: {
        horizontal: true, // Define barras verticais
        columnWidth: "100%", // Define a largura das colunas
        dataLabels: {
          position: "center", // Exibe os valores no topo das barras
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}`, // Exibe valores dentro das barras
      style: {
        fontFamily: "Nunito, serif",
        fontSize: "12px",
        colors: ["#31374a"],
        fontWeight: 700,
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      y: {
        formatter: (val: number) => `${val}`, // Formata valores no tooltip
      },
      style: {
        fontFamily: "Nunito, serif",
        fontSize: "15px",
      },
    },
    xaxis: {
      categories: top10Data.map((item) => item.bda), // Usa apenas os 10 maiores
      labels: {
        show: true,
        style: {
          fontSize: elementSize.width > 400 ? "12px" : "8px",
          colors: "#31374a",
        },
      },
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          fontSize: elementSize.width > 400 ? "12px" : "10px",
        },
        formatter: (val: number) => `${val}`, // Formata os valores do eixo Y
      },
    },
    grid: {
      show: false,
    },
    colors: ["#00A023"], // Define a cor das barras
    legend: {
      show: true, // Oculta a legenda
    },
  };

  const series = [
    {
      name: "Quantidade",
      data: top10Data.map((item) => item.quantidade), // Usa apenas os 10 maiores
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

export default QtdMaterialBdaSmall;
