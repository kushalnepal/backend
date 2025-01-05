import { ErrorHandler } from "@/error-handler";
import { AdminMiddleware } from "@/features/Middleware/adminMiddleware";
import { AuthMiddleware } from "@/features/Middleware/authMiddleware";
import { Router } from "express";
import { GetProductById } from "./controller";

const GetProductByIdRouter = Router();

GetProductByIdRouter.get(
  "/:id",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(GetProductById)
);
export default GetProductByIdRouter;
