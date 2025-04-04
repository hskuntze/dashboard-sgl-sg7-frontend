import { Route, Routes } from "react-router-dom";
import QcpOMList from "./List";

const QcpOM = () => {
  return (
    <Routes>
      <Route path="/filter/:cmdo" element={<QcpOMList />} />
    </Routes>
  );
};

export default QcpOM;
