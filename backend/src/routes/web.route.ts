import { Router } from "express";
import multer from "multer";
import * as webController from "../controllers/web.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * /web/pay-bill:
 *   post:
 *     summary: Pay a bill
 *     description: Pay a bill for a specific subscriber and month. This is a public endpoint and does not require authentication.
 *     tags:
 *       - Web
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
 *         description: Payment successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentStatus:
 *                   type: string
 *                   example: "Successful"
 *       400:
 *         description: Bad request - Missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentStatus:
 *                   type: string
 *                   example: "Error"
 *                 transactionStatus:
 *                   type: string
 *                   example: "Missing parameters"
 *       404:
 *         description: Bill not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentStatus:
 *                   type: string
 *                   example: "Error"
 */
router.post("/pay-bill", webController.payBill);

/**
 * @swagger
 * /web/admin/add-bill:
 *   post:
 *     summary: Add a new bill
 *     description: Create a new bill for a subscriber. Requires Admin authentication.
 *     tags:
 *       - Admin
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
 *               - billTotal
 *             properties:
 *               subscriberNo:
 *                 type: string
 *                 description: The subscriber number
 *                 example: "5551234567"
 *               month:
 *                 type: string
 *                 description: The billing month (YYYY-MM format)
 *                 example: "2024-01"
 *               billTotal:
 *                 type: number
 *                 format: float
 *                 description: Total bill amount
 *                 example: 150.50
 *     responses:
 *       200:
 *         description: Bill created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionStatus:
 *                   type: string
 *                   example: "Successful"
 *       400:
 *         description: Bad request - Missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionStatus:
 *                   type: string
 *                   example: "Error"
 *                 message:
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionStatus:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "Bill creation failed"
 */
router.post("/admin/add-bill", webController.addBill);

/**
 * @swagger
 * /web/admin/batch-upload:
 *   post:
 *     summary: Batch upload bills from CSV
 *     description: Upload a CSV file containing multiple bills to create them in batch. Requires Admin authentication.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file containing bills data (subscriberNo, month, billTotal)
 *     responses:
 *       200:
 *         description: Batch upload successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionStatus:
 *                   type: string
 *                   example: "Successful"
 *       400:
 *         description: Bad request - CSV file not uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionStatus:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "CSV file not uploaded"
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionStatus:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "File processing failed"
 */
router.post(
  "/admin/batch-upload",
  upload.single("file"),
  webController.addBatchBills
);

export default router;
