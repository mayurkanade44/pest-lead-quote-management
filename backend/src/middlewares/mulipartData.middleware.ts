import { Request, Response, NextFunction } from "express";
import { processMultipartData } from "../utils/helpers/imageUpload";

export const handleMultipartData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await processMultipartData(req);
    next();
  } catch (error) {
    next(error);
  }
};
