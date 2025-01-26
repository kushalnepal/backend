import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { errormiddleware } from "./features/Middleware/errors";
import mainRouter from "./features/routes";
import { Port } from "./secret";

const app = express();
const cors = require("cors");

app.use(cors({ origin: true, withCredentials: true }));

app.use(express.json());

export const prisma = new PrismaClient();

app.use("/api", mainRouter);

app.get("/", (req: Request, res: Response) => {
  const data = req.body;
  return res.send("I am ative and running well");
});

app.use(errormiddleware);

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);

  console.log("CTR + C to exit");
});
