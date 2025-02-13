import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Corrigir ícones padrão do Leaflet (problema comum com Webpack)
import icon from "leaflet/dist/images/marker-icon.png";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import { GeorefUnidade } from "types/georef";
import { saveGeoRefData } from "utils/storage";

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconSize: [15, 25],
  iconAnchor: [7.5, 25],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = () => {
  const [points, setPoints] = useState<GeorefUnidade[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filteredPoints, setFilteredPoints] = useState<GeorefUnidade[]>([]);

  const mapRef = useRef<L.Map | null>(null);

  const loadPoints = useCallback(() => {
    const savedGeoRef = localStorage.getItem("geoRef");
    if (savedGeoRef) {
      // Se houver dados salvos no localStorage, use-os diretamente
      const parsedGeoRef = JSON.parse(savedGeoRef) as GeorefUnidade[];
      setPoints(parsedGeoRef);
      setFilteredPoints(parsedGeoRef);
      return; // Não faz a requisição, já temos os dados
    }

    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/materiaisom/georef/unidades",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        const geoRefData = res.data as GeorefUnidade[];
        setPoints(geoRefData);
        setFilteredPoints(geoRefData);
        saveGeoRefData(geoRefData); // Armazenar no localStorage
      })
      .catch((err) => {
        toast.error("Erro ao tentar carregar os dados de georeferenciamento.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadPoints();
  }, [loadPoints]);

  const goToLocation = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 15);
    }
  };

  const handleFilter = () => {
    const filtered = points.filter((point) =>
      point.equipamento.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPoints(filtered);
  };

  return (
    <>
      {loading ? (
        <div className="loader-div">
          <Loader />
        </div>
      ) : (
        <div className="map-wrapper">
          <MapContainer
            center={[-15, -50]}
            zoom={3}
            className="map-container"
            style={{ width: "100%", height: "70%" }}
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredPoints.map((point) => (
              <Marker
                position={[Number(point.latitude), Number(point.longitude)]}
              >
                <Popup>
                  <div>
                    <p>{point.om}</p>
                    <p>{point.equipamento}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <div className="map-listing">
            <div className="filter-container">
              <input
                type="text"
                placeholder="Buscar equipamento"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <button onClick={handleFilter} className="filter-button">
                Filtrar
              </button>
            </div>
            <ul>
              {filteredPoints.map((p, index) => (
                <li
                  key={index}
                  onClick={() =>
                    goToLocation(Number(p.latitude), Number(p.longitude))
                  }
                >
                  {p.equipamento}, BDA: {p.bda}, OM: {p.om}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Map;
