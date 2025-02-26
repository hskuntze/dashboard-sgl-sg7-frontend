import { ApexOptions } from "apexcharts";
import { AxiosRequestConfig } from "axios";
import Loader from "components/Loader";
import { useCallback, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { toast } from "react-toastify";
import { requestBackend } from "utils/requests";

const QtdMaterialTotalGauge = () => {
  const [data, setData] = useState<number>(0); // Inicializa com 0 para evitar erros
  const [loading, setLoading] = useState<boolean>(false);

  const MAX_VALUE = 50000; // Valor máximo para o gauge

  const loadData = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/materiaisom/total",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        toast.error("Erro ao carregar total de materiais para formar a porcentagem.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const percentage = (data / MAX_VALUE) * 100; // Converte para porcentagem

  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      background: "transparent",
      fontFamily: "Nunito, serif",
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#E0E0E0", // Cor da trilha
          strokeWidth: "100%",
        },
        offsetY: 50,
        dataLabels: {
          name: {
            show: false,
            fontSize: "18px",
            fontWeight: "bold",
            color: "#141824",
            fontFamily: "Nunito, serif",
            offsetY: 5,
          },
          value: {
            show: true,
            fontSize: "27px",
            fontWeight: "bold",
            color: "#141824",
            fontFamily: "Nunito, serif",
            offsetY: 0,
            formatter: () => `${percentage.toFixed(1)}%`, // Exibe o valor real
          },
        },
      },
    },
    colors: ["#091633"], // Cor do gauge
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
          <ReactApexChart options={options} series={[percentage]} type="radialBar" height={250} width={300} />
        </div>
      )}
    </div>
  );
};

export default QtdMaterialTotalGauge;
