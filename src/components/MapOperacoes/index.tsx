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

import OpRoraima from "assets/images/op-roraima.png";
import OpManobraEscolar from "assets/images/manobra-escolar.png";
import OpCore25 from "assets/images/op-core-25.png";
import OpCop30 from "assets/images/op-cop-30.png";
import OpAtlas from "assets/images/op-atlas.png";
import OpBrics from "assets/images/op-brics.png";
import MapaBrasil from "assets/images/mapa-brasil-cmdo.svg";
import markerIcon from "assets/images/marker-icon-3.png";

import { useNavigate } from "react-router-dom";

import { OperacoesType } from "types/operacoes";
import MarkerClusterGroup from "react-leaflet-cluster";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [17, 25],
  iconAnchor: [8.5, 25],
});

L.Marker.prototype.options.icon = DefaultIcon;

const customClusterIcon = (cluster: MarkerCluster) => {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(33, 33, true),
  })
}

interface Props {
  refreshTrigger: number;
}

const MapOperacoes = ({ refreshTrigger }: Props) => {
  const [points, setPoints] = useState<OperacoesType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const bounds: L.LatLngBoundsExpression = [
    [-34.15, -74.25],
    [5.69, -28.69],
  ];

  const mapRef = useRef<L.Map | null>(null);

  const logos: Record<string, string> = {
    "Op Roraima": OpRoraima,
    "Op ATLAS": OpAtlas,
    "Op CORE 25": OpCore25,
    "Op COP 30": OpCop30,
    "Manobra Escolar": OpManobraEscolar,
    "Op BRICS 2025": OpBrics,
  };

  const loadPoints = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/operacoes",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        const geoRefData = res.data as OperacoesType[];
        setPoints(geoRefData);
        mapRef.current?.setZoom(3);
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
      url: "/operacoes",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        const geoRefData = res.data as OperacoesType[];
        setPoints(geoRefData);
      })
      .catch((err) => {
        toast.error("Erro ao tentar carregar os dados de georeferenciamento.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createCustomMarker = (point: OperacoesType) => {
    const logoUrl = logos[point.operacao];

    const customLabel = L.divIcon({
      className: "custom-label",
      html: `
        <div class="map-icon">
          <div class="label" style="background-image: url(${logoUrl});">
          </div>
          <div class="label-content">
            <span>${point.operacao}</span>
          </div>
        </div>
      `,
      iconSize: [4, 4],
    });

    return (
      <Marker
        key={point.codigo} // Use um ID único em vez do nome da operação
        position={[Number(point.latitude), Number(point.longitude)]}
        icon={customLabel}
        eventHandlers={{
          click: () => navigate(`/dashboard-sgl-sg7/operacoes/filter/${point.codigo}`),
        }}
      />
    );
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
            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={customClusterIcon}
            >
              {points
              .map(point => {
                let order = 0;
                if (point.operacao === "Op ATLAS") order = 1;
                if (point.operacao === "Op Roraima") order = 2;
                return { ...point, order };
              })
              .sort((a, b) => a.order - b.order)
              .map((point) => createCustomMarker(point))}
            </MarkerClusterGroup>

            <FooterControl title="Mapa de Operações" key={"mapa-op"} />
          </MapContainer>
        </div>
      )}
    </>
  );
};

export default MapOperacoes;
