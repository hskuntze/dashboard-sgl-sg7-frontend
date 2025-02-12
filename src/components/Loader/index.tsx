import { Triangle } from "react-loader-spinner";

interface Props {
  width?: string;
  height?: string;
}

const Loader = ({ height, width }: Props) => {
  return (
    <Triangle
      visible={true}
      height="80"
      width="80"
      color="#009B3A"
      ariaLabel="triangle-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

export default Loader;
