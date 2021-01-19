import { guid } from "../classes";
import { HasId } from "./HasId";

export interface User extends HasId {
	email: string;
	password: string;
	organizations?: guid[];
	role?: "CaptainAmerica" | "Admin" | "Teacher";
	resetToken?: string;
	resetTokenExpiration?: number;
}
