import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";
import { appLogger } from "../services";

export function errorMiddleware(
	err: HttpException,
	_: Request,
	res: Response,
	_1: NextFunction
) {
	const { status = 500, message = "Somthing went wrong" } = err;
	appLogger.error(message);
	res.status(status).send({
		status,
		message,
	});
}
