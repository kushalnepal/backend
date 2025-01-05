import { Request, Response } from "express";

export const loginAuthentication = async (req: Request, res: Response) => {
  res.json(req.user);
};
