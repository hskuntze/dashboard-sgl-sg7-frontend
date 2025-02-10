import { TablePagination } from "@mui/material";
import { AxiosRequestConfig } from "axios";
import FilterMaterialOM from "components/FilterMaterialOM";
import Loader from "components/Loader";
import MaterialOMCard from "components/MaterialOMCard";
import { useEffect, useState } from "react";
import { FilterMaterialType } from "types/filtermaterialom";
import { MaterialOMType } from "types/materialom";
import { SpringPage } from "types/vendor/spring";
import { requestBackend } from "utils/requests";

type ControlComponentsData = {
  activePage: number;
  filterData: FilterMaterialType;
};

const MaterialOMIndisponivel = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<SpringPage<MaterialOMType>>();
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [controlComponentsData, setControlComponentsData] =
    useState<ControlComponentsData>({
      activePage: 0,
      filterData: { nomeeqp: null, pn: null, sn: null },
    });

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    pageNumber: number
  ) => {
    setControlComponentsData({
      activePage: pageNumber,
      filterData: controlComponentsData.filterData,
    });
  };

  const handleSubmitFilter = (data: FilterMaterialType) => {
    setControlComponentsData({ activePage: 0, filterData: data });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setControlComponentsData({
      activePage: 0,
      filterData: controlComponentsData.filterData,
    });
  };

  useEffect(() => {
    setLoading(true);

    (async () => {
      const params: AxiosRequestConfig = {
        withCredentials: true,
        method: "GET",
        url: "/materiaisom/paginado/indisponivel",
        params: {
          page: controlComponentsData.activePage,
          size: rowsPerPage,
          nomeeqp: controlComponentsData.filterData.nomeeqp,
          sn: controlComponentsData.filterData.sn,
          pn: controlComponentsData.filterData.pn,
        },
      };

      const newPage = (await requestBackend(params)).data;
      setPage(newPage);
      setLoading(false);
    })();
  }, [controlComponentsData, rowsPerPage]);

  return (
    <div className="list-container">
      <h2 style={{marginLeft: "10px", marginTop: "20px"}}>Materiais Indisponíveis</h2>
      <div>
        <FilterMaterialOM onSubmitFilter={handleSubmitFilter} />
      </div>
      {loading ? (
        <div className="loader-div">
          <Loader />
        </div>
      ) : (
        <table className="table-container">
          <thead className="table-head">
            <tr>
              <th scope="col">Nome Eqp.</th>
              <th scope="col">PN</th>
              <th scope="col">SN</th>
              <th scope="col">Fabricante</th>
              <th scope="col">Modelo</th>
              <th scope="col">Disponibilidade</th>
              <th scope="col">DE</th>
              <th scope="col">CMDO</th>
              <th scope="col">Brigada</th>
              <th scope="col">OM</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {page?.content.map((el) => (
              <MaterialOMCard element={el} key={el.id} />
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
    </div>
  );
};

export default MaterialOMIndisponivel;
