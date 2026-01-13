import React, { useState, useEffect } from "react";

const initialFormState = {
  id: null,
  name: "",
  category: "",
  pricePerMonth: 0,
  deposit: 0,
  city: "",
  condition: "new",
  description: "",
  availability: false,
  imageInput: "",
  images: []
};

export default function EditItemModal({ show, item, onSave, onClose }) {
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (item) {
      // Merge item into defaults so missing fields are still safe
      setForm({ ...initialFormState, ...item });
    } else {
      setForm(initialFormState);
    }
  }, [item]);

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
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">
                {form.id ? "Add / Edit Item" : "Add Item"}
              </h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* NAME */}
              <div className="mb-3">
                <label className="form-label">Item Name *</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
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
                />
              </div>

              {/* PRICE */}
              <div className="mb-3">
                <label className="form-label">Price / Month *</label>
                <input
                  type="number"
                  className="form-control"
                  name="pricePerMonth"
                  value={form.pricePerMonth}
                  onChange={handleChange}
                />
              </div>

              {/* DEPOSIT */}
              <div className="mb-3">
                <label className="form-label">Deposit</label>
                <input
                  type="number"
                  className="form-control"
                  name="deposit"
                  value={form.deposit}
                  onChange={handleChange}
                />
              </div>

              {/* CITY */}
              <div className="mb-3">
                <label className="form-label">City *</label>
                <input
                  className="form-control"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>

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
                  <option value="used">Used</option>
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

              {/* IMAGES */}
              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <div className="d-flex gap-2">
                  <input
                    className="form-control"
                    name="imageInput"
                    value={form.imageInput || ""}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleImageAdd}
                  >
                    Add
                  </button>
                </div>

                <ul className="mt-2">
                  {form.images.map((img, idx) => (
                    <li key={idx}>{img}</li>
                  ))}
                </ul>
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
