import { authController } from "../controllers";
import { validationMiddleware } from "../middleware";
import { models } from "@yahalom-tests/common";
import { routerBuilder } from "./router.builder";

export const router = routerBuilder([
    {
        path: "/login",
        method: "post",
        middleware: [validationMiddleware(models.dtos.UserDto)],
        controller: async (req, res) => {
            //send user to login.
            const user = await authController.login(req.params.user);
            res.send(user);
        },
    },

    {
        path: "signup",
        method: "post",
        middleware: [validationMiddleware(models.dtos.UserDto)],
        controller: async (req, res) => {
            const user = await authController.signup(req.params.user);
            res.send(user);
        },
    }




]);