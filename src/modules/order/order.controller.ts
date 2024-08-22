import { Request, Response } from 'express';
import { OrderServices } from './order.service';

const createOrder = async (req: Request, res: Response) => {
  const orderData = req.body;
  try {
    const result = await OrderServices.createOrder(orderData);
    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      data: result,
    });
  } catch (err: unknown) {
    res.status(400).json({
      success: false,
      message: (err instanceof Error) ? err.message : 'Could not create order!',
    });
  }
};


const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.getAllOrders();
    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully!',
      data: result,
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: (err instanceof Error) ? err.message : 'Could not fetch orders!',
    });
  }
};

const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const orderData = req.body;
  try {
    const result = await OrderServices.updateOrder(id, orderData);
    res.status(200).json({
      success: true,
      message: 'Order updated successfully!',
      data: result,
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: (err instanceof Error) ? err.message : 'Could not update order!',
    });
  }
};

const softDeleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await OrderServices.softDeleteOrder(id);
    res.status(200).json({
      success: true,
      message: 'Order deleted successfully!',
      data: result,
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: (err instanceof Error) ? err.message : 'Could not delete order!',
    });
  }
};

const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await OrderServices.getOrderById(id);
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Order fetched successfully!',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found!',
      });
    }
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: (err instanceof Error) ? err.message : 'Could not fetch order!',
    });
  }
};

export const OrderControllers = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,      // Added controller for updating orders
  softDeleteOrder,  // Added controller for soft deletion
};
