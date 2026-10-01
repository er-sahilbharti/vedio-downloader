import app from './app.js';
import { connectDatabase, gracefulShutdown } from './config/database.js';
import { env } from './config/env.js';
import { startCleanupScheduler } from './services/cleanupService.js';

async function startServer() {
  try {
    await connectDatabase();
    const cleanupTimer = startCleanupScheduler();

    const server = app.listen(env.port, () => {
      console.log(`Backend server is running on http://localhost:${env.port}`);
    });

    process.on('SIGINT', () => {
      gracefulShutdown('SIGINT');
      clearInterval(cleanupTimer);
      server.close();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      gracefulShutdown('SIGTERM');
      clearInterval(cleanupTimer);
      server.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
