import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import StoreService from '../services/store.service';

class StoreController {
  public createStore = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const store = await StoreService.createStore(req.user!.id, req.body);
      res.status(201).json(store);
    } catch (error) {
      next(error);
    }
  };

  public getNearbyStores = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { lng, lat, radius } = req.query;
      const stores = await StoreService.findNearbyStores(
        Number(lng),
        Number(lat),
        Number(radius) || 2000
      );
      res.status(200).json(stores);
    } catch (error) {
      next(error);
    }
  };

  public getStoreDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const store = await StoreService.getStoreById(req.params.id);
      res.status(200).json(store);
    } catch (error) {
      next(error);
    }
  };

  public getMyStore = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const store = await StoreService.getStoreByOwnerId(req.user!.id);
      res.status(200).json(store);
    } catch (error) {
      next(error);
    }
  };
}

export default new StoreController();
