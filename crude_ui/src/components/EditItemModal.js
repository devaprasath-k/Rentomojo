import React, { useState, useEffect } from "react";
import { CITY_SUB_BRANCHES } from "../utils/constants";

const initialFormState = {
  id: "",
  name: "",
  category: "",
  pricePerMonth: 0,
  deposit: 0,
  city: "",
  subBranch: "",
  condition: "new",
  description: "",
  availability: false,
  imageInput: "",
  images: [],
  vendorId: ""
};

export default function EditItemModal({ show, item, onSave, onClose, isVendor = false }) {
  const [form, setForm] = useState(initialFormState);
  const [availableSubBranches, setAvailableSubBranches] = useState([]);

  useEffect(() => {
    if (item) {
      // Merge item into defaults so missing fields are still safe
      setForm({ ...initialFormState, ...item });
    } else {
      setForm(initialFormState);
    }
  }, [item]);

  // Update available sub-branches when city changes
  useEffect(() => {
    if (form.city && CITY_SUB_BRANCHES[form.city]) {
      setAvailableSubBranches(CITY_SUB_BRANCHES[form.city]);
    } else {
      setAvailableSubBranches([]);
      // Clear sub-branch if city changes and current sub-branch is not valid
      if (form.subBranch) {
        setForm(prev => ({ ...prev, subBranch: "" }));
      }
    }
  }, [form.city]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleImageAdd = () => {
    if (form.imageInput?.trim()) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, prev.imageInput],
        imageInput: "",
      }));
    }
  };

  const handleSubmit = () => {
    onSave({
      ...form,
      images: form.images || [],
    });
  };

  return (
    <div className="modal-backdrop-custom">
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">

            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">
                {form.id ? "Edit Item" : "Add Item"}
              </h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* ID */}
              <div className="mb-3">
                <label className="form-label">
                  Item ID * 
                  {form.id && !form.id.startsWith('item_') && (
                    <span className="badge bg-success ms-2">Backend ID</span>
                  )}
                </label>
                <input
                  className="form-control"
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                  placeholder="e.g., item_001, ITEM123"
                  readOnly={form.id && !form.id.startsWith('item_')}
                />
                <small className="text-muted">
                  {form.id && !form.id.startsWith('item_') 
                    ? '🔒 This ID is assigned by the backend and cannot be changed'
                    : 'Enter a unique identifier (backend may change this)'
                  }
                </small>
              </div>

              {/* NAME */}
              <div className="mb-3">
                <label className="form-label">Item Name *</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., MacBook Pro 2021"
                />
              </div>

              {/* CATEGORY */}
              <div className="mb-3">
                <label className="form-label">Category *</label>
                <input
                  className="form-control"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g., Electronics, Furniture"
                />
              </div>

              {/* PRICE */}
              <div className="mb-3">
                <label className="form-label">Price / Month (₹) *</label>
                <input
                  type="number"
                  className="form-control"
                  name="pricePerMonth"
                  value={form.pricePerMonth}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 5000"
                />
              </div>

              {/* DEPOSIT */}
              <div className="mb-3">
                <label className="form-label">Deposit (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="deposit"
                  value={form.deposit}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 10000"
                />
              </div>

              {/* CITY */}
              <div className="mb-3">
                <label className="form-label">City *</label>
                <select
                  className="form-select"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                >
                  <option value="">Select City</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Pune">Pune</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Surat">Surat</option>
                </select>
              </div>

              {/* SUB-BRANCH / AREA */}
              {form.city && availableSubBranches.length > 0 && (
                <div className="mb-3">
                  <label className="form-label">
                    Area / Sub-Branch
                    <small className="text-muted ms-2">(optional)</small>
                  </label>
                  <select
                    className="form-select"
                    name="subBranch"
                    value={form.subBranch}
                    onChange={handleChange}
                  >
                    <option value="">Select Area</option>
                    {availableSubBranches.map((branch) => (
                      <option key={branch.name} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">
                    Specify the exact area/locality within {form.city}
                  </small>
                </div>
              )}

              {/* CONDITION */}
              <div className="mb-3">
                <label className="form-label">Condition</label>
                <select
                  className="form-select"
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                >
                  <option value="new">New</option>
                  <option value="good">Good</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>

              {/* DESCRIPTION */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the item..."
                />
              </div>

              {/* AVAILABILITY */}
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="availability"
                  checked={form.availability}
                  onChange={handleChange}
                />
                <label className="form-check-label">
                  Available for Rent
                </label>
              </div>

              {/* VENDOR ID (read-only for vendors, hidden for non-vendors) */}
              {isVendor && form.vendorId && (
                <div className="mb-3">
                  <label className="form-label">Vendor ID</label>
                  <input
                    className="form-control"
                    name="vendorId"
                    value={form.vendorId}
                    readOnly
                    disabled
                  />
                  <small className="text-muted">
                    Your vendor identifier (cannot be changed)
                  </small>
                </div>
              )}

              {/* IMAGES */}
              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <div className="d-flex gap-2">
                  <input
                    className="form-control"
                    name="imageInput"
                    value={form.imageInput || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleImageAdd}
                  >
                    Add
                  </button>
                </div>

                {form.images.length > 0 && (
                  <ul className="mt-2 list-group">
                    {form.images.map((img, idx) => (
                      <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                        <small className="text-truncate">{img}</small>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            setForm(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx)
                            }));
                          }}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Save Item
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}