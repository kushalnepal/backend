import { prisma } from "@/index";

import { Request, Response } from "express";

export const getProducts = async (req: Request, res: Response) => {
  const { name, description, price } = req.body;

  const createProducts = await prisma.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });
  res.status(200).json({
    message: "Login successful",
    user: req.user.name,
    product: {
      id: createProducts.id,
      name: createProducts.name,
      description: createProducts.description,
      price: createProducts.price,
      tags: createProducts.tags,
    },
  });
};
