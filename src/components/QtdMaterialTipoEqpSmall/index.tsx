import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { QtdMaterialTipoEqpExistentePrevisto } from "types/relatorio/qtdmaterialtipoeqp";

interface Props {
  selectedData?: QtdMaterialTipoEqpExistentePrevisto[];
}

const QtdMaterialTipoEqpSmall = ({ selectedData }: Props) => {
  const [data, setData] = useState<QtdMaterialTipoEqpExistentePrevisto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [elementSize, setElementSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setElementSize({
        height: 300,
        width:
          newWidth < 768
            ? 300
            : newWidth < 1600
            ? 400
            : newWidth < 1800
            ? 420
            : 450,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
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
        url: "/materiaisom/qtd/tipoeqp",
        method: "GET",
        withCredentials: true,
      };
      requestBackend(requestParams)
        .then((res) =>
          setTimeout(() => {
            setData(res.data as QtdMaterialTipoEqpExistentePrevisto[])
          }, 300)
        )
        .catch(() =>
          toast.error("Erro ao carregar dados de quantidade de materiais.")
        )
        .finally(() => setLoading(false));
    }
  }, [selectedData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
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
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "60%",
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
        fontFamily: "Nunito, serif",
        fontWeight: 600,
        colors: ["#333"],
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
    xaxis: {
      categories: data.map((item) => item.tipo),
      labels: {
        style: {
          fontSize: elementSize.width > 400 ? "12px" : "8px",
          colors: "#31374a",
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: elementSize.width > 400 ? "12px" : "10px",
          fontWeight: 600,
        },
      },
    },
    colors: ["#00A023", "#FF5733"],
    legend: { show: true },
  };

  const series = [
    {
      name: "Existente",
      data: data.map((item) => item.existente),
    },
    {
      name: "Previsto",
      data: data.map((item) => item.previsto),
    },
  ];

  return (
    <div className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <div className="column-chart">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={elementSize.height}
            width={elementSize.width}
          />
        </div>
      )}
    </div>
  );
};

export default QtdMaterialTipoEqpSmall;
