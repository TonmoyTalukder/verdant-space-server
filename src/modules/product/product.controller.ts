import { Request, Response } from 'express';
import { ProductServices } from './product.service';

const createProduct = async (req: Request, res: Response) => {
  const productData = req.body;
  try {
    const result = await ProductServices.createProduct(productData);
    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      data: result,
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Could not create product!',
    });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { searchTerm, type: productType } = req.query;
    let result;

    if (searchTerm && typeof searchTerm === 'string') {
      result = await ProductServices.searchProducts(searchTerm, productType as string);
      res.status(200).json({
        success: true,
        message: `Products matching search term '${searchTerm}' fetched successfully!`,
        data: result,
      });
    } else {
      result = await ProductServices.getAllProducts();
      res.status(200).json({
        success: true,
        message: 'Products fetched successfully!',
        data: result,
      });
    }
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Could not fetch products!',
    });
  }
};



const getProductByProductId = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await ProductServices.getProductById(productId);

    res.status(200).json({
      success: true,
      message: 'Product by productId fetched successfully!',
      data: result,
    });
  } catch (err: unknown) {
    res.status(404).json({
      success: false,
      message: err instanceof Error ? err.message : 'Product not found!',
    });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const productData = req.body;
    const result = await ProductServices.updateProduct(productId, productData);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Product updated successfully!',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found!',
      });
    }
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Could not update product!',
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await ProductServices.deleteProduct(productId);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Product deleted softly successfully!',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found!',
      });
    }
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Could not delete product!',
    });
  }
};

export const ProductControllers = {
  createProduct,
  getProductByProductId,
  getAllProducts, // Define the getAllProducts controller
  updateProduct, // Define the updateProduct controller
  deleteProduct, // Define the deleteProduct controller
};
