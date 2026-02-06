import { useRef } from "react";
import SearchBar from "../components/Searchbar";
import HK80MapView from "../components/MapView";

export default function MapPage() {
  const mapRef = useRef(null);

  return (
    <div className="d-flex flex-column" style={{ height: "100%" }}>
      <SearchBar onSearch={(value) => mapRef.current?.search(value)} />

      <div className="flex-grow-1 position-relative">
        <HK80MapView ref={mapRef} />
      </div>
    </div>
  );
}
