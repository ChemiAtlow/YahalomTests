import { verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../errors";
import { general } from "../constants";
import { models } from "@yahalom-tests/common";
import { organizationService } from "../services";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization, organization, field } = req.headers;
    //check if request has auth.
    if (!authorization || !organization || !field) { throw new UnauthorizedError(); }
    const matches = authorization.match(/^Bearer (.+)$/);
    if (!matches || matches.length !== 2) { throw new UnauthorizedError(); }
    const jwt = matches[1];
    try {
        const user = verify(jwt, general.jwtSecret) as models.interfaces.User;
        const organizationId = organization as models.classes.guid;
        const fieldId = field as models.classes.guid;
        if (!await organizationService.isUserConnectedToOrganization(organizationId, user.id!)) {
            throw new UnauthorizedError();
        }
        if (!await organizationService.isFieldConnectedToOrganization(organizationId, fieldId)) {
            throw new BadRequestError("Requested field isn't part of requested organization!");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new UnauthorizedError(false);
    }
}
