import { Route, Routes } from "react-router-dom";
import SisfronSAD2 from "./SAD2";
import SisfronSAD1 from "./SAD1";
import SisfronSAD3 from "./SAD3";
import SisfronSAD3A from "./SAD3A";
import SisfronSAD7 from "./SAD7";
import InspectOM from "./InspectOMCFF";

const SISFRON = () => {
  return (
    <Routes>
      <Route path="/sad1" element={<SisfronSAD1 />} />
      <Route path="/sad2" element={<SisfronSAD2 />} />
      <Route path="/sad3" element={<SisfronSAD3 />} />
      <Route path="/sad3a" element={<SisfronSAD3A />} />
      <Route path="/sad7" element={<SisfronSAD7 />} />
      <Route path="/cff/sad2/:om" element={<InspectOM />} />
    </Routes>
  );
};

export default SISFRON;
