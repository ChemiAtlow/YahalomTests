import { HTTPStatuses } from "../constants";

export class HttpError extends Error {
	constructor(public status: HTTPStatuses, public message: string) {
		super(message);
	}
}
