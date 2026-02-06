export default function AboutPage() {
  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3">About This App</h2>

      <p className="text-muted">
        This application provides an interactive HK80 coordinate map with
        search, sport centre information.
      </p>

      <p>
        You can explore Hong Kong’s sport centres, tap on any marker to view
        details, and use the built‑in search to jump directly to HK80
        coordinates or named locations.
      </p>

      <p>
        The map is powered by LandsD HKMap APIs and rendered using ArcGIS
        MapView for smooth, mobile‑friendly navigation.
      </p>

      <hr className="my-4" />

      <p className="small text-secondary">
        Built with React, ArcGIS JS API, Bootstrap, and HK80 spatial reference.
      </p>
    </div>
  );
}
