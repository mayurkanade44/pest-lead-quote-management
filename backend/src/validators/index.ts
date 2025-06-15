import { NextFunction, Request, Response } from "express";
import { AnyZodObject, z } from "zod";
import logger from "../config/logger.config";

/**
 *
 * @param schema - Zod schema to validate the request body
 * @returns - Middleware function to validate the request body
 */
export const validateRequestBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("Validating request body");
      await schema.parseAsync(req.body);
      logger.info("Request body is valid");
      next();
    } catch (error: z.ZodError | any) {
      // If the validation fails,
      error?.issues?.forEach((issue: z.ZodIssue) => {
        let msg = issue.message ? issue.message : "Invalid request body";
        logger.error(msg);
        return res.status(400).json({
          message: msg,
          success: false,
          error: error,
        });
      });
    }
  };
};

/**
 *
 * @param schema - Zod schema to validate the request body
 * @returns - Middleware function to validate the request query params
 */
export const validateQueryParams = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.query);
      console.log("Query params are valid");
      next();
    } catch (error) {
      // If the validation fails,

      res.status(400).json({
        message: "Invalid query params",
        success: false,
        error: error,
      });
    }
  };
};
