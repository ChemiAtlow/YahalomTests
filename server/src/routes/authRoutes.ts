import { Router } from "express";
import { models } from "@yahalom-tests/common";
import { authController } from "../controllers";
import { validationMiddleware } from "../middleware";
import { HTTPStatuses } from "../constants";

export const router = Router();

router.post(
	"/login",
	validationMiddleware(models.dtos.UserDto),
	async (req, res) => {
		//send user to login.
		const jwtWithOrgAndFields = await authController.login(req.body);
		res.send(jwtWithOrgAndFields);
	}
);

router.post(
	"/signup",
	validationMiddleware(models.dtos.UserDto),
	async (req, res) => {
		await authController.signup(req.body);
		res.status(HTTPStatuses.created).send({
			message: "user created successfully",
		});
	}
);

router.post(
	"/reset",
	validationMiddleware(models.dtos.RequestPasswordResetDto),
	async (req, res) => {
		await authController.requestPasswordReset(req.body);
		res.send({ message: "token sent to email" });
	}
);

router.post(
	"/reset/:token",
	validationMiddleware(models.dtos.ResetPasswordDto),
	async (req, res) => {
		await authController.resetPassword(req.params.token, req.body);
		res.send({ message: "password reset success" });
	}
);
