import { NextFunction, Request, Response } from "express";
import { AnyZodObject, z } from "zod";
import logger from "../config/logger.config";

export const validateRequestBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("Validating request body");
      await schema.parseAsync(req.body);
      next();
    } catch (error: z.ZodError | any) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.map((issue: z.ZodIssue) => ({
          path: issue.path.join(".") || "root",
          message: issue.message,
          code: issue.code,
        }));

        logger.error("Request body validation failed:", formattedErrors);

        res.status(400).json({
          message:
            formattedErrors[0]?.message != "Required"
              ? formattedErrors[0]?.message
              : "Validation failed",
          success: false,
          errors: formattedErrors,
        });
        return;
      } else {
        logger.error("Request body validation error:", error);
        res.status(400).json({
          message: "Invalid request body",
          success: false,
          error: error.message || "Unknown validation error",
        });
        return;
      }
    }
  };
};

export const validateQueryParams = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (error: z.ZodError | any) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.map((issue: z.ZodIssue) => ({
          path: issue.path.join(".") || "root",
          message: issue.message,
          code: issue.code,
        }));

        res.status(400).json({
          message: "Query validation failed",
          success: false,
          errors: formattedErrors,
          error: formattedErrors[0]?.message || "Query validation failed",
        });
        return;
      } else {
        logger.error("Params validation error:", error);
        res.status(400).json({
          message: "Invalid query params",
          success: false,
          error: error.message || "Unknown validation error",
        });
        return;
      }
    }
  };
};
