import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { HttpError } from "../errors";

export function notFoundMiddleware(_req: Request, _res: Response) {
	throw new HttpError(HTTPStatuses.notFound, "This path does not exist!");
}
