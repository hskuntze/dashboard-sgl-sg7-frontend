import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdMaterialCidadeEstadoType } from "types/relatorio/qtdmaterialcidadeestado";

import "./styles.css";

const QtdMaterialCidadeEstado = () => {
  const [data, setData] = useState<QtdMaterialCidadeEstadoType[]>([]);
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

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: {
        show: false,
      },
    },
    title: {
      text: "Materiais Classe VII - UF",
      align: "center",
      style: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#141824",
        fontFamily: "Nunito, serif",
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
              to: 200,
              color: "#A7C0F2",
            },
            {
              from: 201,
              to: 1500,
              color: "#5E6C88",
            },
            {
              from: 1501,
              to: 100000,
              color: "#0E1A33",
            },
          ],
        },
      },
    },
    xaxis: {
      categories: data.map((item) => item.cidadeestado),
      title: {
        text: "Quantidade",
        style: {
          fontSize: "14px",
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
        text: "UF",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          color: "#141824",
          fontFamily: "Nunito, serif",
        },
      },
    },
    dataLabels: {
      style: {
        colors: ["#141824"],
        fontWeight: 700,
        fontFamily: "Nunito, serif",
        fontSize: "16px",
      },
      offsetX: 5,
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
      data: data.map((item) => item.quantidade),
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
            height={size.height > 1400 ? 400 : 600}
            width={size.width > 2500 ? 500 : 700}
          />
        </div>
      )}
    </div>
  );
};

export default QtdMaterialCidadeEstado;
