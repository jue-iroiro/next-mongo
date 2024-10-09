"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function OrderItemsPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const [orderItemList, setOrderItemList] = useState([]);
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  async function fetchOrderItems() {
    try {
      const response = await fetch(`${API_BASE}/orderitem`);
      if (!response.ok) {
        throw new Error("Failed to fetch order items");
      }
      const items = await response.json();
      setOrderItemList(items);
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  }

  async function fetchProducts() {
    try {
      const response = await fetch(`${API_BASE}/product`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const productsData = await response.json();
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchOrderItems();
    fetchProducts();
  }, []);

  function handleOrderItemFormSubmit(data) {
    const payload = {
      product: data.product,
      quantity: parseInt(data.quantity, 10),
      discount: parseFloat(data.discount || 0),
    };

    if (editMode) {
      fetch(`${API_BASE}/orderitem/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then(() => {
          stopEditMode();
          fetchOrderItems();
        })
        .catch((error) => console.error("Error updating order item:", error));
      return;
    }

    fetch(`${API_BASE}/orderitem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then(() => fetchOrderItems())
      .catch((error) => console.error("Error adding order item:", error));
  }

  function startEditMode(orderItem) {
    reset({
      id: orderItem._id,
      product: orderItem.product?._id,
      quantity: orderItem.quantity,
      discount: orderItem.discount,
    });
    setEditMode(true);
  }

  function stopEditMode() {
    reset({
      product: '',
      quantity: '',
      discount: '',
    });
    setEditMode(false);
  }

  async function deleteOrderItem(orderItem) {
    if (!confirm(`Are you sure you want to delete this order item?`)) return;

    try {
      const id = orderItem._id;
      await fetch(`${API_BASE}/orderitem/${id}`, {
        method: "DELETE",
      });
      fetchOrderItems();
    } catch (error) {
      console.error("Error deleting order item:", error);
    }
  }

  return (
    <main>
      <form onSubmit={handleSubmit(handleOrderItemFormSubmit)}>
        <div className="grid grid-cols-2 gap-4 w-fit m-4 border border-gray-800 p-2">
          <div>Product:</div>
          <div>
            <select
              name="product"
              {...register("product", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>Quantity:</div>
          <div>
            <input
              name="quantity"
              type="number"
              {...register("quantity", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div>Discount:</div>
          <div>
            <input
              name="discount"
              type="number"
              step="0.01"
              {...register("discount")}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div className="col-span-2 text-right">
            {editMode ?
              <>
                <input
                  type="submit"
                  className="italic bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  value="Update" />
                {' '}
                <button
                  onClick={() => stopEditMode()}
                  className="italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                >Cancel
                </button>
              </>
              :
              <input
                type="submit"
                value="Add"
                className="w-20 italic bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              />
            }
          </div>
        </div>
      </form>

      <div className="mx-4">
        <h2 className="text-xl font-bold mb-4">Order Items</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Product</th>
              <th className="py-2 px-4 border">Quantity</th>
              <th className="py-2 px-4 border">Discount</th>
              <th className="py-2 px-4 border">Total</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderItemList.map((item) => (
              <tr key={item._id}>
                <td className="py-2 px-4 border">{item.product ? item.product.name : 'N/A'}</td>
                <td className="py-2 px-4 border">{item.quantity}</td>
                <td className="py-2 px-4 border">{item.discount}</td>
                <td className="py-2 px-4 border">{item.total}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => startEditMode(item)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteOrderItem(item)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}