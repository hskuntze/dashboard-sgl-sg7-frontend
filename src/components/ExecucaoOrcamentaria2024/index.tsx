import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { UnidadeOrcamentariaType } from "types/relatorio/unidadeorcamentaria";

const ExecucaoOrcamentaria2024 = () => {
  const [data, setData] = useState<UnidadeOrcamentariaType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/execucao/2024",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as UnidadeOrcamentariaType[]);
      })
      .catch(() => {
        toast.error("Erro ao carregar dados de valor total de diárias.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Definição das categorias no eixo X
  const categorias = ["Provisão Recebida", "Despesas Empenhadas", "Despesas Liquidadas", "Despesas Pagas"];

  // Criando as séries baseadas em `grupoCodUo`
  const series = data.map((item) => ({
    name: item.grupoCodUo,
    data: [item.provisaoRecebida, item.despesasEmpenhadas, item.despesasLiquidadas, item.despesasPagas],
  }));

  // Calculando o total de cada coluna
  const totals = categorias.map((_, index) => {
    return series.reduce((sum, serie) => sum + serie.data[index], 0);
  });

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      stacked: true,
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
        formatter: (val) => {
          return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
        }
      }
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
        columnWidth: "80%", // Largura das colunas
        dataLabels: {
          position: "top",
          total: {
            style: {
              fontSize: "10px",
            },
            offsetY: -5,
            enabled: true,
            formatter: function (val, { dataPointIndex }) {
              // Exibe o total somatório no topo de cada barra
              return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totals[dataPointIndex]);
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#0077F5", "#E37D24", "#34A853", "#FF5733"], // Cores para cada série
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
        <ReactApexChart options={options} series={series} type="bar" height={720} width={800} />
      )}
    </div>
  );
};

export default ExecucaoOrcamentaria2024;
