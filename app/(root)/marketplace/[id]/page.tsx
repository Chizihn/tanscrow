import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, gql } from "@apollo/client";
import { useAuthStore } from "@/store/auth-store";

const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
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

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data, loading, error } = useQuery(GET_PRODUCT, { variables: { id } });
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  if (loading) return <div>Loading product...</div>;
  if (error || !data?.product) return <div>Product not found.</div>;

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      localStorage.setItem("pendingProductId", id);
      router.push("/auth/signin");
    } else {
      // Proceed to order creation (placeholder)
      alert("Proceeding to order creation for product " + id);
      // router.push(`/checkout/${id}`) or trigger order mutation
    }
  };

  const { product } = data;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto border rounded-lg p-6">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <p className="text-gray-700 mb-1">
          Seller: {product.seller.firstName} {product.seller.lastName}
        </p>
        <p className="text-lg font-bold mb-2">₦{product.price}</p>
        <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800 mb-4">
          {product.status}
        </span>
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleBuyNow}
          disabled={product.status !== "ACTIVE"}
        >
          {product.status === "ACTIVE" ? "Buy Now" : "Not Available"}
        </button>
      </div>
    </div>
  );
} 