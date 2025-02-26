import { ThreeDots } from "react-loader-spinner";

const TextLoader = () => {
  return (
    <div>
      <ThreeDots visible={true} height="20" width="40" color="#333" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" />
    </div>
  );
};

export default TextLoader;
