import React from "react";
import { Package } from "lucide-react";

export default function Header({ role, onLogout }) {
  return (
    <header className="bg-body border-bottom shadow-sm">
      <div className="container py-3 d-flex align-items-center justify-content-between">

        {/* Left: Logo & Title */}
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded text-white"
            style={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #0d6efd, #6f42c1)",
            }}
          >
            <Package size={22} />
          </div>

          <div>
            <h1 className="h4 mb-0 fw-bold">Rental Hub</h1>
            <small className="text-body-secondary">
              Item Management System
            </small>
          </div>
        </div>

        {/* Right: Role & Logout */}
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary-subtle text-primary-emphasis px-3 py-2">
            {role}
          </span>

          <button
            onClick={onLogout}
            className="btn btn-outline-danger btn-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
