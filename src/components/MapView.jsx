import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import "../styles/map.css";

export default function MapView() {
  useEffect(() => {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    const map = new maplibregl.Map({
      container: "map",
      center: [114.1694, 22.3193], // Central
      zoom: 12,
      style: {
        version: 8,
        sources: {
          basemap: {
            type: "vector",
            tiles: [
              "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/basemap/EPSG3857/tile/{z}/{y}/{x}.pbf",
            ],
            minzoom: 0,
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: "roads-debug",
            type: "line",
            source: "basemap",
            "source-layer": "RoadL",
            paint: {
              "line-color": "#ff0000",
              "line-width": 1,
            },
          },
        ],
      },
      transformRequest: (url) => {
        if (isLocalhost && url.startsWith("https://mapapi.geodata.gov.hk")) {
          return {
            url: url.replace(
              "https://mapapi.geodata.gov.hk",
              "http://localhost:5173/hkmap",
            ),
          };
        }
        return { url };
      },
    });

    return () => map.remove();
  }, []);

  return <div id="map" className="map-container" />;
}
