import { Route, Routes } from "react-router-dom";
import OperacoesInspect from "./Inspect";

const Operacoes = () => {
  return (
    <Routes>
      <Route path="/filter/:codigo" element={<OperacoesInspect />} />
    </Routes>
  );
};

export default Operacoes;
