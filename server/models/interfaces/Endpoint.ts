import { RequestHandler } from "express";

export type Endpoint = {
	path?: string;
	method:
		| "all"
		| "get"
		| "post"
		| "put"
		| "delete"
		| "patch"
		| "options"
		| "head"
		| "use";
	authSafe?: boolean;
	middleware?: RequestHandler<any>[];
	controller: RequestHandler<any>;
};
