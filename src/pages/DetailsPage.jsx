import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DetailsPage() {
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(
          "https://www.map.gov.hk/gs/api/v1.0.0/locationSearch?q=sports%20centre",
        );
        const data = await res.json();
        setCentres(data);
      } catch (err) {
        console.error("Failed to load sports centres:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 d-flex justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <div className="fw-semibold">Loading data…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Sports Centres in Hong Kong</h2>

      <div className="row g-3">
        {centres.map((item, index) => (
          <div className="col-md-6 col-lg-4" key={index}>
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.nameEN}</h5>

                <p className="card-text text-muted">
                  {item.addressEN || "No address available"}
                </p>

                <p className="card-text small text-secondary">
                  X: {item.x} <br />
                  Y: {item.y}
                </p>

                {/* Push button to bottom */}
                <div className="mt-auto">
                  <Link
                    to={`/details/${index}`}
                    state={{ centre: item }}
                    className="btn btn-primary btn-sm w-100"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
