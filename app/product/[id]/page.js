/*export default async function Home({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const data = await fetch(`${API_BASE}/product/${params.id}`, { cache: "no-store" });
  const product = await data.json();
  console.log({ product, category: product.category });
  // const id = params.id;
  return (
    <div className="m-4">
      <h1>Product</h1>
      <p className="font-bold text-xl text-blue-800">{product.name}</p>
      <p>{product.description}</p>
      <p>{product.price} Baht</p>
      <p>Category: {product.category.name}</p>
    </div>
  );
}*/

// app/product/[id]/page.js
"use client"
import { useEffect, useState } from 'react';

export default function ProductPage({ params }) {
  const { id } = params; // Access the dynamic id parameter directly
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch product data when the component mounts
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch product data');
        }
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete the product');
      }
      alert('Product deleted successfully');
      window.location.href = '/'; // Redirect to the homepage or another route after deletion
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      {product ? (
        <div>
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-gray-700">{product.description}</p>
          <p className="text-gray-500 mt-2">Price: ${product.price}</p>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
          >
            Delete Product
          </button>
        </div>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  );
}