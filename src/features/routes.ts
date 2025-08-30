import { Router } from "express";

import loginRouter from "./auth/login/routes";
import signupRouter from "./auth/signup/routes";
import OrdersRouter from "./orders/router";
import CreateProductRouter from "./products/CreateProduct/router";
import DeleteProductRouter from "./products/DeleteProduct/router";
import GetProductByIdRouter from "./products/GetProductById/router";
import ListProductRouter from "./products/ListProduct/router";
import UpdateProductRouter from "./products/UpdateProduct/router";
import UsersRouter from "./users/router";

const mainRouter = Router();

mainRouter.use("/auth", loginRouter);
mainRouter.use("/auth", signupRouter);
mainRouter.use("/products", CreateProductRouter);
mainRouter.use("/products", DeleteProductRouter);
mainRouter.use("/products", GetProductByIdRouter);
mainRouter.use("/products", ListProductRouter);
mainRouter.use("/products", UpdateProductRouter);
mainRouter.use("/admin/users", UsersRouter);
mainRouter.use("/orders", OrdersRouter);

export default mainRouter;
