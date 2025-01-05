import { ErrorHandler } from "@/error-handler";
import { Router } from "express";
import { AdminMiddleware } from "../../Middleware/adminMiddleware";
import { AuthMiddleware } from "../../Middleware/authMiddleware";
import { getProducts } from "./controller";

const CreateProductRouter = Router();
CreateProductRouter.post(
  "/createproduct",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(getProducts)
);
export default CreateProductRouter;
