import { Router } from "express";
import * as bankController from "../controllers/bank.controller";

const router = Router();

/**
 * @swagger
 * /bank/query-bill:
 *   post:
 *     summary: Query unpaid bills
 *     description: Retrieve all unpaid bills for a specific subscriber. Requires Bank authentication.
 *     tags:
 *       - Bank
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
 *             properties:
 *               subscriberNo:
 *                 type: string
 *                 description: The subscriber number to query bills for
 *                 example: "5551234567"
 *     responses:
 *       200:
 *         description: Successfully retrieved unpaid bills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 unpaidBills:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         description: The billing month
 *                         example: "2024-01"
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
 *         description: Bad request - Subscriber No is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Subscriber No is required"
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
 */
router.post("/query-bill", bankController.queryUnpaidBills);

export default router;
