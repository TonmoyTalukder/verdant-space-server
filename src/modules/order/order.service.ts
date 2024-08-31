/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TOrder } from './order.interface';
import { Order } from './order.model';
import { ProductServices } from '../product/product.service';
import { UserServices } from '../user/user.service';

const createOrder = async (payload: TOrder) => {
  const { userId, products, order } = payload;

  if (!products || products.length === 0) {
    throw new Error('At least one product is required.');
  }

  // Fetch the user details (excluding the password)
  const user = await UserServices.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Exclude the password from user details
  const { password, ...userDetails } = user.toObject();

  // Only update inventory if adminApproval is true
  if (order.adminApproval) {
    for (const { productId, quantity } of products) {
      const product = await ProductServices.getProductById(productId);

      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      if (product.inventory.quantity < quantity) {
        throw new Error(`Insufficient quantity for product ID ${productId}`);
      }

      // Deduct quantity from inventory
      const updatedInventory = product.inventory.quantity - quantity;
      const updatedOrderedQuantity = product.orderedQuantity + quantity;

      // Update product inventory and ordered quantity
      await ProductServices.updateProduct(productId, {
        inventory: {
          quantity: updatedInventory,
          inStock: updatedInventory > 0,
        },
        orderedQuantity: updatedOrderedQuantity,
      });
    }
  }

  // Create the order with user details
  const orderWithUserDetails = {
    ...payload,
    userDetails,
  };

  const result = await Order.create(orderWithUserDetails);
  return result;
};


const getOrderById = async (id: string) => {
  const result = await Order.findById(id);
  if (!result) {
    throw new Error('Order not found');
  }
  return result;
};

const getAllOrders = async () => {
  const result = await Order.find({ isDeleted: false });
  return result;
};

const updateOrder = async (orderId: string, updates: Partial<TOrder>) => {
  const existingOrder = await Order.findById(orderId);

  if (!existingOrder) {
    throw new Error('Order not found');
  }

  const { products: existingProducts, order: existingOrderDetails } = existingOrder.toObject();

  // Fetch current product details
  const productDetails = await Promise.all(
    existingProducts.map(({ productId }) => ProductServices.getProductById(productId))
  );

  const isAdminApprovalChanging =
    existingOrderDetails?.adminApproval !== updates.order?.adminApproval;

  const isQuantityChanging = updates.products && updates.products.some((updatedProduct, index) => {
    const existingProduct = existingProducts[index];
    return updatedProduct.quantity !== existingProduct.quantity;
  });

  // Handle removal of products from the order when adminApproval is true
  if (updates.products && updates.products.length < existingProducts.length) {
    const removedProducts = existingProducts.filter(
      existingProduct =>
        !updates.products!.some(updatedProduct => updatedProduct.productId === existingProduct.productId)
    );

    if (existingOrderDetails.adminApproval) {
      for (const removedProduct of removedProducts) {
        const product = await ProductServices.getProductById(removedProduct.productId);
        if (!product) throw new Error(`Product with ID ${removedProduct.productId} not found`);

        // Revert inventory for removed products if adminApproval is true
        const restoredInventory = product.inventory.quantity + removedProduct.quantity;
        const restoredOrderedQuantity = product.orderedQuantity - removedProduct.quantity;

        await ProductServices.updateProduct(removedProduct.productId, {
          inventory: {
            quantity: restoredInventory,
            inStock: restoredInventory > 0,
          },
          orderedQuantity: restoredOrderedQuantity,
        });
      }
    }
  }

  // Handle adminApproval changes (both from false to true and true to false)
  if (isAdminApprovalChanging) {
    if (updates.order?.adminApproval) {
      // Case: adminApproval changing from false to true (reduce stock)
      for (const product of productDetails) {
        const existingProduct = existingProducts.find(p => p.productId === product.productId);
        if (!existingProduct) throw new Error('Existing product not found.');

        const updatedQuantity = existingProduct.quantity;
        const updatedInventory = product.inventory.quantity - updatedQuantity;

        if (updatedInventory < 0) {
          throw new Error(`Insufficient stock for product ID ${product.productId}`);
        }

        await ProductServices.updateProduct(product.productId!, {
          inventory: {
            quantity: updatedInventory,
            inStock: updatedInventory > 0,
          },
          orderedQuantity: product.orderedQuantity + updatedQuantity,
        });
      }
    } else {
      // Case: adminApproval changing from true to false (restore stock)
      for (const product of productDetails) {
        const existingProduct = existingProducts.find(p => p.productId === product.productId);
        if (!existingProduct) throw new Error('Existing product not found.');

        const restoredQuantity = existingProduct.quantity;
        const updatedInventory = product.inventory.quantity + restoredQuantity;

        await ProductServices.updateProduct(product.productId!, {
          inventory: {
            quantity: updatedInventory,
            inStock: updatedInventory > 0,
          },
          orderedQuantity: product.orderedQuantity - restoredQuantity,
        });
      }
    }
  }

  // Handle quantity changes and adjust stock accordingly
  if (isQuantityChanging) {
    for (let i = 0; i < existingProducts.length; i++) {
      const { productId, quantity: oldQuantity } = existingProducts[i];
      const newQuantity = updates.products![i].quantity;

      if (oldQuantity !== newQuantity) {
        const product = await ProductServices.getProductById(productId);
        if (!product) throw new Error('Product not found.');

        const quantityDifference = newQuantity - oldQuantity;
        const updatedInventory = product.inventory.quantity - quantityDifference;

        if (updatedInventory < 0) {
          throw new Error(`Insufficient stock for product ID: ${productId}`);
        }

        await ProductServices.updateProduct(product.productId!, {
          inventory: {
            quantity: updatedInventory,
            inStock: updatedInventory > 0,
          },
          orderedQuantity: product.orderedQuantity + quantityDifference,
        });
      }
    }
  }

  // Update the order
  const result = await Order.findByIdAndUpdate(orderId, updates, { new: true });
  return result;
};



const softDeleteOrder = async (id: string) => {
  const existingOrder = await Order.findById(id);

  if (!existingOrder) {
    throw new Error('Order not found');
  }

  // If the order was approved by admin, revert stock for all ordered products
  if (existingOrder.order.adminApproval) {
    for (const { productId, quantity } of existingOrder.products) {
      const product = await ProductServices.getProductById(productId);

      if (!product) throw new Error(`Product with ID ${productId} not found`);

      // Revert inventory
      const updatedInventory = product.inventory.quantity + quantity;
      const updatedOrderedQuantity = product.orderedQuantity - quantity;

      await ProductServices.updateProduct(productId, {
        inventory: {
          quantity: updatedInventory,
          inStock: updatedInventory > 0,
        },
        orderedQuantity: updatedOrderedQuantity,
      });
    }
  }

  // Soft delete the order
  const result = await Order.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return result;
};

export const OrderServices = {
  createOrder,
  getAllOrders,
  updateOrder,
  softDeleteOrder,
  getOrderById,
};
