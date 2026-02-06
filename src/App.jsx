import { useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import MapPage from "./pages/Mappage";
import DetailsPage from "./pages/DetailsPage";
import AboutPage from "./pages/AboutPage";
import DetailsItemPage from "./pages/DetailsItemPage";

export default function App() {
  const mapRef = useRef(null);

  return (
    <BrowserRouter>
      <div className="d-flex flex-column" style={{ height: "100vh" }}>
        <Navbar />

        <div className="flex-grow-1 d-flex flex-column">
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/details" element={<DetailsPage />} />
            <Route path="/details/:id" element={<DetailsItemPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
