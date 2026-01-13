import React, { useState, useEffect, useCallback } from "react";
import Login from "./pages/Login";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import ItemList from "./components/ItemList";
import Loading from "./components/Loading";
import { itemsAPI } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    search: "",
    sort: ""
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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

  // Fetch items on user login or filters change (debounced)
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => fetchItems(), 300);
    return () => clearTimeout(timer);
  }, [user, filters, fetchItems]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setUser(null);
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header role={user?.role} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <SearchBar
          searchTerm={filters.search}
          onSearchChange={(val) =>
            setFilters((prev) => ({ ...prev, search: val }))
          }
          onFilterToggle={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
        />

        {showFilters && (
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={() =>
              setFilters({ city: "", category: "", search: "", sort: "" })
            }
          />
        )}

        {loading ? (
          <Loading />
        ) : (
          <ItemList
            items={items}
            isAdmin={user?.role === "admin"}
            onItemsChange={setItems}
          />
        )}
      </main>
    </div>
  );
}
