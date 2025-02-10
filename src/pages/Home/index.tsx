import { AxiosRequestConfig } from "axios";
import "./styles.css";
import { requestBackend } from "utils/requests";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import QtdMaterialCmdo from "components/QtdMaterialCmdo";
import QtdMaterialBda from "components/QtdMaterialBda";
import QtdMaterialRm from "components/QtdMaterialRm";
import QtdMaterialTotalGauge from "components/QtdMaterialTotalGauge";
import QtdMaterialCidadeEstado from "components/QtdMaterialCidadeEstado";
import QtdChamadoAno from "components/QtdChamadoAno";
import { Link } from "react-router-dom";
import Loader from "components/Loader";

/**
 * Página inicial
 * Rota correspondente: / (quando se está logado)
 */
const Home = () => {
  const [totalMateriais, setTotalMateriais] = useState<string>();
  const [qtdEtapas, setQtdEtapas] = useState<string>();
  const [qtdContratos, setQtdContratos] = useState<string>();
  const [qtdChamados, setQtdChamados] = useState<string>();
  const [qtdChamadosAbertos, setQtdChamadosAbertos] = useState<string>();
  const [disponibilidadeMaterial, setDisponibilidadeMaterial] = useState<
    [
      {
        disponibilidade: string;
        quantidade: number;
      }
    ]
  >();

  const [loadingQtdTotal, setLoadingQtdTotal] = useState(false);
  const [loadingDisponibilidade, setLoadingDisponibilidade] = useState(false);
  const [loadingContrato, setLoadingContrato] = useState(false);
  const [loadingEtapa, setLoadingEtapa] = useState(false);

  const loadQtdTotal = useCallback(() => {
    setLoadingQtdTotal(true);

    const requestParams: AxiosRequestConfig = {
      url: "/materiaisom/total",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setTotalMateriais(res.data);
      })
      .catch((err) => {
        toast.error("Não foi possível carregar a quantidade de chamados.");
      })
      .finally(() => {
        setLoadingQtdTotal(false);
      });
  }, []);

  const loadQtdContratos = useCallback(() => {
    setLoadingContrato(true);

    const requestParams: AxiosRequestConfig = {
      url: "/safe/contratos",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setQtdContratos(res.data);
      })
      .catch((err) => {
        toast.error(
          "Não foi possível carregar a quantidade de contratos do SAFE."
        );
      })
      .finally(() => {
        setLoadingContrato(false);
      });
  }, []);

  const loadQtdEtapas = useCallback(() => {
    setLoadingEtapa(true);

    const requestParams: AxiosRequestConfig = {
      url: "/safe/etapas",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setQtdEtapas(res.data);
      })
      .catch((err) => {
        toast.error(
          "Não foi possível carregar a quantidade de etapas do SAFE."
        );
      })
      .finally(() => {
        setLoadingEtapa(false);
      });
  }, []);

  const loadQtdChamados = useCallback(() => {
    const requestParams: AxiosRequestConfig = {
      url: "/chamados",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setQtdChamados(res.data);
      })
      .catch((err) => {
        toast.error("Não foi possível carregar a quantidade de chamados.");
      });
  }, []);

  const loadQtdChamadosAbertos = useCallback(() => {
    const requestParams: AxiosRequestConfig = {
      url: "/chamados/abertos",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setQtdChamadosAbertos(res.data);
      })
      .catch((err) => {
        toast.error(
          "Não foi possível carregar a quantidade de chamados abertos."
        );
      });
  }, []);

  const loadDisponibilidadeMaterial = useCallback(() => {
    setLoadingDisponibilidade(true);

    const requestParams: AxiosRequestConfig = {
      url: "/materiaisom/qtd/disponibilidade",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setDisponibilidadeMaterial(res.data);
      })
      .catch((err) => {
        toast.error(
          "Não foi possível carregar a quantidade de chamados abertos."
        );
      })
      .finally(() => {
        setLoadingDisponibilidade(false);
      });
  }, []);

  useEffect(() => {
    loadQtdTotal();
    loadQtdChamados();
    loadQtdChamadosAbertos();
    loadDisponibilidadeMaterial();
    loadQtdContratos();
    loadQtdEtapas();
  }, [
    loadQtdTotal,
    loadQtdChamados,
    loadQtdChamadosAbertos,
    loadDisponibilidadeMaterial,
    loadQtdContratos,
    loadQtdEtapas,
  ]);

  return (
    <div className="home-container">
      <div className="dashboard">
        <div className="div-qtds">
          <div className="card-qtd">
            <h6>Total Chamados - SGL (Garantia) </h6>
            <span>{qtdChamados}</span>
          </div>
          <div className="card-qtd">
            <h6>Total Chamados Abertos - SGL (Garantia)</h6>
            <span>{qtdChamadosAbertos}</span>
          </div>
          {loadingDisponibilidade ? (
            <div className="loader-div">
              <Loader />
            </div>
          ) : (
            disponibilidadeMaterial?.map((d) =>
              d.disponibilidade === "Disponível" ? (
                <Link to={"/dashboard-sgl-sg7/materialom/disponivel"}>
                  <div className="card-qtd card-link-material">
                    <h6>Materiais Disponíveis Classe VII nas OM</h6>
                    <span>{d.quantidade}</span>
                  </div>
                </Link>
              ) : (
                <Link to={"/dashboard-sgl-sg7/materialom/indisponivel"}>
                  <div className="card-qtd card-link-material">
                    <h6>Materiais Indisponíveis Classe VII nas OM</h6>
                    <span>{d.quantidade}</span>
                  </div>
                </Link>
              )
            )
          )}
          {loadingQtdTotal ? (
            <div className="loader-div">
              <Loader />
            </div>
          ) : (
            <Link to={"/dashboard-sgl-sg7/materialom"}>
              <div className="card-qtd card-link-material">
                <h6>Total Materiais Classe VII nas OM</h6>
                <span>{totalMateriais}</span>
              </div>
            </Link>
          )}
          <div className="card-qtd">
            <h6 style={{ position: "absolute", top: "50px" }}>
              Porcentagem até 50.000 materiais
            </h6>
            <QtdMaterialTotalGauge />
          </div>
          {loadingContrato ? (
            <div className="loader-div">
              <Loader />
            </div>
          ) : (
            <div className="card-qtd">
              <h6>Total Contratos SAD/SISFRON</h6>
              <span>{qtdContratos}</span>
            </div>
          )}
          {loadingEtapa ? (
            <div className="loader-div">
              <Loader />
            </div>
          ) : (
            <div className="card-qtd">
              <h6>Total Etapas SAD/SISFRON</h6>
              <span>{qtdEtapas}</span>
            </div>
          )}
        </div>
        <div className="div-charts">
          <div className="card-chart">
            <QtdMaterialRm />
          </div>
        </div>
      </div>
      <div className="dashboard">
        <div className="div-charts cmdo-uf">
          <div>
            <QtdMaterialCmdo />
          </div>
          <div>
            <QtdMaterialCidadeEstado />
          </div>
        </div>
      </div>
      <div className="dashboard">
        <div className="div-charts">
          <QtdMaterialBda />
        </div>
      </div>
      <div className="dashboard">
        <div className="div-charts">
          <QtdChamadoAno />
        </div>
      </div>
    </div>
  );
};

export default Home;
