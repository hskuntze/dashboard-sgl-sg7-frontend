import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdMaterialBdaType } from "types/relatorio/qtdmaterialbda";

const QtdMaterialBda = () => {
  const [data, setData] = useState<QtdMaterialBdaType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize(); // Atualiza no início
    window.addEventListener("resize", updateSize); // Atualiza ao redimensionar

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const loadData = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/materiaisom/qtd/bda",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as QtdMaterialBdaType[]);
      })
      .catch(() => {
        toast.error(
          "Erro ao carregar dados de quantidade de materiais por comando."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Ordena os dados do maior para o menor para facilitar a visualização
  const sortedData = [...data].sort((a, b) => b.quantidade - a.quantidade);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: {
        show: false,
      },
    },
    title: {
      text: "Materiais - BDA",
      align: "center",
      style: {
        fontFamily: "Nunito, serif",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#141824",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false, // Define barras verticais
        columnWidth: "80%", // Define a largura das colunas
        dataLabels: {
          position: "top", // Exibe os valores no topo das barras
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
      offsetY: -20,
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
      categories: sortedData.map((item) => item.bda),
      labels: {
        rotate: -90,
        style: {
          fontSize: "12px",
          colors: "#31374a",
        },
        offsetX: -1,
        offsetY: -5,
      },
    },
    yaxis: {
      show: false,
      title: {
        text: "Quantidade",
      },
      labels: {
        formatter: (val: number) => `${val}`, // Formata os valores do eixo Y
      },
    },
    grid: {
      show: false,
    },
    colors: ["#386346"], // Define a cor das barras
    legend: {
      show: true, // Oculta a legenda
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
        <div className="column-chart">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={600}
            width={size.width > 2500 ? 1600 : 1500}
          />
        </div>
      )}
    </div>
  );
};

export default QtdMaterialBda;
