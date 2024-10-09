// app/api/orderitem/[id]/route.js
import OrderItem from "@/models/OrderItem";
import Product from "@/models/Product";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const orderItem = await OrderItem.findById(id).populate("product");
    if (!orderItem) {
      return new Response(JSON.stringify({ error: "OrderItem not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(orderItem), { status: 200 });
  } catch (error) {
    console.error("Error fetching order item:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { product, quantity, discount } = await req.json();

    // Validate input
    if (!product || !quantity) {
      return new Response(JSON.stringify({ error: "Product and quantity are required" }), { status: 400 });
    }

    // Check if the product exists
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    // Find the order item and update it
    const orderItem = await OrderItem.findById(id);
    if (!orderItem) {
      return new Response(JSON.stringify({ error: "OrderItem not found" }), { status: 404 });
    }

    orderItem.product = product;
    orderItem.quantity = quantity;
    orderItem.discount = discount || 0;
    orderItem.total = (productDoc.price * quantity) - orderItem.discount;

    await orderItem.save();

    return new Response(JSON.stringify(orderItem), { status: 200 });
  } catch (error) {
    console.error("Error updating order item:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const orderItem = await OrderItem.findByIdAndDelete(id);

    if (!orderItem) {
      return new Response(JSON.stringify({ error: "OrderItem not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "OrderItem deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting order item:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const updateData = await req.json();

    // Find the order item
    const orderItem = await OrderItem.findById(id);
    if (!orderItem) {
      return new Response(JSON.stringify({ error: "OrderItem not found" }), { status: 404 });
    }

    // Update only the provided fields
    if (updateData.product) {
      const productDoc = await Product.findById(updateData.product);
      if (!productDoc) {
        return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
      }
      orderItem.product = updateData.product;
      orderItem.total = (productDoc.price * (updateData.quantity || orderItem.quantity)) - (updateData.discount || orderItem.discount);
    }

    if (updateData.quantity !== undefined) {
      orderItem.quantity = updateData.quantity;
    }

    if (updateData.discount !== undefined) {
      orderItem.discount = updateData.discount;
    }

    // Recalculate total if needed
    if (updateData.product || updateData.quantity !== undefined || updateData.discount !== undefined) {
      const productDoc = await Product.findById(orderItem.product);
      orderItem.total = (productDoc.price * orderItem.quantity) - orderItem.discount;
    }

    await orderItem.save();

    return new Response(JSON.stringify(orderItem), { status: 200 });
  } catch (error) {
    console.error("Error updating order item:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}