import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors";

export function errorMiddleware(
	err: HttpError,
	_: Request,
	res: Response,
	_1: NextFunction
) {
	const { status = 500, message = "Somthing went wrong" } = err;
	res.status(status).send({
		status,
		message,
	});
}
