import { IsEmail, IsEmpty, Matches } from "class-validator";
import { validations } from "../../constants";
import { User } from "../interfaces";
const { passwordDescription, passwordRegex } = validations;

export class UserDto implements User {
	@IsEmail()
	public email!: string;
	//1 upper-case, 1 lower-case, 1 number, 1 special char, minimum 8 chars
	@Matches(passwordRegex, { message: passwordDescription })
	password!: string;
	@IsEmpty()
	role!: "CaptainAmerica" | "Admin" | "Teacher";
}
