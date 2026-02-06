import React from "react";

export default function InfoPanel({ point, onClose }) {
  if (!point) return null;

  return (
    <div className="info-panel">
      <div className="info-title">{point.name}</div>
      <div className="info-address">{point.address}</div>

      <div className="info-coords">
        X: {point.x} <br />
        Y: {point.y}
      </div>

      <button className="info-close" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
