import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";
import { BadRequestError } from "../errors";

export function validationMiddleware<T extends {}>(
	type: { new (): T },
	skipMissingProperties = false
): RequestHandler {
	return async (req, _, next) => {
		const errors = await validate(plainToClass(type, req.body), {
			skipMissingProperties,
		});
		if (errors.length > 0) {
			const message = errors
				.map(error => Object.values(error.constraints || []))
				.join(", ");
			return next(new BadRequestError(message));
		}
		return next();
	};
}
