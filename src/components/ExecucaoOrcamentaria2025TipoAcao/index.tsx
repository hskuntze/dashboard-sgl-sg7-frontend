import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import { UnidadeOrcamentariaType } from "types/relatorio/unidadeorcamentaria";

const ExecucaoOrcamentaria2025TipoAcao = () => {
  const [data, setData] = useState<UnidadeOrcamentariaType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [elementSize, setElementSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;

      if (newWidth < 768) {
        setElementSize({ height: 300, width: 300 });
      } else if (newWidth >= 768 && newWidth < 1600) {
        setElementSize({ height: 300, width: 400 });
      } else if (newWidth >= 1600 && newWidth < 1800) {
        setElementSize({ height: 300, width: 490 });
      } else {
        setElementSize({ height: 300, width: 550 });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Chama a função uma vez para definir o estado inicial

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadData = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/execucao/2025/tipoacao",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as UnidadeOrcamentariaType[]);
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
    name: item.grupoCodUo,
    data: [item.provisaoRecebida, item.creditoDisponivel, item.despesasEmpenhadas, item.despesasLiquidadas, item.despesasPagas],
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
        columnWidth: "80%", // Largura das colunas
        dataLabels: {
          position: "top",
          total: {
            offsetY: -5,
            enabled: true,
            formatter: function (val, { dataPointIndex }) {
              // Exibe o total somatório no topo de cada barra
              return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totals[dataPointIndex]);
            },
          }
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#a08914", "#fbb124", "#acc142"], // Cores para cada série
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

export default ExecucaoOrcamentaria2025TipoAcao;
