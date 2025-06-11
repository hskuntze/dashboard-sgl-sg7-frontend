import EqpFaseExecucaoCFF from "components/EqpFaseExecucaoCFF";
import ExecucaoConjuntoCFF from "components/ExecucaoConjuntoCFF";
import ExecucaoConjuntoPorElementoDespesaCFF from "components/ExecucaoConjuntoPorElementoDespesaCFF";
import ExecucaoElementoDespesaCFF from "components/ExecucaoElementoDespesaCFF";
import ExecucaoEqpOmCFF from "components/ExecucaoEqpOmCFF";
import ExecucaoOmDestinoCFF from "components/ExecucaoOmDestinoCFF";
import MapOmCFF from "components/MapOmCFF";
import MenuLateral from "components/MenuLateral";
import TipoEqpOmCFF from "components/TipoEqpOmCFF";
import { useRef } from "react";

const SisfronSAD2 = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const handleMenuClick = () => {};

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral onMenuClick={handleMenuClick} />
      <div className="unique-page-container">
        <div ref={carouselRef} id="carousel-acao20xe" className="carousel slide" data-bs-ride="carousel" data-bs-interval="30000">
          <div className="carousel-inner">
            <div className="carousel-item active" id="execucao">
              <div className="four-grid">
                <div className="four-grid-element">
                  <MapOmCFF />
                </div>
                <div className="four-grid-element">
                  <span className="span-title">CFF Contrato 07/2022 - SAD 2</span>
                  <span className="span-subtitle">Execução do conjunto por elemento de despesa</span>
                  <ExecucaoConjuntoPorElementoDespesaCFF selectedData={[]} />
                </div>
                <div className="four-grid-element">
                  <span className="span-title">CFF Contrato 07/2022 - SAD 2</span>
                  <span className="span-subtitle">Execução do contrato por conjunto</span>
                  <ExecucaoConjuntoCFF selectedData={[]} />
                </div>
                <div className="four-grid-element">
                  <span className="span-title">CFF Contrato 07/2022 - SAD 2</span>
                  <span className="span-subtitle">Execução do contrato por elemento de despesa</span>
                  <ExecucaoElementoDespesaCFF selectedData={[]} />
                </div>
              </div>
            </div>
            <div className="carousel-item" id="eqp">
              <div className="four-grid">
                <div className="four-grid-element">
                  <span className="span-title">CFF Contrato 07/2022 - SAD 2</span>
                  <span className="span-subtitle">Tipos e quantidade de eqp. por OM</span>
                  <TipoEqpOmCFF selectedData={[]} />
                </div>
                <div className="four-grid-element">
                  <span className="span-title">CFF Contrato 07/2022 - SAD 2</span>
                  <span className="span-subtitle">Execução do contrato por OM de destino</span>
                  <ExecucaoOmDestinoCFF selectedData={[]} />
                </div>
                <div className="four-grid-element">
                  <span className="span-title">CFF Contrato 07/2022 - SAD 2</span>
                  <span className="span-subtitle">Valor executado de equipamento por OM</span>
                  <ExecucaoEqpOmCFF selectedData={[]} />
                </div>
                <div className="four-grid-element">
                  <span className="span-title">CFF Contrato 07/2022 - SAD 2</span>
                  <span className="span-subtitle">Equipamento por fase de execução</span>
                  <EqpFaseExecucaoCFF selectedData={[]} />
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-button carousel-button-left" type="button" data-bs-target="#carousel-acao20xe" data-bs-slide="prev">
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="carousel-button carousel-button-right" type="button" data-bs-target="#carousel-acao20xe" data-bs-slide="next">
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SisfronSAD2;
