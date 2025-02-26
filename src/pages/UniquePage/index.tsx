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
import ValorTotalClassificacaoDiariaPassagemSmall from "components/ValorTotalClassificacaoDiariaPassagemSmall";
import ValorTotalCodAoDiariaPassagemSmall from "components/ValorTotalCodAoDiariaPassagemSmall";
import TextLoader from "components/TextLoader";
import Map from "components/Map";

import { useCallback, useEffect, useState } from "react";
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

  useEffect(() => {
    loadQtdTotal();
    loadQtdChamados();
    loadQtdChamadosAbertos();
    loadDisponibilidadeMaterial();
  }, [loadQtdTotal, loadQtdChamados, loadQtdChamadosAbertos, loadDisponibilidadeMaterial]);

  return (
    <>
      <div className="unique-page-container">
        <div className="unique-page-grid">
          {/* Visão Geral */}
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
            <div className="object-row clickable-div material-om-disponivel" onClick={() => navigate("/dashboard-sgl-sg7/materialom/disponivel")}>
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
            <div className="object-row clickable-div material-om-indisponivel" onClick={() => navigate("/dashboard-sgl-sg7/materialom/indisponivel")}>
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
          {/* Por Comando */}
          <div className="grid-object">
            <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">por C Mil A / ODS​</span>
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
            <span className="span-subtitle">indisponibilidade por categoria</span>
            <QtdCategoriaMaterialIndisponivelSmall selectedData={selectedCmdoCategoria} />
          </div>
          {/* Por BDA */}
          <div className="grid-object">
            <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">Brigadas com Maior Quantidade de Materiais</span>
            <QtdMaterialBdaSmall selectedData={selectedCmdoBda} />
          </div>
          {/* Chamados por OM */}
          <div className="grid-object">
            {/* <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">indisponíveis por BDA</span>
            <QtdIndisponivelPorBda selectedData={selectedCmdoIndisponivelBda} /> */}
            <Map selectedData={selectedCmdoMapa} />
          </div>
          <div className="grid-object">
            <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">por sistema</span>
            <QtdMaterialSubsistemaSmall selectedData={selectedCmdoSubsistema} />
          </div>
          <div className="grid-object">
            <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">existentes e previstos</span>
            <QtdMaterialTipoEqpSmall selectedData={selectedCmdoTipoEqp} />
          </div>
          <div className="grid-object">
            <span className="span-title">Diárias e Passagens</span>
            <span className="span-subtitle">por classificação</span>
            <ValorTotalClassificacaoDiariaPassagemSmall />
          </div>
          <div className="grid-object">
            <span className="span-title">Diárias e Passagens</span>
            <span className="span-subtitle">por ação orçamentária</span>
            <ValorTotalCodAoDiariaPassagemSmall />
          </div>
        </div>
      </div>
    </>
  );
};

export default UniquePage;
