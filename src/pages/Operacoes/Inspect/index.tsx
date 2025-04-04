import { AxiosRequestConfig } from "axios";
import Loader from "components/Loader";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { requestBackend } from "utils/requests";
import { OperacoesType } from "types/operacoes";

import "./styles.css";
import { formatarData } from "utils/functions";

type UrlParams = {
  codigo: string;
};

const OperacoesInspect = () => {
  const urlParams = useParams<UrlParams>();

  const [loading, setLoading] = useState<boolean>(false);
  const [el, setEl] = useState<OperacoesType>();

  useEffect(() => {
    setLoading(true);

    const params: AxiosRequestConfig = {
      url: `/operacoes/${urlParams.codigo}`,
      method: "GET",
      withCredentials: true,
    };

    requestBackend(params)
      .then((res) => {
        setEl(res.data as OperacoesType);
        console.log(res.data as OperacoesType);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlParams]);

  return (
    <div className="inspect-container">
      {loading ? (
        <div className="loader-div">
          <Loader />
        </div>
      ) : (
        <div className="inspect-content">
          <h5>{el?.operacao}</h5>
          <span>
            <b>Conceito: </b>
            {el?.conceito}
          </span>
          <span>
            <b>Início: </b>
            {formatarData(el ? el?.inicio : "")}
          </span>
          <span>
            <b>Fim: </b>
            {el?.fim === null ? "-" : formatarData(el ? el.fim : "")}
          </span>
          <span>
            <b>Cidade: </b>
            {el?.cidade}
          </span>
          <span>
            <b>Estado: </b>
            {el?.estado}
          </span>
          <span>
            <b>Pessoal Envolvido: </b>
            {el?.pessoalEnvolvido}
          </span>
          <span>
            <b>Latitude: </b>
            {el?.latitude}
          </span>
          <span>
            <b>Longitude: </b>
            {el?.longitude}
          </span>
          <div className="inspect-row">
            {el && el.materiais.length > 0 && (
              <ul className="inspect-list">
                <div className="list-header">
                  <h6>Materiais</h6>
                </div>
                <div className="list-body">
                  {el.materiais.map((m) => (
                    <li className="list-element">
                      <b>{m.material}</b> - {m.qnt} unidades
                    </li>
                  ))}
                </div>
              </ul>
            )}
            {el && el.oms.length > 0 && (
              <ul className="inspect-list">
                <div className="list-header">
                  <h6>OMs</h6>
                </div>
                <div className="list-body">
                  {el.oms.map((m) => (
                    <li className="list-element">{m.sigla}</li>
                  ))}
                </div>
              </ul>
            )}
          </div>
        </div>
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

export default OperacoesInspect;
