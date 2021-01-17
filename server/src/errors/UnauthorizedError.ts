import { HTTPStatuses } from "../constants";
import { HttpError } from "./HttpError";

export class UnauthorizedError extends HttpError {
    constructor(isUnauthorized = true) {
        isUnauthorized ?
            super(HTTPStatuses.unauthorized, "Unauthorized to acceess this route. please login.") :
            super(HTTPStatuses.forbidden, "Access denied.");
    }
}