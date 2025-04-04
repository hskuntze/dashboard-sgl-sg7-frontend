import { Route, Routes } from "react-router-dom";
import MaterialOMDisponivel from "./ListDisponivel";
import MaterialOMInspect from "./Inspect";
import MaterialOMIndisponivel from "./ListIndisponivel";
import MaterialOMList from "./List";

import "./styles.css";
import MaterialOMIndisponivelCategoria from "./ListIndisponivelCategoria";

const MaterialOM = () => {
  return (
    <Routes>
      <Route path="" element={<MaterialOMList />} />
      <Route path="/disponivel" element={<MaterialOMDisponivel />} />
      <Route path="/indisponivel" element={<MaterialOMIndisponivel />} />
      <Route path="/visualizar/:id" element={<MaterialOMInspect />} />
      <Route path="/filter/:cmdo" element={<MaterialOMList />} />
      <Route path="/material/indisponivel" element={<MaterialOMIndisponivelCategoria />} />
    </Routes>
  );
};

export default MaterialOM;