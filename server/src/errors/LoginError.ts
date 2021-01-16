import { HttpError } from "./HttpError";
import { HTTPStatuses } from "../constants";

export class LoginError extends HttpError {
    constructor() {
        super(HTTPStatuses.unprocessableEntity, `Login has failed: check out your details.`);
    }
}