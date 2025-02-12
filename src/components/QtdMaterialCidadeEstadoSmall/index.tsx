import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdMaterialCidadeEstadoType } from "types/relatorio/qtdmaterialcidadeestado";

import "./styles.css";

const QtdMaterialCidadeEstadoSmall = () => {
  const [data, setData] = useState<QtdMaterialCidadeEstadoType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/materiaisom/qtd/cidadeestado",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as QtdMaterialCidadeEstadoType[]);
      })
      .catch(() => {
        toast.error(
          "Erro ao carregar dados de quantidade de materiais por cidade e estado."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const top10Data = [...data]
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 10);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: {
        show: false,
      },
    },
    title: {
      text: "",
      align: "center",
      style: {
        fontSize: "1px",
        fontWeight: "bold",
        color: "#141824",
        fontFamily: "Nunito, serif",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        barHeight: "70%",
        colors: {
          ranges: [
            {
              from: 0,
              to: 100000,
              color: "#0E1A33",
            },
          ],
        },
      },
    },
    xaxis: {
      categories: top10Data.map((item) => item.cidadeestado),
      title: {
        text: "Cidade/UF",
        style: {
          fontSize: "1px",
          fontWeight: "bold",
          color: "#141824",
          fontFamily: "Nunito, serif",
        },
      },
    },
    grid: {
      show: false,
    },
    yaxis: {
      title: {
        text: "",
        style: {
          fontSize: "1px",
          fontWeight: "bold",
          color: "#141824",
          fontFamily: "Nunito, serif",
        },
      },
      show: false,
    },
    dataLabels: {
      style: {
        colors: ["#fff"],
        fontWeight: 700,
        fontFamily: "Nunito, serif",
        fontSize: "11px",
      },
      enabled: true,
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
    legend: {
      show: false,
    },
  };

  const series = [
    {
      name: "Quantidade",
      data: top10Data.map((item) => item.quantidade),
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

export default QtdMaterialCidadeEstadoSmall;
