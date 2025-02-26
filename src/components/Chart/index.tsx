import React from "react";
import ReactApexChart from "react-apexcharts";

type ChartProps = {
  options: any;
  series: { name: string; data: number[] }[];
  type: "line" | "bar" | "area" | "pie";
  height: number;
  width: number;
};

const Chart: React.FC<ChartProps> = ({ options, series, type, height, width }) => {
  return <ReactApexChart options={options} series={series} type={type} height={height} width={width} />;
};

export default Chart;
