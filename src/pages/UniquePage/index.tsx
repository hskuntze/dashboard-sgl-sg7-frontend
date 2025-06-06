import "./styles.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Carousel } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import { Box, Modal } from "@mui/material";

import useActiveObserver from "utils/hooks/useobserver";

import CloseIcon from "assets/images/x-lg.svg";

import RestantePorAno from "components/RestantePorAno";
import MenuLateral from "components/MenuLateral";
import QtdChamadoAnoSmall from "components/QtdChamadoAnoSmall";
import QtdMaterialBdaSmall from "components/QtdMaterialBdaSmall";
import QtdCategoriaMaterialIndisponivelSmall from "components/QtdCategoriaMaterialIndisponivelSmall";
import QtdMaterialSubsistemaSmall from "components/QtdMaterialSubsistemaSmall";
import QtdMaterialTipoEqpSmall from "components/QtdMaterialTipoEqpSmall";
import Map from "components/Map";
import MapQcpOM from "components/MapQcpOM";
import QtdMaterialDisponibilidadePorCmdo from "components/QtdMaterialDisponibilidadePorCmdo";
import MapOperacoes from "components/MapOperacoes";
import { useLocation, useNavigate } from "react-router-dom";
import SituacaoRisco from "components/SituacaoRisco";
import QuantidadeDemandas from "components/QuantidadeDemandas";
import ExecucaoFinanceira from "components/ExecucaoFinanceira";
import QtdMotivoIndisponibilidade from "components/QtdMotivoIndisponibilidade";
import QtdChamadoMesSmall from "components/QtdChamadoMesSmall";
import QtdChamadoSubsistemaSmall from "components/QtdChamadoSubsistemaSmall";
import QtdChamadoStatusPorAno from "components/QtdChamadoStatusPorAno";
import OmOrcamento from "components/OmOrcamento";
import PorcentagemLiquidadaGauge from "components/PorcentagemLiquidadaGauge";

import { QtdMaterialBdaType } from "types/relatorio/qtdmaterialbda";
import { CategoriaMaterialIndisponivelType } from "types/relatorio/qtdcategoriamaterialindisponivel";
import { QtdMaterialSubsistemaType } from "types/relatorio/qtdmaterialsubsistema";
import { QtdMaterialTipoEqpExistentePrevisto } from "types/relatorio/qtdmaterialtipoeqp";
import { QtdMaterialDisponibilidadeCmdoType } from "types/relatorio/qtdmaterialdisponibilidadecmdo";
import ExecucaoOrcamentaria2025AreaInterna from "components/ExecucaoOrcamentaria2025AreaInterna";
import PorcentagemEmpenhadaGauge from "components/PorcentagemEmpenhadaGauge";

const UniquePage = () => {
  const [selectedCmdo, setSelectedCmdo] = useState<string>();
  const [selectedBrigada, setSelectedBrigada] = useState<string>();
  const [selectedEqp, setSelectedEqp] = useState<string>();
  const [selectedAno, setSelectedAno] = useState<number>();

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaMaterialIndisponivelType[]>([]);
  const [selectedBda, setSelectedBda] = useState<QtdMaterialBdaType[]>([]);
  const [selectedSubsistema, setSelectedSubsistema] = useState<QtdMaterialSubsistemaType[]>([]);
  const [selectedTipoEqp, setSelectedTipoEqp] = useState<QtdMaterialTipoEqpExistentePrevisto[]>([]);

  const [selectedDisponibilidadeCmdo, setSelectedDisponibilidadeCmdo] = useState<QtdMaterialDisponibilidadeCmdoType[]>([]);

  const [openModalMotivoIndisponibilidade, setOpenModalMotivoIndisponibilidade] = useState<boolean>(false);
  const [openModalGraficosSgl, setOpenModalGraficosSgl] = useState<boolean>(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselInstance = useRef<Carousel | null>(null);

  const navigate = useNavigate();

  const location = useLocation();

  /**
   * Necessário para definir o slide ativo do carrossel baseado no clique do menu lateral,
   * uma vez que o menu lateral é um componente a parte.
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const index = params.get("carouselIndex");

    if (index !== null) {
      // Definir o slide ativo do carousel
      handleMenuClick(parseInt(index));
    }
  }, [location]);

  /**
   * Para que os filtros sejam aplicados nos outros gráficos ao selecionar um comando
   * @param cmdo
   */
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

  /**
   * Para que os filtros sejam aplicados ao selecionar uma brigada
   * @param bda
   */
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

  /**
   * Ao selecionar uma categoria de material indisponível abre o modal
   * @param cat
   */
  const handleSelectCategoria = (cat: string | null) => {
    setOpenModalMotivoIndisponibilidade(true);
    setSelectedEqp(cat || "");
  };

  /**
   * Quando o modal de indisponibilidade é aberto ele exibe os motivos da indisponibilidade.
   * É possível que o usuário selecione um dos motivos. Ao selecionar o motivo ele é redirecionado
   * para a página de listagem dos materiais de acordo com o motivo.
   * @param motivo
   */
  const handleSelectMotivo = (motivo: string) => {
    setOpenModalMotivoIndisponibilidade(false);
    navigate(`/dashboard-sgl-sg7/materialom/material/indisponivel`, {
      state: { selectedCmdo, selectedBrigada, selectedEqp, motivo },
    });
  };

  /**
   * Função para mudar o painel do carrossel.
   * O "refreshTrigger" é necessário para lidar com um bug do Leaflet,
   * que não carrega os 'tiles' se não for na página inicial. Dessa forma,
   * ao clicar no índice do "COp" ele força a recarregar os componentes
   * e os 'tiles' carregam.
   * @param index
   */
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

  /**
   * Funciona como um observador para dar refresh nos componentes de mapa
   * do COp. Se faz necessário pois o carrossel navega sozinho entre os painéis,
   * e dessa forma ao detectar que está no índice 2 dá o trigger no refresh.
   */
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
                  {/**
                   * MODAL PARA MOSTRAR OS MOTIVOS DE INDISPONIBILIDADE
                   */}
                  <Modal
                    open={openModalMotivoIndisponibilidade}
                    onClose={() => setOpenModalMotivoIndisponibilidade(!openModalMotivoIndisponibilidade)}
                  >
                    <Box className="modal-on-unique-page">
                      {openModalMotivoIndisponibilidade && (
                        <>
                          <div className="modal-header">
                            <button onClick={() => setOpenModalMotivoIndisponibilidade(false)}>
                              <img src={CloseIcon} alt="" />
                            </button>
                          </div>
                          <div className="modal-grid-object">
                            <span className="span-title">Materiais Classe VII</span>
                            <span className="span-subtitle">Motivos de Indisponibilidade</span>
                            <QtdMotivoIndisponibilidade
                              bda={selectedBrigada || ""}
                              cmdo={selectedCmdo || ""}
                              eqp={selectedEqp || ""}
                              onSelectMotivo={(m) => handleSelectMotivo(m)}
                            />
                          </div>
                        </>
                      )}
                    </Box>
                  </Modal>
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
                    <ExecucaoOrcamentaria2025AreaInterna />
                  </div>
                  <div className="grid-object-two-squares">
                    <span className="span-title">Execução orçamentária 2025</span>
                    <span className="span-subtitle">por OM</span>
                    <OmOrcamento />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Execução orçamentária 2025</span>
                    <span className="span-subtitle">Porcentagem Liquidada</span>
                    <PorcentagemLiquidadaGauge />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Execução orçamentária 2025</span>
                    <span className="span-subtitle">Porcentagem Empenhada</span>
                    <PorcentagemEmpenhadaGauge />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">Restos a Pagar Não Processados a Pagar</span>
                    <span className="span-subtitle">Restante por Ano</span>
                    <RestantePorAno />
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
                  {/**
                   * MODAL PARA MOSTRAR OS GRÁFICOS DO SGL
                   */}
                  <Modal open={openModalGraficosSgl} onClose={() => setOpenModalGraficosSgl(!openModalGraficosSgl)}>
                    <Box className="modal-on-unique-page">
                      {openModalGraficosSgl && (
                        <>
                          <div className="modal-header">
                            <button onClick={() => setOpenModalGraficosSgl(false)}>
                              <img src={CloseIcon} alt="" />
                            </button>
                          </div>
                          <div className="modal-grid-multiple">
                            <div className="modal-grid-multiple-object">
                              <span className="span-title">SGL</span>
                              <span className="span-subtitle">Chamados por mês do ano de {selectedAno}</span>
                              <QtdChamadoMesSmall ano={selectedAno ? selectedAno : 0} />
                            </div>
                            <div className="modal-grid-multiple-object">
                              <span className="span-title">SGL</span>
                              <span className="span-subtitle">Chamados por subcategoria do ano de {selectedAno}</span>
                              <QtdChamadoSubsistemaSmall ano={selectedAno ? selectedAno : 0} />
                            </div>
                          </div>
                        </>
                      )}
                    </Box>
                  </Modal>
                  <div className="grid-object">
                    <span className="span-title">SGL</span>
                    <span className="span-subtitle">Chamados por ano</span>
                    <QtdChamadoAnoSmall
                      onSelectAno={(ano) => {
                        setOpenModalGraficosSgl(true);
                        setSelectedAno(ano);
                      }}
                    />
                  </div>
                  <div className="grid-object">
                    <span className="span-title">SGL</span>
                    <span className="span-subtitle">Chamados por status de acordo com o ano</span>
                    <QtdChamadoStatusPorAno />
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
