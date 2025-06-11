import "leaflet/dist/leaflet.css";
import "react-leaflet-fullscreen/styles.css";
import "leaflet.fullscreen";

import { MapContainer, TileLayer, Marker, ImageOverlay } from "react-leaflet";
import { FullscreenControl } from "react-leaflet-fullscreen";
import L, { MarkerCluster } from "leaflet";

// Corrigir ícones padrão do Leaflet (problema comum com Webpack)
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import Loader from "components/Loader";
import FooterControl from "components/FooterControl";

import MapaBrasil from "assets/images/mapa-brasil-cmdo.svg";
import markerIcon from "assets/images/marker-icon-3.png";

import { useNavigate } from "react-router-dom";

import MarkerClusterGroup from "react-leaflet-cluster";
import { GeorefCFF } from "types/relatorio/georefcff";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [17, 25],
  iconAnchor: [8.5, 25],
});

L.Marker.prototype.options.icon = DefaultIcon;

const customClusterIcon = (cluster: MarkerCluster) => {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'custom-cff-marker-cluster',
    iconSize: L.point(33, 33, true),
  })
}
const MapOmCFF = () => {
  const [points, setPoints] = useState<GeorefCFF[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const bounds: L.LatLngBoundsExpression = [
    [-34.15, -74.25],
    [5.69, -28.69],
  ];

  const mapRef = useRef<L.Map | null>(null);

  const loadPoints = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/cff/georef",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        const geoRefData = res.data as GeorefCFF[];
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
      url: "/cff/georef",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        const geoRefData = res.data as GeorefCFF[];
        setPoints(geoRefData);
      })
      .catch((err) => {
        toast.error("Erro ao tentar carregar os dados de georeferenciamento.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createCustomMarker = (point: GeorefCFF) => {

    const customLabel = L.divIcon({
      className: "custom-label",
      html: `
        <div class="map-icon">
          <div class="cffmap-label-content">
            <span>${point.om}</span>
          </div>
        </div>
      `,
      iconSize: [4, 4],
    });

    return (
      <Marker
        key={point.om} // Use um ID único em vez do nome da operação
        position={[Number(point.lat), Number(point.longi)]}
        icon={customLabel}
        eventHandlers={{
          click: () => navigate(`/dashboard-sgl-sg7/sisfron/cff/sad2/${point.om}`),
        }}
      />
    );
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
            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={customClusterIcon}
            >
              {points
              .map((point) => createCustomMarker(point))}
            </MarkerClusterGroup>

            <FooterControl title="Mapa de OM" key={"mapa-cff-om"} />
          </MapContainer>
        </div>
      )}
    </>
  );
};

export default MapOmCFF;
