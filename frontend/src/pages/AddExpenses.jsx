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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddExpenses = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category_id: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await API.get("/expenses/categories");
        setCategories(data);
        if (data.length > 0)
          setForm((f) => ({ ...f, category_id: data[0].id.toString() }));
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/expenses", form);
      navigate("/viewExpenses");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add expense");
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-md w-96 flex flex-col gap-4"
        >
          <h1 className="text-2xl font-bold mb-2 text-center">Add Expense</h1>
          {error && <p className="text-red-500">{error}</p>}
          <Input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />

          <Input
            type="number"
            step="0.01"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            required
          />

          <Select
            value={form.category_id}
            onValueChange={(value) => handleChange("category_id", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button className="mt-4 text-white bg-blue-400" type="submit">
            Add Expense
          </Button>
        </form>{" "}
      </div>
    </>
  );
};

export default AddExpenses;
