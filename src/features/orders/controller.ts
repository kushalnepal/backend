import { prisma } from "@/index";
import { Request, Response } from "express";

export const createOrder = async (req: Request, res: Response) => {
  const { name, phone, orderDetails } = req.body;
  // Validate minimal fields
  if (!name || !phone || !orderDetails) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const order = await prisma.order.create({
    data: {
      name,
      phone,
      orderDetails,
      // status will default to PENDING as per Prisma schema
    },
  });

  res.status(201).json(order);
};

export const completeOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { status: "COMPLETED" },
    });
    res.json(updated);
  } catch (err) {
    res.status(404).json({ message: "Order not found" });
  }
};
