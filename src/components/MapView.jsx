import { useEffect, useRef } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Basemap from "@arcgis/core/Basemap";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Point from "@arcgis/core/geometry/Point";

import "@arcgis/core/assets/esri/themes/light/main.css";
import "../styles/map.css";

export default function HK80MapView() {
  const mapRef = useRef(null);

  useEffect(() => {
    const styleJSON = "https://hk-map-proxy.fly.dev/style.json";

    const vtLayer = new VectorTileLayer({
      url: styleJSON,
      copyright:
        '<a href="https://api.portal.hkmapservice.gov.hk/disclaimer" target="_blank" class="copyright-url">&copy; Map information from Lands Department</a><div class="copyright-logo"></div>',
    });

    const basemap = new Basemap({
      baseLayers: [vtLayer],
    });

    const map = new Map({
      basemap,
    });

    const view = new MapView({
      container: mapRef.current,
      map,
      zoom: 10,
      center: new Point({
        x: 833359.88495,
        y: 822961.986247,
        spatialReference: new SpatialReference({ wkid: 2326 }),
      }),
      spatialReference: new SpatialReference({ wkid: 2326 }),
      constraints: {
        minZoom: 8,
        maxZoom: 19,
      },
    });

    return () => view.destroy();
  }, []);

  return (
    <div
      id="map-area"
      ref={mapRef}
      style={{ width: "100%", height: "100vh" }}
    />
  );
}
