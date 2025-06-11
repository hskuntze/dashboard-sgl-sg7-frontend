import { ApexOptions } from "apexcharts";
import { AxiosRequestConfig } from "axios";
import Loader from "components/Loader";
import { useCallback, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { toast } from "react-toastify";
import { requestBackend } from "utils/requests";

const MetaEmpenhada20XE = () => {
  const [data, setData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/acao20xe/meta/empenhada",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as number);
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

  const getColor = (percentage: number) => {
    if (percentage <= 30) return "#F41C00";
    if (percentage <= 60) return "#DCC701";
    return "#02C208";
  };

  const percentage = data;

  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      fontFamily: "Nunito, serif",
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#E0E0E0",
          strokeWidth: "100%",
        },
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
            formatter: () => `${percentage.toFixed(2)}%`,
          },
        },
      },
    },
    colors: [getColor(percentage)],
  };

  return (
    <div className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <div className="severity-column-chart">
          <ReactApexChart options={options} series={[percentage]} type="radialBar" height={450} width={500} />
        </div>
      )}
    </div>
  );
};

export default MetaEmpenhada20XE;
