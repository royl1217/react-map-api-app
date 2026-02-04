import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import MVT from "ol/format/MVT";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";

export default function MapView() {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new VectorTileLayer({
          source: new VectorTileSource({
            format: new MVT(),
            url: `${window.location.origin}/hkmap/gs/api/v1.0.0/vt/basemap/EPSG3857/tile/{z}/{y}/{x}.pbf`,
            maxZoom: 19,
          }),
          style: null, // use default styling for now
        }),
      ],
      view: new View({
        center: fromLonLat([114.1694, 22.3193]),
        zoom: 12,
      }),
    });

    return () => map.setTarget(null);
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100vh", position: "relative" }}
    />
  );
}
