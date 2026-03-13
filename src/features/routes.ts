import { Router } from "express";

import loginRouter from "./auth/login/routes";
import signupRouter from "./auth/signup/routes";
import OrdersRouter from "./orders/router";
import productRouter from "./products/router";
import UsersRouter from "./users/router";

const mainRouter = Router();

mainRouter.use("/auth", loginRouter);
mainRouter.use("/auth", signupRouter);
mainRouter.use("/products", productRouter);
mainRouter.use("/admin/users", UsersRouter);
mainRouter.use("/orders", OrdersRouter);

export default mainRouter;
