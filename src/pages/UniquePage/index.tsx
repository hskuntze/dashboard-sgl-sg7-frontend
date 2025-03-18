import "./styles.css";

import AllTicketsSVG from "assets/images/all_tickets.svg";
import OpenTicketsSVG from "assets/images/open_tickets.svg";
import AvailableSVG from "assets/images/available_materials.svg";
import UnavailableSVG from "assets/images/unavailable_materials.svg";
import MaterialsSVG from "assets/images/all_materials.svg";

import QtdMaterialCidadeEstadoSmall from "components/QtdMaterialCidadeEstadoSmall";
import QtdMaterialCmdoSmall from "components/QtdMaterialCmdoSmall";
import QtdMaterialRmSmall from "components/QtdMaterialRmSmall";
import QtdChamadoAnoSmall from "components/QtdChamadoAnoSmall";
import QtdMaterialBdaSmall from "components/QtdMaterialBdaSmall";
import QtdCategoriaMaterialIndisponivelSmall from "components/QtdCategoriaMaterialIndisponivelSmall";
import QtdMaterialSubsistemaSmall from "components/QtdMaterialSubsistemaSmall";
import QtdMaterialTipoEqpSmall from "components/QtdMaterialTipoEqpSmall";
import TextLoader from "components/TextLoader";
import Map from "components/Map";

import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { GeorefCmdo } from "types/georefcmdo";
import { QtdMaterialCidadeEstadoType } from "types/relatorio/qtdmaterialcidadeestado";
import { QtdMaterialRmType } from "types/relatorio/qtdmaterialrm";
import { QtdMaterialBdaType } from "types/relatorio/qtdmaterialbda";
import { CategoriaMaterialIndisponivelType } from "types/relatorio/qtdcategoriamaterialindisponivel";
import { QtdMaterialSubsistemaType } from "types/relatorio/qtdmaterialsubsistema";
import { QtdMaterialTipoEqpExistentePrevisto } from "types/relatorio/qtdmaterialtipoeqp";
import ExecucaoOrcamentaria2024 from "components/ExecucaoOrcamentaria2024";
import ExecucaoOrcamentaria2025 from "components/ExecucaoOrcamentaria2025";
import ExecucaoOrcamentaria2024TipoAcao from "components/ExecucaoOrcamentaria2024TipoAcao";
import ExecucaoOrcamentaria2025TipoAcao from "components/ExecucaoOrcamentaria2025TipoAcao";
import RestantePorAno from "components/RestantePorAno";
import TipoAcaoValor from "components/TipoAcaoValor";
import MenuLateral from "components/MenuLateral";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Carousel } from "bootstrap";
import MapQcpOM from "components/MapQcpOM";


type DisponibilidadeMaterial = {
  disponibilidade: string;
  quantidade: number;
};

const UniquePage = () => {
  const [totalMateriais, setTotalMateriais] = useState<string>();
  const [qtdChamados, setQtdChamados] = useState<string>();
  const [qtdChamadosAbertos, setQtdChamadosAbertos] = useState<string>();
  const [disponibilidadeMaterial, setDisponibilidadeMaterial] = useState<DisponibilidadeMaterial[]>();

  const [loadingChamados, setLoadingChamados] = useState<boolean>(false);
  const [loadingChamadosAbertos, setLoadingChamadosAbertos] = useState<boolean>(false);
  const [loadingMateriais, setLoadingMateriais] = useState<boolean>(false);
  const [loadingDisponibilidade, setLoadingDisponibilidade] = useState<boolean>(false);

  // Função para garantir a ordem correta dos dados
  const organizeDisponibilidadeMaterial = (data: DisponibilidadeMaterial[]) => {
    const disponiveis = data.find((item) => item.disponibilidade === "Disponível");
    const indisponiveis = data.find((item) => item.disponibilidade === "Indisponível");

    return [disponiveis || { quantidade: 0, disponibilidade: "Disponível" }, indisponiveis || { quantidade: 0, disponibilidade: "Indisponível" }];
  };

  const navigate = useNavigate();

  const [selectedCmdoUf, setSelectedCmdoUf] = useState<QtdMaterialCidadeEstadoType[]>([]);
  const [selectedCmdoRm, setSelectedCmdoRm] = useState<QtdMaterialRmType[]>([]);
  const [selectedCmdoCategoria, setSelectedCmdoCategoria] = useState<CategoriaMaterialIndisponivelType[]>([]);
  const [selectedCmdoBda, setSelectedCmdoBda] = useState<QtdMaterialBdaType[]>([]);
  const [selectedCmdoMapa, setSelectedCmdoMapa] = useState<GeorefCmdo[]>([]);
  const [selectedCmdoSubsistema, setSelectedCmdoSubsistema] = useState<QtdMaterialSubsistemaType[]>([]);
  const [selectedCmdoTipoEqp, setSelectedCmdoTipoEqp] = useState<QtdMaterialTipoEqpExistentePrevisto[]>([]);

  const carouselRef = useRef<HTMLDivElement>(null);

  const loadQtdTotal = useCallback(() => {
    setLoadingMateriais(true);

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
        toast.error("Não foi possível carregar a quantidade de materiais.");
      })
      .finally(() => {
        setLoadingMateriais(false);
      });
  }, []);

  const loadQtdChamados = useCallback(() => {
    setLoadingChamados(true);

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
      })
      .finally(() => {
        setLoadingChamados(false);
      });
  }, []);

  const loadQtdChamadosAbertos = useCallback(() => {
    setLoadingChamadosAbertos(true);

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
        toast.error("Não foi possível carregar a quantidade de chamados abertos.");
      })
      .finally(() => {
        setLoadingChamadosAbertos(false);
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
        let data = res.data as DisponibilidadeMaterial[];
        let organizedData = organizeDisponibilidadeMaterial(data);
        setDisponibilidadeMaterial(organizedData);
      })
      .catch((err) => {
        toast.error("Não foi possível carregar a quantidade de materiais disponíveis.");
      })
      .finally(() => {
        setLoadingDisponibilidade(false);
      });
  }, []);

  const handleSelectCmdo = async (cmdo: string | null) => {
    if (cmdo !== null) {
      // Mapeando os endpoints para facilitar a manutenção
      const endpoints = [
        { key: "uf", url: `/materiaisom/qtd/ufcmdo/${cmdo}`, stateSetter: setSelectedCmdoUf },
        { key: "rm", url: `/materiaisom/qtd/rmcmdo/${cmdo}`, stateSetter: setSelectedCmdoRm },
        { key: "bda", url: `/materiaisom/qtd/bdacmdo/${cmdo}`, stateSetter: setSelectedCmdoBda },
        { key: "catIndisponivel", url: `/materiaisom/qtd/ctgmtindisponivelcmdo/${cmdo}`, stateSetter: setSelectedCmdoCategoria },
        { key: "mapa", url: `/materiaisom/georef/cmdo/${cmdo}`, stateSetter: setSelectedCmdoMapa },
        { key: "subsistema", url: `/materiaisom/qtd/subsistema/${cmdo}`, stateSetter: setSelectedCmdoSubsistema },
        { key: "tipoEqp", url: `/materiaisom/qtd/tipoeqp/${cmdo}`, stateSetter: setSelectedCmdoTipoEqp },
      ];

      try {
        // Criando as requisições em paralelo
        const responses = await Promise.all(
          endpoints.map(({ url }) =>
            requestBackend({ url, method: "GET", withCredentials: true }).catch((err) => {
              toast.error(`Erro ao carregar dados de ${url}`);
              return null;
            })
          )
        );

        // Atualizando os estados com os dados das respostas
        responses.forEach((res, index) => {
          if (res !== null) {
            endpoints[index].stateSetter(res.data);
          }
        });
      } catch (error) {
        toast.error("Erro ao carregar os dados do CMDO.");
      }
    } else {
      // Resetando os estados de uma vez só
      setSelectedCmdoUf([]);
      setSelectedCmdoRm([]);
      setSelectedCmdoBda([]);
      setSelectedCmdoCategoria([]);
      setSelectedCmdoMapa([]);
      setSelectedCmdoSubsistema([]);
      setSelectedCmdoTipoEqp([]);
    }
  };

  const handleMenuClick = (index: number) => {
    if (carouselRef.current) {
      const carousel = new Carousel(carouselRef.current, {
        interval: 10000,
      });
      carousel.to(index);
    }
  };

  useEffect(() => {
    loadQtdTotal();
    loadQtdChamados();
    loadQtdChamadosAbertos();
    loadDisponibilidadeMaterial();
  }, [loadQtdTotal, loadQtdChamados, loadQtdChamadosAbertos, loadDisponibilidadeMaterial]);

  return (
    <>
      <div id="element-content">
        <MenuLateral onMenuClick={handleMenuClick} />
        <div className="unique-page-container">
          <div ref={carouselRef} id="carousel-page" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active" id="dm7">
                <div className="unique-page-grid">
                  <div className="grid-object">
                    <Map selectedData={selectedCmdoMapa} />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Materiais Classe VII</span>
                    <span className="span-subtitle">por C Mil A / ODS​</span>
                    <QtdMaterialCmdoSmall onSelectedItem={handleSelectCmdo} />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Materiais Classe VII</span>
                    <span className="span-subtitle">por UF</span>
                    <QtdMaterialCidadeEstadoSmall selectedData={selectedCmdoUf} />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Materiais Classe VII</span>
                    <span className="span-subtitle">por RM</span>
                    <QtdMaterialRmSmall selectedData={selectedCmdoRm} />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Materiais Classe VII</span>
                    <span className="span-subtitle">Brigadas com Maior Quantidade de Materiais</span>
                    <QtdMaterialBdaSmall selectedData={selectedCmdoBda} />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Materiais Classe VII</span>
                    <span className="span-subtitle">indisponibilidade por categoria</span>
                    <QtdCategoriaMaterialIndisponivelSmall selectedData={selectedCmdoCategoria} />
                  </div>
                  <span className="painel-title">PAINEL DM7</span>
                </div>
              </div>
              <div className="carousel-item" id="agge">
                <div className="unique-page-grid">
                  <div className="grid-object">
                    <span className="span-title">Execução Orçamentária</span>
                    <span className="span-subtitle">em 2024</span>
                    <ExecucaoOrcamentaria2024 />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Execução Orçamentária</span>
                    <span className="span-subtitle">em 2025</span>
                    <ExecucaoOrcamentaria2025 />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Execução Orçamentária</span>
                    <span className="span-subtitle">ações 147F, 15W6, 20XE, 20XJ, 14T5 e 21D2 em 2024</span>
                    <ExecucaoOrcamentaria2024TipoAcao />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Execução Orçamentária</span>
                    <span className="span-subtitle">ações 147F, 15W6, 20XE, 20XJ, 14T5 e 21D2 em 2025</span>
                    <ExecucaoOrcamentaria2025TipoAcao />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Restos a Pagar</span>
                    <span className="span-subtitle">restante por ano</span>
                    <RestantePorAno />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Restos a Pagar</span>
                    <span className="span-subtitle">por tipo de ação</span>
                    <TipoAcaoValor />
                  </div>
                  <span className="painel-title">PAINEL AGGE</span>
                </div>
              </div>
              <div className="carousel-item" id="cop">
                <div className="unique-page-grid cop-grid">
                  <div className="cop-top">
                    <span className="span-title">Materiais Classe VII</span>
                    <span className="span-subtitle">por sistema</span>
                    <QtdMaterialSubsistemaSmall selectedData={selectedCmdoSubsistema} />
                  </div>
                  <div className="cop-bottom">
                    <span className="span-title">Materiais Classe VII</span>
                    <span className="span-subtitle">existentes e previstos</span>
                    <QtdMaterialTipoEqpSmall selectedData={selectedCmdoTipoEqp} />
                  </div>
                  <div className="cop-right">
                    <MapQcpOM selectedData={null} />
                  </div>
                  <span className="painel-title">PAINEL COP</span>
                </div>
              </div>
              <div className="carousel-item" id="sisfron">
                <div className="unique-page-grid">
                  <div className="grid-object grid-row">
                    <span className="span-title">Visão Geral</span>
                    <div className="object-row">
                      <img className="small-icon" src={AllTicketsSVG} alt="all-tickets" />
                      <div>
                        {loadingChamados ? <TextLoader /> : <h6>{qtdChamados} chamados</h6>}
                        <span>SGL - Garantia</span>
                      </div>
                    </div>
                    <div className="object-row">
                      <img className="small-icon" src={OpenTicketsSVG} alt="all-tickets" />
                      <div>
                        {loadingChamadosAbertos ? <TextLoader /> : <h6>{qtdChamadosAbertos} chamados abertos</h6>}
                        <span>SGL - Garantia</span>
                      </div>
                    </div>
                    <div className="object-row clickable-div material-om" onClick={() => navigate("/dashboard-sgl-sg7/materialom")}>
                      <img className="small-icon" src={MaterialsSVG} alt="all-tickets" />
                      <div>
                        {loadingMateriais ? <TextLoader /> : <h6>{totalMateriais} materiais</h6>}
                        <span>Classe VII | OM</span>
                      </div>
                    </div>
                    <div
                      className="object-row clickable-div material-om-disponivel"
                      onClick={() => navigate("/dashboard-sgl-sg7/materialom/disponivel")}
                    >
                      <img className="small-icon" src={AvailableSVG} alt="all-tickets" />
                      <div>
                        {loadingDisponibilidade ? (
                          <TextLoader />
                        ) : (
                          <h6>{(disponibilidadeMaterial && disponibilidadeMaterial.at(0)?.quantidade) || 0} materiais disponíveis</h6>
                        )}
                        <span>Classe VII | OM</span>
                      </div>
                    </div>
                    <div
                      className="object-row clickable-div material-om-indisponivel"
                      onClick={() => navigate("/dashboard-sgl-sg7/materialom/indisponivel")}
                    >
                      <img className="small-icon" src={UnavailableSVG} alt="all-tickets" />
                      <div>
                        {loadingDisponibilidade ? (
                          <TextLoader />
                        ) : (
                          <h6>{(disponibilidadeMaterial && disponibilidadeMaterial.at(1)?.quantidade) || 0} materiais indisponíveis</h6>
                        )}
                        <span>Classe VII | OM</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Chamados por Ano</span>
                    <span className="span-subtitle">SGL - Garantia</span>
                    <QtdChamadoAnoSmall />
                  </div>
                  <span className="painel-title">PAINEL SISFRON</span>
                </div>
              </div>
            </div>
            {/* <button
              className="carousel-control-prev"
              type="button"
              style={{ color: "#000", fontSize: "60px", opacity: "0.8" }}
              data-bs-target="#carousel-page"
              data-bs-slide="prev"
            >
              <i className="bi bi-chevron-left" />
            </button>
            <button
              className="carousel-control-next"
              type="button"
              style={{ color: "#000", fontSize: "60px", opacity: "0.8" }}
              data-bs-target="#carousel-page"
              data-bs-slide="next"
            >
              <i className="bi bi-chevron-right" />
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default UniquePage;
