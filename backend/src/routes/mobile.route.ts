import { Router } from "express";
import * as mobileController from "../controllers/mobile.controller";

const router = Router();

/**
 * @swagger
 * /mobile/query-bill:
 *   post:
 *     summary: Query bill summary
 *     description: Retrieve bill summary for a specific subscriber and month. Requires Mobile authentication. Rate limited to 3 requests per subscriber per day.
 *     tags:
 *       - Mobile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriberNo
 *               - month
 *             properties:
 *               subscriberNo:
 *                 type: string
 *                 description: The subscriber number
 *                 example: "5551234567"
 *               month:
 *                 type: string
 *                 description: The billing month (YYYY-MM format)
 *                 example: "2024-01"
 *     responses:
 *       200:
 *         description: Successfully retrieved bill summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bills:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       billTotal:
 *                         type: number
 *                         format: float
 *                         description: Total bill amount
 *                         example: 150.50
 *                       status:
 *                         type: string
 *                         description: Bill payment status
 *                         example: "UNPAID"
 *       400:
 *         description: Bad request - Missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing parameters"
 *       401:
 *         description: Unauthorized - Token is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token is required (Authorization header missing)"
 *       403:
 *         description: Forbidden - Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or expired token"
 *       404:
 *         description: Bill not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bill not found"
 *       429:
 *         description: Too Many Requests - Daily limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Daily limit exceeded (Gateway Blocked)"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */
router.post("/query-bill", mobileController.queryBill);

/**
 * @swagger
 * /mobile/query-bill-detailed:
 *   post:
 *     summary: Query detailed bill information
 *     description: Retrieve detailed bill information for a specific subscriber and month with pagination. Requires Mobile authentication.
 *     tags:
 *       - Mobile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriberNo
 *               - month
 *             properties:
 *               subscriberNo:
 *                 type: string
 *                 description: The subscriber number
 *                 example: "5551234567"
 *               month:
 *                 type: string
 *                 description: The billing month (YYYY-MM format)
 *                 example: "2024-01"
 *     responses:
 *       200:
 *         description: Successfully retrieved detailed bill information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   description: Number of results per page
 *                   example: 10
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       billTotal:
 *                         type: number
 *                         format: float
 *                         description: Total bill amount
 *                         example: 150.50
 *                       details:
 *                         type: string
 *                         description: Bill details
 *                         example: "Monthly subscription + data usage"
 *       400:
 *         description: Bad request - Missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing parameters"
 *       401:
 *         description: Unauthorized - Token is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token is required (Authorization header missing)"
 *       403:
 *         description: Forbidden - Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or expired token"
 *       404:
 *         description: Bill not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bill not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */
router.post("/query-bill-detailed", mobileController.queryBillDetailed);

export default router;
