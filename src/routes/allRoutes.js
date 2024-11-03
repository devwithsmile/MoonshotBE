import { router as authRoutes } from './authRoute.js';
import { router as analyticsRoutes } from './analyticsRoute.js';
import { router as preferencesRoutes } from './preferences.js';

export const setupRoutes = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/preferences', preferencesRoutes);
};