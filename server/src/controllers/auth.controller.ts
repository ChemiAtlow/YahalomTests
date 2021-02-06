import { appLoggerService, authService } from "../services";
import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { models } from "@yahalom-tests/common";
import { types } from "../models";

export const signup = async (req: Request<never, any, models.dtos.UserDto>, res: Response) => {
    appLoggerService.info(`request ${req.id} started signup`);
await authService.signup(req.body);
    appLoggerService.info(`request ${req.id} signup success`);
    res.status(HTTPStatuses.created).send({
        message: "user created successfully",
    });
};

export const login = async (req: Request<never, any, models.dtos.UserDto>, res: Response) => {
    appLoggerService.info(`request ${req.id} started login`);
    const jwtWithOrgAndFields = await authService.login(req.body);
    appLoggerService.info(`request ${req.id} login success`);
    res.send(jwtWithOrgAndFields);
};

export const requestPasswordReset = async (
    req: Request<never, any, models.dtos.RequestPasswordResetDto>,
    res: Response
    ) => {
    appLoggerService.info(`request ${req.id} started password reset token creation.`);
    await authService.requestPasswordReset(req.body);
    appLoggerService.info(`request ${req.id} succeeded creating password reset token.`);
    res.send({ message: "token sent to email" });
};

export const resetPassword = async (
    req: types.RequestWithToken<any, models.dtos.ResetPasswordDto>,
    res: Response
    ) => {
    appLoggerService.info(`request ${req.id} started reseting password.`);
    await authService.resetPassword(req.params.token, req.body);
    appLoggerService.info(`request ${req.id} succeeded reseting password.`);
    res.send({ message: "password reset success" });
};
