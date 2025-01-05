import { NotFoundException } from "@/features/Exception/notfound-exception";
import { ErrorCodes } from "@/features/Exception/root";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export const ListProduct = async (req: Request, res: Response) => {
  // For list product we need the concept of pagination
  // {
  //     count:100,
  //     data:[]
  // }
  try {
    const prisma = new PrismaClient();
    const count = await prisma.product.count();
    const products = await prisma.product.findMany({
      skip: +req.params.skip || 0,
      take: 5,
    });
    res.json({
      count,
      data: products,
    });
  } catch (err) {
    throw new NotFoundException(
      "Some error while finding list",
      ErrorCodes.USER_NOT_FOUND
    );
  }
};
