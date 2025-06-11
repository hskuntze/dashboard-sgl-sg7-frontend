import "./styles.css";
import { Link } from "react-router-dom";
import { MaterialIndisponivel } from "types/materialindisponivel";

interface Props {
  element: MaterialIndisponivel;
}

/**
 * Elemento para exibição na listagem de treinamentos
 */
const MaterialIndisponivelCard = ({ element }: Props) => {
  return (
    <tr className="card-container">
      <td>
        <div className="card-content">{element.equipamento}</div>
      </td>
      <td>
        <div className="card-content">{element.motivoindisp === "" ? "Não identificado" : element.motivoindisp}</div>
      </td>
      <td>
        <div className="card-content">{element.pn}</div>
      </td>
      <td>
        <div className="card-content">{element.sn}</div>
      </td>
      <td>
        <div className="card-content">{element.fabricante}</div>
      </td>
      <td>
        <div className="card-content">{element.modelo}</div>
      </td>
      <td>
        <div className="card-content">{element.de}</div>
      </td>
      <td>
        <div className="card-content">{element.cmdo}</div>
      </td>
      <td>
        <div className="card-content">{element.bda}</div>
      </td>
      <td>
        <div className="card-content">{element.om}</div>
      </td>
      <td>
        <div className="card-buttons">
          <Link to={`/dashboard-sgl-sg7/materialom/visualizar/${element.sn}`}>
            <button className="act-button submit-button">
              <i className="bi bi-file-earmark-text" />
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default MaterialIndisponivelCard;
