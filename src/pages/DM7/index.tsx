import { Route, Routes } from "react-router-dom";
import Distribuicao from "./Distribuicao";
import ListDistribuicao from "./ListDistribuicao";
import ApoioDireto from "./ApoioDireto";

const DM7 = () => {
  return (
    <Routes>
      <Route path="/distribuicao" element={<Distribuicao />} />
      <Route path="/distribuicao/lista" element={<ListDistribuicao />} />
      <Route path="/apoiodireto" element={<ApoioDireto />} />
    </Routes>
  );
};

export default DM7;
