import { Request, Response } from "express";
import logger from "../config/logger.config";
import * as userRepository from "../repositories/user.repository";
import { CreateUserInput } from "../types/user.type";

export const addUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
) => {
  logger.info("Add user request received");
  const newUser = await userRepository.createUser(req.body);

  // TODO: Don't send back the token in the response
  res.status(201).json({
    message: "User created successfully",
    data: newUser,
  });
};
