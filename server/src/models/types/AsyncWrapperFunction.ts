import { NextFunction } from "connect";
import type {
	Request,
	RequestHandler,
	Response,
} from "express-serve-static-core";

export type AsyncWrapperFunction = (
	fn: RequestHandler<any>
) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
