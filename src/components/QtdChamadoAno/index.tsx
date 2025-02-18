import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdChamadoAnoType } from "types/relatorio/qtdchamadosano";

import "./styles.css";

const QtdChamadoAno = () => {
  const [data, setData] = useState<QtdChamadoAnoType[]>([]);
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
      url: "/chamados/ano",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setTimeout(() => {
          setData(res.data as QtdChamadoAnoType[]);
        }, 300);
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
      text: "Chamados por Ano - SGL (Garantia)",
      align: "center",
      style: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#141824",
        fontFamily: "Nunito, serif",
      },
    },
    xaxis: {
      categories: labels, // Anos como categorias no eixo X
      title: {
        text: "Ano",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          fontFamily: "Nunito, serif",
        },
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
      style: {
        fontSize: "15px",
        fontFamily: "Nunito, serif",
      },
    },
    dataLabels: {
      enabled: true, // Desabilitado para gráficos de linha
      style: {
        fontSize: "20px",
        fontFamily: "Nunito, serif",
      },
    },
    markers: {
      size: 6, // Tamanho dos marcadores nos pontos da linha
      colors: ["#F54D00"], // Cor dos marcadores
      strokeColors: "#ffffff", // Cor de borda dos marcadores
      strokeWidth: 2, // Largura da borda dos marcadores
    },
    stroke: {
      width: 3, // Largura da linha
      curve: "smooth", // Linha suave
    },
    colors: ["#F54D00"], // Cor da linha
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
        <div className="severity-column-chart">
          <ReactApexChart
            options={options}
            series={[{ name: "Quantidade", data: values }]}
            type="line"
            height={600}
            width={size.width > 2500 ? 800 : 1500}
          />
        </div>
      )}
    </div>
  );
};

export default QtdChamadoAno;
