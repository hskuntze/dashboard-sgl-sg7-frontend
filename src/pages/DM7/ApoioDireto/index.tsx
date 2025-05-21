import "./styles.css";
import { AxiosRequestConfig } from "axios";
import ApoioDiretoFabricante from "components/ApoioDiretoFabricante";
import ApoioDiretoMaterial from "components/ApoioDiretoMaterial";
import ApoioDiretoOM from "components/ApoioDiretoOM";
import Loader from "components/Loader";
import MapApoioDiretoRM from "components/MapApoioDiretoRM";
import MenuLateral from "components/MenuLateral";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ApoioDiretoDadosQuantitativos } from "types/relatorio/apoiodiretodadosquantitativos";
import { ApoioDiretoDisponibilidadeFabricanteType } from "types/relatorio/apoiodiretodisponibilidadefabricante";
import { ApoioDiretoFabricanteType } from "types/relatorio/apoiodiretofabricante";
import { ApoioDiretoMaterialType } from "types/relatorio/apoiodiretomaterial";
import { ApoioDiretoOmType } from "types/relatorio/apoiodiretoom";
import { requestBackend } from "utils/requests";
import { Box, Modal } from "@mui/material";
import CloseIcon from "assets/images/x-lg.svg";
import ApoioDiretoNecessidadeConfiguracao from "components/ApoioDiretoNecessidadeConfiguracao";
import ApoioDiretoDisponibilidadeFabricante from "components/ApoioDiretoDisponibilidadeFabricante";

const ApoioDireto = () => {
  const handleMenuClick = (index: number) => {};

  const [loading, setLoading] = useState<boolean>(false);

  const [dadosQuantitativos, setDadosQuantitativos] = useState<ApoioDiretoDadosQuantitativos>();
  const [dadosDisponibilidadeFabricante, setDadosDisponibilidadeFabricante] = useState<ApoioDiretoDisponibilidadeFabricanteType[]>();

  const [selectedFabricanteElement, setSelectedFabricanteElement] = useState<string>();
  const [openModalFabricante, setOpenModalFabricante] = useState<boolean>(false);

  const [selectedRm, setSelectedRm] = useState<string>();
  const [selectedFabricante, setSelectedFabricante] = useState<ApoioDiretoFabricanteType[]>([]);
  const [selectedOm, setSelectedOm] = useState<ApoioDiretoOmType[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<ApoioDiretoMaterialType[]>([]);

  const handleSelectRm = async (rm: string | null) => {
    if (rm !== null) {
      const endpoints = [
        { key: "fabricante", url: `/apoiodireto/fabricante/${rm}`, stateSetter: setSelectedFabricante },
        { key: "om", url: `/apoiodireto/om/${rm}`, stateSetter: setSelectedOm },
        { key: "om", url: `/apoiodireto/material/${rm}`, stateSetter: setSelectedMaterial },
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
        setSelectedRm(rm);
        loadDadosQuantitativosPorRm(rm);
        loadDisponibilidadeFabricante(rm);
      }
    } else {
      setSelectedFabricante([]);
      setSelectedOm([]);
      setSelectedMaterial([]);

      loadInitialData();
      loadDisponibilidadeFabricante();
    }
  };

  const handleSelectOm = (om: string | null) => {
    console.log(om);
  };

  const handleSelectFabricante = (fabricante: string | null) => {
    if (fabricante) {
      setSelectedFabricanteElement(fabricante);
      setOpenModalFabricante(true);
    }
  };

  const loadDadosQuantitativosPorRm = (rm: string) => {
    const requestParams: AxiosRequestConfig = {
      url: `/apoiodireto/quantitativo/${rm}`,
      withCredentials: true,
      method: "GET",
    };

    requestBackend(requestParams)
      .then((res) => {
        let data = res.data as ApoioDiretoDadosQuantitativos;
        setDadosQuantitativos(data);
      })
      .catch((err) => {
        toast.error("Erro ao carregar dados quantitativos");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadInitialData = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/apoiodireto/quantitativo",
      withCredentials: true,
      method: "GET",
    };

    requestBackend(requestParams)
      .then((res) => {
        let data = res.data as ApoioDiretoDadosQuantitativos;
        setDadosQuantitativos(data);
      })
      .catch((err) => {
        toast.error("Erro ao carregar dados quantitativos");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const loadDisponibilidadeFabricante = (rm?: string) => {
    let requestParams: AxiosRequestConfig = {};

    if (rm === undefined || rm === null) {
      requestParams = {
        url: "/apoiodireto/disponibilidade/fabricante",
        method: "GET",
        withCredentials: true,
      };
    } else {
      requestParams = {
        url: `/apoiodireto/disponibilidade/fabricante/${rm}`,
        method: "GET",
        withCredentials: true,
      };
    }

    requestBackend(requestParams)
      .then((res) => {
        setDadosDisponibilidadeFabricante(res.data as ApoioDiretoDisponibilidadeFabricanteType[]);
      })
      .catch((err) => {
        toast.error("Erro ao tentar carregar dados de disponibilidade por fabricante");
      });
  };

  useEffect(() => {
    loadInitialData();
    loadDisponibilidadeFabricante();
  }, [loadInitialData]);

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral onMenuClick={handleMenuClick} />
      <div className="unique-page-grid">
        <div className="grid-object">
          <MapApoioDiretoRM onSelectedItem={handleSelectRm} />
        </div>
        <div className="grid-object">
          <span className="span-title">Apoio Direto</span>
          <span className="span-subtitle">Quantidade por Fabricante</span>
          <ApoioDiretoFabricante selectedData={selectedFabricante} onSelectedFabricante={handleSelectFabricante} />
        </div>
        <div className="grid-object">
          <span className="span-title">Apoio Direto</span>
          <span className="span-subtitle">Quantidade por Material</span>
          <ApoioDiretoMaterial selectedData={selectedMaterial} />
        </div>
        <div className="grid-object">
          {loading ? (
            <div className="loading-div">
              <Loader />
            </div>
          ) : (
            <>
              <span className="span-title">Apoio Direto</span>
              <span className="span-subtitle">Dados Quantitativos</span>
              <div className="apoio-direto-dados">
                <span>
                  <b>Total:</b> {dadosQuantitativos?.total}
                </span>
                <span>
                  <b>Disponível:</b> {dadosQuantitativos?.disponivel}
                </span>
                <span>
                  <b>Indisponível:</b> {dadosQuantitativos?.indisponivel}
                </span>
                <span>
                  <b>Percentual de disponibilidade:</b>{" "}
                  {dadosQuantitativos && (
                    <span
                      style={{
                        color:
                          dadosQuantitativos.disponivel / dadosQuantitativos.total > 0.8
                            ? "green"
                            : dadosQuantitativos.disponivel / dadosQuantitativos.total >= 0.5
                            ? "gold"
                            : dadosQuantitativos.disponivel / dadosQuantitativos.total >= 0.3
                            ? "orange"
                            : "red",
                      }}
                    >
                      {((dadosQuantitativos.disponivel / dadosQuantitativos.total) * 100).toFixed(2)}%
                    </span>
                  )}
                </span>
                {dadosDisponibilidadeFabricante &&
                  dadosDisponibilidadeFabricante.map((el) => (
                    <>
                      <span>
                        <b>Fabricante:</b> {el.fabricante} {" - "}
                        <b>Disp.: </b> <span style={{ color: "green" }}>{el.disponivel}</span> | <b>Indisp.: </b>
                        <span style={{ color: "red" }}>{el.indisponivel}</span>
                      </span>
                    </>
                  ))}
              </div>
            </>
          )}
        </div>
        <div className="grid-object-two-squares">
          <span className="span-title">Apoio Direto</span>
          <span className="span-subtitle">Quantidade por OM</span>
          <ApoioDiretoOM selectedData={selectedOm} onSelectOm={handleSelectOm} />
        </div>
        <Modal open={openModalFabricante}>
          <Box className="modal-on-unique-page">
            <div className="modal-header">
              <button onClick={() => setOpenModalFabricante(false)}>
                <img src={CloseIcon} alt="" />
              </button>
            </div>
            <div className="modal-grid-multiple">
              <div className="modal-grid-multiple-object">
                <span className="span-title">Apoio Direto</span>
                <span className="span-subtitle">Motivos de Indisponibilidade</span>
                <ApoioDiretoDisponibilidadeFabricante selectedData={[]} />
              </div>
              <div className="modal-grid-multiple-object">
                <span className="span-title">Apoio Direto</span>
                <span className="span-subtitle">Necessidade de Configuração</span>
                <ApoioDiretoNecessidadeConfiguracao selectedData={[]} />
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default ApoioDireto;
