import {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Basemap from "@arcgis/core/Basemap";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Point from "@arcgis/core/geometry/Point";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import InfoPanel from "./InfoPanel";

import "@arcgis/core/assets/esri/themes/light/main.css";

const HK80MapView = forwardRef((props, ref) => {
  const mapDiv = useRef(null);
  const viewRef = useRef(null);

  const markerLayerRef = useRef(null);
  const basemapRef = useRef(null);

  const markerTimeoutRef = useRef(null);
  const sportCentresVisibleRef = useRef(false);
  const sportBtnRef = useRef(null);

  const [mapLoading, setMapLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const selectedMarkerRef = useRef(null);

  const normalSportSymbol = new SimpleMarkerSymbol({
    color: [255, 165, 0, 0.9],
    size: 10,
    outline: { color: [255, 255, 255], width: 2 },
  });

  const selectedSportSymbol = new SimpleMarkerSymbol({
    color: [72, 61, 119, 0.9],
    size: 12,
    outline: { color: [255, 255, 255], width: 3 },
  });

  // ⭐ Dim basemap only
  function setBasemapDimmed(isDimmed) {
    if (!basemapRef.current) return;
    basemapRef.current.baseLayers.forEach((layer) => {
      layer.opacity = isDimmed ? 0.5 : 1;
    });
  }

  // ⭐ Show temporary marker
  function showMarker(x, y) {
    if (markerTimeoutRef.current) {
      clearTimeout(markerTimeoutRef.current);
      markerTimeoutRef.current = null;
    }

    markerLayerRef.current.removeAll();

    const marker = new Graphic({
      geometry: new Point({
        x,
        y,
        spatialReference: { wkid: 2326 },
      }),
      symbol: normalSportSymbol,
    });

    markerLayerRef.current.add(marker);

    markerTimeoutRef.current = setTimeout(() => {
      markerLayerRef.current.removeAll();
      markerTimeoutRef.current = null;
    }, 3000);
  }

  // ⭐ Reset map
  function resetMap() {
    if (markerTimeoutRef.current) {
      clearTimeout(markerTimeoutRef.current);
      markerTimeoutRef.current = null;
    }

    markerLayerRef.current.removeAll();

    sportCentresVisibleRef.current = false;
    if (sportBtnRef.current) {
      sportBtnRef.current.setAttribute("aria-pressed", "false");
    }

    setSelectedPoint(null);
    setBasemapDimmed(false);

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.symbol = normalSportSymbol;
      selectedMarkerRef.current = null;
    }

    viewRef.current.goTo({
      center: new Point({
        x: 833359,
        y: 822962,
        spatialReference: { wkid: 2326 },
      }),
      zoom: 10,
    });
  }

  // ⭐ Toggle Sport Centres
  async function toggleSportCentres(buttonEl) {
    const isOn = sportCentresVisibleRef.current;

    if (isOn) {
      markerLayerRef.current.removeAll();
      sportCentresVisibleRef.current = false;
      buttonEl.setAttribute("aria-pressed", "false");

      setSelectedPoint(null);
      setBasemapDimmed(false);

      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.symbol = normalSportSymbol;
        selectedMarkerRef.current = null;
      }

      return;
    }

    const url =
      "https://www.map.gov.hk/gs/api/v1.0.0/locationSearch?q=sports%20centre";

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.length) {
        alert("No sport centres found");
        return;
      }

      markerLayerRef.current.removeAll();

      data.forEach((item) => {
        const marker = new Graphic({
          geometry: new Point({
            x: item.x,
            y: item.y,
            spatialReference: { wkid: 2326 },
          }),
          symbol: normalSportSymbol,
          attributes: {
            name: item.nameEN,
            address: item.addressEN,
            x: item.x,
            y: item.y,
          },
        });

        markerLayerRef.current.add(marker);
      });

      sportCentresVisibleRef.current = true;
      buttonEl.setAttribute("aria-pressed", "true");

      setBasemapDimmed(true);
    } catch (err) {
      console.error("Sport centre search error:", err);
      alert("Failed to load sport centres");
    }
  }

  // ⭐ Expose search() to parent
  useImperativeHandle(ref, () => ({
    async search(value) {
      const parts = value.split(/[ ,]+/).map(Number);

      if (parts.length === 2 && parts.every((n) => !isNaN(n))) {
        const x = parts[0];
        const y = parts[1];

        showMarker(x, y);

        viewRef.current.goTo({
          center: new Point({ x, y, spatialReference: { wkid: 2326 } }),
          zoom: 17,
        });
        return;
      }

      const url = `https://www.map.gov.hk/gs/api/v1.0.0/locationSearch?q=${encodeURIComponent(
        value,
      )}`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.length) {
          alert("No results found");
          return;
        }

        const { x, y } = data[0];

        showMarker(x, y);

        viewRef.current.goTo({
          center: new Point({ x, y, spatialReference: { wkid: 2326 } }),
          zoom: 17,
        });
      } catch (err) {
        console.error("Search error:", err);
        alert("Search failed");
      }
    },
  }));

  // ⭐ Initialize map
  useEffect(() => {
    const basemapVTURL =
      "https://hk-map-proxy.fly.dev/hkmap/gs/api/v1.0.0/vt/basemap/HK80";

    const labelVTURL =
      "https://hk-map-proxy.fly.dev/hkmap/gs/api/v1.0.0/vt/label/hk/en/HK80";

    const basemap = new Basemap({
      baseLayers: [
        new VectorTileLayer({ url: basemapVTURL }),
        new VectorTileLayer({ url: labelVTURL }),
      ],
    });

    basemapRef.current = basemap;

    const map = new Map({ basemap });

    const markerLayer = new GraphicsLayer();
    markerLayerRef.current = markerLayer;
    map.add(markerLayer);

    const view = new MapView({
      container: mapDiv.current,
      map,
      zoom: 10,
      center: new Point({
        x: 833359,
        y: 822962,
        spatialReference: { wkid: 2326 },
      }),
      spatialReference: new SpatialReference({ wkid: 2326 }),
      constraints: {
        minZoom: 10,
        maxZoom: 19,
      },
    });

    viewRef.current = view;

    view.when(() => {
      setMapLoading(false);
    });

    // ⭐ Click marker → show details
    view.on("click", (event) => {
      view.hitTest(event).then((response) => {
        const result = response.results.find(
          (r) => r.graphic.layer === markerLayerRef.current,
        );

        if (!result) {
          setSelectedPoint(null);

          if (selectedMarkerRef.current) {
            selectedMarkerRef.current.symbol = normalSportSymbol;
            selectedMarkerRef.current = null;
          }

          return;
        }

        const g = result.graphic;

        if (selectedMarkerRef.current && selectedMarkerRef.current !== g) {
          selectedMarkerRef.current.symbol = normalSportSymbol;
        }

        g.symbol = selectedSportSymbol;
        selectedMarkerRef.current = g;

        const attrs = g.attributes;
        setSelectedPoint({
          name: attrs.name,
          address: attrs.address,
          x: attrs.x,
          y: attrs.y,
        });
      });
    });

    return () => view.destroy();
  }, []);

  // ⭐ UI
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* ⭐ Loading Screen */}
      {mapLoading && (
        <div className="map-loading-overlay">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <div className="fw-semibold">Loading map…</div>
        </div>
      )}

      {/* ⭐ Map container */}
      <div ref={mapDiv} style={{ width: "100%", height: "100%" }} />

      {/* ⭐ Home Button */}
      <button
        onClick={resetMap}
        className="icon-home-btn"
        style={{
          top: "15px",
          right: "15px",
        }}
      >
        <span className="icon-home"></span>
      </button>

      {/* ⭐ Sport Centres Toggle */}
      <button
        ref={sportBtnRef}
        aria-pressed="false"
        className="icon-sport-toggle-btn"
        onClick={(e) => toggleSportCentres(e.currentTarget)}
        style={{
          position: "absolute",
          top: "60px",
          right: "15px",
          zIndex: 9999,
        }}
      >
        <span className="icon-sport"></span>
      </button>

      {/* ⭐ Bottom Sheet Info Panel */}
      <InfoPanel point={selectedPoint} onClose={() => setSelectedPoint(null)} />
    </div>
  );
});

export default HK80MapView;
