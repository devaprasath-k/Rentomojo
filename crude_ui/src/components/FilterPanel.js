import React from "react";
import { CITIES, CATEGORIES } from "../utils/constants";

export default function FilterPanel({
  filters = { city: "", category: "", sort: "" },
  onFilterChange,
  onClearFilters
}) {
  return (
    <div className="bg-body border rounded p-4">
      <div className="row g-3 mb-3">
        {/* City */}
        <div className="col-12">
          <label className="form-label fw-medium">City</label>
          <select
            className="form-select"
            value={filters.city}
            onChange={(e) =>
              onFilterChange(prev => ({ ...prev, city: e.target.value }))
            }
          >
            <option value="">All Cities</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="col-12">
          <label className="form-label fw-medium">Category</label>
          <select
            className="form-select"
            value={filters.category}
            onChange={(e) =>
              onFilterChange(prev => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sorting */}
        <div className="col-12">
          <label className="form-label fw-medium">Sort By</label>
          <select
            className="form-select"
            value={filters.sort}
            onChange={(e) =>
              onFilterChange(prev => ({ ...prev, sort: e.target.value }))
            }
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
      </div>

      <button
        onClick={() =>
          onClearFilters?.()
        }
        className="btn btn-link p-0"
      >
        Clear all filters
      </button>
    </div>
  );
}
