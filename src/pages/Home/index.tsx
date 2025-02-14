import { AxiosRequestConfig } from "axios";
import "./styles.css";
import { requestBackend } from "utils/requests";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import QtdMaterialCmdo from "components/QtdMaterialCmdo";
import QtdMaterialBda from "components/QtdMaterialBda";
import QtdMaterialRm from "components/QtdMaterialRm";
import QtdMaterialCidadeEstado from "components/QtdMaterialCidadeEstado";
import QtdChamadoAno from "components/QtdChamadoAno";
import { useNavigate } from "react-router-dom";
import Loader from "components/Loader";

/**
 * Página inicial
 * Rota correspondente: / (quando se está logado)
 */
const Home = () => {
  const [totalMateriais, setTotalMateriais] = useState<string>();
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

  const navigate = useNavigate();

  const [loadingQtdTotal, setLoadingQtdTotal] = useState(false);
  const [loadingDisponibilidade, setLoadingDisponibilidade] = useState(false);

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
  }, [
    loadQtdTotal,
    loadQtdChamados,
    loadQtdChamadosAbertos,
    loadDisponibilidadeMaterial,
  ]);

  return (
    <div className="home-container">
      <div className="dashboard">
        <div className="div-qtds">
          <div className="card-qtd card-link-chamado">
            <h6>Chamados - SGL (Garantia) </h6>
            <span>{qtdChamados}</span>
          </div>
          <div className="card-qtd card-link-chamado">
            <h6>Chamados Abertos - SGL (Garantia)</h6>
            <span>{qtdChamadosAbertos}</span>
          </div>
          {loadingDisponibilidade ? (
            <div className="loader-div">
              <Loader />
            </div>
          ) : (
            disponibilidadeMaterial?.map((d) =>
              d.disponibilidade === "Disponível" ? (
                <div
                  className="card-qtd card-link-material"
                  onClick={() =>
                    navigate("/dashboard-sgl-sg7/materialom/disponivel")
                  }
                >
                  <h6>Materiais Disponíveis Classe VII nas OM</h6>
                  <span>{d.quantidade}</span>
                </div>
              ) : (
                <div
                  className="card-qtd card-link-material"
                  onClick={() =>
                    navigate("/dashboard-sgl-sg7/materialom/indisponivel")
                  }
                >
                  <h6>Materiais Indisponíveis Classe VII nas OM</h6>
                  <span>{d.quantidade}</span>
                </div>
              )
            )
          )}
          {loadingQtdTotal ? (
            <div className="loader-div">
              <Loader />
            </div>
          ) : (
            <div
              className="card-qtd card-link-material"
              onClick={() =>
                navigate("/dashboard-sgl-sg7/materialom")
              }
            >
              <h6>Materiais Classe VII nas OM</h6>
              <span>{totalMateriais}</span>
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
