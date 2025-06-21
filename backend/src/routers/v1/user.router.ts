import { UserRole } from "@prisma/client";
import express from "express";
import {
  addUserHandler,
  getUserByIdHandler,
  updateUserProfileHandler,
  uploadProfilePictureHandler,
  getAllUsersHandler,
  deactivateUserHandler,
} from "../../controllers/user.controller";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/auth.middleware";
import { validateRequestBody, validateQueryParams } from "../../validators";
import {
  userProfileSchema,
  getAllUsersSchema,
} from "../../validators/user.validator";

const userRouter = express.Router();

userRouter
  .route("/")
  .post(
    isAuthenticated,
    isAuthorized([UserRole.ADMIN]),
    validateRequestBody(userProfileSchema),
    addUserHandler
  )
  .get(
    isAuthenticated,
    isAuthorized([UserRole.ADMIN]),
    validateQueryParams(getAllUsersSchema),
    getAllUsersHandler
  );

userRouter.route("/upload-profile-picture").post(uploadProfilePictureHandler);

userRouter
  .route("/profile/:id")
  .get(isAuthenticated, getUserByIdHandler)
  .put(
    isAuthenticated,
    validateRequestBody(userProfileSchema),
    updateUserProfileHandler
  )
  .delete(
    isAuthenticated,
    isAuthorized([UserRole.ADMIN]),
    deactivateUserHandler
  );

export default userRouter;
