import { AxiosRequestConfig } from "axios";
import Loader from "components/Loader";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { OM } from "types/om";
import { requestBackend } from "utils/requests";

const OMInspect = () => {
  const urlParams = useParams();

  const [om, setOm] = useState<OM>();
  const [loading, setLoading] = useState(false);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: `/oms/${urlParams.id}`,
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setOm(res.data as OM);
      })
      .catch((err) => {
        toast.error("Erro ao resgatar dados da ocorrência.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlParams.id]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <div className="inspect-container">
      <div>
        {loading ? (
          <div className="loading-div">
            <Loader />
          </div>
        ) : (
          <div className="inspect-content">
            <h5>{om?.sigla}</h5>
            <span><b>Brigada:</b>{" "}{om?.bda}</span>
            <span><b>Código:</b>{" "}{om?.codigo}</span>
            <span><b>RM:</b>{" "}{om?.rm}</span>
            <span><b>CMA:</b>{" "}{om?.cma}</span>
            <span><b>ID:</b>{" "}{om?.id}</span>
            <span><b>DE:</b>{" "}{om?.de}</span>
            <span><b>CODOM:</b>{" "}{om?.codom}</span>
            <span><b>Tipo:</b>{" "}{om?.tipo}</span>
            <span><b>FORPRON:</b>{" "}{om?.forpron}</span>
            <span><b>Nível:</b>{" "}{om?.nivel}</span>
            <span><b>CODREGRA:</b>{" "}{om?.codregra}</span>
            <span><b>OM com material?:</b>{" "}{om?.omcommaterial}</span>
            <span><b>Endereço:</b>{" "}{om?.endereco}</span>
            <span><b>CEP:</b>{" "}{om?.cep}</span>
            <span><b>Cidade/UF:</b>{" "}{om?.cidadeestado}</span>
            <span><b>CNPJ:</b>{" "}{om?.cnpj}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OMInspect;
