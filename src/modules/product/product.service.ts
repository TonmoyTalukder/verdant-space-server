import { TProduct } from './product.interface';
import { Product } from './product.model';

// Function to generate the next productId
const generateProductId = async (): Promise<string> => {
  // Get the last created product, sorted by productId in descending order
  const lastProduct = await Product.findOne().sort({ productId: -1 });
  let newId = 'P00001'; // Default productId if no products exist

  if (lastProduct && lastProduct.productId) {
    // Extract the number part, increment it, and format it with leading zeros
    const lastIdNumber = parseInt(lastProduct.productId.substring(1), 10);
    const nextIdNumber = lastIdNumber + 1;
    newId = `P${nextIdNumber.toString().padStart(5, '0')}`; // Ensures the ID is padded with leading zeros
  }

  return newId;
};

const createProduct = async (payload: Omit<TProduct, 'productId'>) => {
  const newProductId = await generateProductId();

  // Assign the generated productId to the product
  const result = await Product.create({ ...payload, productId: newProductId });
  return result;
};

const deleteProduct = async (productId: string) => {
  const result = await Product.findOneAndUpdate(
    { productId },
    { isDeleted: true }, // Soft delete by setting isDeleted to true
    { new: true }
  );
  if (!result) {
    throw new Error('Product not found');
  }
  return result;
};

const getAllProducts = async () => {
  const result = await Product.find({ isDeleted: false }); // Only fetch products not soft-deleted
  return result;
};


const getProductById = async (productId: string) => {
  const result = await Product.findOne({ productId });  // Search by productId
  if (!result) {
    throw new Error('Product not found');
  }
  return result;
};

const updateProduct = async (productId: string, payload: Partial<TProduct>) => {
  const result = await Product.findOneAndUpdate({ productId }, payload, { new: true });
  if (!result) {
    throw new Error('Product not found');
  }
  return result;
};

const searchProducts = async (searchTerm: string) => {
  const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search
  const result = await Product.find({
    $or: [
      { name: regex },
      { description: regex },
      { type: regex },
      { tags: regex },
    ],
  });
  return result;
};


export const ProductServices = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
};
