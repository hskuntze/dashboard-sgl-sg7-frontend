import "./styles.css";
import { Box, Modal } from "@mui/material";
import MenuLateral from "components/MenuLateral";
import SolucaoFinanceiroCff from "components/SolucaoFinanceiroCff";
import { useState } from "react";
import CloseIcon from "assets/images/x-lg.svg";
import { SolucaoEntregaCFFType } from "types/relatorio/solucaoentregacff";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import ExecucaoTotalConjuntoCFF from "components/ExecucaoTotalConjuntoCFF";
import { ElementoFinanceiroCffType } from "types/relatorio/elementofinanceirocff";
import { formatarData, formatarDataParaMesAno, formatarDinheiro } from "utils/functions";

const SisfronSAD2 = () => {
  const handleMenuClick = () => {};
  const [openModalSolucao, setOpenModalSolucao] = useState<boolean>(false);
  const [openModalExecFinanceira, setOpenModalExecFinanceira] = useState<boolean>(false);

  const [solucoes, setSolucoes] = useState<SolucaoEntregaCFFType[]>([]);
  const [elementosFinanceiros, setElementosFinanceiros] = useState<ElementoFinanceiroCffType[]>([]);

  const [tipoElementoFinanceiro, setTipoElementoFinanceiro] = useState<number>();
  const [nomeSolucao, setNomeSolucao] = useState<string>("");

  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [loadingTableExecFinanceira, setLoadingTableExecFinanceira] = useState<boolean>(false);

  const handleSelectSolucao = (solucao: string | null) => {
    setLoadingTable(true);
    setOpenModalSolucao(true);

    if (solucao) {
      loadInfoSolucao(solucao);
      setNomeSolucao(solucao);
    } else {
      setLoadingTable(false);
    }
  };

  const handleSelectConjunto = (conjunto: string | null, tipo: number | null) => {
    setLoadingTableExecFinanceira(true);
    setOpenModalExecFinanceira(true);

    if (conjunto && tipo !== null) {
      setTipoElementoFinanceiro(tipo);
      loadInfoExecFinanceira(conjunto, tipo);
    } else {
      setLoadingTableExecFinanceira(false);
    }
  };

  const loadInfoSolucao = (solucao: string) => {
    const requestParams: AxiosRequestConfig = {
      url: `/cff/solucao/entrega/${solucao}`,
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setSolucoes(res.data as SolucaoEntregaCFFType[]);
      })
      .catch((err) => {
        toast.error("Erro ao resgatar dados da solução " + solucao);
      })
      .finally(() => {
        setLoadingTable(false);
      });
  };

  const loadInfoExecFinanceira = (conjunto: string, tipo: number) => {
    const requestParams: AxiosRequestConfig = {
      url: tipo === 0 ? `/cff/execucao/pago/${conjunto}` : `/cff/execucao/restante/${conjunto}`,
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setElementosFinanceiros(res.data as ElementoFinanceiroCffType[]);
      })
      .catch((err) => {
        toast.error("Erro ao carregar informações de valores financeiros.");
      })
      .finally(() => {
        setLoadingTableExecFinanceira(false);
      });
  };

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral onMenuClick={handleMenuClick} />
      <div className="unique-page-container">
        <div className="unique-page-grid cop-grid">
          <div className="cop-left" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <span className="span-title">CFF Contrato 07/2022 - SAD 2</span>
            <span className="span-subtitle">Execução financeira por solução</span>
            <SolucaoFinanceiroCff selectedData={[]} onSelectedItem={handleSelectSolucao} />
          </div>
          <div className="cop-right" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <span className="span-title">CFF Contrato 07/2022 - SAD 2</span>
            <span className="span-subtitle">Execução financeira por solução</span>
            <ExecucaoTotalConjuntoCFF selectedData={[]} onSelectedConjunto={handleSelectConjunto} />
          </div>
        </div>
      </div>
      <Modal open={openModalSolucao}>
        <Box className="modal-on-unique-page">
          <div className="modal-header">
            <button onClick={() => setOpenModalSolucao(false)}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>
          <div className="modal-table-container">
            <h5 className="modal-table-title">Distribuição das Entregas por Lote - {nomeSolucao}</h5>
            {loadingTable ? (
              <div className="loading-div">
                <Loader />
              </div>
            ) : (
              <table className="modal-table">
                <thead className="modal-table-head">
                  <tr>
                    <th scope="col">Solução</th>
                    <th scope="col">Lote</th>
                    <th scope="col">OM Destino</th>
                    <th scope="col">Local</th>
                    <th scope="col">Quantidade</th>
                  </tr>
                </thead>
                <tbody className="modal-table-body">
                  {solucoes.map((slc) => (
                    <tr>
                      <td>
                        <div>{slc.solucao}</div>
                      </td>
                      <td>
                        <div>{slc.lote}</div>
                      </td>
                      <td>
                        <div>{slc.om}</div>
                      </td>
                      <td>
                        <div>{slc.local}</div>
                      </td>
                      <td>
                        <div>{slc.total}</div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", fontWeight: "700", textTransform: "uppercase", borderRight: "1px solid #ccc" }}>
                      Total
                    </td>
                    <td>
                      <b>{solucoes.reduce((sum, serie) => sum + serie.total, 0)}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </Box>
      </Modal>
      <Modal open={openModalExecFinanceira}>
        <Box className="modal-on-unique-page">
          <div className="modal-header">
            <button onClick={() => setOpenModalExecFinanceira(false)}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>
          <div className="modal-table-container">
            <h5 className="modal-table-title">{tipoElementoFinanceiro === 0 ? "Recebimento Realizado do TC 07/2022" : "Recebimento Pendente do TC 07/2022"}</h5>
            {loadingTableExecFinanceira ? (
              <div className="loading-div">
                <Loader />
              </div>
            ) : (
              <table className="modal-table">
                <thead className="modal-table-head">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Descrição da Etapa</th>
                    <th scope="col">OM Destino</th>
                    <th scope="col">Data de Entrega</th>
                    <th scope="col">Valor Apostilamento</th>
                    <th scope="col">Data TRD</th>
                    <th scope="col">Valor Pago</th>
                  </tr>
                </thead>
                <tbody className="modal-table-body">
                  {elementosFinanceiros.map((el) => (
                    <tr>
                      <td>
                        <div>{el.id}</div>
                      </td>
                      <td>
                        <div>{el.descricaoEtapa}</div>
                      </td>
                      <td>
                        <div>{el.om}</div>
                      </td>
                      <td>
                        <div>{formatarDataParaMesAno(el.dataAtualizada)}</div>
                      </td>
                      <td>
                        <div>{formatarDinheiro(el.valorApostilamento)}</div>
                      </td>
                      <td>
                        <div>{formatarData(el.dataTrd)}</div>
                      </td>
                      <td>
                        <div>{formatarDinheiro(el.valorPago)}</div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", fontWeight: "700", textTransform: "uppercase", borderRight: "1px solid #ccc" }}>
                      Total
                    </td>
                    <td>
                      <b>{formatarDinheiro(elementosFinanceiros.reduce((sum, serie) => sum + serie.valorApostilamento, 0))}</b>
                    </td>
                    <td>
                      <b>-</b>
                    </td>
                    <td>
                      <b>{formatarDinheiro(elementosFinanceiros.reduce((sum, serie) => sum + serie.valorPago, 0))}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SisfronSAD2;
