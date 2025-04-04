import "./styles.css";

import ExecucaoOrcamentaria2025 from "components/ExecucaoOrcamentaria2025";
import ExecucaoOrcamentaria2025TipoAcao from "components/ExecucaoOrcamentaria2025TipoAcao";
import RestantePorAno from "components/RestantePorAno";
import TipoAcaoValor from "components/TipoAcaoValor";
import MenuLateral from "components/MenuLateral";
import QtdChamadoAnoSmall from "components/QtdChamadoAnoSmall";
import QtdMaterialBdaSmall from "components/QtdMaterialBdaSmall";
import QtdCategoriaMaterialIndisponivelSmall from "components/QtdCategoriaMaterialIndisponivelSmall";
import QtdMaterialSubsistemaSmall from "components/QtdMaterialSubsistemaSmall";
import QtdMaterialTipoEqpSmall from "components/QtdMaterialTipoEqpSmall";
import Map from "components/Map";
import MapQcpOM from "components/MapQcpOM";

import { QtdMaterialBdaType } from "types/relatorio/qtdmaterialbda";
import { CategoriaMaterialIndisponivelType } from "types/relatorio/qtdcategoriamaterialindisponivel";
import { QtdMaterialSubsistemaType } from "types/relatorio/qtdmaterialsubsistema";
import { QtdMaterialTipoEqpExistentePrevisto } from "types/relatorio/qtdmaterialtipoeqp";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Carousel } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import QtdMaterialDisponibilidadePorCmdo from "components/QtdMaterialDisponibilidadePorCmdo";
import { QtdMaterialDisponibilidadeCmdoType } from "types/relatorio/qtdmaterialdisponibilidadecmdo";
import MapOperacoes from "components/MapOperacoes";
import { useLocation, useNavigate } from "react-router-dom";
import SituacaoRisco from "components/SituacaoRisco";
import QuantidadeDemandas from "components/QuantidadeDemandas";
import ExecucaoFinanceira from "components/ExecucaoFinanceira";
import PorcentagemEmpenhadaGauge from "components/PorcentagemEmpenhadaGauge";
import PorcentagemLiquidadaGauge from "components/PorcentagemLiquidadaGauge";
import useActiveObserver from "utils/hooks/useobserver";

const UniquePage = () => {
  const [selectedCmdo, setSelectedCmdo] = useState<string>();
  const [selectedBrigada, setSelectedBrigada] = useState<string>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaMaterialIndisponivelType[]>([]);
  const [selectedBda, setSelectedBda] = useState<QtdMaterialBdaType[]>([]);
  const [selectedSubsistema, setSelectedSubsistema] = useState<QtdMaterialSubsistemaType[]>([]);
  const [selectedTipoEqp, setSelectedTipoEqp] = useState<QtdMaterialTipoEqpExistentePrevisto[]>([]);

  const [selectedDisponibilidadeCmdo, setSelectedDisponibilidadeCmdo] = useState<QtdMaterialDisponibilidadeCmdoType[]>([]);

  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselInstance = useRef<Carousel | null>(null);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const index = params.get("carouselIndex");
    
    if (index !== null) {
      // Definir o slide ativo do carousel
      handleMenuClick(parseInt(index));
    }
  }, [location]);

  const handleSelectCmdo = async (cmdo: string | null) => {
    if (cmdo !== null) {
      // Mapeando os endpoints para facilitar a manutenção
      const endpoints = [
        { key: "bda", url: `/materiaisom/qtd/bdacmdo/${cmdo}`, stateSetter: setSelectedBda },
        { key: "catIndisponivel", url: `/materiaisom/qtd/ctgmtindisponivelcmdo/${cmdo}`, stateSetter: setSelectedCategoria },
        { key: "subsistema", url: `/materiaisom/qtd/subsistema/${cmdo}`, stateSetter: setSelectedSubsistema },
        { key: "tipoEqp", url: `/materiaisom/qtd/tipoeqp/${cmdo}`, stateSetter: setSelectedTipoEqp },
        { key: "disponibilidadecmdo", url: `/materiaisom/qtd/material/cmdo/${cmdo}`, stateSetter: setSelectedDisponibilidadeCmdo },
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
      } finally {
        setSelectedCmdo(cmdo);
      }
    } else {
      // Resetando os estados de uma vez só
      setSelectedBda([]);
      setSelectedCategoria([]);
      setSelectedSubsistema([]);
      setSelectedTipoEqp([]);
      setSelectedDisponibilidadeCmdo([]);
    }
  };

  const handleSelectBda = async (bda: string | null) => {
    if (bda !== null) {
      if (bda === "Vinculação direta") {
        bda = "Vinculação direta ao CMDO";
      }

      setSelectedBrigada(bda);

      const endpoints = [
        {
          key: "catIndisponivel",
          url: `/materiaisom/qtd/ctgmtindisponivelcmdo/bda`,
          stateSetter: setSelectedCategoria,
          params: { cmdo: selectedCmdo, bda: bda },
        },
        { key: "subsistema", url: `/materiaisom/qtd/subsistema/bda`, stateSetter: setSelectedSubsistema, params: { cmdo: selectedCmdo, bda: bda } },
        { key: "tipoEqp", url: `/materiaisom/qtd/tipoeqp/bda`, stateSetter: setSelectedTipoEqp, params: { cmdo: selectedCmdo, bda: bda } },
        {
          key: "disponibilidadecmdo",
          url: `/materiaisom/qtd/material/cmdo/bda`,
          stateSetter: setSelectedDisponibilidadeCmdo,
          params: { cmdo: selectedCmdo, bda: bda },
        },
      ];

      try {
        // Criando as requisições em paralelo
        const responses = await Promise.all(
          endpoints.map(({ url, params }) =>
            requestBackend({ url, method: "GET", withCredentials: true, params }).catch((err) => {
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
        toast.error("Erro ao carregar os dados da BDA.");
      }
    } else {
      // Resetando os estados de uma vez só
      setSelectedBda([]);
      setSelectedCategoria([]);
      setSelectedSubsistema([]);
      setSelectedTipoEqp([]);
    }
  };

  const handleSelectCategoria = (cat: string | null) => {
    if (selectedBrigada && selectedCmdo) {
      navigate(`/dashboard-sgl-sg7/materialom/material/indisponivel`, { state: { selectedBrigada, cat } });
    } else {
      toast.info("Por favor, selecione um comando e uma brigada.");
    }
  };

  const handleMenuClick = (index: number) => {
    if (carouselRef.current) {
      if (!carouselInstance.current) {
        carouselInstance.current = new Carousel(carouselRef.current);
      }

      carouselInstance.current.to(index);

      if (index === 2) {
        setRefreshTrigger((prev) => prev + 1);
      }
    }
  };

  useActiveObserver({
    onActive: () => {
      setRefreshTrigger((prev) => prev + 1);
    },
    id: "cop",
    className: "active",
  });

  return (
    <>
      <div id="element-content">
        <MenuLateral onMenuClick={handleMenuClick} />
        <div id="unique-page-container" className="unique-page-container">
          <div ref={carouselRef} id="carousel-page" className="carousel slide" data-bs-ride="carousel" data-bs-interval="30000">
            <div className="carousel-inner">
              <div className="carousel-item active" id="dm7">
                <div className="unique-page-grid">
                  <div className="grid-object">
                    <Map onSelectedItem={handleSelectCmdo} />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Materiais Classe VII</span>
                    <span className="span-subtitle">Brigadas com Maior Quantidade de Materiais</span>
                    <QtdMaterialBdaSmall
                      cmdoSelected={selectedCmdo !== undefined ? true : false}
                      onSelectedItem={handleSelectBda}
                      selectedData={selectedBda}
                    />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Materiais Classe VII</span>
                    <span className="span-subtitle">disponível e indisponível por C Mil A</span>
                    <QtdMaterialDisponibilidadePorCmdo selectedData={selectedDisponibilidadeCmdo} />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Materiais Classe VII</span>
                    <span className="span-subtitle">por Sistema</span>
                    <QtdMaterialSubsistemaSmall selectedData={selectedSubsistema} />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Materiais Classe VII</span>
                    <span className="span-subtitle">Existentes e Previstos</span>
                    <QtdMaterialTipoEqpSmall selectedData={selectedTipoEqp} />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Materiais Classe VII</span>
                    <span className="span-subtitle">Indisponibilidade por Categoria</span>
                    <QtdCategoriaMaterialIndisponivelSmall
                      bdaSelected={selectedBrigada !== undefined ? true : false}
                      onSelectCategoria={handleSelectCategoria}
                      selectedData={selectedCategoria}
                    />
                  </div>
                  <span className="painel-title">PAINEL DM7</span>
                </div>
              </div>
              <div className="carousel-item" id="agge">
                <div className="unique-page-grid">
                  <div className="grid-object">
                    <span className="span-title">Execução orçamentária 2025</span>
                    <span className="span-subtitle">Área Interna</span>
                    <ExecucaoOrcamentaria2025 />
                    <span className="hint">Atualizado em 28/03/2025</span>
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Execução orçamentária 2025</span>
                    <span className="span-subtitle">Porcentagem Empenhada</span>
                    <PorcentagemEmpenhadaGauge />
                    <span className="hint">Atualizado em 28/03/2025</span>
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Execução orçamentária 2025</span>
                    <span className="span-subtitle">Porcentagem Liquidada</span>
                    <PorcentagemLiquidadaGauge />
                    <span className="hint">Atualizado em 28/03/2025</span>
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Execução Orçamentária das Ações Finalísticas 2025</span>
                    <span className="span-subtitle">147F, 15W6, 20XE, 20XJ, 14T5 e 21D2</span>
                    <ExecucaoOrcamentaria2025TipoAcao />
                    <span className="hint">Atualizado em 28/03/2025</span>
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Restos a Pagar Não Processados a Liquidar</span>
                    <span className="span-subtitle">Restante por Ano</span>
                    <RestantePorAno />
                    <span className="hint">Atualizado em 28/03/2025</span>
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Restos a Pagar Não Processados a Liquidar</span>
                    <span className="span-subtitle">por Tipo de Ação</span>
                    <TipoAcaoValor />
                    <span className="hint">Atualizado em 28/03/2025</span>
                  </div>
                  <span className="painel-title">PAINEL AGGE</span>
                </div>
              </div>
              <div className="carousel-item" id="cop">
                <div className="unique-page-grid cop-grid">
                  <div className="cop-left">
                    <MapOperacoes refreshTrigger={refreshTrigger} />
                  </div>
                  <div className="cop-right">
                    <MapQcpOM refreshTrigger={refreshTrigger} selectedData={null} />
                  </div>
                  <span className="painel-title">PAINEL COP</span>
                </div>
              </div>
              <div className="carousel-item" id="sisfron">
                <div className="unique-page-grid">
                  <div className="grid-object">
                    <span className="span-title">SGL</span>
                    <span className="span-subtitle">Chamados por Ano</span>
                    <QtdChamadoAnoSmall />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Gestão de Riscos dos Projetos SAD</span>
                    <span className="span-subtitle">Quantidade de riscos por magnitude</span>
                    <SituacaoRisco />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Resultados da Parceria CComGEx - CTCEA</span>
                    <span className="span-subtitle">Quantidade de demandas realizadas por Projetos SAD/SISFRON</span>
                    <QuantidadeDemandas />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Execução Financeira Anual</span>
                    <span className="span-subtitle">em 2025</span>
                    <ExecucaoFinanceira />
                  </div>
                  <span className="painel-title">PAINEL SISFRON</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UniquePage;
