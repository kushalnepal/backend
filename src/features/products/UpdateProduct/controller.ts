import { NotFoundException } from "@/features/Exception/notfound-exception";
import { ErrorCodes } from "@/features/Exception/root";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export const UpdateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags = product.tags.join(",");
    }
    const prisma = new PrismaClient();
    const updateproduct = await prisma.product.update({
      where: { id: req.params.id },
      data: product,
    });
    res.json(updateproduct);
  } catch (error) {
    throw new NotFoundException("Product not found", ErrorCodes.USER_NOT_FOUND);
  }
};
