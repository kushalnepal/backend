import { PrismaClient } from "@prisma/client";
import express from "express";
import { errormiddleware } from "./features/Middleware/errors";
import mainRouter from "./features/routes";
import { Port } from "./secret";
const app = express();
app.use(express.json());

export const prisma = new PrismaClient();

app.use("/api", mainRouter);

app.use(errormiddleware);

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);

  console.log("CTR + C to exit");
});
