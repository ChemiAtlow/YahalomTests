import { HTTPStatuses } from "../constants";
import { HttpError } from "./HttpError";

export class EmailTakenError extends HttpError {
	constructor(email: string) {
		super(HTTPStatuses.unprocessableEntity, `Bad request: ${email} is in use.`);
	}
}
