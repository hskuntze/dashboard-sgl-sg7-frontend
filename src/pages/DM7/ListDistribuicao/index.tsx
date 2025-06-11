import Loader from "components/Loader";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ListDistribuicao = () => {
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();

  return (
    <div>
      <div className="list-container">
        <h2 style={{ marginLeft: "10px", marginTop: "20px" }}>{state.cmdo} - {state.cat }</h2>
        <div>
          <div className="top-list-buttons">
            <button type="button" className="act-button create-button">
              <i className="bi bi-filetype-pdf" />
            </button>
            <button type="button" className="act-button create-button">
              <i className="bi bi-file-earmark-excel" />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="loader-div">
            <Loader />
          </div>
        ) : (
          <table className="table-container">
            <thead className="table-head">
              <tr>
                <th scope="col">RM</th>
                <th scope="col">OM</th>
                <th scope="col">Equipamento</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Data Recebimento</th>
                <th scope="col">Data Distribuição</th>
                <th scope="col">Ação Orçamentária</th>
              </tr>
            </thead>
            <tbody className="table-body">
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tbody>
          </table>
        )}
        <div style={{ marginLeft: "20px" }}>
          <Link to="/dashboard-sgl-sg7">
            <button type="button" className="button delete-button">
              Voltar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListDistribuicao;
