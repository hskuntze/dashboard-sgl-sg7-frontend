import { RpOrcamentaria20XEType } from "types/relatorio/rporcamentaria20xe";
import { formatarDinheiro } from "utils/functions";

interface Props {
  element: RpOrcamentaria20XEType;
}

/**
 * Elemento para exibição na listagem de treinamentos
 */
const RpOrcamentario20XECard = ({ element }: Props) => {
  return (
    <tr className="card-container">
      <td>
        <div className="card-content">{element.ano}</div>
      </td>
      <td>
        <div className="card-content">{element.ugExec}</div>
      </td>
      <td>
        <div className="card-content">{element.nomeUgExec}</div>
      </td>
      <td>
        <div className="card-content">{element.pi}</div>
      </td>
      <td>
        <div className="card-content">{element.nomePi}</div>
      </td>
      <td>
        <div className="card-content">{element.neCcor}</div>
      </td>
      <td>
        <div className="card-content">{element.favorecido}</div>
      </td>
      <td>
        <div className="card-content">{element.nomeFavorecido}</div>
      </td>
      <td>
        <div className="card-content">{element.neDescricao}</div>
      </td>
      <td>
        <div className="card-content">{element.dataNe}</div>
      </td>
      <td>
        <div className="card-content">{formatarDinheiro(element.rpnpLiquidar)}</div>
      </td>
      <td>
        <div className="card-content">{formatarDinheiro(element.rpnpPagar)}</div>
      </td>
    </tr>
  );
};

export default RpOrcamentario20XECard;
