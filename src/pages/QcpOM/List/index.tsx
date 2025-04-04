import { AxiosRequestConfig } from "axios";
import Loader from "components/Loader";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QcpOM } from "types/qcpom";
import { requestBackend } from "utils/requests";

import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import QcpOMCard from "components/QcpOMCard";
import { TablePagination } from "@mui/material";
import { SpringPage } from "types/vendor/spring";

type ControlComponentsData = {
  activePage: number;
};

type UrlParams = {
  cmdo: string;
};

const QcpOMList = () => {
  const urlParams = useParams<UrlParams>();

  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<SpringPage<QcpOM>>();
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [controlComponentsData, setControlComponentsData] = useState<ControlComponentsData>({
    activePage: 0,
  });

  const handleExportToExcel = () => {
    if (page && page.content.length > 0) {
      const capacitadosProcessado = page.content.map((u) => ({
        CMDO: u.cmdoMilA,
        RM: u.rm,
        DE: u.de,
        BDA: u.bda,
        Sigla: u.sigla,
        Longitude: u.longi,
        Latitude: u.lat,
        Posto: u.posto,
        Previsto: u.qtdMilPrev,
        Efetivo: u.qtdMilEfetivo,
      }));

      const ws = XLSX.utils.json_to_sheet(capacitadosProcessado);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Qcp OM");
      XLSX.writeFile(wb, "qcpom.xlsx");
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

    if (page && page.content.length > 0) {
      page?.content.forEach((u, i) => {
        doc.setFont("helvetica", "bold");
        doc.text(u.cmdoMilA + ", " + u.bda + " - " + u.posto, marginLeft, y);
        y += lineHeight;

        const data = [
          ["RM", u.rm],
          ["DE", u.de],
          ["BDA", u.bda],
          ["Sigla", u.sigla],
          ["Longitude", u.longi],
          ["Latitude", u.lat],
          ["Posto", u.posto],
          ["Previsto", String(u.qtdMilPrev)],
          ["Efetivo", String(u.qtdMilEfetivo)],
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

    doc.save("qcp_om.pdf");
  };

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

    const params: AxiosRequestConfig = {
      url: "/qcpom/cmdo",
      method: "GET",
      withCredentials: true,
      params: {
        page: controlComponentsData.activePage,
        size: rowsPerPage,
        cmdo: urlParams.cmdo,
      },
    };

    requestBackend(params)
      .then((res) => {
        setPage(res.data as SpringPage<QcpOM>);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlParams, controlComponentsData, rowsPerPage]);

  console.log(page);

  return (
    <div className="list-container">
      <h2 style={{ marginLeft: "10px", marginTop: "20px" }}>QCP OM - {urlParams.cmdo}</h2>
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
              <th scope="col">CMDO</th>
              <th scope="col">RM</th>
              <th scope="col">DE</th>
              <th scope="col">BDA</th>
              <th scope="col">Sigla</th>
              <th scope="col">Latitude</th>
              <th scope="col">Longitude</th>
              <th scope="col">Posto/Graduação</th>
              <th scope="col">Previsto</th>
              <th scope="col">Efetivo</th>
            </tr>
          </thead>
          {page && page.content && (
            <>
              <tbody className="table-body">
                {page.content.map((el) => (
                  <QcpOMCard element={el} key={el.longi + el.qtdMilPrev + "-" + el.qtdMilPrev} />
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
            </>
          )}
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

export default QcpOMList;
