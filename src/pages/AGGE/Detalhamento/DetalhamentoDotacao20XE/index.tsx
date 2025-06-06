import { TablePagination } from "@mui/material";
import { AxiosRequestConfig } from "axios";
import Dotacao20XECard from "components/Dotacao20XECard";
import Loader from "components/Loader";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dotacao20XEType } from "types/relatorio/dotacao20xe";
import { SpringPage } from "types/vendor/spring";
import { requestBackend } from "utils/requests";

type ControlComponentsData = {
  activePage: number;
};

const DetalhamentoDotacao20XE = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<SpringPage<Dotacao20XEType>>();
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
        url: "/dotacao20xe/paged",
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
      <h2 style={{ marginLeft: "10px", marginTop: "20px" }}>Dotação 20XE</h2>
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
              <th scope="col">Cód. Ação</th>
              <th scope="col">Cód. Grupo Despesa</th>
              <th scope="col">Nome Grupo Despesa</th>
              <th scope="col">Dotação</th>
              <th scope="col">Código Elemento Despesa</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {page?.content.map((el) => (
              <Dotacao20XECard element={el} key={el.codigo} />
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

export default DetalhamentoDotacao20XE;
