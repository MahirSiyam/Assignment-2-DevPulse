import { createApp } from './app';
import { config } from './config/index';
import { pool, testConnection } from './config/database';
import { logger } from './utils/logger';

async function bootstrap(): Promise<void> {
  await testConnection();
  logger.info('Database successfully connected');

  const app = createApp();

  const server = app.listen(config.port, () => {
    logger.info(`Port is ${config.port}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      await pool.end();
      logger.info('HTTP server closed. Database pool drained.');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

bootstrap().catch((error: unknown) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});
