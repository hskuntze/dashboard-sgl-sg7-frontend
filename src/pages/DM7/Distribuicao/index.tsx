import MenuLateral from "components/MenuLateral";
import QtdMaterialSubsistemaCmdo from "components/QtdMaterialSubsistemaCmdo";
import { useNavigate } from "react-router-dom";

const Distribuicao = () => {
  const handleMenuClick = (index: number) => {};

  const navigate = useNavigate();

  const handleSelectCategoria = (cmdo: string | null, cat: string | null) => {
    console.log(cmdo);
    console.log(cat);
    navigate(`/dashboard-sgl-sg7/dm7/distribuicao/lista`, { state: { cmdo, cat } });
  };

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral onMenuClick={handleMenuClick} />
      <div className="unique-page-container">
        <div className="full-grid-object">
          <span className="span-title">Materiais Classe VII</span>
          <span className="span-subtitle">Sistema por C Mil A</span>
          <QtdMaterialSubsistemaCmdo onSelectCategoria={handleSelectCategoria} />
        </div>
      </div>
    </div>
  );
};

export default Distribuicao;
