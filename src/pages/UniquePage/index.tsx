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
import { QtdMaterialBdaType } from "types/relatorio/qtdmaterialbda";
import QtdCategoriaMaterialIndisponivelSmall from "components/QtdCategoriaMaterialIndisponivelSmall";
import QtdIndisponivelPorBda from "components/QtdIndisponivelPorBda";
import { useNavigate } from "react-router-dom";

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

  const [bdaData, setBdaData] = useState<QtdMaterialBdaType[]>([]);
  const [loadingBda, setLoadingBda] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loadData = async () => {
      setLoadingBda(true);

      try {
        const res = await requestBackend({
          url: "/materiaisom/qtd/bda",
          method: "GET",
          withCredentials: true,
        });
        setBdaData(res.data as QtdMaterialBdaType[]);
      } catch {
        toast.error(
          "Erro ao carregar dados de quantidade de materiais por brigada."
        );
      } finally {
        setLoadingBda(false);
      }
    };

    loadData(); // Busca os dados apenas uma vez na montagem
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isFixed) {
      // Atualiza a posição somente se o modal não estiver fixado
      setPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleClick = () => {
    setIsFixed(!isFixed); // Alterna entre fixar e desfixar o modal
  };

  const loadQtdTotal = useCallback(() => {
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
                <h6>{qtdChamados} chamados</h6>
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
                <h6>{qtdChamadosAbertos} chamados abertos</h6>
                <span>SGL - Garantia</span>
              </div>
            </div>
            <div
              className="object-row clickable-div material-om"
              onClick={() =>
                navigate("/dashboard-sgl-sg7/materialom")
              }
            >
              <img
                className="small-icon"
                src={MaterialsSVG}
                alt="all-tickets"
              />
              <div>
                <h6>{totalMateriais} materiais</h6>
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
                <h6>
                  {(disponibilidadeMaterial &&
                    disponibilidadeMaterial.at(0)?.quantidade) ||
                    0}{" "}
                  materiais disponíveis
                </h6>
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
                <h6>
                  {(disponibilidadeMaterial &&
                    disponibilidadeMaterial.at(1)?.quantidade) ||
                    0}{" "}
                  materiais indisponíveis
                </h6>
                <span>Classe VII | OM</span>
              </div>
            </div>
          </div>
          {/* Por Comando */}
          <div className="grid-object">
            <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">por CMDO/ODS</span>
            <QtdMaterialCmdoSmall />
          </div>
          {/* Por UF */}
          <div className="grid-object">
            <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">por UF</span>
            <QtdMaterialCidadeEstadoSmall />
          </div>
          {/* Por RM */}
          <div className="grid-object">
            <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">por RM</span>
            <QtdMaterialRmSmall />
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
              Indisponibilidade por categoria
            </span>
            <QtdCategoriaMaterialIndisponivelSmall />
          </div>
          {/* Por BDA */}
          <div className="grid-object">
            <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">por BDA</span>
            <QtdMaterialBdaSmall />
          </div>
          {/* Chamados por OM */}
          <div className="grid-object">
            <span className="span-title">Materiais Classe VII</span>
            <span className="span-subtitle">indisponíveis por BDA</span>
            <QtdIndisponivelPorBda />
          </div>
        </div>
      </div>
    </>
  );
};

export default UniquePage;
