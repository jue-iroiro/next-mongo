// app/api/orderitem/route.js
import OrderItem from "@/models/OrderItem";
import Product from "@/models/Product";


export async function GET() {
  try {
    const orderItems = await OrderItem.find().populate("product");
    return new Response(JSON.stringify(orderItems), { status: 200 });
  } catch (error) {
    console.error("Error fetching order items:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
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

    // Calculate the total based on the product price, quantity, and discount
    const total = (productDoc.price * quantity) - (discount || 0);

    // Create and save the order item
    const orderItem = new OrderItem({
      product,
      quantity,
      discount: discount || 0,
      total,
    });

    await orderItem.save();

    // Populate the product details before returning the response
    const populatedOrderItem = await OrderItem.findById(orderItem._id).populate("product");

    return new Response(JSON.stringify(populatedOrderItem), { status: 201 });
  } catch (error) {
    console.error("Error creating order item:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}