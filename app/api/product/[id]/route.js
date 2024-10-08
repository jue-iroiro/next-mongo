/*import Product from "@/models/Product";

export async function GET(request, { params }) {
  const id = params.id;
  const product = await Product.findById(id).populate("category");
  console.log({ product });
  return Response.json(product);
}

export async function DELETE(request, { params }) {
  const id = params.id;
  return Response.json(await Product.findByIdAndDelete(id));
}*/

import Product from "@/models/Product"; // Ensure you import the correct model

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const product = await Product.findById(id).populate('category'); // Populating the category if needed

    if (!product) {
      return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
