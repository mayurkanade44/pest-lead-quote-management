import express from "express";
import {
  loginHandler,
  logoutHandler,
  setupPasswordHandler,
} from "../../controllers/auth.controller";
import { validateRequestBody } from "../../validators";
import {
  loginSchema,
  setupPasswordSchema,
} from "../../validators/auth.validator";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post("/login", validateRequestBody(loginSchema), loginHandler);

authRouter.post(
  "/setup-password",
  validateRequestBody(setupPasswordSchema),
  setupPasswordHandler
);

authRouter.post("/logout", isAuthenticated, logoutHandler);

export default authRouter;
