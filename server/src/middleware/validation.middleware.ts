import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";
import { BadRequestError } from "../errors";
import { appLoggerService } from "../services";

export function validationMiddleware<T extends {}>(
	type: { new (): T },
	skipMissingProperties = false
): RequestHandler {
	return async (req, _, next) => {
		appLoggerService.verbose(`Attempting to validate ${type.name} for request ${req.id}`);
		const errors = await validate(plainToClass(type, req.body), {
			skipMissingProperties,
		});
		if (errors.length > 0) {
			appLoggerService.info(`${req.id} has failed DTO validation`, { errors, type: type.name });
			const message = errors
			.map(error => Object.values(error.constraints || []))
			.join(", ");
			return next(new BadRequestError(message || "Validation failed!"));
		}
		appLoggerService.verbose(`${req.id} has completed DTO validation`);
		return next();
	};
}
