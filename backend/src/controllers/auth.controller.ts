import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';

class AuthController {
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AuthService.login(req.body.email, req.body.password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
