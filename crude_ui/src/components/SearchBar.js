import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";

export default function SearchBar({
  searchTerm,
  onSearchChange,
  onFilterToggle,
  showFilters
}) {
  const [localValue, setLocalValue] = useState(searchTerm);

  // Sync localValue with searchTerm prop changes
  useEffect(() => {
    setLocalValue(searchTerm);
  }, [searchTerm]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onSearchChange]);

  return (
    <div className="sticky-top bg-body border-bottom z-3">
      <div className="container py-3">
        <div className="row align-items-center g-3">
          {/* Search Input */}
          <div className="col-12 col-md">
            <div className="position-relative">
              <Search
                size={18}
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
              />
              <input
                type="text"
                className="form-control form-control-lg ps-5"
                placeholder="Search rental items..."
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
              />
              {localValue && (
                <button
                  type="button"
                  onClick={() => setLocalValue("")}
                  className="btn btn-sm btn-link position-absolute top-50 end-0 translate-middle-y me-3 text-secondary"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Button */}
          <div className="col-12 col-md-auto">
            <button
              onClick={onFilterToggle}
              className={`btn btn-lg w-100 d-flex align-items-center gap-2 ${
                showFilters ? "btn-primary" : "btn-outline-secondary"
              }`}
            >
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
