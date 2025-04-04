import ExecucaoOrcamentaria2024 from "components/ExecucaoOrcamentaria2024";
import ExecucaoOrcamentaria2024TipoAcao from "components/ExecucaoOrcamentaria2024TipoAcao";
import MenuLateral from "components/MenuLateral";

const Acoes2024 = () => {
  const handleMenuClick = (index: number) => {};

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral onMenuClick={handleMenuClick} />
      <div className="unique-page-container">
        <div className="double-grid">
          <div className="double-grid-element">
            <span className="span-title">Execução Orçamentária</span>
            <span className="span-subtitle">em 2024</span>
            <ExecucaoOrcamentaria2024 />
          </div>
          <div className="double-grid-element">
            <span className="span-title">Execução Orçamentária</span>
            <span className="span-subtitle">Ações 147F, 15W6, 20XE, 20XJ, 14T5 e 21D2 em 2024</span>
            <ExecucaoOrcamentaria2024TipoAcao />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Acoes2024;
