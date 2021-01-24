import { authService } from "../services";
import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { models } from "@yahalom-tests/common";
import { types } from "../models";

export const signup = async (req: Request<never, any, models.dtos.UserDto>, res: Response) => {
    await authService.signup(req.body);
    res.status(HTTPStatuses.created).send({
        message: "user created successfully",
    });
};

export const login = async (req: Request<never, any, models.dtos.UserDto>, res: Response) => {
    //send user to login.
    const jwtWithOrgAndFields = await authService.login(req.body);
    res.send(jwtWithOrgAndFields);
};

export const requestPasswordReset = async (
    req: Request<never, any, models.dtos.RequestPasswordResetDto>,
    res: Response
) => {
    await authService.requestPasswordReset(req.body);
    res.send({ message: "token sent to email" });
};

export const resetPassword = async (
    req: types.RequestWithToken<any, models.dtos.ResetPasswordDto>,
    res: Response
) => {
    await authService.resetPassword(req.params.token, req.body);
    res.send({ message: "password reset success" });
};
