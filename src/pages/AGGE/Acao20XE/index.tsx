import { AxiosRequestConfig } from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import Acao20XETotal from "components/Acao20XETotal";
import Dotacao20XE from "components/Dotacao20XE";
import MenuLateral from "components/MenuLateral";
import MetaEmpenhada20XE from "components/MetaEmpenhada20XE";
import MetaLiquidada20XE from "components/MetaLiquidada20XE";
import RestantePorAno20XE from "components/RestantePorAno20XE";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatarDinheiro } from "utils/functions";
import { requestBackend } from "utils/requests";

const Acao20XE = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleMenuClick = (index: number) => {};

  const handleSelectAcaoTotal = () => {
    navigate("/dashboard-sgl-sg7/agge/detalhamento/acao20xe");
  };

  const handleSelectDotacao = () => {
    navigate("/dashboard-sgl-sg7/agge/detalhamento/dotacao20xe");
  };

  const handleSelectRp = () => {
    navigate("/dashboard-sgl-sg7/agge/detalhamento/rporcamentario20xe");
  };

  const [valorDisponivelDCT, setValorDisponivelDCT] = useState<number>(0);

  const loadValorDisponivel = useCallback(() => {
    const requestParams: AxiosRequestConfig = {
      url: "/execucao/valor/disponivel",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setValorDisponivelDCT(res.data as number);
      })
      .catch(() => {
        toast.error("Erro ao carregar valor disponível no DCT.");
      })
      .finally(() => {})
  }, []);

  useEffect(() => {
    loadValorDisponivel();
  }, [loadValorDisponivel]);

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral onMenuClick={handleMenuClick} />
      <div className="unique-page-container">
        <div ref={carouselRef} id="carousel-acao20xe" className="carousel slide" data-bs-ride="carousel" data-bs-interval="30000">
          <div className="carousel-inner">
            <div className="carousel-item active" id="outros">
              <div className="unique-page-grid">
                <div className="grid-object">
                  <span className="span-title">Ação 20XE</span>
                  <span className="span-subtitle">Valores nas UGE</span>
                  <Acao20XETotal onSelectItem={handleSelectAcaoTotal} />
                </div>
                <div className="grid-object">
                  <span className="span-title">Ação 20XE</span>
                  <span className="span-subtitle">Dotação</span>
                  <Dotacao20XE onSelectItem={handleSelectDotacao} />
                </div>
                <div className="grid-object">
                  <span className="span-title">Ação 20XE</span>
                  <span className="span-subtitle">Restante a Pagar por Ano</span>
                  <RestantePorAno20XE onSelectItem={handleSelectRp} />
                </div>
                <div className="grid-object">
                  <span className="span-title">Ação 20XE</span>
                  <span className="span-subtitle">Meta Empenhada</span>
                  <MetaEmpenhada20XE />
                </div>
                <div className="grid-object">
                  <span className="span-title">Ação 20XE</span>
                  <span className="span-subtitle">Meta Liquidada</span>
                  <MetaLiquidada20XE />
                </div>
                <div className="grid-object">
                  <span className="span-title">Ação 20XE</span>
                  <span className="span-subtitle">Valor disponível no DCT</span>
                  <span className="valor-disponivel">
                    {formatarDinheiro(valorDisponivelDCT)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Acao20XE;
