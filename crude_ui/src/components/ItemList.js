import React, { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import EditItemModal from "./EditItemModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { itemsAPI } from "../services/api";

export default function ItemList({ items = [], isAdmin = false, onItemsChange, filters = {}, loading }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  // ----------------- Filter & Sort Items -----------------
  useEffect(() => {
    let temp = [...items];

    // Filter by city
    if (filters.city) {
      temp = temp.filter((item) => item.city === filters.city);
    }

    // Filter by category
    if (filters.category) {
      temp = temp.filter((item) => item.category === filters.category);
    }

    // Filter by search term
    if (filters.search) {
      const term = filters.search.toLowerCase();
      temp = temp.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }

    // Sorting
    if (filters.sort) {
      switch (filters.sort) {
        case "price-asc":
          temp.sort((a, b) => a.pricePerMonth - b.pricePerMonth);
          break;
        case "price-desc":
          temp.sort((a, b) => b.pricePerMonth - a.pricePerMonth);
          break;
        case "name":
          temp.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    setFilteredItems(temp);
  }, [items, filters]);

  // ----------------- Add/Edit/Delete Modals -----------------
  const openAddModal = () => {
    setSelectedItem({
      id: `item_${Date.now()}`,
      name: "",
      category: "",
      pricePerMonth: 0,
      deposit: 0,
      description: "",
      images: [],
      availability: true,
      city: "",
      condition: "new",
    });
    setIsAdding(true);
    setShowEdit(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setIsAdding(false);
    setShowEdit(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDelete(true);
  };

  const closeAllModals = () => {
    setShowEdit(false);
    setShowDelete(false);
    setIsAdding(false);
    setSelectedItem(null);
  };

  // ----------------- Save Item -----------------
  const handleSave = async (item) => {
    try {
      if (isAdding) {
        const created = await itemsAPI.createItem(item);
        onItemsChange([...items, created]);
      } else {
        const updated = await itemsAPI.updateItem(item.id, item);
        onItemsChange(items.map((i) => (i.id === item.id ? updated : i)));
      }
      closeAllModals();
    } catch (err) {
      console.error("Failed to save item", err);
      alert("Item could not be saved!");
    }
  };

  // ----------------- Delete Item -----------------
  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await itemsAPI.deleteItem(selectedItem.id);
      onItemsChange(items.filter((i) => i.id !== selectedItem.id));
      closeAllModals();
    } catch (err) {
      console.error("Failed to delete item", err);
      alert("Item could not be deleted!");
    }
  };

  // ----------------- Render -----------------
  return (
    <>
      {/* ---------------- Add Item Button ---------------- */}
      {isAdmin && (
        <div className="text-end mt-3">
          <button className="btn btn-primary" onClick={openAddModal}>
            Add Item
          </button>
        </div>
      )}

      {/* ---------------- Loading ---------------- */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* ---------------- No Items Found ---------------- */}
      {!loading && filteredItems.length === 0 && (
        <div className="text-center mt-5 text-body-secondary">
          <p>No items found</p>
        </div>
      )}

      {/* ---------------- Items Grid ---------------- */}
      {!loading && filteredItems.length > 0 && (
        <div className="row g-4 mt-2">
          {filteredItems.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-lg-4">
              <ItemCard
                item={item}
                isAdmin={isAdmin}
                onEdit={() => openEditModal(item)}
                onDelete={() => openDeleteModal(item)}
              />
            </div>
          ))}
        </div>
      )}

      {/* ---------------- Modals ---------------- */}
      <EditItemModal
        show={showEdit}
        item={selectedItem}
        onSave={handleSave}
        onClose={closeAllModals}
      />

      <DeleteConfirmModal
        show={showDelete}
        item={selectedItem}
        onConfirm={handleConfirmDelete}
        onClose={closeAllModals}
      />
    </>
  );
}
