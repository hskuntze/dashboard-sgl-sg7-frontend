import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { ValorTotalClassificacaoDiariaPassagem } from "types/relatorio/totalclassificacaodiariapassagem";

const ValorTotalClassificacaoDiariaPassagemSmall = () => {
  const [data, setData] = useState<ValorTotalClassificacaoDiariaPassagem[]>([]);
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

    const requestParams: AxiosRequestConfig = {
      url: "/materiaisom/diariaspassagens/classificacao",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as ValorTotalClassificacaoDiariaPassagem[]);
      })
      .catch(() => {
        toast.error(
          "Erro ao carregar dados de valor total de diárias e passagens por classificação."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Define os rótulos (anos) e valores (quantidade) para o gráfico de linha
  const anos = Array.from(new Set(data.map((item) => item.ano)));

  // 🔹 Organizando os dados para as séries
  const series = ["DIARIAS", "PASSAGENS"].map((classificacao) => ({
    name: classificacao,
    data: anos.map(
      (ano) =>
        data.find(
          (item) => item.ano === ano && item.classificacao === classificacao
        )?.total || 0
    ),
  }));

  const options: ApexOptions = {
    chart: {
      type: "area",
      background: "transparent",
      toolbar: {
        show: false,
      },
      stacked: true,
      fontFamily: "Nunito, serif",
    },
    xaxis: {
      categories: anos, // Definindo os anos no eixo X
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Nunito, serif",
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      title: {
        text: "Total",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          fontFamily: "Nunito, serif",
        },
      },
      labels: {
        formatter: (value: number) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value),
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
    stroke: {
      curve: "smooth"
    },
    colors: ["#0077F5", "#E37D24"], // Azul para DIARIAS e Laranja para PASSAGENS
    dataLabels: {
      enabled: true, // Remove os valores escritos dentro das barras
      style: {
        fontSize: "12px",
        fontWeight: 600,
        colors: ["#333"],
      },
      background: {
        opacity: 0.7,
        foreColor: "#f3f3f3",
      },
      formatter: (value: number) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value),
    },
    legend: {
      position: "bottom",
    },
    markers: {
      size: 5, // Tamanho dos marcadores nos pontos da linha
      colors: ["#0077F5", "#E37D24"], // Cor dos marcadores
      strokeColors: "#000", // Cor de borda dos marcadores
      strokeWidth: 1, // Largura da borda dos marcadores
    },
  };

  return (
    <div className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={elementSize.height}
          width={elementSize.width}
        />
      )}
    </div>
  );
};

export default ValorTotalClassificacaoDiariaPassagemSmall;
