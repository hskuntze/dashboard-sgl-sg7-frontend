import { Route, Routes } from "react-router-dom";
import OMList from "./List";
import OMForm from "./Form";
import OMInspect from "./Inspect";

const OMs = () => {
  return (
    <Routes>
      <Route path="" element={<OMList />} />
      <Route path=":id" element={<OMForm />} />
      <Route path="/visualizar/:id" element={<OMInspect />} />
    </Routes>
  );
};

export default OMs;
