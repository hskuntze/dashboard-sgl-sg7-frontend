import "./styles.css";

import IconeBox from "assets/images/box-seam.svg";
import IconeCash from "assets/images/cash.svg";
import IconeBroadcast from "assets/images/broadcast.svg";
import IconeFile from "assets/images/clipboard-data.svg";

const MenuLateral = ({ onMenuClick }: { onMenuClick: (index: number) => void }) => {
  return (
    <div className="menu-lateral-container">
      <div className="menu-lateral-content">
        <ul className="menu-lateral">
          <li className="menu-lateral-item" onClick={() => onMenuClick(0)}>
            <img className="menu-item-icone icone-box" src={IconeBox} alt="" /> DM7
          </li>
          <li className="menu-lateral-item" onClick={() => onMenuClick(1)}>
            <img className="menu-item-icone icone-cash" src={IconeCash} alt="" /> AGGE
          </li>
          <li className="menu-lateral-item" onClick={() => onMenuClick(2)}>
            <img className="menu-item-icone icone-broad" src={IconeBroadcast} alt="" /> COp
          </li>
          <li className="menu-lateral-item" onClick={() => onMenuClick(3)}>
            <img className="menu-item-icone icone-file" src={IconeFile} alt="" /> SISFRON
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MenuLateral;
