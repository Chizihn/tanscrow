import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PRODUCT } from "@/graphql/queries/marketplace";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [createProduct, { loading }] = useMutation(CREATE_PRODUCT);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.description || !form.price || !form.imageUrl) {
      setError("All fields are required.");
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) {
      setError("Price must be a positive number.");
      return;
    }
    try {
      await createProduct({
        variables: {
          input: {
            title: form.title,
            description: form.description,
            price,
            imageUrl: form.imageUrl,
          },
        },
      });
      router.push("/marketplace");
    } catch (err: any) {
      setError(err.message || "Failed to create product.");
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Price (₦)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
} 