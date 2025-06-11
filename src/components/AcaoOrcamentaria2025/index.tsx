import "./styles.css";

import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import { AcaoOrcamentariaType } from "types/relatorio/acaoorcamentaria";
import { formatarNumero } from "utils/functions";

const AcaoOrcamentaria2025 = () => {
  const [data, setData] = useState<AcaoOrcamentariaType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/execucao/acao/2025",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as AcaoOrcamentariaType[]);
      })
      .catch(() => {
        toast.error("Erro ao carregar dados de valor total por Unidade Gestora.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Definição das categorias no eixo X
  const categorias = ["Provisão Recebida", "Crédito Disponível", "Despesas Empenhadas", "Despesas Liquidadas", "Despesas Pagas"];
 
  // Criando as séries baseadas em `grupoCodUo`
  const series = data.map((item) => ({
    name: item.acao,
    data: [item.provisaoRecebida, item.creditoDisponivel, item.despesasEmpenhadas, item.despesasLiquidadas, item.despesasPagas],
  }));

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
        formatter: (val: number) => formatarNumero(val)
      }
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      custom: function({ seriesIndex, dataPointIndex, w }) {
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
        columnWidth: "79%", // Largura das colunas
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => formatarNumero(val),
      offsetY: -20,
      style: {
        colors: ["#000"],
        fontSize: "10px",
        fontFamily: "Nunito, serif",
        fontWeight: 700
      }
    },
    colors: ["#0052DB", "#A0DB00", "#DB1D00", "#86392D", "#2E3F5C", "#4F5C2E"], // Cores para cada série
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
        <ReactApexChart options={options} series={series} type="bar" height={720} width={1400} />
      )}
    </div>
  );
};

export default AcaoOrcamentaria2025;
