import express from "express";
import {
  addUserHandler,
  uploadProfilePictureHandler,
} from "../../controllers/user.controller";
import { validateRequestBody } from "../../validators";
import { createUserSchema } from "../../validators/user.validator";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";

const userRouter = express.Router();

userRouter.post(
  "/",
  isAuthenticated,
  isAuthorized([UserRole.ADMIN]),
  validateRequestBody(createUserSchema),
  addUserHandler
);

userRouter.post("/upload-profile-picture", uploadProfilePictureHandler);

export default userRouter;
