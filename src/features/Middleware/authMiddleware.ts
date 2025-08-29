import { JWT_SECRET } from "@/secret";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { ErrorCodes } from "../Exception/root";
import { UnauthorizedException } from "../Exception/unauthorized";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next(
      new UnauthorizedException("Token not found", ErrorCodes.TOKEN_NOT_FOUND)
    );
    return;
  }

  // 2. Split "Bearer <token>" and take only the token
  const token = authHeader.split(" ")[1];

  try {
    // 3. Verify the token
    const payload = jwt.verify(token as string, JWT_SECRET) as any;

    // 4. Get user from payload
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user) {
      next(
        new UnauthorizedException("Invalid Token", ErrorCodes.TOKEN_NOT_FOUND)
      );
      return;
    }

    // 5. Attach user to request object
    req.user = user;

    next(); // pass control to next middleware
  } catch (err) {
    next(
      new UnauthorizedException("Invalid Token", ErrorCodes.TOKEN_NOT_FOUND)
    );
  }
};
