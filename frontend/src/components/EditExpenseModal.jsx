import { useState, useEffect } from "react";
import API from "../services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EditExpenseModal = ({ expense, onClose, onUpdated }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: expense.title,
    amount: expense.amount,
    category_id: 1,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await API.get("/expenses/categories");
        setCategories(data);

        const category = data.find((c) => c.name === expense.category);
        if (category) {
          setForm((prev) => ({ ...prev, category_id: category.id }));
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, [expense.category]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/expenses/${expense.id}`, form);
    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow">
        <h2 className="text-xl font-bold mb-4">Edit Expense</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
          <Input
            name="amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            required
          />
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="border p-2 rounded text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-500 text-white">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;
