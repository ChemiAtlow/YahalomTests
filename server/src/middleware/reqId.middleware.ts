import { models } from '@yahalom-tests/common';
import { NextFunction, Request, Response } from 'express';

export function assignId(req: Request, res: Response, next: NextFunction) {
    req.id = models.classes.Guid.newGuid();
    next();
}
