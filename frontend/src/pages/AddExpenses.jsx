import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import API from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddExpenses = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category_id: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await API.get("/expenses/categories");
        setCategories(data);
        if (data.length > 0 && !form.category_id) {
          setForm((f) => ({ ...f, category_id: data[0].id.toString() }));
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
        setError("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!form.amount || parseFloat(form.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!form.category_id) {
      setError("Please select a category");
      return;
    }

    setLoading(true);
    try {
      await API.post("/expenses", form);
      navigate("/viewExpenses");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add expense");
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex justify-center p-4 md:p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-md w-full max-w-md p-6 flex flex-col gap-4 shadow-lg"
        >
          <h1 className="text-xl md:text-2xl font-bold mb-2 text-center">
            Add Expense
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              name="title"
              placeholder="Enter expense title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              name="amount"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select
              value={form.category_id}
              onValueChange={(value) => handleChange("category_id", value)}
              disabled={loading || categories.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1 text-sm text-gray-500">
                      No categories available
                    </div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="mt-4 text-white bg-blue-400 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading || categories.length === 0}
          >
            {loading ? "Adding..." : "Add Expense"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default AddExpenses;
