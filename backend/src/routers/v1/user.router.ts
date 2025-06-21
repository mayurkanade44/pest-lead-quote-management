import { UserRole } from "@prisma/client";
import express from "express";
import {
  addUserHandler,
  getUserByIdHandler,
  updateUserProfileHandler,
  uploadProfilePictureHandler,
} from "../../controllers/user.controller";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/auth.middleware";
import { validateRequestBody } from "../../validators";
import { userProfileSchema } from "../../validators/user.validator";

const userRouter = express.Router();

userRouter.post(
  "/",
  isAuthenticated,
  isAuthorized([UserRole.ADMIN]),
  validateRequestBody(userProfileSchema),
  addUserHandler
);

userRouter.post("/upload-profile-picture", uploadProfilePictureHandler);

userRouter
  .route("/profile")
  .put(
    isAuthenticated,
    validateRequestBody(userProfileSchema),
    updateUserProfileHandler
  );

userRouter.get("/profile/:id", isAuthenticated, getUserByIdHandler);

export default userRouter;
