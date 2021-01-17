import { IsEmail, Matches } from "class-validator";
import { User } from "../interfaces";
const errorMessage = "Password needs to have at least: 1 upper-case, 1 lower-case, 1 number, 1 special char and minimum 8 chars";

export class UserDto implements User {
	@IsEmail()
	public email!: string;
	//1 upper-case, 1 lower-case, 1 number, 1 special char, minimum 8 chars
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#\$%\^&\*])(?=.{8,})/, { message: errorMessage })
	password!: string;
}