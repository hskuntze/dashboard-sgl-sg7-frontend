import { Acao20XEType } from "types/relatorio/acao20xe";
import { formatarDinheiro } from "utils/functions";

interface Props {
  element: Acao20XEType;
}

/**
 * Elemento para exibição na listagem de treinamentos
 */
const Acao20XECard = ({ element }: Props) => {
  return (
    <tr className="card-container">
      <td>
        <div className="card-content">{element.ugExec}</div>
      </td>
      <td>
        <div className="card-content">{element.nomeUgExec}</div>
      </td>
      <td>
        <div className="card-content">{element.grupoDespesa}</div>
      </td>
      <td>
        <div className="card-content">{element.nomeGrupoDespesa}</div>
      </td>
      <td>
        <div className="card-content">{element.natDespesa}</div>
      </td>
      <td>
        <div className="card-content">{element.nomeNatDespesa}</div>
      </td>
      <td>
        <div className="card-content">{element.elementoDespesa}</div>
      </td>
      <td>
        <div className="card-content">{element.nomeElementoDespesa}</div>
      </td>
      <td>
        <div className="card-content">{formatarDinheiro(element.provisaoRecebida)}</div>
      </td>
      <td>
        <div className="card-content">{formatarDinheiro(element.creditoDisponivel)}</div>
      </td>
      <td>
        <div className="card-content">{formatarDinheiro(element.despesaEmpenhada)}</div>
      </td>
      <td>
        <div className="card-content">{formatarDinheiro(element.despesaLiquidada)}</div>
      </td>
      <td>
        <div className="card-content">{formatarDinheiro(element.despesaPaga)}</div>
      </td>
    </tr>
  );
};

export default Acao20XECard;
