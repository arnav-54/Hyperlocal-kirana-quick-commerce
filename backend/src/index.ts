import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import storeRoutes from './routes/store.routes';
import orderRoutes from './routes/order.routes';
import ErrorMiddleware from './middleware/error.middleware';

dotenv.config();

class App {
  public app: Application;
  public port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes() {
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK' });
    });

    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/stores', storeRoutes);
    this.app.use('/api/orders', orderRoutes);
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware.handle);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

const server = new App();
export const app = server.app;

if (process.env.NODE_ENV !== 'production') {
  server.listen();
}
 
