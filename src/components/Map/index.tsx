import { MapContainer, TileLayer, Marker, ImageOverlay } from "react-leaflet";
import L from "leaflet";

// Corrigir ícones padrão do Leaflet (problema comum com Webpack)
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import { saveGeoRefCmdoData } from "utils/storage";

import MapaBrasil from "assets/images/mapa-brasil-cmdo.svg";
import CMS from "assets/images/CMS.png";
import CMSE from "assets/images/CMSE.png";
import CMP from "assets/images/CMP.png";
import CMO from "assets/images/CMO.png";
import CMN from "assets/images/CMN.png";
import CMNE from "assets/images/CMNE.png";
import CML from "assets/images/CML.png";
import CMA from "assets/images/CMA.png";

import markerIcon from "assets/images/marker-icon-3.png";
import { GeorefCmdo } from "types/georefcmdo";

import "react-leaflet-fullscreen/styles.css";
import "leaflet.fullscreen";
import { FullscreenControl } from "react-leaflet-fullscreen";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [17, 25],
  iconAnchor: [8.5, 25],
});

L.Marker.prototype.options.icon = DefaultIcon;
// L.imageOverlay(MapaBrasil, [[-33.70, -53.43601], [5.24591, -60.18398]]);

interface Props {
  onSelectedItem: (cmdo: string | null) => void;
}

const Map = ({ onSelectedItem }: Props) => {
  const [points, setPoints] = useState<GeorefCmdo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const bounds: L.LatLngBoundsExpression = [
    [-34.15, -74.25],
    [5.69, -28.69],
  ];

  const mapRef = useRef<L.Map | null>(null);

  const logos: Record<string, string> = {
    CMS,
    CMSE,
    CMP,
    CMO,
    CMN,
    CMNE,
    CML,
    CMA,
  };

  const loadPoints = useCallback(() => {
    setLoading(true);

    const savedGeoRef = localStorage.getItem("geoRef");
    if (savedGeoRef) {
      // Se houver dados salvos no localStorage, usa diretamente
      const parsedGeoRef = JSON.parse(savedGeoRef) as GeorefCmdo[];

      setPoints(parsedGeoRef);
      setLoading(false);
      return; // Não faz a requisição, já temos os dados
    }

    const requestParams: AxiosRequestConfig = {
      url: "/materiaisom/georef/cmdo",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        const geoRefData = res.data as GeorefCmdo[];
        setPoints(geoRefData);
        saveGeoRefCmdoData(geoRefData); // Armazena no localStorage
      })
      .catch((err) => {
        toast.error("Erro ao tentar carregar os dados de georeferenciamento.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const forceRefresh = () => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/materiaisom/georef/cmdo",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        const geoRefData = res.data as GeorefCmdo[];
        setPoints(geoRefData);
        saveGeoRefCmdoData(geoRefData); // Armazena no localStorage
      })
      .catch((err) => {
        toast.error("Erro ao tentar carregar os dados de georeferenciamento.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPoints();
  }, [loadPoints]);

  return (
    <>
      {loading ? (
        <div className="loader-div">
          <Loader />
        </div>
      ) : (
        <div className="map-wrapper">
          <MapContainer center={[-15.78, -47.93]} zoom={3} className="map-container" style={{ width: "100%", height: "100%" }} ref={mapRef}>
            <FullscreenControl position="topleft" />
            <button onClick={forceRefresh} className="refresh-map-button">
              <i className="bi bi-arrow-clockwise" />
            </button>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" />
            <ImageOverlay
              url={MapaBrasil} // Estilos opcionais para o SVG
              bounds={bounds}
              opacity={0.5}
            />
            {points.map((point) => {
              const logoUrl = logos[point.cmdoOds]; // Usa um logo padrão caso não tenha mapeado

              const customLabel = L.divIcon({
                className: "custom-label",
                html: `
                  <div class="map-icon">
                    <div class="label" style="background-image: url(${logoUrl});">
                    </div>
                    <div class="label-content">
                      <span>${point.cmdoOds}</span>
                      <span>${point.quantidade}</span>
                    </div>
                  </div>
                  `,
                iconSize: [4, 4],
              });

              return (
                <Marker
                  key={point.cmdoOds}
                  position={[Number(point.latitude), Number(point.longitude)]}
                  icon={customLabel}
                  eventHandlers={{
                    click: () => {
                      if (point.cmdoOds === selectedItem) {
                        setSelectedItem(null);
                        onSelectedItem(null);
                      } else {
                        setSelectedItem(point.cmdoOds);
                        onSelectedItem(point.cmdoOds);
                      }
                    },
                  }}
                />
              );
            })}
          </MapContainer>
        </div>
      )}
    </>
  );
};

export default Map;
