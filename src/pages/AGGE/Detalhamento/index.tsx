import { Route, Routes } from "react-router-dom";
import DetalhamentoAcao20XE from "./DetalhamentoAcao20XE";
import DetalhamentoDotacao20XE from "./DetalhamentoDotacao20XE";
import DetalhamentoRpOrcamentaria20XE from "./DetalhamentoRpOrcamentaria20XE";

const DetalhamentoAGGE = () => {
  return (
    <Routes>
      <Route path="/acao20xe" element={<DetalhamentoAcao20XE />} />
      <Route path="/dotacao20xe" element={<DetalhamentoDotacao20XE />} />
      <Route path="/rporcamentario20xe" element={<DetalhamentoRpOrcamentaria20XE />} />
    </Routes>
  );
};

export default DetalhamentoAGGE;
