import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors";
import { appLoggerService } from "../services";

export function errorMiddleware(
	error: HttpError,
	req: Request,
	res: Response,
	_1: NextFunction
) {
	appLoggerService.warn(`${req.id} has completed with an error`, { error });
	const { status = 500, message = "Somthing went wrong" } = error;
	res.status(status).send({
		status,
		message,
	});
}
