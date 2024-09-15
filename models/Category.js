import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  order: Number
});

const Category = mongoose.models.category || mongoose.model("category", categorySchema);

export default Category;
