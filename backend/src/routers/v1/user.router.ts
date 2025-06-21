import express from "express";
import { addUserHandler } from "../../controllers/user.controller";
import { validateRequestBody } from "../../validators";
import { createUserSchema } from "../../validators/user.validator";

const userRouter = express.Router();

userRouter.post("/", validateRequestBody(createUserSchema), addUserHandler);

export default userRouter;
