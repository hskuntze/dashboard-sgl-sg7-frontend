import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdMaterialRmType } from "types/relatorio/qtdmaterialrm";

import "./styles.css";

const QtdMaterialRm = () => {
  const [data, setData] = useState<QtdMaterialRmType[]>([]);
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
      url: "/materiaisom/qtd/rm",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as QtdMaterialRmType[]);
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

  // Função para extrair o número da RM (ex: "3ª RM" -> 3)
  const extractNumber = (rm: string) => {
    const match = rm.match(/^(\d+)ª RM$/);
    return match ? parseInt(match[1], 10) : 999; // Se não encontrar, coloca no final
  };

  // Ordena os dados corretamente de 1 a 12
  const sortedData = [...data].sort(
    (a, b) => extractNumber(a.rm) - extractNumber(b.rm)
  );

  // Define os rótulos e valores para o gráfico de pizza
  const labels = sortedData.map((item) => item.rm);
  const values = sortedData.map((item) => item.quantidade);

  const options: ApexOptions = {
    chart: {
      type: "pie",
      background: "transparent",
      width: 500,
      height: 500,
    },
    title: {
      text: "Materiais Classe VII - RM",
      align: "center",
      style: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#141824",
        fontFamily: "Nunito, serif",
      },
    },
    labels: labels,
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val}`,
      },
      style: {
        fontSize: "15px",
        fontFamily: "Nunito, serif",
      },
      fillSeriesColor: false,
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        fontFamily: "Nunito, serif",
        colors: ["#FFF"],
      },
      formatter: function (val: number, opts) {
        return opts.w.config.series[opts.seriesIndex].toLocaleString(); // Formata o valor real
      },
    },
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontFamily: "Nunito, serif",
      fontWeight: 800,
      formatter: (val) => `${val}`,
      width: 400,
      offsetX: 80,
    },
    colors: [
      "#A7C0F2",
      "#ABBCDD",
      "#ABB5C8",
      "#9AA2B3",
      "#7A869D",
      "#5E6C88",
      "#465573",
      "#31405E",
      "#202D48",
      "#121D33",
      "#0E1A33",
      "#0A1833",
    ],
    stroke: {
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
        <div className="severity-column-chart">
          <ReactApexChart
            options={options}
            series={values}
            type="pie"
            height={500}
            width={600}
          />
        </div>
      )}
    </div>
  );
};

export default QtdMaterialRm;
