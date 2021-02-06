import { models } from '@yahalom-tests/common';
import { NextFunction, Request, Response } from 'express';
import { appLoggerService } from '../services';

export function assignId(req: Request, res: Response, next: NextFunction) {
    req.id = models.classes.Guid.newGuid();
    if (req.method !== "OPTIONS") {
        appLoggerService.verbose(`${req.method} - Req ${req.id} has begun to: ${req.path}.`);
    }
    next();
}
