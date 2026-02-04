import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import "../styles/map.css";

export default function MapView() {
  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      center: [114.1694, 22.3193],
      zoom: 12,
      style: {
        version: 8,
        sources: {
          basemap: {
            type: "vector",
            tiles: [
              "/hkmap/gs/api/v1.0.0/vt/basemap/EPSG3857/tile/{z}/{y}/{x}.pbf",
            ],
            minzoom: 0,
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: "roads",
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
    });

    return () => map.remove();
  }, []);

  return <div id="map" className="map-container" />;
}
