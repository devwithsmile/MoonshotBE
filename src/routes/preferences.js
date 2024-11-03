import express from 'express';
import { auth } from '../middlewares/auth.js';
import { updatePreferences, createShareableUrl } from '../controllers/preferencesController.js';

export const router = express.Router();

/**
 * @swagger
 * /api/preferences:
 *   put:
 *     tags:
 *       - Preferences
 *     summary: Update user preferences
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filters:
 *                 type: object
 *                 properties:
 *                   ageGroup:
 *                     type: string
 *                   gender:
 *                     type: string
 *                     enum: [male, female]
 *                   dateRange:
 *                     type: object
 *                     properties:
 *                       start:
 *                         type: string
 *                         format: date
 *                       end:
 *                         type: string
 *                         format: date
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put('/', auth, updatePreferences);

/**
 * @swagger
 * /api/preferences/share:
 *   post:
 *     tags:
 *       - Preferences
 *     summary: Create shareable URL for current filters
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filters:
 *                 type: object
 *                 properties:
 *                   ageGroup:
 *                     type: string
 *                   gender:
 *                     type: string
 *                     enum: [male, female]
 *                   dateRange:
 *                     type: object
 *                     properties:
 *                       start:
 *                         type: string
 *                         format: date
 *                       end:
 *                         type: string
 *                         format: date
 *     responses:
 *       200:
 *         description: Shareable URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shareUrl:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/share', auth, createShareableUrl);

export default router;