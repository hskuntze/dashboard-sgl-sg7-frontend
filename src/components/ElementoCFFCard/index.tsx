import { ElementoCFF } from "types/elementocff";
import { formatarData, formatarDinheiro } from "utils/functions";

interface Props {
  element: ElementoCFF;
}

/**
 * Elemento para exibição na listagem de treinamentos
 */
const ElementoCFFCard = ({ element }: Props) => {
  return (
    <tr className="card-container">
      <td>
        <div className="card-content">{element.conjunto}</div>
      </td>
      <td>
        <div className="card-content">{element.elemenDesp}</div>
      </td>
      <td>
        <div className="card-content">{element.id}</div>
      </td>
      <td>
        <div className="card-content" style={{minWidth: "400px"}}>{element.descricaoEtapa}</div>
      </td>
      <td>
        <div className="card-content">{element.omDestinoRep}</div>
      </td>
      <td>
        <div className="card-content">{element.localDestinoRep}</div>
      </td>
      <td>
        <div className="card-content">{element.brigadaRep}</div>
      </td>
      <td>
        <div className="card-content">{element.quantRep}</div>
      </td>
      <td>
        <div className="card-content">{formatarDinheiro(element.valorApostilamento)}</div>
      </td>
      <td>
        <div className="card-content">{formatarDinheiro(element.valorLiquidado)}</div>
      </td>
      <td>
        <div className="card-content">{formatarDinheiro(element.valorPago)}</div>
      </td>
      <td>
        <div className="card-content">{formatarData(element.dtTrd)}</div>
      </td>
      <td>
        <div className="card-content">{formatarDinheiro(element.valorEmpenhado)}</div>
      </td>
      <td>
        <div className="card-content">{formatarData(element.dtAtualizadaEntrega)}</div>
      </td>
      <td>
        <div className="card-content">{formatarData(element.dtPago)}</div>
      </td>
      <td>
        <div className="card-content">{formatarData(element.dtLiquidado)}</div>
      </td>
      <td>
        <div className="card-content">{element.solucao}</div>
      </td>
      <td>
        <div className="card-content">{element.lote}</div>
      </td>
      <td>
        <div className="card-content">{element.qtdeEntrega}</div>
      </td>
      <td>
        <div className="card-content">{element.evento}</div>
      </td>
    </tr>
  );
};

export default ElementoCFFCard;
