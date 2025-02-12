import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdMaterialBdaType } from "types/relatorio/qtdmaterialbda";

const QtdMaterialBdaSmall = () => {
  const [data, setData] = useState<QtdMaterialBdaType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
          fontSize: "12px",
          colors: "#31374a",
        },
      },
    },
    yaxis: {
      show: true,
      labels: {
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
            height={300}
            width={450}
          />
        </div>
      )}
    </div>
  );
};

export default QtdMaterialBdaSmall;