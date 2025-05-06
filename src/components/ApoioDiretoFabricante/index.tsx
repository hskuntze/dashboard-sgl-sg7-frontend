import { useState, useEffect } from "react";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { useFetchData } from "utils/hooks/usefetchdata";
import { ApoioDiretoFabricanteType } from "types/relatorio/apoiodiretofabricante";

interface Props {
  selectedData?: ApoioDiretoFabricanteType[];
}

const ApoioDiretoFabricante = ({ selectedData }: Props) => {
  const { data, loading } = useFetchData<ApoioDiretoFabricanteType>({
    url: "/apoiodireto/fabricante",
    initialData: selectedData,
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
          height: 300,
          width: 320,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const labels = data.map((item) => item.fabricante);
  const values = data.map((item) => item.quantidade);

  const colors = ["#AAB0F0", "#C6C2A1"];

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
        fontSize: "10px",
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
      formatter: function (label: string, opts) {
        const series = opts.w.globals.series;
        const total = series.reduce((acc: number, val: number) => acc + val, 0);
        const index = opts.seriesIndex;
        const value = series[index];
        const percent = ((value / total) * 100).toFixed(1); // arredondado com 1 casa decimal
        return `${label} - ${percent}%`;
      },
      show: true,
      offsetY: 100,
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
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
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
            height={480}
            width={480}
          />
        </div>
      )}
    </div>
  );
};

export default ApoioDiretoFabricante;
