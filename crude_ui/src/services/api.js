import axios from "axios";

const API_BASE_URL = "http://localhost:2026";

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const itemsAPI = {
  getItems: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/db?${params}`);
    return response.data.data || [];
  },
  getItem: async (id) => (await api.get(`/db/${id}`)).data.data,
  createItem: async (itemData) => (await api.post("/db", itemData)).data.data,
  updateItem: async (id, itemData) => (await api.put(`/db/${id}`, itemData)).data.data,
  deleteItem: async (id) => (await api.delete(`/db/${id}`)).data.data,
};

export default api;
