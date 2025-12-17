import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
  withCredentials: true,
});

export const fetchExpense = async () => {
  const res = await API.get("/expenses");
  return res.data;
};

export const createExpense = async (data) => {
  const res = await API.post("/expenses", data);
  return res.data;
};

export const updateExpense = async (id, data) => {
  const res = await API.put(`/expenses/${id}`, data);
  return res.data;
};

export const deleteExpense = async (id) => {
  await API.delete(`/expenses/${id}`);
};

export const fetchExpensebyId = async (id) => {
  const res = await API.get(`/expenses/${id}`);
  return res.data;
};

export default API;
