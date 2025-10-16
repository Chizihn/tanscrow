import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, gql } from "@apollo/client";

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      title
      price
      imageUrl
      status
      seller {
        firstName
        lastName
      }
    }
  }
`;

export default function MarketplacePage() {
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products.</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <a
          href="/marketplace/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Product
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.products.map((product: any) => (
          <Link
            key={product.id}
            href={`/marketplace/${product.id}`}
            className="block border rounded-lg p-4 hover:shadow-lg transition"
          >
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-700 mb-1">
              Seller: {product.seller.firstName} {product.seller.lastName}
            </p>
            <p className="text-lg font-bold mb-2">₦{product.price}</p>
            <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800">
              {product.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
} 