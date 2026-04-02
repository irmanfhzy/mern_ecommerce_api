import Product from "../models/Product.js";

export async function createProduct(req, res) {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    console.log("REQUEST BODY: ", req.body);
    res.status(201).json({ success: true, data: savedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function findAllProducts(req, res) {
  try {
    console.log("Fetching all products from DB...");
    const allProducts = await Product.find({});
    res.status(200).json({ success: true, data: allProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function findProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product is not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      returnDocument: "after",
    });

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product is not found" });
    }
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteProductById(req, res) {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product is not found" });
    }
    res.status(200).json({ success: true, data: deletedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
