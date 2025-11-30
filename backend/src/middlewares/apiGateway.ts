import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import * as authService from "../services/auth.service";

export const gatewayMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  const originalJson = res.json;
  let responseStatusCode = 200;
  let responseSize = 0;
  let authStatus: string | null = null;

  const requestSize = req.headers["content-length"]
    ? parseInt(req.headers["content-length"], 10)
    : JSON.stringify(req.body || {}).length;

  res.json = function (body) {
    responseStatusCode = res.statusCode;
    responseSize = JSON.stringify(body || {}).length;
    return originalJson.call(this, body);
  };

  res.on("finish", async () => {
    const duration = Date.now() - startTime;

    const sanitizedHeaders: Record<string, string | string[] | undefined> = {
      "content-type": req.headers["content-type"],
      "user-agent": req.headers["user-agent"],
      accept: req.headers["accept"],
      "accept-language": req.headers["accept-language"],
      origin: req.headers["origin"],
      referer: req.headers["referer"],
    };

    const authHeader = req.headers.authorization;
    if (authHeader) {
      if ((req as any).user) {
        authStatus = "authenticated";
      } else if (responseStatusCode === 401) {
        authStatus = "missing_token";
      } else if (responseStatusCode === 403) {
        authStatus = "invalid_token";
      } else {
        authStatus = "token_provided";
      }
    } else {
      authStatus = "no_auth";
    }

    try {
      await prisma.requestLog.create({
        data: {
          endpoint: req.originalUrl || req.path,
          method: req.method,
          subscriberNo: req.body?.subscriberNo || null,
          statusCode: responseStatusCode,
          ipAddress: req.ip || req.socket?.remoteAddress || null,
          headers: sanitizedHeaders,
          requestSize: requestSize,
          responseSize: responseSize,
          authStatus: authStatus,
          durationMs: duration,
        },
      });
    } catch (err) {
      console.error("Gateway Log Error:", err);
    }
  });

  const protectedRoutes = [
    "/mobile/query-bill",
    "/mobile/query-bill-detailed",
    "/bank/query-bill",
    "/web/admin/add-bill",
    "/web/admin/batch-upload",
  ];

  const isProtected = protectedRoutes.some((route) => req.path.includes(route));

  if (isProtected) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ error: "Token is required (Authorization header missing)" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = authService.verifyToken(token);

    if (!decoded) {
      res.status(403).json({ error: "Invalid or expired token" });
      return;
    }

    (req as any).user = decoded;
  }

  if (
    req.path.includes("/mobile/query-bill") &&
    !req.originalUrl.includes("detailed") &&
    req.method === "POST"
  ) {
    const { subscriberNo } = req.body;

    if (subscriberNo) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const count = await prisma.requestLog.count({
        where: {
          subscriberNo: subscriberNo,
          endpoint: { contains: "/query-bill" },
          timestamp: { gte: today },
        },
      });

      if (count >= 3) {
        res
          .status(429)
          .json({ error: "Daily limit exceeded (Gateway Blocked)" });
        return;
      }
    }
  }

  next();
};
