import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { formatarNumero } from "utils/functions";
import { OmOrcamentoType } from "types/relatorio/omorcamento";

const OmOrcamento = () => {
  const [data, setData] = useState<OmOrcamentoType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/execucao/om",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as OmOrcamentoType[]);
      })
      .catch(() => {
        toast.error("Erro ao carregar dados de valor total por OM.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Definição das categorias no eixo X
  // const categorias = ["Provisao Recebida", "Despesas Empenhadas", "Despesas Liquidadas", "Despesas Pagas"];
  const categorias = data.map((el) => el.om);

  // Criando as séries baseadas em `grupoCodUo`
  const series = [
    {
      name: "Provisão Recebida",
      data: data.map((el) => el.provisaoRecebida),
    },
    {
      name: "Despesas Empenhadas",
      data: data.map((el) => el.despesasEmpenhadas),
    },
    {
      name: "Despesas Liquidadas",
      data: data.map((el) => el.despesasLiquidadas),
    },
    {
      name: "Despesas Pagas",
      data: data.map((el) => el.despesasPagas),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "Nunito, serif",
    },
    xaxis: {
      categories: categorias, // Definindo os rótulos no eixo X
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 600,
          fontFamily: "Nunito, serif",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => formatarNumero(val),
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const seriesName = w.config.series[seriesIndex].name;
        const dataValue = w.config.series[seriesIndex].data[dataPointIndex];

        // Formatação do valor como moeda
        const formattedValue = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(dataValue);

        return `
          <div style="padding: 10px; background: #00000cc; border: 1px solid #ccc;">
            <strong>${seriesName}</strong><br />
            Valor: ${formattedValue}<br />
          </div>
        `;
      },
    },
    stroke: {
      show: true,
      width: 2,
    },
    plotOptions: {
      bar: {
        horizontal: false, // Barras verticais
        columnWidth: "70%", // Largura das colunas
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        // Recupera o valor real da série
        const seriesIndex = opts.seriesIndex;
        const dataPointIndex = opts.dataPointIndex;
        const value = opts.w.config.series[seriesIndex].data[dataPointIndex];
        return formatarNumero(value);
      },
      style: {
        colors: ["#333"],
        fontSize: "9px",
        fontFamily: "Nunito, serif",
        fontWeight: 700,
      },
      offsetY: -15,
      background: {
        foreColor: "#fff",
        borderColor: "#bbb",
        borderWidth: 1,
        opacity: 0.7,
        enabled: true,
        borderRadius: 4,
      },
    },
    colors: ["#E00D00", "#5969F0", "#2062E6", "#01AFF0", "#30E000", "#E0DD00"], // Cores para cada série
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
        <ReactApexChart options={options} series={series} type="bar" height={320} width={1200} />
      )}
    </div>
  );
};

export default OmOrcamento;
