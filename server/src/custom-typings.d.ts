import { models } from "@yahalom-tests/common";

declare global {
	namespace Express {
		interface Request {
			id: models.classes.guid;
			user?: models.interfaces.User;
		}
	}
}
