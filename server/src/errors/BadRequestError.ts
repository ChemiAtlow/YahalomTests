import { HTTPStatuses } from "../constants";
import { HttpError } from "./HttpError";

export class BadRequestError extends HttpError {
	constructor(data: string) {
		super(HTTPStatuses.badRequest, `Bad request: ${data}`);
	}
}
