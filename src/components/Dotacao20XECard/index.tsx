import { Dotacao20XEType } from "types/relatorio/dotacao20xe";
import { formatarDinheiro } from "utils/functions";

interface Props {
  element: Dotacao20XEType;
}

/**
 * Elemento para exibição na listagem de treinamentos
 */
const Dotacao20XECard = ({ element }: Props) => {
  return (
    <tr className="card-container">
      <td>
        <div className="card-content">{element.codAcao}</div>
      </td>
      <td>
        <div className="card-content">{element.grupoDespesa}</div>
      </td>
      <td>
        <div className="card-content">{element.nomeGrupo}</div>
      </td>
      <td>
        <div className="card-content">{formatarDinheiro(element.dotacao)}</div>
      </td>
      <td>
        <div className="card-content">{formatarDinheiro(element.creditoIndisponivel)}</div>
      </td>
    </tr>
  );
};

export default Dotacao20XECard;
