import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { QtdMaterialSubsistemaType } from "types/relatorio/qtdmaterialsubsistema";

interface Props {
  selectedData?: QtdMaterialSubsistemaType[];
}

const QtdMaterialSubsistemaSmall = ({ selectedData }: Props) => {
  const [data, setData] = useState<QtdMaterialSubsistemaType[]>([]);
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
          width: 260,
        });
      } else if (newWidth >= 768 && newWidth < 1600) {
        setElementSize({
          height: 300,
          width: 300,
        });
      } else {
        setElementSize({
          height: 300,
          width: 320,
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
      setTimeout(() => {
        setData(selectedData);
      }, 300);
      setLoading(false);
    } else {
      const requestParams: AxiosRequestConfig = {
        url: "/materiaisom/qtd/subsistema",
        method: "GET",
        withCredentials: true,
      };

      requestBackend(requestParams)
        .then((res) => {
          setTimeout(() => {
            setData(res.data as QtdMaterialSubsistemaType[]);
          }, 300);
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

  const labels = data.map((item) => item.subsistema);
  const values = data.map((item) => item.quantidade);

  const colorMap: Record<string, string> = {
    "CTC": "#64E324",
    "SAT": "#E3DA24",
    "TAT": "#E37D24",
    // Adicione mais subsistemas conforme necessário
  };

  const colors = labels.map((label) => colorMap[label] || "#000");

  const options: ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      fontFamily: "Nunito, serif",
      offsetX: elementSize.width < 320 ? 0 : -40,
      animations: {
        enabled: true,
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 1000,
        },
      },
    },
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
        fontSize: "12px",
        fontWeight: "bold",
        fontFamily: "Nunito, serif",
        colors: ["#FFF"],
      },
      formatter: function (val: number, opts) {
        return opts.w.config.labels[opts.seriesIndex];
      },
    },
    legend: {
      position: "left",
      fontSize: "14px",
      fontFamily: "Nunito, serif",
      fontWeight: 800,
      formatter: (val) => `${val}`,
      show: true,
      offsetY: elementSize.width < 320 ? 25 : 60,
    },
    labels: labels,
    colors: colors,
    stroke: {
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Nunito, serif",
              color: "#333",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
              },
            },
            value: {
              fontSize: "22px",
              fontWeight: "bold",
              fontFamily: "Nunito, serif",
              color: "#333",
            },
          },
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
            type="donut"
            // height={350}
            // width={350}
            height={elementSize.height}
            width={elementSize.width}
          />
          <div className="quantidade-container">
            {data.map((x) => (
              <div className="quantidade">
                <span className="quantidade-value">{new Intl.NumberFormat("pt-BR").format(x.quantidade)}</span>
                <span className="quantidade-title">{x.subsistema}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QtdMaterialSubsistemaSmall;
