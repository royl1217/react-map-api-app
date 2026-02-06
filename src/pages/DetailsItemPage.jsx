import { useLocation, useNavigate } from "react-router-dom";

export default function DetailsItemPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.centre) {
    return (
      <div className="container py-4">
        <h3>No data found.</h3>
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const centre = state.centre;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3">{centre.name}</h2>

      <p className="text-muted">{centre.address}</p>

      <div className="mb-3">
        <strong>Coordinates:</strong>
        <br />
        X: {centre.x}
        <br />
        Y: {centre.y}
      </div>

      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}
