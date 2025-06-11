import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useFetchData } from "utils/hooks/usefetchdata";
import { ExecucaoConjuntoElementoDespesaCFF } from "types/relatorio/execucaoconjeldespcff";

interface Props {
  selectedData?: ExecucaoConjuntoElementoDespesaCFF[];
}

const ExecucaoConjuntoPorElementoDespesaCFF = ({ selectedData }: Props) => {
  const { data, loading } = useFetchData<ExecucaoConjuntoElementoDespesaCFF>({
    url: "/cff/execucao/conjunto/elementoDespesa",
    initialData: selectedData,
  });

  const conjuntos = Array.from(new Set(data.map((d) => d.conjunto)));
  const tipos = Array.from(new Set(data.map((d) => d.elementoDespesa)));

  const series = tipos.map((tipo) => {
    return {
      name: tipo,
      data: conjuntos.map((conjunto) => {
        const item = data.find((d) => d.conjunto === conjunto && d.elementoDespesa === tipo);
        return item ? item.pago : 0;
      }),
    };
  });

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
      stacked: true,
    },
    plotOptions: {
      bar: {
        columnWidth: "70%",
        dataLabels: {
          position: "top",
          hideOverflowingLabels: true,
          total: {
            enabled: true,
            formatter: (val?: string | number) => {
              const num = typeof val === "string" ? parseFloat(val) : val;
              if (typeof num !== "number" || isNaN(num)) return "R$ 0,00";

              return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(num);
            },
            style: {
              fontSize: "10px",
            },
            offsetY: -2
          },
        },
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      },
    },
    xaxis: {
      categories: conjuntos,
      labels: {
        style: {
          fontSize: "9px",
          colors: "#31374a",
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      show: false,
    },
    colors: ["#3B00FA", "#1AA2BD", "#DBFA23", "#FA6E00"],
    legend: { show: true, offsetY: 20 },
  };

  return (
    <div className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <div className="column-chart">
          <ReactApexChart options={options} series={series} type="bar" height={300} width={850} />
        </div>
      )}
    </div>
  );
};

export default ExecucaoConjuntoPorElementoDespesaCFF;
