import { authService } from "../services";
import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";

export const signup = async (req: Request, res: Response) => {
    await authService.signup(req.body);
    res.status(HTTPStatuses.created).send({
        message: "user created successfully",
    });
};

export const login = async (req: Request, res: Response) => {
    //send user to login.
    const jwtWithOrgAndFields = await authService.login(req.body);
    res.send(jwtWithOrgAndFields);
};

export const requestPasswordReset = async (req: Request, res: Response) => {
    await authService.requestPasswordReset(req.body);
    res.send({ message: "token sent to email" });
};

export const resetPassword = async (req: Request, res: Response) => {
    await authService.resetPassword(req.params.token, req.body);
    res.send({ message: "password reset success" });
};
