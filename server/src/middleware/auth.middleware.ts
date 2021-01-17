import { verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors";
import { general } from "../constants";
import { models } from "@yahalom-tests/common";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) { throw new UnauthorizedError(); }
    const matches = authorizationHeader.match(/^Bearer (.+)$/);
    if (!matches || matches.length !== 2) { throw new UnauthorizedError(); }
    const jwt = matches[1];
    try {
        const user = verify(jwt, general.jwtSecret);
        req.user = user as models.interfaces.User;
        next();
    } catch (error) {
        throw new UnauthorizedError(false);
    }
}
