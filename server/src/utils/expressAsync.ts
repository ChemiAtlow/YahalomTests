//Taken from https://github.com/davidbanham/express-async-errors/blob/master/index.js

const expressLayer = require("express/lib/router/layer");
const expressRouter = require("express/lib/router");

const last = (arr = []) => arr[arr.length - 1];
const noop = Function.prototype;

function copyFnProps(oldFn: any, newFn: any) {
	Object.keys(oldFn).forEach(key => {
		newFn[key] = oldFn[key];
	});
	return newFn;
}

function wrap(fn: Function) {
	const newFn = function newFn(this: any, ...args: any) {
		const ret = fn.apply(this, args);
		const next = (args.length === 5 ? args[2] : last(args)) || noop;
		if (ret && ret.catch) {
			ret.catch((err: Error) => next(err));
		}
		return ret;
	};
	Object.defineProperty(newFn, "length", {
		value: fn.length,
		writable: false,
	});
	return copyFnProps(fn, newFn);
}

export function patchRouterParamForAsyncHandling() {
	const originalParam = expressRouter.prototype.constructor.param;
	expressRouter.prototype.constructor.param = function param(
		name: string,
		fn: Function
	) {
		fn = wrap(fn);
		return originalParam.call(this, name, fn);
	};
}

Object.defineProperty(expressLayer.prototype, "handle", {
	enumerable: true,
	get() {
		return this.__handle;
	},
	set(fn) {
		fn = wrap(fn);
		this.__handle = fn;
	},
});
