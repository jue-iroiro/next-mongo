// models/OrderItem.js
import mongoose from "mongoose";
import Product from "./Product"; // Import the Product model

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
  },
  total: {
    type: Number,
    required: true,
  },
});

// Pre-save middleware to calculate the total
orderItemSchema.pre("save", async function (next) {
  const product = await Product.findById(this.product);
  if (!product) {
    throw new Error("Product not found");
  }
  this.total = (product.price * this.quantity) - this.discount;
  next();
});

const OrderItem = mongoose.models.orderitem || mongoose.model("orderitem", orderItemSchema);

export default OrderItem;