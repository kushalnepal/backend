import dotnet from "dotenv";

dotnet.config({ path: ".env" });

export const Port = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET!;
