import React, { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import EditItemModal from "./EditItemModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { itemsAPI } from "../services/api";

export default function ItemList({
  items = [],
  isAdmin = false,
  isVendor = false,
  onItemsChange,
  filters = {},
  loading,
}) {
  const [localItems, setLocalItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [justCreatedId, setJustCreatedId] = useState(null);

  // Debug: Log role props


  // Keep localItems in sync with parent items
  useEffect(() => {
    setLocalItems(Array.isArray(items) ? items : []);
  }, [items]);

  const { city = "", category = "", search = "", sort = "", availability = "", subBranch = "" } = filters || {};

  // ----------------- Filter & Sort Items -----------------
  useEffect(() => {
    let temp = localItems.filter(item => item != null);

    if (city) {
      temp = temp.filter((item) => item?.city === city);
    }

    if (subBranch) {
      temp = temp.filter((item) => item?.subBranch === subBranch);
    }

    if (category) {
      temp = temp.filter((item) => item?.category === category);
    }

    if (search) {
      const term = search.toLowerCase();
      temp = temp.filter(
        (item) =>
          item?.name?.toLowerCase().includes(term) ||
          item?.description?.toLowerCase().includes(term)
      );
    }

    if (availability !== "") {
      const isAvailable = availability === "true" || availability === true;
      temp = temp.filter((item) => item?.availability === isAvailable);
    }

    if (sort) {
      switch (sort) {
        case "price-asc":
          temp.sort((a, b) => (a?.pricePerMonth || 0) - (b?.pricePerMonth || 0));
          break;
        case "price-desc":
          temp.sort((a, b) => (b?.pricePerMonth || 0) - (a?.pricePerMonth || 0));
          break;
        case "name":
          temp.sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));
          break;
        default:
          break;
      }
    }

    setFilteredItems(temp.filter(item => item != null && item.id != null));
  }, [localItems, city, category, search, sort, availability, subBranch]);

  // ----------------- Modals -----------------
  const openAddModal = () => {
    const defaultId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setSelectedItem({
      id: defaultId,
      name: "",
      category: "",
      pricePerMonth: "",
      deposit: "",
      description: "",
      images: [],
      availability: true,
      city: "",
      subBranch: "",
      condition: "new",
    });
    setIsAdding(true);
    setShowEdit(true);
  };

  const openEditModal = (item) => {
    console.log("Opening edit modal for:", item.name);
    if (!item || (!item._id && !item.id)) {
      alert("Cannot edit: Item data is missing!");
      return;
    }
    setSelectedItem(item);
    setIsAdding(false);
    setShowEdit(true);
  };

 const openDeleteModal = (item) => {
  if (!isAdmin) {
    alert("❌ Vendor are not allowed to delete items");
    return;
  }

  console.log("Opening delete modal for:", item.name);
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
  const handleSave = async (itemData) => {
    if (!itemData.name || !itemData.name.trim()) {
      alert("Item name is required!");
      return;
    }
    if (!itemData.category || !itemData.category.trim()) {
      alert("Category is required!");
      return;
    }
    if (!itemData.city || !itemData.city.trim()) {
      alert("City is required!");
      return;
    }
    if (!itemData.pricePerMonth || itemData.pricePerMonth <= 0) {
      alert("Price per month must be greater than 0!");
      return;
    }

    try {
      const cleanData = {
        name: itemData.name.trim(),
        category: itemData.category.trim(),
        pricePerMonth: Number(itemData.pricePerMonth),
        deposit: Number(itemData.deposit || 0),
        city: itemData.city.trim(),
        subBranch: itemData.subBranch?.trim() || "",
        condition: itemData.condition || "new",
        description: itemData.description?.trim() || "",
        availability: Boolean(itemData.availability),
        images: Array.isArray(itemData.images) ? itemData.images.filter(img => img && img.trim()) : []
      };

      if (isAdding) {
        cleanData.id = itemData.id.trim();
      }

      if (isAdding) {
        const created = await itemsAPI.createItem(cleanData);
        if (!created || !created.id) {
          throw new Error("Backend did not return a valid item");
        }
        
        closeAllModals();
        setJustCreatedId(created.id);
        setIsSyncing(true);
        
        alert(`✅ Item created: ${created.name}`);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          const freshData = await itemsAPI.getItems({});
          onItemsChange(Array.isArray(freshData) ? freshData : []);
        } catch (err) {
          console.error("Refresh failed:", err);
        } finally {
          setIsSyncing(false);
          setJustCreatedId(null);
        }
      } else {
        const itemId = itemData.id || itemData._id;
        
        if (!itemId) {
          alert("Cannot update: Item ID is missing!");
          return;
        }
        
        try {
          const updated = await itemsAPI.updateItem(itemId, cleanData);
          if (!updated) {
            throw new Error("Backend did not return updated item");
          }
          
          alert(`✅ Item updated: ${updated.name}`);
          closeAllModals();
          
          setTimeout(async () => {
            try {
              const freshData = await itemsAPI.getItems({});
              onItemsChange(Array.isArray(freshData) ? freshData : []);
            } catch (err) {
              console.error("Refresh failed:", err);
            }
          }, 500);
          
        } catch (updateError) {
          console.error("❌ Update failed:", updateError);
          if (updateError.response?.status === 404) {
            alert(`Item not found in database.\n\nTry clicking 🔄 Sync button.`);
            closeAllModals();
            return;
          }
          throw updateError;
        }
      }
    } catch (err) {
      console.error("Failed to save item:", err);
      
      let errorMessage = "Item could not be saved!";
      
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = `Item not found (404)`;
        } else {
          errorMessage = err.response.data?.message || 
                        err.response.data?.error ||
                        `Error ${err.response.status}: ${err.response.statusText}`;
        }
      } else if (err.request) {
        errorMessage = "Network error: Could not reach the server.";
      } else {
        errorMessage = err.message || "An unexpected error occurred.";
      }
      
      alert(errorMessage);
    }
  };

  // ----------------- Delete Item -----------------
  const handleConfirmDelete = async (itemId) => {
    if (!itemId) return;
    
    try {
      await itemsAPI.deleteItem(itemId);
      onItemsChange(items.filter((i) => i?.id !== itemId));
      alert("Item deleted successfully!");
      closeAllModals();
    } catch (err) {
      console.error("Failed to delete item", err);
      
      let errorMessage = "Item could not be deleted!";
      
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      `Error: ${err.response.status} - ${err.response.statusText}`;
      } else if (err.request) {
        errorMessage = "Network error: Could not reach the server.";
      } else {
        errorMessage = err.message || "An unexpected error occurred.";
      }
      
      alert(errorMessage);
    }
  };

  // ----------------- Render -----------------
  return (
    <>
      {/* Admin Controls */}
      {isAdmin && (
        <div className="d-flex justify-content-between align-items-center mt-3 gap-2">
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-secondary"
              onClick={async () => {
                setIsSyncing(true);
                try {
                  const freshData = await itemsAPI.getItems({});
                  onItemsChange(Array.isArray(freshData) ? freshData : []);
                  alert(`✅ Synced! ${freshData?.length || 0} items`);
                } catch (err) {
                  console.error("Sync failed:", err);
                  alert("❌ Sync failed");
                } finally {
                  setIsSyncing(false);
                }
              }}
            >
              🔄 Sync
            </button>
            
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={async () => {
                const confirm = window.confirm("Clean up phantom items?");
                if (!confirm) return;
                
                setIsSyncing(true);
                try {
                  const backendItems = await itemsAPI.getItems({});
                  const backendIds = new Set(backendItems.map(item => item.id));
                  const currentItems = [...localItems];
                  const phantomItems = currentItems.filter(item => !backendIds.has(item.id));
                  
                  if (phantomItems.length === 0) {
                    alert("✅ No phantom items found!");
                  } else {
                    onItemsChange(backendItems);
                    alert(`✅ Removed ${phantomItems.length} phantom item(s)`);
                  }
                } catch (err) {
                  console.error("Cleanup failed:", err);
                  alert("❌ Cleanup failed");
                } finally {
                  setIsSyncing(false);
                }
              }}
              title="Remove items that don't exist in backend"
            >
              🧹 Clean Up
            </button>
          </div>
          
          <button className="btn btn-primary" onClick={openAddModal}>
            + Add Item
          </button>
        </div>
      )}

      {/* Vendor Badge */}
     

      {/* Loading */}
      {(loading || isSyncing) && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">{isSyncing ? "Syncing..." : "Loading..."}</span>
          </div>
          {isSyncing && <p className="mt-2 text-muted">Syncing with backend...</p>}
        </div>
      )}

      {/* Empty States */}
      {!loading && !isSyncing && localItems.length === 0 && !showEdit && (
        <div className="text-center mt-5 text-body-secondary">
          <p>No items available</p>
        </div>
      )}

      {!loading && !isSyncing && localItems.length > 0 && filteredItems.length === 0 && !showEdit && (
        <div className="text-center mt-5 text-body-secondary">
          <p>No items match your filters</p>
        </div>
      )}

      {/* Items Grid */}
      {!loading && !isSyncing && filteredItems.length > 0 && (
        <div className="row g-4 mt-2">
          {filteredItems.map((item) => (
            item && (item._id || item.id) ? (
              <div key={item._id || item.id} className="col-12 col-sm-6 col-lg-4">
                <ItemCard
                  item={item}
                  isAdmin={isAdmin}
                  isVendor={isVendor}
                  onEdit={() => openEditModal(item)}
                  onDelete={() => openDeleteModal(item)}
                  showSyncWarning={false}
                  isLoading={justCreatedId === item.id || justCreatedId === item._id}
                />
              </div>
            ) : null
          ))}
        </div>
      )}

      {/* Modals */}
    <EditItemModal
  show={showEdit}
  item={selectedItem}
  isAdding={isAdding}
  isVendor={isVendor}   // ✅ ADD THIS
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