import "./styles.css";

import { ApexOptions } from "apexcharts";
import { AxiosRequestConfig } from "axios";
import Loader from "components/Loader";
import { useCallback, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { toast } from "react-toastify";
import { SomaFinanceira } from "types/relatorio/somafinanceira";
import { requestBackend } from "utils/requests";

const PorcentagemEmpenhadaGauge = () => {
  const [data, setData] = useState<SomaFinanceira>();
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/execucao/soma",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as SomaFinanceira);
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

  const percentage = data ? (data.despesasEmpenhadas / data.provisaoRecebida) * 100 : 0;

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
        },
        dataLabels: {
          name: {
            show: false,
            fontSize: "18px",
            fontWeight: "bold",
            color: "#141824",
            fontFamily: "Nunito, serif",
          },
          value: {
            show: true,
            fontSize: "27px",
            fontWeight: "bold",
            color: "#141824",
            fontFamily: "Nunito, serif",
            formatter: () => `${percentage.toFixed(1)}%`, // Exibe o valor real
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

export default PorcentagemEmpenhadaGauge;
