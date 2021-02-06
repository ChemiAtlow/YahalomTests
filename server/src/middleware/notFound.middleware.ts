import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { HttpError } from "../errors";
import { appLoggerService } from "../services";

export function notFoundMiddleware(req: Request, _res: Response) {
	appLoggerService.warn(`${req.id} has ended with 404 to endpoint: ${req.path}`);
	throw new HttpError(HTTPStatuses.notFound, "This path does not exist!");
}
