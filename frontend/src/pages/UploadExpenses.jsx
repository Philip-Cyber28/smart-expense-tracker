import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import API from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UploadExpenses = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await API.get("/expenses/categories");
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, []);

  const runOCR = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await API.post("/ocr", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOcrText(data.ocr_text);

      if (data.predicted_items && data.predicted_items.length > 0) {
        setItems(
          data.predicted_items.map((item) => {
            const category = categories.find((c) => c.name === item.category);
            return {
              title: item.title,
              amount: item.amount,
              category_id: category ? category.id : categories[0]?.id || 1,
            };
          })
        );
      } else {
        setError("No items detected. You can manually add expenses below.");
      }
    } catch (err) {
      console.error("OCR error:", err);
      setError(
        err.response?.data?.detail || "OCR failed. Please try another image."
      );
    } finally {
      setLoading(false);
    }
  };

  const addManualItem = () => {
    setItems([
      ...items,
      {
        title: "",
        amount: "",
        category_id: categories[0]?.id || 1,
      },
    ]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const saveExpenses = async () => {
    try {
      const validItems = items.filter(
        (item) => item.title && item.amount && item.category_id
      );

      if (validItems.length === 0) {
        setError("Please add at least one valid expense.");
        return;
      }

      for (const item of validItems) {
        await API.post("/expenses", item);
      }

      alert("Expenses saved successfully!");
      setItems([]);
      setOcrText("");
      setFile(null);
      setError("");
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save expenses. Please try again.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-2xl mx-auto mt-4 md:mt-6 p-4">
        <h1 className="text-xl md:text-2xl font-bold text-center mb-4">
          Upload Receipt (OCR)
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm"
          />

          <Button
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={runOCR}
            disabled={loading || !file}
          >
            {loading ? "Processing..." : "Run OCR"}
          </Button>

          {error && (
            <p className="text-red-500 bg-red-50 p-2 rounded mt-3 text-sm">
              {error}
            </p>
          )}

          {ocrText && (
            <div className="mt-6 p-3 border rounded bg-gray-50">
              <h2 className="font-bold mb-2 text-sm md:text-base">
                Extracted Text
              </h2>
              <pre className="text-xs md:text-sm whitespace-pre-wrap overflow-x-auto">
                {ocrText}
              </pre>
            </div>
          )}

          {ocrText && (
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <h2 className="font-bold text-sm md:text-base">
                  Detected Expenses
                </h2>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addManualItem}
                  className="bg-blue-400 text-white hover:bg-blue-700 w-full sm:w-auto"
                >
                  + Add Item
                </Button>
              </div>

              {items.length === 0 && (
                <p className="text-gray-500 text-center py-4 text-sm">
                  No items detected. Click "Add Item" to add manually.
                </p>
              )}

              {items.map((item, i) => (
                <div
                  key={i}
                  className="border rounded p-3 md:p-4 mb-3 bg-white shadow"
                >
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem(i, "title", e.target.value)}
                    placeholder="Title"
                    className="text-sm"
                  />

                  <Input
                    className="mt-2"
                    type="number"
                    step="0.01"
                    value={item.amount}
                    onChange={(e) => updateItem(i, "amount", e.target.value)}
                    placeholder="Amount"
                  />

                  <Select
                    value={item.category_id?.toString() || ""}
                    onValueChange={(value) =>
                      updateItem(i, "category_id", Number(value))
                    }
                  >
                    <SelectTrigger className="mt-2 w-full">
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

                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2 w-full bg-red-600 text-white hover:bg-red-700"
                    onClick={() => removeItem(i)}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              {items.length > 0 && (
                <Button
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
                  onClick={saveExpenses}
                >
                  Save All Expenses
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadExpenses;
