import {
	NextFunction,
	Request,
	RequestHandler,
	Response,
	Router,
} from "express";
import { interfaces } from "../models";

type AsyncEndpointWrapper = (
	fn: RequestHandler<any>
) => (req: Request, res: Response, next: NextFunction) => Promise<any>;

const asyncWrapper: AsyncEndpointWrapper = fn => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

export const routeBuilder = (routes: interfaces.Endpoint[]) => {
	const router = Router();
	for (const { controller, method, path = "", middleware } of routes) {
		const handlers: RequestHandler[] = [];
		if (middleware) {
			handlers.push(...middleware);
		}
		const isAsync = controller.constructor.name === "AsyncFunction";
		handlers.push(isAsync ? asyncWrapper(controller) : controller);
		router[method]?.(path, ...handlers);
	}
	return router;
};
