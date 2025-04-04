import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

import "./styles.css";

interface Props {
  title: string;
}

const FooterControl = ({ title }: Props) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const footerControl = new L.Control({ position: "bottomright" });

    footerControl.onAdd = () => {
      const div = L.DomUtil.create("div", "leaflet-footer");
      div.innerHTML = title;
      return div;
    };

    footerControl.addTo(map);

    return () => {
      map.removeControl(footerControl);
    };
  }, [map, title]);

  return null;
};

export default FooterControl;