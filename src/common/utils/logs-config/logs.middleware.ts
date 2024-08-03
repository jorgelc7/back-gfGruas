import * as morgan from 'morgan';
import { Request, Response } from 'express';

export class HttpLoggerMiddleware {
  private logRequest = morgan('dev');

  use(req: Request, res: Response, next: () => void) {
    this.logRequest(req, res, next);
  }
}
