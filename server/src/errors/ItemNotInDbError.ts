import { models } from "@yahalom-tests/common";
import { HTTPStatuses } from "../constants";
import { HttpError } from "./HttpError";

type ItemTypes = "Question" | "Test";

export class ItemNotInDbError extends HttpError {
	constructor(id: models.classes.guid, itemType: ItemTypes) {
		super(HTTPStatuses.notFound, `Item not in Db: ${itemType} ${id}`);
	}
}
