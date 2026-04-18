import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import AuthMiddleware from '../middleware/auth.middleware';

class OrderRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(AuthMiddleware.authenticate);

    this.router.post('/', AuthMiddleware.requireRole(['CUSTOMER']), OrderController.createOrder);
    this.router.get('/customer', AuthMiddleware.requireRole(['CUSTOMER']), OrderController.getCustomerOrders);
    this.router.get('/store', AuthMiddleware.requireRole(['STORE_OWNER']), OrderController.getStoreOrders);
    this.router.get('/tasks', AuthMiddleware.requireRole(['HELPER']), OrderController.getHelperTasks);
    this.router.patch('/:id/status', OrderController.updateOrderStatus);
  }
}

export default new OrderRoutes().router;
 
