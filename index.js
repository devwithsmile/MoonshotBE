import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { setupSwagger } from './src/config/swagger.js';
import { setupRoutes } from './src/routes/allRoutes.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { connectDB } from './src/config/database.js';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Setup Swagger
setupSwagger(app);

// Setup Routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

// Connect to database
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;