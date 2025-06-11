import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "components/Loader";

import { ElementoCFF } from "types/elementocff";

import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { formatarData } from "utils/functions";
import { TablePagination } from "@mui/material";
import ElementoCFFCard from "components/ElementoCFFCard";

type UrlParams = {
  om: string;
};

const InspectOM = () => {
  const urlParams = useParams<UrlParams>();

  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<ElementoCFF[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [filter, setFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleExportToExcel = () => {
    if (page && page.length > 0) {
      const capacitadosProcessado = page.map((u) => ({
        "Elemento Despesa": u.elemenDesp,
        Conjunto: u.conjunto,
        "Descrição da Etapa": u.descricaoEtapa,
        "OM Destino": u.omDestinoRep,
        "Local de Destino": u.localDestinoRep,
        Brigada: u.brigadaRep,
        Quantidade: u.quantRep,
        "Valor de Apostilamento": new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(u.valorApostilamento),
        "Valor Liquidado": new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(u.valorLiquidado),
        "Valor Pago": new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(u.valorPago),
        "Data TRD": formatarData(u.dtTrd),
        "Valor Empenhado": new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(u.valorEmpenhado),
        "Data Atualizada de Entrega": formatarData(u.dtAtualizadaEntrega),
        "Data Pago": formatarData(u.dtPago),
        "Data Liquidado": formatarData(u.dtLiquidado),
        Solução: u.solucao,
        Lote: u.lote,
        "Qtde. Entrega": u.qtdeEntrega,
        Evento: u.evento,
      }));

      const ws = XLSX.utils.json_to_sheet(capacitadosProcessado);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "CFF OM");
      XLSX.writeFile(wb, "cff-om.xlsx");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("QCP OM", 5, 20);

    doc.setFontSize(12);
    const yStart = 30;
    let y = yStart;
    const lineHeight = 10;
    const marginLeft = 15;
    const colWidth = 50;

    if (page && page.length > 0) {
      page?.forEach((u, i) => {
        doc.setFont("helvetica", "bold");
        doc.text(u.omDestinoRep, marginLeft, y);
        y += lineHeight;

        const data = [
          ["Elemento Despesa", u.elemenDesp],
          ["Conjunto", u.conjunto],
          ["Descrição da Etapa", u.descricaoEtapa],
          ["OM Destino", u.omDestinoRep],
          ["Local de Destino", u.localDestinoRep],
          ["Brigada", u.brigadaRep],
          ["Quantidade", u.quantRep],
          ["Valor de Apostilamento", new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(u.valorApostilamento)],
          ["Valor Liquidado", new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(u.valorLiquidado)],
          ["Valor Pago", new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(u.valorPago)],
          ["Data TRD", formatarData(u.dtTrd)],
          ["Valor Empenhado", new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(u.valorEmpenhado)],
          ["Data Atualizada de Entrega", formatarData(u.dtAtualizadaEntrega)],
          ["Data Pago", formatarData(u.dtPago)],
          ["Data Liquidado", formatarData(u.dtLiquidado)],
          ["Solução", u.solucao],
          ["Lote", u.lote],
          ["Qtde. Entrega", u.qtdeEntrega],
          ["Evento", u.evento],
        ];

        data.forEach(([k, v]) => {
          doc.setFont("helvetica", "bold");
          doc.text(k, marginLeft, y);
          doc.setFont("helvetica", "normal");
          doc.text(v, marginLeft + colWidth, y);
          y += lineHeight;

          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        });

        y += 10;
      });
    }

    doc.save("om_cff.pdf");
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageNumber(0);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value.toLowerCase());
    setPageNumber(0);
  };

  const filteredData = page.filter((el) => {
    const searchTerm = filter.trim();
    if (!searchTerm) return true;

    return (
      el.conjunto.toLowerCase().includes(searchTerm) ||
      (el.elemenDesp.toLowerCase().includes(searchTerm) ?? false) ||
      (el.id.toLowerCase().includes(searchTerm) ?? false) ||
      (el.descricaoEtapa.toLowerCase().includes(searchTerm) ?? false) ||
      (el.omDestinoRep.toLowerCase().includes(searchTerm) ?? false) ||
      (el.localDestinoRep.toLowerCase().includes(searchTerm) ?? false) ||
      (el.brigadaRep.toLowerCase().includes(searchTerm) ?? false) ||
      (el.solucao.toLowerCase().includes(searchTerm) ?? false) ||
      (el.lote.toLowerCase().includes(searchTerm) ?? false) ||
      (el.evento.toLowerCase().includes(searchTerm) ?? false) ||
      (formatarData(el.dtAtualizadaEntrega).toLowerCase().includes(searchTerm) ?? false) ||
      (formatarData(el.dtLiquidado).toLowerCase().includes(searchTerm) ?? false) ||
      (formatarData(el.dtPago).toLowerCase().includes(searchTerm) ?? false) ||
      (formatarData(el.dtTrd).toLowerCase().includes(searchTerm) ?? false)
    );
  });

  const paginatedData = filteredData.slice(pageNumber * rowsPerPage, pageNumber * rowsPerPage + rowsPerPage);

  useEffect(() => {
    setLoading(true);

    const params: AxiosRequestConfig = {
      url: `/cff/om/${urlParams.om}`,
      method: "GET",
      withCredentials: true,
    };

    requestBackend(params)
      .then((res) => {
        setPage(res.data as ElementoCFF[]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlParams, rowsPerPage]);

  return (
    <>
      <div className="top-list-buttons">
        <button onClick={handleExportPDF} type="button" className="act-button create-button">
          <i className="bi bi-filetype-pdf" />
        </button>
        <button onClick={handleExportToExcel} type="button" className="act-button create-button">
          <i className="bi bi-file-earmark-excel" />
        </button>
      </div>
      <div className="filtro-container">
        <form>
          <div className="filtro-input-div form-floating">
            <input
              type="text"
              className="form-control filtro-input"
              id="nome-treinamento-filtro"
              placeholder="Digite um termo para filtrar"
              onChange={handleFilterChange}
            />
            <label htmlFor="nome-treinamento-filtro">Digite um termo para filtrar</label>
          </div>
          <button className="search-button" type="button">
            <i className="bi bi-search" />
          </button>
        </form>
      </div>
      <div className="list-container">
        <h2 style={{ marginLeft: "10px", marginTop: "20px" }}>{urlParams.om}</h2>
        {loading ? (
          <div className="loader-div">
            <Loader />
          </div>
        ) : (
          <table className="table-container">
            <thead className="table-head">
              <tr>
                <th scope="col">Conjunto</th>
                <th scope="col">Elemento de Despesa</th>
                <th scope="col">ID</th>
                <th scope="col">Descrição da Etapa</th>
                <th scope="col">OM Destino</th>
                <th scope="col">Local Destino</th>
                <th scope="col">Brigada</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Valor Apostilamento</th>
                <th scope="col">Valor da Etapa Liquidado</th>
                <th scope="col">Valor da Etapa Pago</th>
                <th scope="col">Data TRD</th>
                <th scope="col">Valor da Etapa Empenhado</th>
                <th scope="col">Data atualizada da Entrega</th>
                <th scope="col">Data Pago</th>
                <th scope="col">Data Liquidado</th>
                <th scope="col">Solução</th>
                <th scope="col">Lote</th>
                <th scope="col">Qtde./Entrega</th>
                <th scope="col">Evento</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {paginatedData.map((el) => (
                <ElementoCFFCard element={el} key={el.id} />
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <TablePagination
                    className="table-pagination-container"
                    component="div"
                    count={filteredData.length}
                    page={pageNumber}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Registros por página: "
                    labelDisplayedRows={({ from, to, count }) => {
                      return `${from} - ${to} de ${count}`;
                    }}
                    classes={{
                      selectLabel: "pagination-select-label",
                      displayedRows: "pagination-displayed-rows-label",
                      select: "pagination-select",
                      toolbar: "pagination-toolbar",
                    }}
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        )}
        <div style={{ marginLeft: "20px" }}>
          <Link to="/dashboard-sgl-sg7/sisfron/sad2">
            <button type="button" className="button delete-button">
              Voltar
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default InspectOM;
