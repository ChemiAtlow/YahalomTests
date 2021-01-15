import { models } from "@yahalom-tests/common";
import { HTTPStatuses } from "../constants";
import { types } from "../models";
import { HttpError } from "./HttpError";

export class ItemNotInDbError extends HttpError {
	constructor(id: models.classes.guid, itemType: types.EntityTypes) {
		super(HTTPStatuses.notFound, `Item not in Db: ${itemType} ${id}`);
	}
}
