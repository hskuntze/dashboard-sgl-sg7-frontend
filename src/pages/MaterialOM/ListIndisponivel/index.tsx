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
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

type ControlComponentsData = {
  activePage: number;
  filterData: FilterMaterialType;
};

const MaterialOMIndisponivel = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<SpringPage<MaterialOMType>>();
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [controlComponentsData, setControlComponentsData] = useState<ControlComponentsData>({
    activePage: 0,
    filterData: { nomeeqp: null, pn: null, sn: null, cmdo: null },
  });

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, pageNumber: number) => {
    setControlComponentsData({
      activePage: pageNumber,
      filterData: controlComponentsData.filterData,
    });
  };

  const handleSubmitFilter = (data: FilterMaterialType) => {
    setControlComponentsData({ activePage: 0, filterData: data });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleExportToExcel = () => {
    if (page && page.content.length > 0) {
      const capacitadosProcessado = page.content.map((u) => ({
        "Nome eqp.": u.equipamento,
        Modelo: u.modelo,
        Fabricante: u.fabricante,
        PN: u.pn,
        SN: u.sn,
        Disponibilidade: u.disponibilidade,
        "Motivo da indisponibilidade": u.motivoindisp,
        RM: u.rm,
        CMDO: u.cmdoOds,
        BDA: u.bda,
        OM: u.om,
        DE: u.de,
        "Cidade/UF": u.cidade + "/" + u.estado,
        Subsistema: u.subsistema,
        Grupo: u.grupo,
        Longitude: u.longitude,
        Latitude: u.latitude,
      }));

      const ws = XLSX.utils.json_to_sheet(capacitadosProcessado);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Materiais");
      XLSX.writeFile(wb, "materiais.xlsx");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Materiais disponíveis", 5, 20);

    doc.setFontSize(12);
    const yStart = 30;
    let y = yStart;
    const lineHeight = 10;
    const marginLeft = 15;
    const colWidth = 50;

    if (page && page.content.length > 0) {
      page.content?.forEach((u, i) => {
        doc.setFont("helvetica", "bold");
        doc.text(u.equipamento + ", " + u.sn, marginLeft, y);
        y += lineHeight;

        const data = [
          ["Nome eqp.", u.equipamento ?? "-"],
          ["Modelo", u.modelo ?? "-"],
          ["Fabricante", u.fabricante ?? "-"],
          ["PN", u.pn ?? "-"],
          ["SN", u.sn ?? "-"],
          ["Disponibilidade", u.disponibilidade ?? "-"],
          ["Motivo da indisponibilidade", u.motivoindisp ?? "-"],
          ["RM", u.rm ?? "-"],
          ["CMDO", u.cmdoOds ?? "-"],
          ["BDA", u.bda ?? "-"],
          ["OM", u.om ?? "-"],
          ["DE", u.de ?? "-"],
          ["Cidade", u.cidade ?? "-"],
          ["UF", u.estado ?? "-"],
          ["Subsistema", u.subsistema ?? "-"],
          ["Grupo", u.grupo ?? "-"],
          ["Tipo Eqp.", u.tipo_eqp ?? "-"],
          ["Longitude", String(u.longitude) ?? "-"],
          ["Latitude", String(u.latitude) ?? "-"],
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

    doc.save("materiais_disponiveis.pdf");
  };

  return (
    <div className="list-container">
      <h2 style={{ marginLeft: "10px", marginTop: "20px" }}>Materiais Indisponíveis</h2>
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
              <MaterialOMCard element={el} key={el.sn} />
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

export default MaterialOMIndisponivel;
