import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Fixed: Don't logout on 401 for item edit/delete operations
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      if (!url.includes("/db/")) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export const itemsAPI = {
  getItems: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/db?${params}`);
    console.log("getItems response:", response.data);
    return response.data.data || response.data || [];
  },

  getItem: async (id) => {
    console.log("getItem - Fetching ID:", id);
    try {
      const response = await api.get(`/db/${id}`);
      console.log("getItem response:", response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error("getItem failed:", error);
      throw error;
    }
  },

  createItem: async (itemData) => {
    console.log("createItem request:", itemData);
    try {
      const response = await api.post("/db", itemData);
      let createdItem = response.data.data || response.data.item || response.data;

      if (!createdItem.id) {
        throw new Error("Backend returned success but no item ID");
      }

      return createdItem;
    } catch (error) {
      console.error("❌ CREATE ITEM FAILED:", error);
      throw error;
    }
  },

  updateItem: async (id, itemData) => {
    console.log("updateItem - ID:", id, "Data:", itemData);
    const customId = itemData.id || id;
    const { _id, ...cleanData } = itemData;
    const response = await api.patch(`/db/${customId}`, cleanData);
    return response.data.data || response.data.item || response.data;
  },

  deleteItem: async (id) => {
    console.log("deleteItem request:", id);
    const response = await api.delete(`/db/${id}`);
    console.log("deleteItem response:", response.data);
    return response.data.data || response.data;
  },
};

export default api;