import Loader from "components/Loader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useFetchData } from "utils/hooks/usefetchdata";
import { TipoEqpOmDestinoCff } from "types/relatorio/tipoeqpomcff";

interface Props {
  selectedData?: TipoEqpOmDestinoCff[];
}

const TipoEqpOmCFF = ({ selectedData }: Props) => {
  const { data, loading } = useFetchData<TipoEqpOmDestinoCff>({
    url: "/cff/equipamentos/om/tipo",
    initialData: selectedData,
  });

  const conjuntos = Array.from(new Set(data.map((d) => d.omDestino)));
  const eqps = Array.from(new Set(data.map((d) => d.solucao)));

  const series = eqps.map((eqp) => {
    return {
      name: eqp,
      data: conjuntos.map((conjunto) => {
        const item = data.find((d) => d.omDestino === conjunto && d.solucao === eqp);
        return item ? item.quantidade : 0;
      }),
    };
  });

  const totals = data.map((_, index) => {
    return series.reduce((sum, serie) => sum + serie.data[index], 0);
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
        barHeight: 10,
        dataLabels: {
          position: "top",
          hideOverflowingLabels: true,
          total: {
            offsetY: -3,
            enabled: true,
            formatter: function (val, { dataPointIndex }) {
              return String(totals[dataPointIndex]);
            },
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
      categories: conjuntos,
      labels: {
        style: {
          fontSize: "9px",
          colors: "#31374a",
          fontWeight: 600,
        },
      },
    },
    colors: ["#3B00FA", "#1AA2BD", "#DBFA23", "#FA6E00", "#A866ED", "#66B3ED", "#19F0AD", "#04F04F", "#0B39F0", "#E60801"],
    legend: { show: true },
  };

  return (
    <div className="card-chart">
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <div className="column-chart">
          <ReactApexChart options={options} series={series} type="bar" height={300} width={900} />
        </div>
      )}
    </div>
  );
};

export default TipoEqpOmCFF;
