import { ErrorHandler } from "@/error-handler";
import { AdminMiddleware } from "@/features/Middleware/adminMiddleware";
import { AuthMiddleware } from "@/features/Middleware/authMiddleware";
import { Router } from "express";
import { DeleteProduct } from "./controller";

const DeleteProductRouter = Router();

DeleteProductRouter.delete(
  "/:id",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(DeleteProduct)
);
export default DeleteProductRouter;
