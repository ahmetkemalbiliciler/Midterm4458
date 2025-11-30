import { Router, Request, Response } from "express";
import * as authService from "../services/auth.service";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and receive a JWT token for accessing protected routes
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for authentication
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authorization
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request - Username is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Username is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Login failed"
 */
router.post("/login", async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    res.status(400).json({ error: "Username is required" });
    return;
  }

  try {
    const token = await authService.login(username);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
