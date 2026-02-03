import React, { useState, useEffect } from "react";
import { CITIES, CATEGORIES, CITY_COORDINATES, CITY_SUB_BRANCHES } from "../utils/constants";

// Helper function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

export default function FilterPanel({
  filters = { city: "", category: "", sort: "", availability: "", subBranch: "" },
  onFilterChange,
  onClearFilters,
  userLocation = null // Optional: {lat, lon} or city name
}) {
  const [availableSubBranches, setAvailableSubBranches] = useState([]);
  const [nearbySubBranches, setNearbySubBranches] = useState([]);

  // Get cities within 10km of user's location
  const getNearbyCities = () => {
    if (!userLocation || !CITY_COORDINATES) {
      return CITIES;
    }

    let userCoords = userLocation;
    
    // If userLocation is a city name, get its coordinates
    if (typeof userLocation === 'string') {
      const cityCoord = CITY_COORDINATES[userLocation];
      if (!cityCoord) return CITIES;
      userCoords = cityCoord;
    }

    // Filter cities within 10km
    const nearbyCities = CITIES.filter(city => {
      const cityCoord = CITY_COORDINATES[city];
      if (!cityCoord) return true; // Include cities without coordinates
      
      const distance = calculateDistance(
        userCoords.lat,
        userCoords.lon,
        cityCoord.lat,
        cityCoord.lon
      );
      
      return distance <= 10;
    });

    return nearbyCities.length > 0 ? nearbyCities : CITIES;
  };

  // Get sub-branches within 10km for selected city
  const getSubBranchesWithin10km = (selectedCity) => {
    if (!selectedCity || !CITY_SUB_BRANCHES[selectedCity]) {
      return [];
    }

    const allSubBranches = CITY_SUB_BRANCHES[selectedCity];
    
    // If no user location, return all sub-branches
    if (!userLocation) {
      return allSubBranches;
    }

    let userCoords = userLocation;
    
    // If userLocation is a city name, get its coordinates
    if (typeof userLocation === 'string') {
      const cityCoord = CITY_COORDINATES[userLocation];
      if (!cityCoord) return allSubBranches;
      userCoords = cityCoord;
    }

    // Filter sub-branches within 10km
    const nearbyBranches = allSubBranches.filter(subBranch => {
      if (!subBranch.coordinates) return false; // Skip branches without coordinates
      
      const distance = calculateDistance(
        userCoords.lat,
        userCoords.lon,
        subBranch.coordinates.lat,
        subBranch.coordinates.lon
      );
      
      return distance <= 10;
    });

    return nearbyBranches;
  };

  // Update available sub-branches when city changes
  useEffect(() => {
    if (filters.city && CITY_SUB_BRANCHES[filters.city]) {
      const allBranches = CITY_SUB_BRANCHES[filters.city];
      setAvailableSubBranches(allBranches);
      
      // Get nearby branches within 10km
      const nearby = getSubBranchesWithin10km(filters.city);
      setNearbySubBranches(nearby);
    } else {
      setAvailableSubBranches([]);
      setNearbySubBranches([]);
    }
  }, [filters.city, userLocation]);

  const displayCities = getNearbyCities();
  const displaySubBranches = nearbySubBranches.length > 0 ? nearbySubBranches : availableSubBranches;

  const handleCityChange = (newCity) => {
    onFilterChange(prev => ({ 
      ...prev, 
      city: newCity,
      subBranch: "" // Reset sub-branch when city changes
    }));
  };

  return (
    <div className="bg-body border rounded p-4">
      <div className="row g-3 mb-3">
        {/* City */}
        <div className="col-12">
          <label className="form-label fw-medium">
            City
            {userLocation && (
              <small className="text-muted ms-2">(within 10km)</small>
            )}
          </label>
          <select
            className="form-select"
            value={filters.city}
            onChange={(e) => handleCityChange(e.target.value)}
          >
            <option value="">All Cities</option>
            {displayCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {userLocation && displayCities.length < CITIES.length && (
            <small className="text-muted">
              Showing {displayCities.length} of {CITIES.length} cities nearby
            </small>
          )}
        </div>

        {/* Sub-Branch / Area (only show when city is selected) */}
        {filters.city && availableSubBranches.length > 0 && (
          <div className="col-12">
            <label className="form-label fw-medium">
              Area / Sub-Branch
              {nearbySubBranches.length > 0 && nearbySubBranches.length < availableSubBranches.length && (
                <small className="text-muted ms-2">(within 10km)</small>
              )}
            </label>
            <select
              className="form-select"
              value={filters.subBranch}
              onChange={(e) =>
                onFilterChange(prev => ({ ...prev, subBranch: e.target.value }))
              }
            >
              <option value="">All Areas in {filters.city}</option>
              {displaySubBranches.map((subBranch) => (
                <option key={subBranch.name} value={subBranch.name}>
                  {subBranch.name}
                  {subBranch.distance && ` (${subBranch.distance})`}
                </option>
              ))}
            </select>
            {nearbySubBranches.length > 0 && nearbySubBranches.length < availableSubBranches.length && (
              <small className="text-muted">
                Showing {nearbySubBranches.length} of {availableSubBranches.length} areas nearby
              </small>
            )}
          </div>
        )}

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

        {/* Availability Filter */}
        <div className="col-12">
          <label className="form-label fw-medium">Availability</label>
          <select
            className="form-select"
            value={filters.availability}
            onChange={(e) =>
              onFilterChange(prev => ({ ...prev, availability: e.target.value }))
            }
          >
            <option value="">All Items</option>
            <option value="true">✅ Available Only</option>
            <option value="false">❌ Unavailable Only</option>
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
        onClick={() => onClearFilters?.()}
        className="btn btn-link p-0"
      >
        Clear all filters
      </button>
    </div>
  );
}