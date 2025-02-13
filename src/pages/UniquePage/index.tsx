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

import { useCallback, useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import QtdCategoriaMaterialIndisponivelSmall from "components/QtdCategoriaMaterialIndisponivelSmall";
// import QtdIndisponivelPorBda from "components/QtdIndisponivelPorBda";
import { useNavigate } from "react-router-dom";
import TextLoader from "components/TextLoader";
import { QtdMaterialCidadeEstadoType } from "types/relatorio/qtdmaterialcidadeestado";
import { QtdMaterialRmType } from "types/relatorio/qtdmaterialrm";
import { QtdMaterialBdaType } from "types/relatorio/qtdmaterialbda";
// import { QtdIndisponivelPorBdaType } from "types/relatorio/qtdindisponivelporbda";
import { CategoriaMaterialIndisponivelType } from "types/relatorio/qtdcategoriamaterialindisponivel";
import Map from "components/Map";
import { GeorefUnidade } from "types/georef";

type DisponibilidadeMaterial = {
  disponibilidade: string;
  quantidade: number;
};

const UniquePage = () => {
  const [totalMateriais, setTotalMateriais] = useState<string>();
  const [qtdChamados, setQtdChamados] = useState<string>();
  const [qtdChamadosAbertos, setQtdChamadosAbertos] = useState<string>();
  const [disponibilidadeMaterial, setDisponibilidadeMaterial] =
    useState<DisponibilidadeMaterial[]>();

  const [loadingChamados, setLoadingChamados] = useState<boolean>(false);
  const [loadingChamadosAbertos, setLoadingChamadosAbertos] =
    useState<boolean>(false);
  const [loadingMateriais, setLoadingMateriais] = useState<boolean>(false);
  const [loadingDisponibilidade, setLoadingDisponibilidade] =
    useState<boolean>(false);

  // Função para garantir a ordem correta dos dados
  const organizeDisponibilidadeMaterial = (data: DisponibilidadeMaterial[]) => {
    const disponiveis = data.find(
      (item) => item.disponibilidade === "Disponível"
    );
    const indisponiveis = data.find(
      (item) => item.disponibilidade === "Indisponível"
    );

    return [
      disponiveis || { quantidade: 0, disponibilidade: "Disponível" },
      indisponiveis || { quantidade: 0, disponibilidade: "Indisponível" },
    ];
  };

  const navigate = useNavigate();

  const [selectedCmdoUf, setSelectedCmdoUf] = useState<QtdMaterialCidadeEstadoType[]>([]);
  const [selectedCmdoRm, setSelectedCmdoRm] = useState<QtdMaterialRmType[]>([]);
  const [selectedCmdoCategoria, setSelectedCmdoCategoria] = useState<CategoriaMaterialIndisponivelType[]>([]);
  const [selectedCmdoBda, setSelectedCmdoBda] = useState<QtdMaterialBdaType[]>([]);
  // const [selectedCmdoIndisponivelBda, setSelectedCmdoIndisponivelBda] =
  //   useState<QtdIndisponivelPorBdaType[]>([]);
  const [selectedCmdoMapa, setSelectedCmdoMapa] = useState<GeorefUnidade[]>([]);

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
        toast.error(
          "Não foi possível carregar a quantidade de chamados abertos."
        );
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
        toast.error(
          "Não foi possível carregar a quantidade de materiais disponíveis."
        );
      })
      .finally(() => {
        setLoadingDisponibilidade(false);
      });
  }, []);

  const handleSelectCmdo = (cmdo: string | null) => {
    if (cmdo !== null) {
      const requestParamsUf: AxiosRequestConfig = {
        url: `/materiaisom/qtd/ufcmdo/${cmdo}`,
        method: "GET",
        withCredentials: true,
      };

      const requestParamsRm: AxiosRequestConfig = {
        url: `/materiaisom/qtd/rmcmdo/${cmdo}`,
        method: "GET",
        withCredentials: true,
      };

      const requestParamsBda: AxiosRequestConfig = {
        url: `/materiaisom/qtd/bdacmdo/${cmdo}`,
        method: "GET",
        withCredentials: true,
      };

      // const requestParamsIndisponivelBda: AxiosRequestConfig = {
      //   url: `/materiaisom/qtd/indisponivelbdacmdo/${cmdo}`,
      //   method: "GET",
      //   withCredentials: true,
      // };

      const requestParamsCatIndisponivel: AxiosRequestConfig = {
        url: `/materiaisom/qtd/ctgmtindisponivelcmdo/${cmdo}`,
        method: "GET",
        withCredentials: true,
      };

      const requestParamsMapa: AxiosRequestConfig = {
        url: `/materiaisom/georef/unidades/${cmdo}`,
        method: "GET",
        withCredentials: true,
      };

      requestBackend(requestParamsUf)
        .then((res) => {
          setSelectedCmdoUf(res.data as QtdMaterialCidadeEstadoType[]);
        })
        .catch((err) => {
          toast.error("Erro ao tentar carregar dados de UF por CMDO.");
        });

      requestBackend(requestParamsRm)
        .then((res) => {
          setSelectedCmdoRm(res.data as QtdMaterialRmType[]);
        })
        .catch((err) => {
          toast.error("Erro ao tentar carregar dados de RM por CMDO.");
        });

      requestBackend(requestParamsBda)
        .then((res) => {
          setSelectedCmdoBda(res.data as QtdMaterialBdaType[]);
        })
        .catch((err) => {
          toast.error("Erro ao tentar carregar dados de BDA por CMDO.");
        });

      // requestBackend(requestParamsIndisponivelBda)
      //   .then((res) => {
      //     setSelectedCmdoIndisponivelBda(
      //       res.data as QtdIndisponivelPorBdaType[]
      //     );
      //   })
      //   .catch((err) => {
      //     toast.error(
      //       "Erro ao tentar carregar dados de indisponível por BDA por CMDO."
      //     );
      //   });

      requestBackend(requestParamsCatIndisponivel)
        .then((res) => {
          setSelectedCmdoCategoria(
            res.data as CategoriaMaterialIndisponivelType[]
          );
        })
        .catch((err) => {
          toast.error(
            "Erro ao tentar carregar dados de categoria indisponível por CMDO."
          );
        });

      requestBackend(requestParamsMapa)
        .then((res) => {
          setSelectedCmdoMapa(res.data as GeorefUnidade[]);
        })
        .catch((err) => {
          toast.error(
            "Erro ao tentar carregar dados de georeferenciamento por CMDO."
          );
        });
    } else {
      setSelectedCmdoUf([]);
      setSelectedCmdoRm([]);
      setSelectedCmdoBda([]);
      // setSelectedCmdoIndisponivelBda([]);
      setSelectedCmdoCategoria([]);
      setSelectedCmdoMapa([]);
    }
  };

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
    <>
      <div className="unique-page-container">
        <div className="unique-page-grid">
          {/* Visão Geral */}
          <div className="grid-object grid-row">
            <span className="span-title">Visão Geral</span>
            <div className="object-row">
              <img
                className="small-icon"
                src={AllTicketsSVG}
                alt="all-tickets"
              />
              <div>
                {loadingChamados ? (
                  <TextLoader />
                ) : (
                  <h6>{qtdChamados} chamados</h6>
                )}
                <span>SGL - Garantia</span>
              </div>
            </div>
            <div className="object-row">
              <img
                className="small-icon"
                src={OpenTicketsSVG}
                alt="all-tickets"
              />
              <div>
                {loadingChamadosAbertos ? (
                  <TextLoader />
                ) : (
                  <h6>{qtdChamadosAbertos} chamados abertos</h6>
                )}
                <span>SGL - Garantia</span>
              </div>
            </div>
            <div
              className="object-row clickable-div material-om"
              onClick={() => navigate("/dashboard-sgl-sg7/materialom")}
            >
              <img
                className="small-icon"
                src={MaterialsSVG}
                alt="all-tickets"
              />
              <div>
                {loadingMateriais ? (
                  <TextLoader />
                ) : (
                  <h6>{totalMateriais} materiais</h6>
                )}
                <span>Classe VII | OM</span>
              </div>
            </div>
            <div
              className="object-row clickable-div material-om-disponivel"
              onClick={() =>
                navigate("/dashboard-sgl-sg7/materialom/disponivel")
              }
            >
              <img
                className="small-icon"
                src={AvailableSVG}
                alt="all-tickets"
              />
              <div>
                {loadingDisponibilidade ? (
                  <TextLoader />
                ) : (
                  <h6>
                    {(disponibilidadeMaterial &&
                      disponibilidadeMaterial.at(0)?.quantidade) ||
                      0}{" "}
                    materiais disponíveis
                  </h6>
                )}
                <span>Classe VII | OM</span>
              </div>
            </div>
            <div
              className="object-row clickable-div material-om-indisponivel"
              onClick={() =>
                navigate("/dashboard-sgl-sg7/materialom/indisponivel")
              }
            >
              <img
                className="small-icon"
                src={UnavailableSVG}
                alt="all-tickets"
              />
              <div>
                {loadingDisponibilidade ? (
                  <TextLoader />
                ) : (
                  <h6>
                    {(disponibilidadeMaterial &&
                      disponibilidadeMaterial.at(1)?.quantidade) ||
                      0}{" "}
                    materiais indisponíveis
                  </h6>
                )}
                <span>Classe VII | OM</span>
              </div>
            </div>
          </div>
          {/* Por Comando */}
          <div className="grid-object">
            <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">por CMDO/ODS</span>
            <QtdMaterialCmdoSmall onSelectedItem={handleSelectCmdo} />
          </div>
          {/* Por UF */}
          <div className="grid-object">
            <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">por UF</span>
            <QtdMaterialCidadeEstadoSmall selectedData={selectedCmdoUf} />
          </div>
          {/* Por RM */}
          <div className="grid-object">
            <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">por RM</span>
            <QtdMaterialRmSmall selectedData={selectedCmdoRm} />
          </div>
          {/* Por Ano (CHAMADOS) */}
          <div className="grid-object">
            <span className="span-title">Chamados por Ano</span>
            <span className="span-subtitle">SGL - Garantia</span>
            <QtdChamadoAnoSmall />
          </div>
          {/* Material Indisponível */}
          <div className="grid-object">
            <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">
              indisponibilidade por categoria
            </span>
            <QtdCategoriaMaterialIndisponivelSmall
              selectedData={selectedCmdoCategoria}
            />
          </div>
          {/* Por BDA */}
          <div className="grid-object">
            <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">por BDA</span>
            <QtdMaterialBdaSmall selectedData={selectedCmdoBda} />
          </div>
          {/* Chamados por OM */}
          <div className="grid-object">
            {/* <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">indisponíveis por BDA</span>
            <QtdIndisponivelPorBda selectedData={selectedCmdoIndisponivelBda} /> */}
            <Map selectedData={selectedCmdoMapa} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UniquePage;
