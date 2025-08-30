import { prisma } from "@/index";
import { Request, Response } from "express";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const createProducts = await prisma.product.create({
      data: {
        name: req.body.name,
        price: parseFloat(req.body.price),
        description: req.body.description,
        tags: Array.isArray(req.body.tags)
          ? req.body.tags.join(",")
          : req.body.tags,
        image: req.file ? req.file.buffer : undefined, // 👈 multer provides req.file.buffer
      },
    });

    res.status(200).json({
      message: "Product created successfully",
      user: req.user?.name,
      product: {
        id: createProducts.id,
        name: createProducts.name,
        description: createProducts.description,
        price: createProducts.price,
        tags: createProducts.tags,
        image: createProducts.image
          ? Buffer.from(createProducts.image).toString("base64") // 👈 convert to Base64 for frontend
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product", error });
  }
};
