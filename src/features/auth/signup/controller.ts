import { BadRequest } from "@/features/Exception/bad-request";
import { ErrorCodes } from "@/features/Exception/root";
import { SignUpSchema } from "@/features/Schema/SignUpSchema";
import { prisma } from "@/index";
import { hashSync } from "bcrypt";
import { Request, Response } from "express";

export const Signup = async (req: Request, res: Response): Promise<any> => {
  SignUpSchema.parse(req.body);
  const { name, email, password, role } = req.body;
  const user = await prisma.user.findFirst({
    where: { email: email },
  });
  if (user) {
    throw new BadRequest("User already exists", ErrorCodes.USER_ALREADY_EXISTS);
  }
  const Userdata = await prisma.user.create({
    data: {
      email,
      password: hashSync(password, 10),
      name,
      role,
    },
  });
  // console.log("user created", Userdata);
  return res.send(Userdata);
  //  catch (err: any) {
  //   if (err.name === "ZodError") {
  //     // Handle Zod validation error
  //     return next(
  //       new UnProcessableEntity(
  //         422,
  //         "Validation failed",
  //         ErrorCodes.UNPROCESSABLE_ENTITY,
  //         err.errors // Zod's error details
  //       )
  //     );
  //   }

  //   // Handle other errors
  //   return next(
  //     new UnProcessableEntity(
  //       500,
  //       "Internal server error",
  //       ErrorCodes.INTERNAL_SERVER_ERROR,
  //       err?.issues
  //     )
  //   );
  // }
};
