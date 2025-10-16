"use client";

import { gql, useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export interface ProductDetailProps {
  id: string;
}

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

export default function ProductDetail({ id }: ProductDetailProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>Error loading product: {error.message}</div>;
  if (!data?.product) return <div>Product not found</div>;

  const { product } = data;

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      localStorage.setItem("pendingProductId", id);
      router.push("/signin");
    } else {
      // Handle purchase logic
      console.log("Proceeding to checkout for product:", id);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative w-full h-96 rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-2xl font-semibold text-gray-900 mb-6">
              ₦{product.price.toLocaleString()}
            </p>
            <p className="text-gray-700 mb-6">
              {product.description || "No description available"}
            </p>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {product.status}
              </span>
            </div>
            <Button 
              onClick={handleBuyNow}
              className="w-full py-6 text-lg"
              disabled={product.status !== "ACTIVE"}
            >
              {product.status === "ACTIVE" ? "Buy Now" : "Not Available"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
