import express from 'express';
import { auth } from '../middlewares/auth.js';
import { getStats, getTrends } from '../controllers/analyticsController.js';

export const router = express.Router();


/**
 * @swagger
 * /api/analytics/stats:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get feature usage statistics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ageGroup
 *         schema:
 *           type: string
 *         description: Age range (e.g., "15-25")
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Feature statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   totalUsage:
 *                     type: number
 *                   avgDuration:
 *                     type: number
 *                   minDuration:
 *                     type: number
 *                   maxDuration:
 *                     type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', auth, getStats);

/**
 * @swagger
 * /api/analytics/trends:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get time-based trends for features
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: feature
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *           enum: [hour, day, month]
 *           default: day
 *     responses:
 *       200:
 *         description: Trends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: object
 *                   count:
 *                     type: number
 *                   avgDuration:
 *                     type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/trends', auth, getTrends);

export default router;