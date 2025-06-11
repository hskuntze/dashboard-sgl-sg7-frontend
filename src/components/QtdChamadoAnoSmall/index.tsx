import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdChamadoAnoType } from "types/relatorio/qtdchamadosano";

import "./styles.css";

interface Props {
  onSelectAno: (ano: number) => void;
}

const QtdChamadoAnoSmall = ({ onSelectAno }: Props) => {
  const [data, setData] = useState<QtdChamadoAnoType[]>([]);
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
      width: "100%",
      toolbar: {
        show: false,
      },
      fontFamily: "Nunito, serif",
      animations: {
        enabled: true,
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 1000,
        },
      },
      events: {
        markerClick: (event, chartContext, config) => {
          const selectedIndex = config.dataPointIndex;
          const clickedItem = data[selectedIndex];

          onSelectAno(clickedItem.ano);
        },
      },
      offsetX: 6,
    },
    xaxis: {
      categories: labels, // Anos como categorias no eixo X
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Nunito, serif",
          fontWeight: 600
        },
        offsetX: 0.5,
      }
    },
    yaxis: {
      show: false,
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
        fontSize: "13px",
        fontFamily: "Nunito, serif",
        fontWeight: "700",
      },
      background: {
        opacity: 0,
        foreColor: "#333",
      },
      offsetY: -7,
    },
    markers: {
      size: 6, // Tamanho dos marcadores nos pontos da linha
      colors: ["#0077F5"], // Cor dos marcadores
      strokeColors: "#ffffff", // Cor de borda dos marcadores
      strokeWidth: 2, // Largura da borda dos marcadores
    },
    stroke: {
      width: 3, // Largura da linha
      curve: "smooth", // Linha suave
    },
    colors: ["#0077F5"], // Cor da linha
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
          height={elementSize.height}
          width={elementSize.width}
        />
      )}
    </div>
  );
};

export default QtdChamadoAnoSmall;
