import { Request, Response, NextFunction } from "express";
import { generateUniqueCode } from "../utils";

declare global {
  namespace Express {
    interface Request {
      code: string;
    }
  }
}

const randomCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.code = await generateUniqueCode();
    next();
  } catch (err) {
    next(err);
  }
};