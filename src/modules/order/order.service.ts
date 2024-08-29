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

  // Check product availability and update inventory if checkoutStatus is true
  for (const { productId, quantity } of products) {
    const product = await ProductServices.getProductById(productId);

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    if (order.checkoutStatus && product.inventory.quantity < quantity) {
      throw new Error(`Insufficient quantity for product ID ${productId}`);
    }

    if (order.checkoutStatus) {
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

  const { products, order } = existingOrder.toObject();

  if (!products || products.length === 0) {
    throw new Error('Products are required.');
  }

  // Fetch details for all products in the order
  const productDetails = await Promise.all(
    products.map(({ productId }) => ProductServices.getProductById(productId))
  );

  if (!productDetails || productDetails.length !== products.length) {
    throw new Error('Some products in the order were not found');
  }

  const isCheckoutStatusChanging =
    order?.checkoutStatus !== updates.order?.checkoutStatus;
  const isAdminApprovalChanging =
    order?.adminApproval !== updates.order?.adminApproval;

  if (isCheckoutStatusChanging) {
    if (order?.checkoutStatus && updates.order?.checkoutStatus === false) {
      throw new Error('Once checkoutStatus is true, it cannot be undone.');
    }

    if (updates.order?.checkoutStatus && updates.order?.adminApproval) {
      for (let i = 0; i < productDetails.length; i++) {
        const product = productDetails[i];
        const { quantity } = products[i];
        if (!product.productId) {
          throw new Error(`Product ID is undefined for product at index ${i}`);
        }
        if (product.inventory.quantity < quantity) {
          throw new Error(`Insufficient product quantity for product ID: ${product.productId}`);
        }
      }

      // Update inventory and ordered quantities for all products
      await Promise.all(
        productDetails.map((product, i) => {
          const { quantity } = products[i];
          if (!product.productId) {
            throw new Error(`Product ID is undefined for product at index ${i}`);
          }
          return ProductServices.updateProduct(product.productId as string, {
            inventory: {
              quantity: product.inventory.quantity - quantity,
              inStock: product.inventory.quantity - quantity > 0,
            },
            orderedQuantity: product.orderedQuantity + quantity,
          });
        })
      );
    }
  }

  if (isAdminApprovalChanging && !updates.order?.adminApproval && order?.checkoutStatus) {
    await Promise.all(
      productDetails.map((product, i) => {
        const { quantity } = products[i];
        if (!product.productId) {
          throw new Error(`Product ID is undefined for product at index ${i}`);
        }
        return ProductServices.updateProduct(product.productId as string, {
          inventory: {
            quantity: product.inventory.quantity + quantity,
            inStock: product.inventory.quantity + quantity > 0,
          },
          orderedQuantity: product.orderedQuantity - quantity,
        });
      })
    );
  }

  // Update the order
  const result = await Order.findByIdAndUpdate(orderId, updates, { new: true });
  return result;
};

const softDeleteOrder = async (id: string) => {
  const result = await Order.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new Error('Order not found');
  }
  return result;
};

export const OrderServices = {
  createOrder,
  getAllOrders,
  updateOrder,
  softDeleteOrder,
  getOrderById,
};
