import React from "react";

export default function DeleteConfirmModal({ show, item, onConfirm, onClose }) {
  if (!show || !item) return null;

  return (
    <div className="modal-backdrop-custom">
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Delete Item</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              Are you sure you want to delete
              <strong> {item.name}</strong>?
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onConfirm(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}