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
    console.log("getItems response:", response.data);
    return response.data.data || response.data || [];
  },
  
  getItem: async (id) => {
    console.log("getItem - Fetching ID:", id);
    try {
      // Try with the provided ID first
      const response = await api.get(`/db/${id}`);
      console.log("getItem response:", response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error("getItem failed with provided ID, trying with _id...", error);
      throw error;
    }
  },
  
  createItem: async (itemData) => {
    console.log("==================== CREATE ITEM ====================");
    console.log("createItem request - Data being sent:", itemData);
    
    try {
      const response = await api.post("/db", itemData);
      console.log("createItem response - Full response:", response);
      console.log("createItem response - response.data:", response.data);
      console.log("createItem response - response.status:", response.status);
      
      // Backend might return { data: item } or just { item } or just the item
      let createdItem = response.data.data || response.data.item || response.data;
      
      console.log("createItem - Extracted item:", createdItem);
      console.log("createItem - ID sent:", itemData.id);
      console.log("createItem - ID received:", createdItem.id);
      
      // CRITICAL: Check if backend changed the ID
      if (createdItem.id !== itemData.id) {
        console.warn("⚠️ WARNING: Backend changed the item ID!");
        console.warn("   Sent ID:", itemData.id);
        console.warn("   Received ID:", createdItem.id);
      }
      
      // Check if backend actually saved it
      if (!createdItem.id) {
        console.error("❌ ERROR: Backend didn't return an item with ID!");
        console.error("   Full response:", response.data);
        throw new Error("Backend returned success but no item ID");
      }
      
      console.log("====================================================");
      return createdItem;
    } catch (error) {
      console.error("❌ CREATE ITEM FAILED:", error);
      console.error("   Error response:", error.response?.data);
      throw error;
    }
  },
  
  updateItem: async (id, itemData) => {
    console.log("==================== UPDATE ITEM ====================");
    console.log("updateItem - URL parameter ID:", id);
    console.log("updateItem - Full item data:", itemData);
    
    try {
      // METHOD 1: Try PUT /db with id in body (no id in URL)
      console.log("Trying METHOD 1: PUT /db with id in body...");
      const response = await api.put("/db", itemData); // Send FULL data including id
      console.log("✅ METHOD 1 SUCCESS:", response.data);
      console.log("====================================================");
      return response.data.data || response.data.item || response.data;
    } catch (error1) {
      console.warn("METHOD 1 failed, trying METHOD 2...", error1.response?.status);
      
      try {
        // METHOD 2: Try PUT /db/:id with id in URL
        const customId = itemData.id;
        console.log("Trying METHOD 2: PUT /db/" + customId);
        const { _id, ...dataWithoutMongoId } = itemData;
        const response = await api.put(`/db/${customId}`, dataWithoutMongoId);
        console.log("✅ METHOD 2 SUCCESS:", response.data);
        console.log("====================================================");
        return response.data.data || response.data.item || response.data;
      } catch (error2) {
        console.error("❌ BOTH METHODS FAILED");
        console.error("METHOD 1 (PUT /db):", error1.response?.status, error1.response?.data);
        console.error("METHOD 2 (PUT /db/:id):", error2.response?.status, error2.response?.data);
        console.log("====================================================");
        throw error2;
      }
    }
  },
  
  deleteItem: async (id) => {
    console.log("deleteItem request:", id);
    const response = await api.delete(`/db/${id}`);
    console.log("deleteItem response:", response.data);
    
    return response.data.data || response.data;
  },
};

export default api;