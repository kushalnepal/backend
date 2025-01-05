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
  //1. Extract the token from the request header
  //2. If token is not present throw an error
  //3. if token is present, verify the token and extract the payload
  //4. to get user from payload
  //5. to attach the user to current request object

  const token = req.headers.authorization;
  if (!token) {
    //** we write next here cuz we are not going too wrap AuthMiddleware with Error handler  */
    next(
      new UnauthorizedException("Token not found", ErrorCodes.TOKEN_NOT_FOUND)
    );
  }
  try {
    const payload = jwt.verify(token as string, JWT_SECRET) as any;

    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user) {
      next(
        new UnauthorizedException("Invalid Token", ErrorCodes.TOKEN_NOT_FOUND)
      );
    }

    req.user = user; // attach user to request object

    next(); // we pass the control to next middleware
  } catch (err) {
    next(
      new UnauthorizedException("Invalid Token", ErrorCodes.TOKEN_NOT_FOUND)
    );
  }
};
