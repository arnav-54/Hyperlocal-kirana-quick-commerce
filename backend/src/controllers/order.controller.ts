import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import OrderService from '../services/order.service';

class OrderController {
  public createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const order = await OrderService.createOrder(req.user!.id, req.body);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  };

  public getCustomerOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const orders = await OrderService.getOrdersByCustomer(req.user!.id);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  };

  public getStoreOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const orders = await OrderService.getOrdersByStoreOwner(req.user!.id);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  };

  public getHelperTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tasks = await OrderService.getAvailableTasks();
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  public updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { status, helperId } = req.body;
      const order = await OrderService.updateStatus(req.params.id, status, helperId || req.user!.id);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  };
}

export default new OrderController();
 
