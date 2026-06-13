import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { apiRouter } from './routes/index';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.cors.origin, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use(config.api.prefix, apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
