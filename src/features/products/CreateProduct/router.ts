import { ErrorHandler } from "@/error-handler";
import { Router } from "express";
import multer from "multer";
import { AdminMiddleware } from "../../Middleware/adminMiddleware";
import { AuthMiddleware } from "../../Middleware/authMiddleware";
import { createProduct } from "./controller";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const CreateProductRouter = Router();
CreateProductRouter.post(
  "/createproduct",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(createProduct)
);
export default CreateProductRouter;
