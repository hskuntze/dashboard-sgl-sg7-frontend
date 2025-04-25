import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { QtdMotivoIndisponibilidadeType } from "types/relatorio/qtdmotivoindisponibilidade";
import { AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";

interface Props {
  onSelectMotivo: (motivo: string) => void;
  cmdo: string;
  bda: string;
  eqp: string;
}

const QtdMotivoIndisponibilidade = ({ cmdo, bda, eqp, onSelectMotivo }: Props) => {
  const [data, setData] = useState<QtdMotivoIndisponibilidadeType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/materiaisom/qtd/motivo/indisp",
      method: "GET",
      withCredentials: true,
      params: {
        cmdo,
        bda,
        eqp,
      },
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as QtdMotivoIndisponibilidadeType[]);
      })
      .catch((err) => {
        toast.error("Erro ao carregar informações de motivos de indisponibilidade");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [bda, cmdo, eqp]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  const total = data.reduce((sum, item) => sum + item.quantidade, 0);

  // Agrupa os dados com quantidade <= 5 em "Outros"
  const agrupado = data.reduce((acc, item) => {
    const motivoTratado = item.motivo === "" ? "Não identificado" : item.motivo;

    let qtdAgrupamento: number;

    if (total < 60) {
      qtdAgrupamento = 1;
    } else if (total >= 60 && total < 200) {
      qtdAgrupamento = 3;
    } else if (total >= 200 && total < 400) {
      qtdAgrupamento = 12;
    } else {
      qtdAgrupamento = 18;
    }
    
    if (item.quantidade <= qtdAgrupamento) {
      const existente = acc.find((el) => el.motivo === "Outros");
      if (existente) {
        existente.quantidade += item.quantidade;
      } else {
        acc.push({ motivo: "Outros", quantidade: item.quantidade });
      }
    } else {
      acc.push({ motivo: motivoTratado, quantidade: item.quantidade });
    }

    return acc;
  }, [] as { motivo: string; quantidade: number }[]);

  // Extrai os labels e valores
  const labels = agrupado.map((item) => item.motivo);
  const values = agrupado.map((item) => item.quantidade);

  const options: ApexOptions = {
    chart: {
      type: "pie",
      background: "transparent",
      parentHeightOffset: 0,
      animations: {
        enabled: true,
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 1000,
        },
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedIndex = config.dataPointIndex;
          const clickedItem = data[selectedIndex];

          console.log("selectedIndex", selectedIndex);
          console.log("clickedItem", clickedItem);

          setTimeout(() => {
            onSelectMotivo(clickedItem.motivo);
          }, 0);
        },
      },
    },
    labels: labels,
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
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "Nunito, serif",
        colors: ["#FFF"],
      },
      formatter: function (val: number, opts) {
        const label = opts.w.config.labels[opts.seriesIndex];
        const value = val; //
        return [`${value.toFixed(2)}%`, label];
      },
    },
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontFamily: "Nunito, serif",
      fontWeight: 800,
      formatter: (val) => `${val}`,
      width: 400,
      show: false,
    },
    colors: ["#018AE6", "#1184D0", "#1F7DBB", "#2974A6", "#306A91", "#335E7B", "#335266", "#2F4351", "#28343C", "#262E33", "#2B3033", "#2D3133"],
    stroke: {
      show: false,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          minAngleToShowLabel: 8,
        },
      },
    },
  };

  return (
    <div id="grafico-motivos" className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <div className="severity-column-chart">
          <ReactApexChart options={options} series={values} type="pie" height={600} width={800} />
        </div>
      )}
    </div>
  );
};

export default QtdMotivoIndisponibilidade;
