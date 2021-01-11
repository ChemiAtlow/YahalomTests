import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { HttpException } from "../exceptions/HttpException";
import { appLogger } from "../services";

export function notFoundMiddleware(req: Request, res: Response) {
	appLogger.error(`bad path attempted: ${req.method}: ${req.originalUrl}`);
	throw new HttpException(HTTPStatuses.notFound, "This path does not exist!");
}
