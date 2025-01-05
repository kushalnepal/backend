import { ErrorHandler } from "@/error-handler";
import { AdminMiddleware } from "@/features/Middleware/adminMiddleware";
import { AuthMiddleware } from "@/features/Middleware/authMiddleware";
import { Router } from "express";
import { ListProduct } from "./controller";

const ListProductRouter = Router();
ListProductRouter.get(
  "/",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(ListProduct)
);

export default ListProductRouter;
