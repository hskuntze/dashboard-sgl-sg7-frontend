import "./styles.css";
import { AxiosRequestConfig } from "axios";
import ApoioDiretoDisponibilidade from "components/ApoioDiretoDisponibilidade";
import ApoioDiretoDisponibilidadeFabricante from "components/ApoioDiretoDisponibilidadeFabricante";
import ApoioDiretoFabricante from "components/ApoioDiretoFabricante";
import ApoioDiretoNecessidadeConfiguracao from "components/ApoioDiretoNecessidadeConfiguracao";
import Loader from "components/Loader";
import MapApoioDiretoRM from "components/MapApoioDiretoRM";
import MenuLateral from "components/MenuLateral";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ApoioDiretoDadosQuantitativos } from "types/relatorio/apoiodiretodadosquantitativos";
import { ApoioDiretoDisponibilidadeFabricanteType } from "types/relatorio/apoiodiretodisponibilidadefabricante";
import { ApoioDiretoFabricanteType } from "types/relatorio/apoiodiretofabricante";
import { ApoioDiretoNecessidadeConfiguracaoType } from "types/relatorio/apoiodiretonecessidadeconfiguracao";
import { requestBackend } from "utils/requests";

const ApoioDireto = () => {
  const handleMenuClick = (index: number) => {};

  const [loading, setLoading] = useState<boolean>(false);

  const [dadosQuantitativos, setDadosQuantitativos] = useState<ApoioDiretoDadosQuantitativos>();

  const [seletecRm, setSelectedRm] = useState<string>();
  const [selectedFabricante, setSelectedFabricante] = useState<ApoioDiretoFabricanteType[]>([]);
  const [selectedDisponibilidadeFabricante, setSelectedDisponibilidadeFabricante] = useState<ApoioDiretoDisponibilidadeFabricanteType[]>([]);
  const [selectedNecessidadeConfiguracao, setSelectedNecessidadeConfiguracao] = useState<ApoioDiretoNecessidadeConfiguracaoType[]>([]);

  const handleSelectRm = async (rm: string | null) => {
    if (rm !== null) {
      const endpoints = [
        { key: "fabricante", url: `/apoiodireto/fabricante/${rm}`, stateSetter: setSelectedFabricante },
        { key: "disponibilidadeFabricante", url: `/apoiodireto/disponibilidade/fabricante/${rm}`, stateSetter: setSelectedDisponibilidadeFabricante },
        { key: "necessidadeConfiguracao", url: `/apoiodireto/configuracao/${rm}`, stateSetter: setSelectedNecessidadeConfiguracao },
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
      }
    } else {
      setSelectedFabricante([]);
      setSelectedDisponibilidadeFabricante([]);
      setSelectedNecessidadeConfiguracao([]);
    }
  };

  const loadData = useCallback(() => {
    if (dadosQuantitativos === undefined) {
      setLoading(true);

      const requestParams: AxiosRequestConfig = {
        url: "/apoiodireto",
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
    }
  }, [dadosQuantitativos]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
          <ApoioDiretoFabricante selectedData={selectedFabricante} />
        </div>
        <div className="grid-object">
          <span className="span-title">Apoio Direto</span>
          <span className="span-subtitle">Disponibilidade por RM</span>
          <ApoioDiretoDisponibilidade selectedData={[]} />
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
              </div>
            </>
          )}
        </div>
        <div className="grid-object">
          <span className="span-title">Apoio Direto</span>
          <span className="span-subtitle">Disponibilidade por Fabricante</span>
          <ApoioDiretoDisponibilidadeFabricante selectedData={selectedDisponibilidadeFabricante} />
        </div>
        <div className="grid-object">
          <span className="span-title">Apoio Direto</span>
          <span className="span-subtitle">Necessidade de configuração por Fabricante</span>
          <ApoioDiretoNecessidadeConfiguracao selectedData={selectedNecessidadeConfiguracao} />
        </div>
      </div>
    </div>
  );
};

export default ApoioDireto;
