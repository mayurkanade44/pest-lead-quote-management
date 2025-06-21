import express from "express";
import { addUserHandler, uploadProfilePictureHandler } from "../../controllers/user.controller";
import { validateRequestBody } from "../../validators";
import { createUserSchema } from "../../validators/user.validator";

const userRouter = express.Router();

userRouter.post("/", validateRequestBody(createUserSchema), addUserHandler);
userRouter.post("/upload-profile-picture", uploadProfilePictureHandler);

export default userRouter;
