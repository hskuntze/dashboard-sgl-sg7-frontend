import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useFetchData } from "utils/hooks/usefetchdata";
import { TipoEqpFaseExecucaoCff } from "types/relatorio/eqpfaseexecucaocff";

interface Props {
  selectedData?: TipoEqpFaseExecucaoCff[];
}

const EqpFaseExecucaoCFF = ({ selectedData }: Props) => {
  const { data, loading } = useFetchData<TipoEqpFaseExecucaoCff>({
    url: "/cff/equipamentos/faseExecucao",
    initialData: selectedData,
  });

  const eventos = Array.from(new Set(data.map((d) => d.evento)));
  const solucoes = Array.from(new Set(data.map((d) => d.solucao)));

  const series = solucoes.map((solucao) => {
    return {
      name: solucao,
      data: eventos.map((evento) => {
        const item = data.find((d) => d.evento === evento && d.solucao === solucao);
        return item ? item.quantidade : 0;
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
              return String(val);
            },
            style: {
              fontSize: "10px",
            },
            offsetY: -2,
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
        formatter: (val) => `${val}`,
      },
    },
    xaxis: {
      categories: eventos,
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
    colors: ["#25C1F5", "#A0804F", "#4F25F5", "#F5CD5F", "#F53727", "#A0554F", "#25F50F", "#C5F564", "#F5F027", "#4FA05A", "#F58427"],
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

export default EqpFaseExecucaoCFF;
