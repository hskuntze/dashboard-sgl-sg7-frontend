import "./styles.css";
import { QcpOM } from "types/qcpom";

interface Props {
  element: QcpOM;
}

/**
 * Elemento para exibição na listagem de treinamentos
 */
const QcpOMCard = ({ element }: Props) => {
  return (
    <tr className="card-container">
      <td>
        <div className="card-content">{element.cmdoMilA}</div>
      </td>
      <td>
        <div className="card-content">{element.rm}</div>
      </td>
      <td>
        <div className="card-content">{element.de}</div>
      </td>
      <td>
        <div className="card-content">{element.bda}</div>
      </td>
      <td>
        <div className="card-content">{element.sigla}</div>
      </td>
      <td>
        <div className="card-content">{element.lat}</div>
      </td>
      <td>
        <div className="card-content">{element.longi}</div>
      </td>
      <td>
        <div className="card-content">{element.posto}</div>
      </td>
      <td>
        <div className="card-content">{element.qtdMilPrev}</div>
      </td>
      <td>
        <div className="card-content">{element.qtdMilEfetivo}</div>
      </td>
    </tr>
  );
};

export default QcpOMCard;
