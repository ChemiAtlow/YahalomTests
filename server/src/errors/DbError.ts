import { HTTPStatuses } from "../constants";
import { HttpError } from "./HttpError";

export class DbError extends HttpError {
	constructor(data: string) {
		super(HTTPStatuses.internalServerError, `Error from DB: ${data}`);
	}
}
