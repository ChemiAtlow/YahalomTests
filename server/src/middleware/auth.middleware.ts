import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../errors';
import { general } from '../constants';
import { models } from '@yahalom-tests/common';
import { appLoggerService, organizationService } from '../services';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization, organization, field } = req.headers;
    appLoggerService.verbose(`${req.id} is Running auth middleware.`);
    //check if request has auth.
    if (!authorization || !organization || !field) {
        appLoggerService.info(`${req.id} is missing info`, { authorization, organization, field });
        throw new UnauthorizedError();
    }
    const matches = authorization.match(/^Bearer (.+)$/);
    if (!matches || matches.length !== 2) {
        appLoggerService.info(`${req.id} authorization header is invalid`, { authorization });
        throw new UnauthorizedError();
    }
    const jwt = matches[1];
    try {
        appLoggerService.verbose(`${req.id} attempting to parse JWT.`);
        const user = verify(jwt, general.jwtSecret) as models.interfaces.User;
        const organizationId = organization as models.classes.guid;
        const fieldId = field as models.classes.guid;
        if (!(await organizationService.isUserConnectedToOrganization(organizationId, user.id!))) {
            appLoggerService.info(`${req.id} The user tried acessing an organization he isn't a part of.`, { user, organizationId });
            throw new UnauthorizedError();
        }
        if (!(await organizationService.isFieldConnectedToOrganization(organizationId, fieldId))) {
            appLoggerService.info(`${req.id} The user tried acessing a field that is not related to requested organization.`, { user, organizationId, fieldId });
            throw new BadRequestError("Requested field isn't part of requested organization!");
        }
        req.user = user;
        appLoggerService.verbose(`${req.id} The user is authenticated.`, { user });
        next();
    } catch (error) {
        appLoggerService.warn(`${req.id} JWT verification failed.`, { error });
        throw new UnauthorizedError(false);
    }
}
