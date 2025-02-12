import { Route, Routes } from "react-router-dom";
import MaterialOMDisponivel from "./ListDisponivel";
import MaterialOMInspect from "./Inspect";
import MaterialOMIndisponivel from "./ListIndisponivel";
import MaterialOMList from "./List";

import "./styles.css";

const MaterialOM = () => {
  return (
    <Routes>
      <Route path="" element={<MaterialOMList />} />
      <Route path="/disponivel" element={<MaterialOMDisponivel />} />
      <Route path="/indisponivel" element={<MaterialOMIndisponivel />} />
      <Route path="/visualizar/:id" element={<MaterialOMInspect />} />
    </Routes>
  );
};

export default MaterialOM;