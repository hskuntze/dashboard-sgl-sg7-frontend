import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { ValorTotalCodaoDiariaPassagem } from "types/relatorio/totalcodaodiariapassagem";

const ValorTotalCodAoDiariaPassagemSmall = () => {
  const [data, setData] = useState<ValorTotalCodaoDiariaPassagem[]>([]);
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
      url: "/materiaisom/diariaspassagens/codao",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as ValorTotalCodaoDiariaPassagem[]);
      })
      .catch(() => {
        toast.error("Erro ao carregar dados de valor total de diárias e passagens por classificação.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const anos = Array.from(new Set(data.map((item) => item.ano)));
  const codAos = Array.from(new Set(data.map((item) => item.codAo)));

  const series = codAos.map((codAo) => {
    const dataForCodAo = anos.map((ano) => {
      const item = data.find((d) => d.ano === ano && d.codAo === codAo);
      return item ? item.total : 0;
    });
    return {
      name: codAo,
      data: dataForCodAo,
    };
  });

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: {
        show: false,
      },
      stacked: true,
      fontFamily: "Nunito, serif",
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      min: 10000,
      max: 1230000,
      categories: anos, // Definindo os anos no eixo X
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Nunito, serif",
          fontWeight: 600,
        },
        formatter: (value) =>
          `${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(value))}`,
        show: false,
      },
    },
    yaxis: {
      show: true,
      title: {
        text: "Total",
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
      onDatasetHover: {
        highlightDataSeries: true,
      },
      y: {
        formatter: (value: number) => {
          return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value);
        },
      },
    },
    colors: ["#001EDB", "#0088DC", "#DBA800", "#008A7D", "#521389"],
    dataLabels: {
      enabled: true, // Remove os valores escritos dentro das barras
      style: {
        fontSize: "10px",
        fontWeight: 700,
        colors: ["#000"],
      },
      background: {
        opacity: 0.7,
        foreColor: "#f3f3f3",
      },
      formatter: (value: number) => {
        return value < 200000 // Defina o limite mínimo aqui
          ? ""
          : new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value);
      },
    },
    legend: {
      position: "bottom",
    },
  };

  return (
    <div className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <ReactApexChart options={options} series={series} type="bar" height={elementSize.height} width={elementSize.width} />
      )}
    </div>
  );
};

export default ValorTotalCodAoDiariaPassagemSmall;
