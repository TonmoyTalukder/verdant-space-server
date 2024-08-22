import { TOrder } from './order.interface';
import { Order } from './order.model';
import { ProductServices } from '../product/product.service';
import { UserServices } from '../user/user.service'; // Assuming you have a UserServices

const createOrder = async (payload: TOrder) => {
  const { userId, productId, quantity, order } = payload;

  if (!productId || !quantity) {
    throw new Error('Product ID and quantity are required.');
  }

  // Fetch the product details
  const product = await ProductServices.getProductById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  if (order.checkoutStatus && product.inventory.quantity < quantity) {
    throw new Error('Insufficient product quantity');
  }

  // Fetch the user details (excluding the password)
  const user = await UserServices.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Exclude the password from user details
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { password, ...userDetails } = user.toObject();

  // Create the order with user details
  const orderWithUserDetails = {
    ...payload,
    userDetails,
  };

  // Decrease inventory only if checkoutStatus is true
  if (order.checkoutStatus) {
    const updatedInventory = product.inventory.quantity - quantity;
    await ProductServices.updateProduct(productId, { 
      inventory: { 
        quantity: updatedInventory,
        inStock: updatedInventory > 0
      }
    });
  }

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
  const result = await Order.find({ isDeleted: false });  // Only return non-deleted orders
  return result;
};

const updateOrder = async (orderId: string, updates: Partial<TOrder>) => {
  const existingOrder = await Order.findById(orderId);

  if (!existingOrder) {
    throw new Error('Order not found');
  }

  const { productId, quantity, order } = existingOrder;

  if (!productId || !quantity) {
    throw new Error('Product ID and quantity are required.');
  }

  // Fetch the product details
  const product = await ProductServices.getProductById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  // Handle checkoutStatus and adminApproval logic
  const isCheckoutStatusChanging = order?.checkoutStatus !== updates.order?.checkoutStatus;
  const isAdminApprovalChanging = order?.adminApproval !== updates.order?.adminApproval;

  if (isCheckoutStatusChanging) {
    if (order?.checkoutStatus && updates.order?.checkoutStatus === false) {
      throw new Error('Once checkoutStatus is true, it cannot be undone.');
    }

    if (updates.order?.checkoutStatus && updates.order?.adminApproval) {
      if (product.inventory.quantity < quantity) {
        throw new Error('Insufficient product quantity');
      }

      const updatedInventory = product.inventory.quantity - quantity;
      await ProductServices.updateProduct(productId, { 
        inventory: { 
          quantity: updatedInventory,
          inStock: updatedInventory > 0,
        },
      });
    }
  }

  if (isAdminApprovalChanging) {
    if (updates.order?.adminApproval) {
      if (product.inventory.quantity < quantity) {
        throw new Error('Insufficient product quantity');
      }

      const updatedInventory = product.inventory.quantity - quantity;
      await ProductServices.updateProduct(productId, { 
        inventory: { 
          quantity: updatedInventory,
          inStock: updatedInventory > 0,
        },
      });
    } else if (!updates.order?.adminApproval && order?.checkoutStatus) {
      // Reverse stock decrease if adminApproval changes to false
      const updatedInventory = product.inventory.quantity + quantity;
      await ProductServices.updateProduct(productId, {
        inventory: {
          quantity: updatedInventory,
          inStock: updatedInventory > 0,
        },
      });
    }
  }

  // Update the order
  const result = await Order.findByIdAndUpdate(orderId, updates, { new: true });
  return result;
};


const softDeleteOrder = async (id: string) => {
  const result = await Order.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!result) {
    throw new Error('Order not found');
  }
  return result;
};

export const OrderServices = {
  createOrder,
  getAllOrders,
  updateOrder,
  softDeleteOrder,  // Added service for soft delete
  getOrderById,
};
