import { useMemo } from "react";
import Loader from "components/Loader";
import { QtdMaterialBdaType } from "types/relatorio/qtdmaterialbda";

import "./styles.css";

interface Props {
  data: QtdMaterialBdaType[];
  loading: boolean;
}

const QtdMaterialBdaHover = ({ data, loading }: Props) => {
  const sortedData = useMemo(
    () => [...data].sort((a, b) => b.quantidade - a.quantidade),
    [data]
  );

  return (
    <div className="card-chart">
      <span className="hint">Dica: Clique para fixar!</span>
      {loading ? (
        <div className="loader-div">
          <Loader width="150px" height="150px" />
        </div>
      ) : (
        <ul className="data-list">
          {sortedData.map((item, index) => (
            <li key={index} className="data-item">
              <span className="data-label">{item.bda}:</span>
              <span className="data-value">{item.quantidade}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QtdMaterialBdaHover;
