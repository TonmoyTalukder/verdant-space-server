import express from 'express';
import { ProductControllers } from './product.controller';
import { createProductSchema, updateProductSchema } from './product.validation';
import validate from '../../middleware/middleware.validation';

const router = express.Router();

// Routes
router.post(
  '/',
  validate(createProductSchema),
  ProductControllers.createProduct,
);
router.get('/:productId', ProductControllers.getProductByProductId); // <-- Make sure this is correctly defined
router.get('/', ProductControllers.getAllProducts);
router.put(
  '/:productId',
  validate(updateProductSchema),
  ProductControllers.updateProduct,
);
router.delete('/:productId', ProductControllers.deleteProduct);

export const ProductRoutes = router;
