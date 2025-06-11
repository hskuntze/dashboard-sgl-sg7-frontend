import { MapContainer, TileLayer, Marker, ImageOverlay } from "react-leaflet";
import L from "leaflet";

// Corrigir ícones padrão do Leaflet (problema comum com Webpack)
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Loader from "components/Loader";

import MapaBrasil from "assets/images/mapa-brasil-cmdo.svg";

import markerIcon from "assets/images/marker-icon-3.png";

import "react-leaflet-fullscreen/styles.css";
import "leaflet.fullscreen";
import { FullscreenControl } from "react-leaflet-fullscreen";
import { ApoioDiretoRmType } from "types/relatorio/apoiodiretorm";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [4, 4],
  iconAnchor: [8.5, 25],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
  onSelectedItem: (rm: string | null) => void;
}

const MapApoioDiretoRM = ({ onSelectedItem }: Props) => {
  const [points, setPoints] = useState<ApoioDiretoRmType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const bounds: L.LatLngBoundsExpression = [
    [-34.15, -74.25],
    [5.69, -28.69],
  ];

  const mapRef = useRef<L.Map | null>(null);

  const loadPoints = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/apoiodireto/rm",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        const geoRefData = res.data as ApoioDiretoRmType[];
        setPoints(geoRefData);
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
      url: "/apoiodireto/rm",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        const geoRefData = res.data as ApoioDiretoRmType[];
        setPoints(geoRefData);
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
              opacity={0.75}
            />
            {points.map((point) => {
              const logoUrl = markerIcon; // Usa um logo padrão caso não tenha mapeado

              const customLabel = L.divIcon({
                className: "custom-label",
                html: `
                  <div class="map-icon">
                    <div class="small-icon" style="background-image: url(${logoUrl});">
                    </div>
                    <div class="small-content">
                      <span>${point.rm}</span>
                      <span>${point.quantidade}</span>
                    </div>
                  </div>
                  `,
                iconSize: [60, 60],
              });

              return (
                <Marker
                  key={point.rm}
                  position={[Number(point.latitude), Number(point.longitude)]}
                  icon={customLabel}
                  eventHandlers={{
                    click: () => {
                      if (point.rm === selectedItem) {
                        setSelectedItem(null);
                        onSelectedItem(null);
                      } else {
                        setSelectedItem(point.rm);
                        onSelectedItem(point.rm);
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

export default MapApoioDiretoRM;
