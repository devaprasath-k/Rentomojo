import React from "react";
import { CONDITIONS } from "../utils/constants";

export default function ItemCard({ item, isAdmin, onEdit, onDelete }) {
  const condition =
    CONDITIONS.find((c) => c.value === item.condition) || {};

  return (
    <div className="card h-100 shadow-sm">
      {/* Image */}
      <img
        src={item.images?.[0] || "https://via.placeholder.com/300"}
        alt={item.name}
        className="card-img-top"
        style={{ height: "160px", objectFit: "cover" }}
      />

      <div className="card-body d-flex flex-column">
        {/* Title */}
        <h5 className="card-title fw-bold">{item.name}</h5>

        {/* Description */}
        <p className="card-text text-body-secondary small">
          {item.description}
        </p>

        {/* Price & Condition */}
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="fw-semibold text-primary">
            ₹{item.pricePerMonth}/month
          </span>

          <span className={`badge ${condition.bsClass || "bg-secondary"}`}>
            {condition.label || item.condition}
          </span>
        </div>

        {/* City */}
        <small className="text-body-secondary mb-2">
          City: {item.city}
        </small>

        {/* Admin actions */}
        {isAdmin && (
          <div className="mt-auto d-flex gap-2">
            <button
              onClick={() => onEdit(item)}
              className="btn btn-outline-warning btn-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="btn btn-outline-danger btn-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
