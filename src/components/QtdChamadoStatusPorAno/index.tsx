import { ApexOptions } from "apexcharts";
import { AxiosRequestConfig } from "axios";
import Loader from "components/Loader";
import { useCallback, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { toast } from "react-toastify";
import { QtdChamadoStatusPorAnoType } from "types/relatorio/qtdchamadostatusporano";
import { requestBackend } from "utils/requests";

const QtdChamadoStatusPorAno = () => {
  const [data, setData] = useState<QtdChamadoStatusPorAnoType[]>([]);
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
      url: "/chamados/status/ano",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as QtdChamadoStatusPorAnoType[]);
      })
      .catch(() => {
        toast.error("Erro ao carregar dados de quantidade de chamados por ano.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const anos = Array.from(new Set(data.map((d) => d.ano))).sort();
  const statusUnicos = Array.from(new Set(data.map((d) => d.status)));

  const series = statusUnicos.map((status) => {
    const dadosPorAno = anos.map((ano) => {
      const item = data.find((d) => d.status === status && d.ano === ano);
      return item ? item.quantidade : 0;
    });

    return {
      name: status,
      data: dadosPorAno,
    };
  });

  const options: ApexOptions = {
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
      background: "transparent",
      width: "100%",
      toolbar: {
        show: false,
      },
      fontFamily: "Nunito, serif",
      animations: {
        enabled: true,
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 1000,
        },
      },
    },
    dataLabels: {
      enabled: true, // Desabilitado para gráficos de linha
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: anos,
    },
    legend: {
      position: "bottom",
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} chamados`,
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
        <ReactApexChart options={options} series={series} type="line" height={elementSize.height} width={elementSize.width} />
      )}
    </div>
  );
};

export default QtdChamadoStatusPorAno;
