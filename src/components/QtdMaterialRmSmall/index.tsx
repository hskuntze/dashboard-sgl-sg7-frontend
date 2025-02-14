import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdMaterialRmType } from "types/relatorio/qtdmaterialrm";

import "./styles.css";

interface Props {
  selectedData?: QtdMaterialRmType[];
}

const QtdMaterialRmSmall = ({ selectedData }: Props) => {
  const [data, setData] = useState<QtdMaterialRmType[]>([]);
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
      setData(selectedData);
      setLoading(false);
    } else {
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
    }
  }, [selectedData]);

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
        fontSize: "13px",
        fontWeight: "bold",
        fontFamily: "Nunito, serif",
        colors: ["#FFF"],
      },
      formatter: function (val: number, opts) {
        const rmLabel = opts.w.config.labels[opts.seriesIndex]; // Obtém o nome da RM
        const value = val; // Obtém o valor formatado
        return [`${value.toFixed(2)}%`, rmLabel]; // Exibe "xª RM" e o valor na fatia da pizza
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
      show: false,
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
    plotOptions: {
      pie: {
        dataLabels: {
          minAngleToShowLabel: 20,
          offset: -10,
        },
      },
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
            height={elementSize.height}
            width={elementSize.width}
          />
        </div>
      )}
    </div>
  );
};

export default QtdMaterialRmSmall;
