import "./styles.css";

import IconeBox from "assets/images/box-seam.svg";
import IconeCash from "assets/images/cash.svg";
import IconeBroadcast from "assets/images/broadcast.svg";
import IconeFile from "assets/images/clipboard-data.svg";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const MenuLateral = ({ onMenuClick }: { onMenuClick: (index: number) => void }) => {
  const [expanded, setExpanded] = useState(true);
  const [isSubMenuVisible, setIsSubMenuVisible] = useState(false); // Estado do submenu
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleClick = (index: number) => {
    navigate(`/dashboard-sgl-sg7?carouselIndex=${index}`);
    onMenuClick(index); // Se o carousel estiver presente na página
  };

  const handleMouseEnter = () => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
    }
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    collapseTimeoutRef.current = setTimeout(() => {
      setExpanded(false);
    }, 3000);
  };

  useEffect(() => {
    collapseTimeoutRef.current = setTimeout(() => setExpanded(false), 3000);
    return () => {
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`menu-lateral-container ${expanded ? "expanded" : "collapsed"}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="menu-lateral-content">
        <ul className="menu-lateral">
          <li className="menu-lateral-item" onClick={() => handleClick(0)} onMouseEnter={() => setIsSubMenuVisible(true)}>
            <img className="menu-item-icone icone-box" src={IconeBox} alt="" /> DM7
          </li>
          {isSubMenuVisible && (
            <ul className="submenu" onMouseLeave={() => setIsSubMenuVisible(false)}>
              <Link to="/dashboard-sgl-sg7/dm7/apoiodireto">
                <li>Apoio Direto</li>
              </Link>
              <Link to="/dashboard-sgl-sg7/dm7/distribuicao">
                <li>Distribuição</li>
              </Link>
            </ul>
          )}
          <li className="menu-lateral-item" onClick={() => handleClick(1)} onMouseEnter={() => setIsSubMenuVisible(true)}>
            <img className="menu-item-icone icone-cash" src={IconeCash} alt="" /> AGGE
          </li>
          {isSubMenuVisible && (
            <ul className="submenu" onMouseLeave={() => setIsSubMenuVisible(false)}>
              <Link to="/dashboard-sgl-sg7/agge/acao20xe">
                <li>Ação 20XE</li>
              </Link>
              <Link to="/dashboard-sgl-sg7/agge/acoesfinalisticas">
                <li>Ações finalísticas</li>
              </Link>
            </ul>
          )}
          <li className="menu-lateral-item" onClick={() => handleClick(2)}>
            <img className="menu-item-icone icone-broad" src={IconeBroadcast} alt="" /> COp
          </li>
          {/* {isSubMenuVisible && (
            <ul className="submenu" onMouseLeave={() => setIsSubMenuVisible(false)}>
              <li>Monitoramento Sites</li>
            </ul>
          )} */}
          <li className="menu-lateral-item" onClick={() => handleClick(3)}>
            <img className="menu-item-icone icone-file" src={IconeFile} alt="" /> SISFRON
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MenuLateral;
