import { Router } from 'express';
import StoreController from '../controllers/store.controller';
import AuthMiddleware from '../middleware/auth.middleware';

class StoreRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', StoreController.getNearbyStores);
    this.router.get('/:id', StoreController.getStoreDetails);

    // Protected routes for store owners
    this.router.post('/', AuthMiddleware.authenticate, AuthMiddleware.requireRole(['STORE_OWNER', 'ADMIN']), StoreController.createStore);
    this.router.get('/my-store', AuthMiddleware.authenticate, AuthMiddleware.requireRole(['STORE_OWNER']), StoreController.getMyStore);
  }
}

export default new StoreRoutes().router;
 
