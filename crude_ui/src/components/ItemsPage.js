import React, { useState, useEffect, useCallback } from "react";
import FilterPanel from "./FilterPanel";
import ItemList from "./ItemList";
import { itemsAPI } from "../services/api";

export default function ItemsPage({ user }) {
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    search: "",
    sort: ""
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch items from backend
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await itemsAPI.getItems(filters);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch on filters change
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Filters */}
        <div className="col-12 col-md-4 col-lg-3">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={() =>
              setFilters({ city: "", category: "", search: "", sort: "" })
            }
          />
        </div>

        {/* Item List */}
        <div className="col-12 col-md-8 col-lg-9">
          <ItemList
            items={items}
            isAdmin={user?.role === "admin"}
            onItemsChange={setItems}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
