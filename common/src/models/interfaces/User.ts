import { HasId } from "./HasId";

export interface User extends HasId {
	email: string;
	password: string;
}
