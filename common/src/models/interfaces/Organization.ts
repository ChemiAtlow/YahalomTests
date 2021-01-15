import { guid } from "../classes";

export interface Organization {
	id: guid;
	name: string;
	fields: guid[];
	users: guid[];
}
