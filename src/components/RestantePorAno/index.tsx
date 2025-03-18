import { useState, useEffect } from "react";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { useFetchData } from "utils/hooks/usefetchdata";
import { RestanteAno } from "types/relatorio/restanteano";

const RestantePorAno = () => {
  const { data, loading } = useFetchData<RestanteAno>({
    url: "/execucao/restante",
    initialData: null,
  });

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
          height: 400,
          width: 420,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Chama a função uma vez para definir o estado inicial

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const labels = data.map((item) => item.ano);
  const values = data.map((item) => item.valor);

  const colorMap: Record<string, string> = {
    2022: "#DB0600",
    2023: "#DB6C00",
    2024: "#43DB00",
    // Adicione mais subsistemas conforme necessário
  };

  const colors = labels.map((label) => colorMap[label] || "#000");

  const options: ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
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
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)}`,
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
                let total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total);
              },
            },
            value: {
              fontSize: "17px",
              fontWeight: "bold",
              fontFamily: "Nunito, serif",
              color: "#333",
              formatter: function (w) {
                return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(w));
              },
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
            height={elementSize.height}
            width={elementSize.width}
          />
        </div>
      )}
    </div>
  );
};

export default RestantePorAno;
