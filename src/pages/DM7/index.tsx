import { Route, Routes } from "react-router-dom";
import Distribuicao from "./Distribuicao";
import ListDistribuicao from "./ListDistribuicao";

const DM7 = () => {
  return (
    <Routes>
      <Route path="/distribuicao" element={<Distribuicao />} />
      <Route path="/distribuicao/lista" element={<ListDistribuicao />} />
    </Routes>
  );
};

export default DM7;
