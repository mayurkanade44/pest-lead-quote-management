import express from "express";
import { addUserHandler } from "../../controllers/user.controller";
import { validateRequestBody } from "../../validators";
import { createUserSchema } from "../../validators/user.validator";
import { handleMultipartData } from "../../middlewares/mulipartData.middleware";

const userRouter = express.Router();


userRouter.post(
  "/",
  handleMultipartData,
  validateRequestBody(createUserSchema),
  addUserHandler
);

export default userRouter;
