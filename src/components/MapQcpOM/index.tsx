import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, Marker, ImageOverlay } from "react-leaflet";
import L from "leaflet";

// Corrigir ícones padrão do Leaflet (problema comum com Webpack)
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FullscreenControl } from "react-leaflet-fullscreen";
import { GeorefQcpOM } from "types/georefqcpom";
import { saveGeoRefQcpOmData } from "utils/storage";
import Loader from "components/Loader";

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
import { useNavigate } from "react-router-dom";

import "react-leaflet-fullscreen/styles.css";
import "leaflet.fullscreen";
import FooterControl from "components/FooterControl";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [17, 25],
  iconAnchor: [8.5, 25],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
  selectedData?: GeorefQcpOM[] | null;
  refreshTrigger: number;
}

const MapQcpOM = ({ selectedData, refreshTrigger }: Props) => {
  const [points, setPoints] = useState<GeorefQcpOM[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

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

    if (selectedData && selectedData.length > 0) {
      setPoints(selectedData);
      setLoading(false);

      mapRef.current?.setZoom(3);
    } else {
      const savedGeoRef = localStorage.getItem("geoRefQcpOm");
      if (savedGeoRef) {
        // Se houver dados salvos no localStorage, usa diretamente
        const parsedGeoRef = JSON.parse(savedGeoRef) as GeorefQcpOM[];

        setPoints(parsedGeoRef);
        setLoading(false);
        mapRef.current?.setZoom(3);
        return; // Não faz a requisição, já temos os dados
      }

      const requestParams: AxiosRequestConfig = {
        url: "/qcpom",
        method: "GET",
        withCredentials: true,
      };

      requestBackend(requestParams)
        .then((res) => {
          const geoRefData = res.data as GeorefQcpOM[];
          setPoints(geoRefData);
          saveGeoRefQcpOmData(geoRefData); // Armazena no localStorage
          mapRef.current?.setZoom(3);
        })
        .catch((err) => {
          toast.error("Erro ao tentar carregar os dados de georeferenciamento.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedData]);

  const forceRefresh = () => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/qcpom",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        const geoRefData = res.data as GeorefQcpOM[];
        setPoints(geoRefData);
        saveGeoRefQcpOmData(geoRefData); // Armazena no localStorage
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

  useEffect(() => {
    forceRefresh();
  }, [refreshTrigger]);

  return (
    <>
      {loading ? (
        <div className="loader-div">
          <Loader />
        </div>
      ) : (
        <div className="map-wrapper">
          <MapContainer
            center={[-15.78, -47.93]}
            zoom={4}
            className="map-container"
            style={{ width: "100%", height: "100%" }}
            ref={mapRef}
            whenReady={() => {}}
          >
            <FullscreenControl position="topleft" />
            <button onClick={forceRefresh} className="refresh-map-button">
              <i className="bi bi-arrow-clockwise" />
            </button>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" key={loading ? "loading" : "loaded"} />
            <ImageOverlay
              url={MapaBrasil} // Estilos opcionais para o SVG
              bounds={bounds}
              opacity={0.5}
            />
            {points &&
              points.map((point) => {
                const logoUrl = logos[point.cmdo]; // Usa um logo padrão caso não tenha mapeado

                const customLabel = L.divIcon({
                  className: "custom-label",
                  html: `
                  <div class="map-icon">
                    <div class="label" style="background-image: url(${logoUrl});">
                    </div>
                    <div class="label-content">
                      <span>${point.cmdo}</span>
                      <span>P: ${point.previsto}</span>
                      <span>E: ${point.efetivo}</span>
                    </div>
                  </div>
                  `,
                  iconSize: [4, 4],
                });

                return (
                  <Marker
                    key={point.cmdo}
                    position={[Number(point.latitude), Number(point.longitude)]}
                    icon={customLabel}
                    eventHandlers={{
                      click: () => navigate(`/dashboard-sgl-sg7/qcpom/filter/${point.cmdo}`),
                    }}
                  />
                );
              })}

            <FooterControl title="Mapa QCP OM" key={"mapa-qcp-om"} />
          </MapContainer>
        </div>
      )}
    </>
  );
};

export default MapQcpOM;
