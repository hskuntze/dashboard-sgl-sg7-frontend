import "./styles.css";
import { Link } from "react-router-dom";
import { MaterialOMType } from "types/materialom";

interface Props {
  element: MaterialOMType;
}

/**
 * Elemento para exibição na listagem de treinamentos
 */
const MaterialOMCard = ({ element }: Props) => {
  return (
    <tr className="card-container">
      <td>
        <div className="card-content">{element.nomeeqp}</div>
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
        <div className="card-content">{element.disponibilidade}</div>
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

export default MaterialOMCard;
