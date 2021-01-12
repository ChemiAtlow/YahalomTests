import { RequestHandler, Router } from "express";
import { interfaces, types } from "../models";

const asyncWrapper: types.AsyncWrapperFunction = fn => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

export const routerBuilder = (endpoints: interfaces.Endpoint[]) => {
	const router = Router();
	for (const { controller, method, path = "", middleware } of endpoints) {
		const handlers: RequestHandler[] = [];
		if (Array.isArray(middleware) && middleware.length) {
			handlers.push(...middleware);
		}
		const isAsync = controller.constructor.name === "AsyncFunction";
		handlers.push(isAsync ? asyncWrapper(controller) : controller);
		router[method]?.(path, handlers);
	}
	return router;
};
