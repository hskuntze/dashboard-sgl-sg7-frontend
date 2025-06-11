import { TablePagination } from "@mui/material";
import { AxiosRequestConfig } from "axios";
import Loader from "components/Loader";
import RpOrcamentario20XECard from "components/RpOrcamentario20XECard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RpOrcamentaria20XEType } from "types/relatorio/rporcamentaria20xe";
import { SpringPage } from "types/vendor/spring";
import { requestBackend } from "utils/requests";

type ControlComponentsData = {
  activePage: number;
};

const DetalhamentoRpOrcamentaria20XE = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<SpringPage<RpOrcamentaria20XEType>>();
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [controlComponentsData, setControlComponentsData] = useState<ControlComponentsData>({
    activePage: 0,
  });

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, pageNumber: number) => {
    setControlComponentsData({
      activePage: pageNumber,
    });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setControlComponentsData({
      activePage: 0,
    });
  };

  useEffect(() => {
    setLoading(true);

    (async () => {
      const params: AxiosRequestConfig = {
        withCredentials: true,
        method: "GET",
        url: "/rporcamentaria20xe/paged",
        params: {
          page: controlComponentsData.activePage,
          size: rowsPerPage,
        },
      };

      const newPage = (await requestBackend(params)).data;
      setPage(newPage);
      setLoading(false);
    })();
  }, [controlComponentsData, rowsPerPage]);

  const handleExportPDF = () => {};

  const handleExportToExcel = () => {};

  return (
    <div className="list-container">
      <h2 style={{ marginLeft: "10px", marginTop: "20px" }}>Restos a Pagar 20XE</h2>
      <div>
        <div className="top-list-buttons">
          <button onClick={handleExportPDF} type="button" className="act-button create-button">
            <i className="bi bi-filetype-pdf" />
          </button>
          <button onClick={handleExportToExcel} type="button" className="act-button create-button">
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
              <th scope="col">Ano</th>
              <th scope="col">Cód. Unidade Exec.</th>
              <th scope="col">Nome Unidade Exec.</th>
              <th scope="col">Nat. Despesa</th>
              <th scope="col">Cód. PI</th>
              <th scope="col">NEC CCOR</th>
              <th scope="col">Cód. Favorecido</th>
              <th scope="col">Nome Favorecido</th>
              <th scope="col">NE Descrição</th>
              <th scope="col">Data NE</th>
              <th scope="col">RPNP à Liquidar</th>
              <th scope="col">RPNP à Pagar</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {page?.content.map((el) => (
              <RpOrcamentario20XECard element={el} key={el.codigo} />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <TablePagination
                  className="table-pagination-container"
                  component="div"
                  count={page ? page.totalElements : 0}
                  page={page ? page.number : 0}
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
        <Link to="/dashboard-sgl-sg7">
          <button type="button" className="button delete-button">
            Voltar
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DetalhamentoRpOrcamentaria20XE;
