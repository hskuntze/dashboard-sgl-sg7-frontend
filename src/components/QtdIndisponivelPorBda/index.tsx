import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdIndisponivelPorBdaType } from "types/relatorio/qtdindisponivelporbda";

import "./styles.css";

interface Props {
  selectedData?: QtdIndisponivelPorBdaType[];
}

const QtdIndisponivelPorBda = ({ selectedData }: Props) => {
  const [data, setData] = useState<QtdIndisponivelPorBdaType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(() => {
    setLoading(true);

    if (selectedData && selectedData.length > 0) {
      setData(selectedData);
      setLoading(false);
    } else {
      const requestParams: AxiosRequestConfig = {
        url: "/materiaisom/qtd/indisponivelbda",
        method: "GET",
        withCredentials: true,
      };

      requestBackend(requestParams)
        .then((res) => {
          setData(res.data as QtdIndisponivelPorBdaType[]);
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

  const sortedData = data
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 10);

  // Define os rótulos e valores para o gráfico de pizza
  const labels = sortedData.map((item) => {
    // Verifica se o valor é "Vinculação direta ao CMDO"
    if (item.bda === "Vinculação direta ao CMDO") {
      return "Vinculação direta"; // Substitui pelo valor desejado
    }
    return item.bda; // Mantém os outros valores inalterados
  });
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
        const rmLabel = opts.w.config.labels[opts.seriesIndex];
        const value = val;
        return [`${value.toFixed(2)}%`, rmLabel];
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 3,
        opacity: 0.7,
      },
      offsetX: 0, // Ajusta o deslocamento horizontal
      offsetY: 0, // Ajusta o deslocamento vertical
      distributed: true,
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
      "#7300F5",
      "#7F16DB",
      "#7927C2",
      "#7132A8",
      "#67398F",
      "#5A3B75",
      "#4B375C",
      "#392E42",
      "#2E2933",
      "#4C4850",
    ],
    stroke: {
      show: false,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          minAngleToShowLabel: 20,
          offset: -30,
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
            height={400}
            width={400}
          />
        </div>
      )}
    </div>
  );
};

export default QtdIndisponivelPorBda;
