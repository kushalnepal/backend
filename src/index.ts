import { PrismaClient } from "@prisma/client";
import express from "express";
import { errormiddleware } from "./features/Middleware/errors";
import mainRouter from "./features/routes";
import { Port } from "./secret";

const app = express();
const cors = require("cors");

// Allow requests from any origin in development; allow credentials and common headers
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

export const prisma = new PrismaClient();

app.use("/api", mainRouter);

app.use(errormiddleware);

const startServer = (port: number, attempts = 3) => {
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log("CTR + C to exit");
  });

  server.on("error", (err: any) => {
    if (err && err.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use.`);
      if (attempts > 0) {
        const nextPort = port + 1;
        console.log(`Trying port ${nextPort}...`);
        setTimeout(() => startServer(nextPort, attempts - 1), 500);
      } else {
        console.error("No available ports. Exiting.");
        process.exit(1);
      }
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
};

startServer(Port);
