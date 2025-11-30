import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not set");
}

export const login = async (username: string) => {
  let user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        username,
        password: "123",
        role: "SUBSCRIBER",
      },
    });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  return token;
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
