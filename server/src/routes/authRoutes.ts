import { Router } from "express";
import { models } from "@yahalom-tests/common";
import { authController } from "../controllers";
import { validationMiddleware } from "../middleware";

export const router = Router();

router.post("/login", validationMiddleware(models.dtos.UserDto), async (req, res) => {
    //send user to login.
    const user = await authController.login(req.body);
    res.send(user);
});

router.post("/signup", validationMiddleware(models.dtos.UserDto), async (req, res) => {
    const user = await authController.signup(req.body);
    res.send(user);
});