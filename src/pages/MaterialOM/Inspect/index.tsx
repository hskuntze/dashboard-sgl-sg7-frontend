import { AxiosRequestConfig } from "axios";
import Loader from "components/Loader";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MaterialOMType } from "types/materialom";
import { requestBackend } from "utils/requests";

type UrlParams = {
  id: string;
};

const MaterialOMInspect = () => {
  const urlParams = useParams<UrlParams>();

  const [material, setMaterial] = useState<MaterialOMType>();
  const [loading, setLoading] = useState(false);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: `/materiaisom/${urlParams.id}`,
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setMaterial(res.data as MaterialOMType);
      })
      .catch((err) => {
        toast.error("Erro ao resgatar dados do material.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlParams.id]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <div>
      <div className="inspect-container">
        <div>
          {loading ? (
            <div className="loader-div">
              <Loader />
            </div>
          ) : (
            <div className="inspect-content">
              <h5>{material?.sn}</h5>
              <span>
                <b>Nome eqp.: </b> {material?.equipamento}
              </span>
              <span>
                <b>PN: </b> {material?.pn}
              </span>
              <span>
                <b>SN: </b> {material?.sn}
              </span>
              <span>
                <b>Fabricante: </b> {material?.fabricante}
              </span>
              <span>
                <b>Modelo: </b> {material?.modelo}
              </span>
              <span>
                <b>Disponibilidade: </b> {material?.disponibilidade}
              </span>
              <span>
                <b>Motivo da indisponibilidade: </b> {material?.motivoindisp ?? "-"}
              </span>
              <span>
                <b>DE: </b> {material?.de}
              </span>
              <span>
                <b>CMDO: </b> {material?.cmdoOds}
              </span>
              <span>
                <b>Brigada: </b> {material?.bda}
              </span>
              <span>
                <b>OM: </b> {material?.om}
              </span>
              <span>
                <b>Cidade/UF: </b> {material?.cidade + "/" + material?.estado}
              </span>
              <span>
                <b>Subsistema: </b> {material?.subsistema}
              </span>
              <span>
                <b>Grupo: </b> {material?.grupo}
              </span>
              <span>
                <b>Tipo Eqp.: </b> {material?.tipo_eqp}
              </span>
              <span>
                <b>Latitude: </b> {material?.latitude}
              </span>
              <span>
                <b>Longitude: </b> {material?.longitude}
              </span>
            </div>
          )}
        </div>
      </div>
      <div style={{ marginLeft: "20px" }}>
        <Link to="/dashboard-sgl-sg7/materialom">
          <button type="button" className="button delete-button">
            Voltar
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MaterialOMInspect;
