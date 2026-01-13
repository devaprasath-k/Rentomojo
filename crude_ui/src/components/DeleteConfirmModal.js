import React from "react";

export default function DeleteConfirmModal({ item, onConfirm }) {
  if (!item) return null;

  return (
    <div className="modal fade" id="deleteItemModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-danger">Delete Item</h5>
            <button className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            Are you sure you want to delete
            <strong> {item.name}</strong>?
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={() => onConfirm(item.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
