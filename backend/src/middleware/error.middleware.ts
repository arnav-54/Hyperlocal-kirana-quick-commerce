import { Request, Response, NextFunction } from 'express';

class ErrorMiddleware {
  public handle = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    
    res.status(status).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  };
}

export default new ErrorMiddleware();
 
