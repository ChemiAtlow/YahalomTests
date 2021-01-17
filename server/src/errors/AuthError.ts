import { HttpError } from "./HttpError";
import { HTTPStatuses } from "../constants";

export class AuthError extends HttpError {
	constructor() {
		super(
			HTTPStatuses.unprocessableEntity,
			`Request has failed: check out your details.`
		);
	}
}
