import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdMaterialCmdoType } from "types/relatorio/qtdmaterialcmdo";

import "./styles.css";

const QtdMaterialCmdoSmall = () => {
  const [data, setData] = useState<QtdMaterialCmdoType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/materiaisom/qtd/cmdo",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as QtdMaterialCmdoType[]);
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

  const sortedData = data.sort((a, b) => b.quantidade - a.quantidade).filter((a, b) => a.cmdo !== "");

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 0,
        barHeight: "100%",
        colors: {
          ranges: [
            {
              from: 0,
              to: 100000,
              color: "#006CFA",
            },
          ],
        },
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: sortedData.map((item) => item.cmdo),
      title: {
        style: {
          fontSize: "0px",
          fontWeight: "bold",
          color: "#141824",
          fontFamily: "Nunito, serif",
        },
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
          fontWeight: "bold",
          color: "#141824",
          fontFamily: "Nunito, serif",
        },
      },
      show: true,
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
      style: {
        colors: ["#303030"],
        fontWeight: 700,
        fontFamily: "Nunito, serif",
        fontSize: "14px",
      },
      offsetX: 5,
      enabled: true,
    },
    legend: {
      show: false,
    },
  };

  const series = [
    {
      name: "Quantidade",
      data: sortedData.map((item) => item.quantidade),
    },
  ];

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
            series={series}
            type="bar"
            height={300}
            width={450}
          />
        </div>
      )}
    </div>
  );
};

export default QtdMaterialCmdoSmall;
