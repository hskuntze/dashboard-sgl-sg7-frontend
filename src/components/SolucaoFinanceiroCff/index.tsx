import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useFetchData } from "utils/hooks/usefetchdata";
import { useElementSize } from "utils/hooks/useelementsize";
import { SolucaoFinanceiroCFFType } from "types/relatorio/solucaofinanceirocff";
import { formatarNumero } from "utils/functions";

interface Props {
  selectedData?: SolucaoFinanceiroCFFType[];
  onSelectedItem: (solucao: string | null) => void;
}

const SolucaoFinanceiroCff = ({ selectedData, onSelectedItem }: Props) => {
  const { data, loading } = useFetchData<SolucaoFinanceiroCFFType>({
    url: "/cff/solucao/financeiro",
    initialData: selectedData,
  });

  const elementSize = useElementSize();

  // Calcula o valor máximo da série 'total' para definir o limite superior do eixo Y da linha
  const maxTotalValue = Math.max(...data.map((item) => item.total));
  const totalYAxisMax = maxTotalValue > 0 ? maxTotalValue + maxTotalValue * 0.1 : 10;

  // Calculando o máximo para Valor Apostilamento (para seu próprio eixo)
  const maxValorApostilamento = Math.max(...data.map((item) => item.valorApostilamento));
  const vaYAxisMax = maxValorApostilamento > 0 ? maxValorApostilamento + maxValorApostilamento * 0.1 : 100000; // Margem para o eixo

  // Calculando o máximo para Valor Unitário (para seu próprio eixo)
  const vuYAxisMax = vaYAxisMax;

  const options: ApexOptions = {
    chart: {
      type: "bar",
      width: "950px",
      height: "700px",
      
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
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedIndex = config.dataPointIndex;
          const clickedItem = data[selectedIndex];

          if (clickedItem.solucao) {
            onSelectedItem(clickedItem.solucao);
          }
        },
      },
      stacked: false, // Importante para que as barras não se empilhem
    },
    plotOptions: {
      bar: {
        columnWidth: "70%",
        dataLabels: {
          position: "top",
          hideOverflowingLabels: true,
        },
      },
    },
    dataLabels: {
      enabled: true, // <--- HABILITA OS DATA LABELS
      formatter: function (val: number, opts: any) {
        // Formata os valores das barras monetárias como R$ e os totais como número
        const seriesName = opts.w.globals.seriesNames[opts.seriesIndex];

        if (seriesName === "Valor Apostilamento" || seriesName === "Valor Unitário") {
          return `R$ ${formatarNumero(val)}`;
        }
        return String(val); // Fallback
      },
      style: {
        fontSize: "10px",
        fontFamily: "Nunito, serif",
        fontWeight: 500,
        colors: ["#114A00", "#005BDB", "#FF5F00"],
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        dropShadow: {
          color: "#fff",
          enabled: true,
          blur: 0.2,
        },
      },
      offsetY: -20,
    },
    grid: {
      show: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number, { seriesIndex, w }) => {
          const seriesName = w.globals.seriesNames[seriesIndex];
          if (seriesName === "Valor Apostilamento" || seriesName === "Valor Unitário") {
            return `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          } else if (seriesName === "Total") {
            return `${val} unidades`;
          }
          return `${val}`;
        },
      },
    },
    xaxis: {
      categories: data.map((item) => item.solucao),
      labels: {
        style: {
          fontSize: elementSize.width > 400 ? "10px" : "8px",
          colors: "#31374a",
          fontWeight: 600,
        },
      },
    },
    yaxis: [
      {
        // Eixo Y para Valor Apostilamento (primeiro à esquerda)
        axisTicks: { show: true },
        axisBorder: { show: true, color: "#114A00" }, // Cor do eixo igual à cor da barra
        labels: {
          formatter: (val: number) => `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
          style: { colors: "#114A00", fontSize: elementSize.width > 400 ? "12px" : "10px", fontWeight: 600 },
        },
        min: 0,
        max: vaYAxisMax, // Escala dinâmica para Apostilamento
        tooltip: { enabled: true },
        show: false,
      },
      {
        // Eixo Y para Valor Unitário (segundo à esquerda, deslocado um pouco)
        axisTicks: { show: true },
        axisBorder: { show: true, color: "#005BDB" }, // Cor do eixo igual à cor da barra
        labels: {
          formatter: (val: number) => `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
          style: { colors: "#005BDB", fontSize: elementSize.width > 400 ? "12px" : "10px", fontWeight: 600 },
        },
        title: { text: "Unitário (R$)", style: { color: "#005BDB" } },
        min: 0,
        max: vuYAxisMax, // Escala dinâmica para Unitário
        opposite: false, // Mantém à esquerda
        tooltip: { enabled: true },
        show: false,
      },
      {
        // Eixo Y para Total (à direita)
        axisTicks: { show: true },
        axisBorder: { show: true, color: "#FF5F00" },
        labels: {
          formatter: (val: number) => `${val.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
          style: { colors: "#FF5F00", fontSize: elementSize.width > 400 ? "12px" : "10px", fontWeight: 600 },
        },
        title: { text: "Total", style: { color: "#FF5F00" } },
        opposite: true, // Posiciona à direita
        min: 0,
        max: totalYAxisMax,
        show: false,
      },
    ],
    colors: ["#114A00", "#005BDB", "#FF5F00"], // Cores para Valor Apostilamento, Valor Unitário, Total
    legend: { show: true },
    stroke: {
      width: [0, 0, 4], // Largura da linha apenas para a terceira série (Total)
      curve: "straight",
    },
    markers: {
      size: [0, 0, 5], // Tamanho dos marcadores apenas para a terceira série (Total)
    },
  };

  const series = [
    {
      name: "Valor Apostilamento",
      type: "bar",
      data: data.map((item) => item.valorApostilamento),
      yaxisIndex: 0, // Associa à primeira Y-axis
    },
    {
      name: "Valor Unitário",
      type: "bar",
      data: data.map((item) => item.valorUnitario),
      yaxisIndex: 1, // Associa à segunda Y-axis
    },
    {
      name: "Unidades",
      type: "line",
      data: data.map((item) => item.total),
      yaxisIndex: 2, // Associa à terceira Y-axis
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
          <ReactApexChart options={options} series={series} type="bar" height={700} width={900} />
        </div>
      )}
    </div>
  );
};

export default SolucaoFinanceiroCff;
