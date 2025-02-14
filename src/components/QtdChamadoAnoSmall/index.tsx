import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdChamadoAnoType } from "types/relatorio/qtdchamadosano";

import "./styles.css";

const QtdChamadoAnoSmall = () => {
  const [data, setData] = useState<QtdChamadoAnoType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/chamados/ano",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as QtdChamadoAnoType[]);
      })
      .catch(() => {
        toast.error(
          "Erro ao carregar dados de quantidade de chamados por ano."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Ordena os dados por ano de forma crescente
  const sortedData = [...data].sort((a, b) => a.ano - b.ano);

  // Define os rótulos (anos) e valores (quantidade) para o gráfico de linha
  const labels = sortedData.map((item) => item.ano);
  const values = sortedData.map((item) => item.quantidade);

  const options: ApexOptions = {
    chart: {
      type: "line", // Mudado para gráfico de linha
      background: "transparent",
      height: 500,
      width: "100%",
      toolbar: {
        show: false,
      },
      fontFamily: "Nunito, serif",
    },
    xaxis: {
      categories: labels, // Anos como categorias no eixo X
      title: {
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          fontFamily: "Nunito, serif",
        },
      },
    },
    yaxis: {
      show: false, //REMOVER DEPOIS
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
      style: {
        fontSize: "15px",
        fontFamily: "Nunito, serif",
      },
    },
    dataLabels: {
      enabled: true, // Desabilitado para gráficos de linha
      style: {
        fontSize: "15px",
        fontFamily: "Nunito, serif",
        fontWeight: "700"
      },
      background: {
        opacity: 0,
        foreColor: "#333"
      },
      offsetY: -7,
    },
    markers: {
      size: 6, // Tamanho dos marcadores nos pontos da linha
      colors: ["#8987F4"], // Cor dos marcadores
      strokeColors: "#ffffff", // Cor de borda dos marcadores
      strokeWidth: 2, // Largura da borda dos marcadores
    },
    stroke: {
      width: 3, // Largura da linha
      curve: "smooth", // Linha suave
    },
    colors: ["#8987F4"], // Cor da linha
    grid: {
      show: false,
    },
    legend: {
      show: false, // Não exibe legenda para o gráfico de linha
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
          series={[{ name: "Quantidade", data: values }]}
          type="line"
          height={300}
          width={450}
        />
      )}
    </div>
  );
};

export default QtdChamadoAnoSmall;
