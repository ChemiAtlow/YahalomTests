import { Router } from "express";
import { models } from "@yahalom-tests/common";
import { authController } from "../controllers";
import { validationMiddleware } from "../middleware";

export const router = Router();

router.post("/login", validationMiddleware(models.dtos.UserDto), authController.login);

router.post("/signup", validationMiddleware(models.dtos.UserDto), authController.signup);

router.post(
    "/reset",
    validationMiddleware(models.dtos.RequestPasswordResetDto),
    authController.requestPasswordReset
);

router.post(
    "/reset/:token",
    validationMiddleware(models.dtos.ResetPasswordDto),
    authController.resetPassword
);
