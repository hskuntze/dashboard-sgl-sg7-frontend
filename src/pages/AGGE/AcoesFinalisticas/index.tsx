import AcaoOrcamentaria2024 from "components/AcaoOrcamentaria2024";
import AcaoOrcamentaria2025 from "components/AcaoOrcamentaria2025";
import MenuLateral from "components/MenuLateral";

const AcoesFinalisticas = () => {
  const handleMenuClick = (index: number) => {};
  
  return (
    <div style={{ display: "flex" }}>
      <MenuLateral onMenuClick={handleMenuClick} />
      <div className="unique-page-container">
        <div className="double-grid">
          <div className="double-grid-element">
            <span className="span-title">Execução Orçamentária</span>
            <span className="span-subtitle">Ações 147F, 15W6, 20XE, 20XJ, 14T5 e 21D2 em 2024</span>
            <AcaoOrcamentaria2024 />
          </div>
          <div className="double-grid-element">
            <span className="span-title">Execução Orçamentária</span>
            <span className="span-subtitle">Ações 147F, 15W6, 20XE, 20XJ, 14T5 e 21D2 em 2025</span>
            <AcaoOrcamentaria2025 />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcoesFinalisticas;
