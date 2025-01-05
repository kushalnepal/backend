import { AuthMiddleware } from "@/features/Middleware/authMiddleware";
import { Router } from "express";
import { loginAuthentication } from "./controller";

const loginAuth = Router();
loginAuth.get("/me", [AuthMiddleware], loginAuthentication);
export default loginAuth;
