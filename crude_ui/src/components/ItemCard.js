import React from "react";
import { CONDITIONS } from "../utils/constants";

export default function ItemCard({ 
  item, 
  isAdmin = false, 
  isVendor = false, 
  onEdit, 
  onDelete, 
  showSyncWarning = false, 
  isLoading = false 
}) {
  const condition = CONDITIONS.find((c) => c.value === item.condition) || {};

  // Debug: Always log to help troubleshoot


  // Determine if we should show any action buttons
 
  
  return (
    <div className={`card h-100 shadow-sm position-relative ${isLoading ? 'opacity-50' : ''}`}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white bg-opacity-90" style={{ zIndex: 10 }}>
          <div className="spinner-border text-primary mb-2" role="status">
            <span className="visually-hidden">Syncing...</span>
          </div>
          <small className="text-muted fw-bold">Syncing with backend...</small>
          <small className="text-muted">Please wait</small>
        </div>
      )}
      
      {/* Sync Warning Badge */}
      {showSyncWarning && (
        <div className="position-absolute top-0 end-0 m-2">
          <span 
            className="badge bg-warning text-dark" 
            title="This item may not be synced with the backend"
          >
            ⚠️ Not Synced
          </span>
        </div>
      )}

      {/* Availability Badge - Visible to all users */}
      {!showSyncWarning && (
        <div className="position-absolute top-0 end-0 m-2">
          <span 
            className={`badge ${item.availability ? 'bg-success' : 'bg-danger'}`}
            title={item.availability ? 'Available for rent' : 'Not available'}
          >
            {item.availability ? '✅ Available' : '❌ Unavailable'}
          </span>
        </div>
      )}

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
          {item.description || "No description available"}
        </p>

        {/* Price & Condition */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-semibold text-primary">
            ₹{item.pricePerMonth}/month
          </span>

          <span className={`badge ${condition.bsClass || "bg-secondary"}`}>
            {condition.label || item.condition}
          </span>
        </div>

        {/* Deposit (Admin only) */}
        {(isAdmin || isVendor) && item.deposit > 0 && (
          <small className="text-body-secondary d-block mb-1">
            💰 Deposit: ₹{item.deposit}
          </small>
        )}

        {/* City */}
        <small className="text-body-secondary mb-2 d-block">
          📍 {item.city}{item.subBranch ? `, ${item.subBranch}` : ''}
        </small>

        {/* Item ID (for debugging - Admin only)
        {isAdmin && (
          <small className="text-muted mb-2" style={{ fontSize: "0.7rem" }}>
            ID: {item.id}
          </small>
        )} */}

        {/* ACTION BUTTONS */}
        {/* ACTION BUTTONS */}
{(isAdmin || isVendor) && (
  <div className="mt-auto">
    {/* EDIT → Admin & Vendor */}
    <button
      onClick={onEdit}
      className="btn btn-outline-warning btn-sm w-100 mb-2"
      disabled={isLoading}
    >
      ✏️ Edit Item
    </button>

    {/* DELETE → Admin ONLY */}
    {isAdmin && (
      <button
        onClick={onDelete}
        className="btn btn-outline-danger btn-sm w-100"
        disabled={isLoading}
      >
        🗑️ Delete
      </button>
    )}
  </div>
)}

      </div>
    </div>
  );
}