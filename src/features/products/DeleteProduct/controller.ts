import { NotFoundException } from "@/features/Exception/notfound-exception";
import { ErrorCodes } from "@/features/Exception/root";
import { prisma } from "@/index";
import { Request, Response } from "express";

export const DeleteProduct = async (req: Request, res: Response) => {
  //   const { name, description, price, tags } = req.body;
  try {
    const product = req.body;
    const deleteProduct = await prisma.product.delete({
      where: { id: req.params.id },
    });
    res.json({
      ...deleteProduct,
      message: "Product deleted sucessfully",
    });
  } catch (err) {
    throw new NotFoundException("Product not found", ErrorCodes.USER_NOT_FOUND);
  }
};
