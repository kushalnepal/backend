import { ErrorHandler } from "@/error-handler";
import { AdminMiddleware } from "@/features/Middleware/adminMiddleware";
import { AuthMiddleware } from "@/features/Middleware/authMiddleware";
import { Router } from "express";
import { UpdateProduct } from "./controller";

const UpdateProductRouter = Router();

UpdateProductRouter.put(
  "/:id",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(UpdateProduct)
);
export default UpdateProductRouter;
